<?php

namespace App\Services;

use App\Models\Property;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PropertyAnalysisService
{
    /** @var array<string> Overpass API mirrors tried in order until one succeeds */
    protected array $overpassUrls = [
        'https://overpass-api.de/api/interpreter',
        'https://lz4.overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
    ];

    protected string $userAgent = 'NeighborhoodApp/1.0 (contact@neighborhood.app)';

    /**
     * Buildings closer than this are assumed to be the property's own footprint
     * and are excluded from neighbor distance results.
     */
    protected float $minimumNeighborDistanceMeters = 3.0;

    public function analyzeProperty(Property $property): array
    {
        $lat = $property->latitude;
        $lng = $property->longitude;

        $neighborDistance = $this->analyzeNeighborDistance($lat, $lng, $property->address);
        usleep(250000); // 250ms delay between requests

        $pointsOfInterest = $this->analyzePointsOfInterest($lat, $lng);
        usleep(250000); // 250ms delay between requests

        $roadAccessibility = $this->analyzeRoadAccessibility($lat, $lng);

        return [
            'neighbor_distance' => $neighborDistance,
            'points_of_interest' => $pointsOfInterest,
            'road_accessibility' => $roadAccessibility,
        ];
    }

    public function geocodeAddress(string|array $address): ?array
    {
        if (is_array($address)) {
            // Geocod.io: rooftop-level accuracy for US addresses
            $result = $this->geocodeWithGeocodio($address);
            if ($result) {
                return $result;
            }

            // Census Bureau: road-interpolated fallback, still better than Nominatim
            $result = $this->geocodeWithCensus($address);
            if ($result) {
                return $result;
            }
        }

        // Last resort: Nominatim
        $attempts = $this->prepareGeocodeAttempts($address);

        foreach ($attempts as $params) {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => $this->userAgent,
                ])->get('https://nominatim.openstreetmap.org/search', $params);

                Log::debug(__CLASS__.':'.__LINE__, [
                    'params' => $params,
                    'json' => $response->json(),
                    'status_code' => $response->getStatusCode(),
                ]);

                if ($response->successful() && count($response->json()) > 0) {
                    $result = $response->json()[0];

                    return [
                        'lat' => (float) $result['lat'],
                        'lng' => (float) $result['lon'],
                        'source' => 'nominatim',
                        'accuracy' => 'approximate',
                    ];
                }
            } catch (Exception $e) {
                Log::error('Geocoding attempt failed: '.$e->getMessage());
            }
        }

        return null;
    }

    protected function geocodeWithGeocodio(array $address): ?array
    {
        $apiKey = config('services.geocodio.key');
        if (! $apiKey) {
            return null;
        }

        try {
            $query = implode(', ', array_filter([
                $address['street'] ?? null,
                $address['city'] ?? null,
                $address['state'] ?? null,
                $address['postalcode'] ?? null,
            ]));

            $response = Http::get('https://api.geocod.io/v1.7/geocode', [
                'q' => $query,
                'api_key' => $apiKey,
                'limit' => 1,
            ]);

            $results = $response->json('results') ?? [];

            if ($response->successful() && ! empty($results)) {
                $location = $results[0]['location'];

                Log::debug(__CLASS__.':'.__LINE__, [
                    'source' => 'geocodio',
                    'matched_address' => $results[0]['formatted_address'] ?? null,
                    'accuracy' => $results[0]['accuracy_type'] ?? null,
                    'coordinates' => $location,
                ]);

                return [
                    'lat' => (float) $location['lat'],
                    'lng' => (float) $location['lng'],
                    'source' => 'geocodio',
                    'accuracy' => $results[0]['accuracy_type'] ?? 'unknown',
                    'accuracy_score' => $results[0]['accuracy'] ?? null,
                    'match_type' => $results[0]['match_type'] ?? null,
                    'data_source' => $results[0]['source'] ?? null,
                    'matched_address' => $results[0]['formatted_address'] ?? null,
                ];
            }
        } catch (Exception $e) {
            Log::error('Geocod.io geocoding failed: '.$e->getMessage());
        }

        return null;
    }

    protected function geocodeWithCensus(array $address): ?array
    {
        try {
            $response = Http::get('https://geocoding.geo.census.gov/geocoder/locations/address', [
                'street' => $address['street'] ?? '',
                'city' => $address['city'] ?? '',
                'state' => $address['state'] ?? '',
                'zip' => $address['postalcode'] ?? '',
                'benchmark' => 'Public_AR_Current',
                'format' => 'json',
            ]);

            $matches = $response->json('result.addressMatches') ?? [];

            if ($response->successful() && ! empty($matches)) {
                $coords = $matches[0]['coordinates'];

                Log::debug(__CLASS__.':'.__LINE__, [
                    'source' => 'census',
                    'matched_address' => $matches[0]['matchedAddress'] ?? null,
                    'coordinates' => $coords,
                ]);

                return [
                    'lat' => (float) $coords['y'],
                    'lng' => (float) $coords['x'],
                    'source' => 'census',
                    'accuracy' => 'range_interpolation',
                ];
            }
        } catch (Exception $e) {
            Log::error('Census geocoding failed: '.$e->getMessage());
        }

        return null;
    }

    protected function prepareGeocodeAttempts(string|array $address): array
    {
        $baseParams = [
            'format' => 'json',
            'limit' => 1,
        ];

        if (is_string($address)) {
            return [array_merge($baseParams, ['q' => $address])];
        }

        $attempts = [];

        // Attempt 1: Full structured search (most precise)
        $attempts[] = array_merge($baseParams, $address);

        // Attempt 2: Full unstructured search string (sometimes handles city mismatches better)
        $fullAddress = implode(', ', array_filter([
            $address['street'] ?? null,
            $address['city'] ?? null,
            $address['state'] ?? null,
            $address['postalcode'] ?? null,
        ]));
        if ($fullAddress) {
            $attempts[] = array_merge($baseParams, ['q' => $fullAddress]);
        }

        // Attempt 3: Structured search without city (if ZIP/street are provided)
        if (isset($address['street'], $address['postalcode'])) {
            $noCity = $address;
            unset($noCity['city']);
            $attempts[] = array_merge($baseParams, $noCity);
        }

        return $attempts;
    }

    protected function queryOverpass(string $query, int $timeout = 30): ?array
    {
        foreach ($this->overpassUrls as $url) {
            try {
                $response = Http::asForm()
                    ->withHeaders([
                        'User-Agent' => $this->userAgent,
                    ])
                    ->retry(3, function (int $attempt) {
                        return $attempt * 500; // 500ms, 1000ms, 1500ms
                    }, throw: false)
                    ->timeout($timeout)
                    ->post($url, ['data' => $query]);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::warning("Overpass returned {$response->status()} from {$url}");
            } catch (Exception $e) {
                Log::warning("Overpass query failed at {$url}: {$e->getMessage()}");
            }
        }

        Log::error('All Overpass API mirrors failed.');

        return null;
    }

    public function analyzeNeighborDistance(float $lat, float $lng, ?string $address = null): array
    {
        $radiusMeters = 1609;

        // Any "building" tag value covers rural types (detached, farm, barn, etc.)
        $query = <<<QUERY
[out:json][timeout:25];
(
  way["building"](around:{$radiusMeters},{$lat},{$lng});
);
out tags center geom;
QUERY;

        try {
            $data = $this->queryOverpass($query, 35);

            if ($data !== null) {
                $buildings = array_values(array_filter(
                    $data['elements'] ?? [],
                    fn (array $building): bool => ($building['type'] ?? null) === 'way' && isset($building['tags']['building']) && (isset($building['center']) || $this->buildingGeometry($building) !== [])
                ));
                $subjectBuilding = $this->findSubjectBuilding($buildings, $lat, $lng, $address);
                $subjectGeometry = $subjectBuilding ? $this->buildingGeometry($subjectBuilding) : [];
                $subjectCenter = $subjectBuilding
                    ? $this->buildingCenter($subjectBuilding) ?? ['lat' => $lat, 'lon' => $lng]
                    : ['lat' => $lat, 'lon' => $lng];

                $nearestHouses = [];
                foreach ($buildings as $building) {
                    if ($subjectBuilding && ($building['id'] ?? null) === ($subjectBuilding['id'] ?? null)) {
                        continue;
                    }

                    $center = $this->buildingCenter($building);
                    if (! $center) {
                        continue;
                    }

                    $geometry = $this->buildingGeometry($building);
                    $centerDistance = $this->haversineDistance(
                        $subjectCenter['lat'], $subjectCenter['lon'], $center['lat'], $center['lon']
                    );
                    $usesFootprintDistance = $subjectGeometry !== [] && $geometry !== [];
                    $distance = $usesFootprintDistance
                        ? $this->minimumFootprintDistance($subjectGeometry, $geometry)
                        : $centerDistance;

                    // Preserve the legacy safeguard when there is no reliable subject match.
                    if (! $subjectBuilding && $distance < $this->minimumNeighborDistanceMeters) {
                        continue;
                    }

                    $nearestHouses[] = [
                        'osm_id' => $building['id'] ?? null,
                        'distance_meters' => $distance,
                        'distance_method' => $usesFootprintDistance ? 'footprint_edge' : 'center_fallback',
                        'center_distance_meters' => $centerDistance,
                        'direction' => $this->calculateDirection(
                            $subjectCenter['lat'], $subjectCenter['lon'], $center['lat'], $center['lon']
                        ),
                        'lat' => $center['lat'],
                        'lng' => $center['lon'],
                        'footprint' => $this->mapFootprint($geometry),
                        'address' => $this->buildingAddress($building),
                    ];
                }

                usort($nearestHouses, fn (array $a, array $b): int => $a['distance_meters'] <=> $b['distance_meters']);
                $nearestHouses = array_slice($nearestHouses, 0, 10);
                $nearestDistances = array_column($nearestHouses, 'distance_meters');

                return [
                    'total_buildings_nearby' => count($buildings) - ($subjectBuilding ? 1 : 0),
                    'nearest_neighbor_meters' => $nearestDistances[0] ?? null,
                    'average_distance_meters' => count($nearestDistances) > 0
                        ? round(array_sum($nearestDistances) / count($nearestDistances), 1)
                        : null,
                    'nearest_10_distances' => $nearestDistances,
                    'nearest_houses' => $nearestHouses,
                    'subject_building' => $subjectBuilding ? [
                        'osm_id' => $subjectBuilding['id'] ?? null,
                        'lat' => $subjectCenter['lat'],
                        'lng' => $subjectCenter['lon'],
                        'footprint' => $this->mapFootprint($subjectGeometry),
                        'match_method' => $this->subjectMatchMethod($subjectBuilding, $buildings, $lat, $lng, $address),
                        'distance_from_input_meters' => $subjectGeometry !== []
                            ? $this->distanceFromPointToFootprint($lat, $lng, $subjectGeometry)
                            : $this->haversineDistance($lat, $lng, $subjectCenter['lat'], $subjectCenter['lon']),
                        'address' => $this->buildingAddress($subjectBuilding),
                    ] : null,
                    'distance_method' => $nearestHouses[0]['distance_method'] ?? 'center_fallback',
                    'subject_match_confidence' => $this->subjectMatchConfidence($subjectBuilding, $buildings, $lat, $lng, $address),
                    'isolation_score' => $this->calculateIsolationScore($nearestDistances),
                ];
            }
        } catch (Exception $e) {
            Log::error('Neighbor distance analysis failed: '.$e->getMessage());
        }

        return ['error' => 'Analysis failed'];
    }

    /**
     * @param  array<int, array<string, mixed>>  $buildings
     * @return array<string, mixed>|null
     */
    protected function findSubjectBuilding(array $buildings, float $lat, float $lng, ?string $address): ?array
    {
        foreach ($buildings as $building) {
            $geometry = $this->buildingGeometry($building);
            if ($geometry !== [] && $this->pointIsInPolygon($lat, $lng, $geometry)) {
                return $building;
            }
        }

        $addressMatches = array_values(array_filter(
            $buildings,
            fn (array $building): bool => $address !== null && $this->addressesMatch($address, $this->buildingAddress($building))
        ));
        if (count($addressMatches) === 1) {
            return $addressMatches[0];
        }

        $nearestBuilding = null;
        $nearestDistance = PHP_FLOAT_MAX;
        $secondNearestDistance = PHP_FLOAT_MAX;
        foreach ($buildings as $building) {
            $geometry = $this->buildingGeometry($building);
            $distance = $geometry !== []
                ? $this->distanceFromPointToFootprint($lat, $lng, $geometry)
                : $this->distanceToBuildingCenter($lat, $lng, $building);

            if ($distance < $nearestDistance) {
                $secondNearestDistance = $nearestDistance;
                $nearestDistance = $distance;
                $nearestBuilding = $building;
            } elseif ($distance < $secondNearestDistance) {
                $secondNearestDistance = $distance;
            }
        }

        if ($nearestBuilding && $this->buildingGeometry($nearestBuilding) === []) {
            return $nearestDistance <= $this->minimumNeighborDistanceMeters ? $nearestBuilding : null;
        }

        return $nearestDistance <= 30 && ($nearestDistance <= 10 || $secondNearestDistance - $nearestDistance >= 5)
            ? $nearestBuilding
            : null;
    }

    /**
     * @param  array<string, mixed>|null  $subjectBuilding
     * @param  array<int, array<string, mixed>>  $buildings
     */
    protected function subjectMatchMethod(?array $subjectBuilding, array $buildings, float $lat, float $lng, ?string $address): ?string
    {
        if (! $subjectBuilding) {
            return null;
        }

        if ($this->pointIsInPolygon($lat, $lng, $this->buildingGeometry($subjectBuilding))) {
            return 'point_in_footprint';
        }

        if ($address !== null && $this->addressesMatch($address, $this->buildingAddress($subjectBuilding))) {
            return 'address_match';
        }

        return 'nearest_footprint';
    }

    /**
     * @param  array<string, mixed>|null  $subjectBuilding
     * @param  array<int, array<string, mixed>>  $buildings
     */
    protected function subjectMatchConfidence(?array $subjectBuilding, array $buildings, float $lat, float $lng, ?string $address): ?string
    {
        return match ($this->subjectMatchMethod($subjectBuilding, $buildings, $lat, $lng, $address)) {
            'point_in_footprint' => 'high',
            'address_match' => 'medium',
            'nearest_footprint' => 'low',
            default => 'none',
        };
    }

    /** @param array<string, mixed> $building */
    protected function buildingAddress(array $building): ?string
    {
        $tags = $building['tags'] ?? [];
        $number = $tags['addr:housenumber'] ?? null;
        if (! $number) {
            return null;
        }

        return trim($number.' '.($tags['addr:street'] ?? ''));
    }

    protected function addressesMatch(string $propertyAddress, ?string $buildingAddress): bool
    {
        if (! $buildingAddress) {
            return false;
        }

        $propertyNumber = $this->addressNumber($propertyAddress);
        $buildingNumber = $this->addressNumber($buildingAddress);
        if (! $propertyNumber || $propertyNumber !== $buildingNumber) {
            return false;
        }

        $propertyStreet = $this->normalizedStreet($propertyAddress);
        $buildingStreet = $this->normalizedStreet($buildingAddress);

        return $propertyStreet !== '' && $buildingStreet !== '' && $propertyStreet === $buildingStreet;
    }

    protected function addressNumber(string $address): ?string
    {
        preg_match('/^\s*([0-9]+[A-Za-z-]*)/', $address, $matches);

        return $matches[1] ?? null;
    }

    protected function normalizedStreet(string $address): string
    {
        $withoutNumber = preg_replace('/^\s*[0-9]+[A-Za-z-]*\s*/', '', $address) ?? '';
        $street = strtolower(trim($withoutNumber));
        $street = preg_replace('/\b(street|st|avenue|ave|road|rd|court|ct|drive|dr|lane|ln|boulevard|blvd)\.?\b/', '', $street) ?? '';

        return preg_replace('/[^a-z0-9]/', '', $street) ?? '';
    }

    /** @param array<string, mixed> $building */
    protected function buildingGeometry(array $building): array
    {
        $geometry = $building['geometry'] ?? [];

        return array_values(array_filter($geometry, fn (mixed $point): bool => isset($point['lat'], $point['lon'])));
    }

    /**
     * @param  array<string, mixed>  $building
     * @return array{lat: float, lon: float}|null
     */
    protected function buildingCenter(array $building): ?array
    {
        if (isset($building['center']['lat'], $building['center']['lon'])) {
            return [
                'lat' => (float) $building['center']['lat'],
                'lon' => (float) $building['center']['lon'],
            ];
        }

        $geometry = $this->buildingGeometry($building);
        if ($geometry === []) {
            return null;
        }

        $latitudes = array_column($geometry, 'lat');
        $longitudes = array_column($geometry, 'lon');

        return [
            'lat' => ((float) min($latitudes) + (float) max($latitudes)) / 2,
            'lon' => ((float) min($longitudes) + (float) max($longitudes)) / 2,
        ];
    }

    /**
     * @param  array<int, array{lat: float|int, lon: float|int}>  $geometry
     * @return array<int, array{lat: float, lng: float}>
     */
    protected function mapFootprint(array $geometry): array
    {
        return array_map(fn (array $point): array => [
            'lat' => (float) $point['lat'],
            'lng' => (float) $point['lon'],
        ], $geometry);
    }

    /** @param array<string, mixed> $building */
    protected function distanceToBuildingCenter(float $lat, float $lng, array $building): float
    {
        $center = $this->buildingCenter($building);
        if (! $center) {
            return PHP_FLOAT_MAX;
        }

        return $this->haversineDistance($lat, $lng, $center['lat'], $center['lon']);
    }

    /** @param array<int, array{lat: float|int, lon: float|int}> $polygon */
    protected function pointIsInPolygon(float $lat, float $lng, array $polygon): bool
    {
        if (count($polygon) < 3) {
            return false;
        }

        $inside = false;
        $previous = count($polygon) - 1;
        foreach ($polygon as $current => $point) {
            $previousPoint = $polygon[$previous];
            if ((($point['lat'] > $lat) !== ($previousPoint['lat'] > $lat)) &&
                ($lng < (($previousPoint['lon'] - $point['lon']) * ($lat - $point['lat']) / ($previousPoint['lat'] - $point['lat']) + $point['lon']))) {
                $inside = ! $inside;
            }
            $previous = $current;
        }

        return $inside;
    }

    /** @param array<int, array{lat: float|int, lon: float|int}> $polygon */
    protected function distanceFromPointToFootprint(float $lat, float $lng, array $polygon): float
    {
        if ($polygon === []) {
            return PHP_FLOAT_MAX;
        }
        if ($this->pointIsInPolygon($lat, $lng, $polygon)) {
            return 0.0;
        }

        $minimum = PHP_FLOAT_MAX;
        foreach ($this->polygonSegments($polygon) as [$start, $end]) {
            $minimum = min($minimum, $this->pointToSegmentDistance($lat, $lng, $start, $end));
        }

        return round($minimum, 1);
    }

    /** @param array<int, array{lat: float|int, lon: float|int}> $first @param array<int, array{lat: float|int, lon: float|int}> $second */
    protected function minimumFootprintDistance(array $first, array $second): float
    {
        if ($this->pointIsInPolygon($first[0]['lat'], $first[0]['lon'], $second) || $this->pointIsInPolygon($second[0]['lat'], $second[0]['lon'], $first)) {
            return 0.0;
        }

        $minimum = PHP_FLOAT_MAX;
        foreach ($this->polygonSegments($first) as [$firstStart, $firstEnd]) {
            foreach ($this->polygonSegments($second) as [$secondStart, $secondEnd]) {
                $minimum = min($minimum, $this->segmentDistance($firstStart, $firstEnd, $secondStart, $secondEnd));
            }
        }

        return round($minimum, 1);
    }

    /** @param array<int, array{lat: float|int, lon: float|int}> $polygon @return array<int, array{0: array{lat: float|int, lon: float|int}, 1: array{lat: float|int, lon: float|int}}> */
    protected function polygonSegments(array $polygon): array
    {
        if (count($polygon) < 2) {
            return [];
        }

        $segments = [];
        foreach ($polygon as $index => $point) {
            $segments[] = [$point, $polygon[($index + 1) % count($polygon)]];
        }

        return $segments;
    }

    /** @param array{lat: float|int, lon: float|int} $point @param array{lat: float|int, lon: float|int} $start @param array{lat: float|int, lon: float|int} $end */
    protected function pointToSegmentDistance(float $lat, float $lng, array $start, array $end): float
    {
        [$pointX, $pointY] = $this->toLocalMeters($lat, $lng, $lat);
        [$startX, $startY] = $this->toLocalMeters($start['lat'], $start['lon'], $lat);
        [$endX, $endY] = $this->toLocalMeters($end['lat'], $end['lon'], $lat);
        $deltaX = $endX - $startX;
        $deltaY = $endY - $startY;
        $lengthSquared = $deltaX ** 2 + $deltaY ** 2;
        $fraction = $lengthSquared === 0.0 ? 0.0 : max(0.0, min(1.0, (($pointX - $startX) * $deltaX + ($pointY - $startY) * $deltaY) / $lengthSquared));

        return hypot($pointX - ($startX + $fraction * $deltaX), $pointY - ($startY + $fraction * $deltaY));
    }

    /** @param array{lat: float|int, lon: float|int} $firstStart @param array{lat: float|int, lon: float|int} $firstEnd @param array{lat: float|int, lon: float|int} $secondStart @param array{lat: float|int, lon: float|int} $secondEnd */
    protected function segmentDistance(array $firstStart, array $firstEnd, array $secondStart, array $secondEnd): float
    {
        $latitude = ($firstStart['lat'] + $firstEnd['lat'] + $secondStart['lat'] + $secondEnd['lat']) / 4;
        [$firstStartX, $firstStartY] = $this->toLocalMeters($firstStart['lat'], $firstStart['lon'], $latitude);
        [$firstEndX, $firstEndY] = $this->toLocalMeters($firstEnd['lat'], $firstEnd['lon'], $latitude);
        [$secondStartX, $secondStartY] = $this->toLocalMeters($secondStart['lat'], $secondStart['lon'], $latitude);
        [$secondEndX, $secondEndY] = $this->toLocalMeters($secondEnd['lat'], $secondEnd['lon'], $latitude);

        if ($this->segmentsIntersect($firstStartX, $firstStartY, $firstEndX, $firstEndY, $secondStartX, $secondStartY, $secondEndX, $secondEndY)) {
            return 0.0;
        }

        return min(
            $this->pointToSegmentDistance($firstStart['lat'], $firstStart['lon'], $secondStart, $secondEnd),
            $this->pointToSegmentDistance($firstEnd['lat'], $firstEnd['lon'], $secondStart, $secondEnd),
            $this->pointToSegmentDistance($secondStart['lat'], $secondStart['lon'], $firstStart, $firstEnd),
            $this->pointToSegmentDistance($secondEnd['lat'], $secondEnd['lon'], $firstStart, $firstEnd),
        );
    }

    protected function segmentsIntersect(float $ax, float $ay, float $bx, float $by, float $cx, float $cy, float $dx, float $dy): bool
    {
        $cross = fn (float $px, float $py, float $qx, float $qy, float $rx, float $ry): float => ($qx - $px) * ($ry - $py) - ($qy - $py) * ($rx - $px);
        $first = $cross($ax, $ay, $bx, $by, $cx, $cy);
        $second = $cross($ax, $ay, $bx, $by, $dx, $dy);
        $third = $cross($cx, $cy, $dx, $dy, $ax, $ay);
        $fourth = $cross($cx, $cy, $dx, $dy, $bx, $by);

        return (($first > 0 && $second < 0) || ($first < 0 && $second > 0)) && (($third > 0 && $fourth < 0) || ($third < 0 && $fourth > 0));
    }

    /** @return array{0: float, 1: float} */
    protected function toLocalMeters(float $lat, float $lng, float $referenceLat): array
    {
        return [deg2rad($lng) * 6371000 * cos(deg2rad($referenceLat)), deg2rad($lat) * 6371000];
    }

    public function analyzePointsOfInterest(float $lat, float $lng): array
    {
        $radiusMeters = 8000; // 8km search radius

        $poiTypes = [
            'grocery' => '["shop"~"supermarket|grocery|convenience"]',
            'hospital' => '["amenity"="hospital"]',
            'school' => '["amenity"~"school|college|university"]',
            'restaurant' => '["amenity"~"restaurant|cafe|fast_food"]',
            'gas_station' => '["amenity"="fuel"]',
            'pharmacy' => '["amenity"="pharmacy"]',
            'bank' => '["amenity"="bank"]',
            'post_office' => '["amenity"="post_office"]',
        ];

        $queryParts = [];
        foreach ($poiTypes as $type => $osmTag) {
            $queryParts[] = "node{$osmTag}(around:{$radiusMeters},{$lat},{$lng});";
            $queryParts[] = "way{$osmTag}(around:{$radiusMeters},{$lat},{$lng});";
        }

        $query = "[out:json][timeout:30];\n(\n".implode("\n", $queryParts)."\n);\nout center;";

        try {
            $data = $this->queryOverpass($query, 45);

            if ($data !== null) {
                $elements = $data['elements'] ?? [];

                $results = [];
                foreach ($poiTypes as $type => $osmTag) {
                    $results[$type] = [
                        'count' => 0,
                        'nearest' => null,
                        'top_3' => [],
                    ];
                }

                $categorizedDistances = [];
                foreach ($elements as $element) {
                    Log::debug(__METHOD__.':'.__LINE__, [$element]);
                    $poiLat = $element['lat'] ?? ($element['center']['lat'] ?? null);
                    $poiLng = $element['lon'] ?? ($element['center']['lon'] ?? null);

                    if (! $poiLat || ! $poiLng) {
                        continue;
                    }

                    $distance = $this->haversineDistance($lat, $lng, $poiLat, $poiLng);
                    $name = $element['tags']['name']
                        ?? $element['tags']['brand']
                        ?? $element['tags']['operator']
                        ?? null;

                    // Skip elements with no real name (raw tag values like "hospital" are not useful)
                    if (! $name) {
                        continue;
                    }

                    $poiData = [
                        'name' => $name,
                        'distance_meters' => $distance,
                    ];

                    // Determine which type this element belongs to
                    foreach ($poiTypes as $type => $osmTag) {
                        if ($this->elementMatchesTag($element, $osmTag)) {
                            $categorizedDistances[$type][] = $poiData;
                        }
                    }
                }

                foreach ($poiTypes as $type => $osmTag) {
                    $distances = $categorizedDistances[$type] ?? [];
                    usort($distances, fn ($a, $b) => $a['distance_meters'] <=> $b['distance_meters']);

                    $results[$type] = [
                        'count' => count($distances),
                        'nearest' => $distances[0] ?? null,
                        'top_3' => array_slice($distances, 0, 3),
                    ];
                }

                return $results;
            }
        } catch (Exception $e) {
            Log::error('POI analysis failed: '.$e->getMessage());
        }

        return ['error' => 'Analysis failed'];
    }

    protected function elementMatchesTag(array $element, string $osmTag): bool
    {
        // Simple parser for osmTag like '["amenity"="hospital"]' or '["shop"~"supermarket|grocery|convenience"]'
        if (preg_match('/\["([^"]+)"="([^"]+)"\]/', $osmTag, $matches)) {
            $key = $matches[1];
            $value = $matches[2];

            return isset($element['tags'][$key]) && $element['tags'][$key] === $value;
        }

        if (preg_match('/\["([^"]+)"~"([^"]+)"\]/', $osmTag, $matches)) {
            $key = $matches[1];
            $regex = $matches[2];

            if (! isset($element['tags'][$key])) {
                return false;
            }

            $values = explode('|', $regex);
            foreach ($values as $value) {
                if ($element['tags'][$key] === $value) {
                    return true;
                }
            }
        }

        return false;
    }

    public function analyzeRoadAccessibility(float $lat, float $lng): array
    {
        $radiusMeters = 5000; // 5km search radius

        $roadTypes = [
            'highway' => '["highway"~"motorway|trunk|primary"]',
            'main_road' => '["highway"~"secondary|tertiary"]',
            'local_road' => '["highway"~"residential|unclassified"]',
            'path' => '["highway"~"path|track|footway"]',
        ];

        $results = [];

        foreach ($roadTypes as $type => $osmTag) {
            $query = <<<QUERY
[out:json][timeout:25];
(
  way{$osmTag}(around:{$radiusMeters},{$lat},{$lng});
);
out geom;
QUERY;

            try {
                $data = $this->queryOverpass($query, 30);

                if ($data !== null) {
                    $roads = $data['elements'] ?? [];

                    $minDistance = PHP_FLOAT_MAX;
                    $nearestRoad = null;

                    foreach ($roads as $road) {
                        if (isset($road['geometry'])) {
                            foreach ($road['geometry'] as $point) {
                                $distance = $this->haversineDistance(
                                    $lat, $lng,
                                    $point['lat'],
                                    $point['lon']
                                );
                                if ($distance < $minDistance) {
                                    $minDistance = $distance;
                                    $name = $road['tags']['name']
                                        ?? $road['tags']['ref']
                                        ?? 'Unnamed Road';

                                    $nearestRoad = [
                                        'name' => $name,
                                        'ref' => $road['tags']['ref'] ?? null,
                                        'surface' => $road['tags']['surface'] ?? 'unknown',
                                    ];
                                }
                            }
                        }
                    }

                    $results[$type] = [
                        'count' => count($roads),
                        'nearest_distance_meters' => $minDistance < PHP_FLOAT_MAX ? round($minDistance, 1) : null,
                        'nearest_road' => $nearestRoad,
                    ];
                }
            } catch (Exception $e) {
                Log::error("Road analysis failed for {$type}: ".$e->getMessage());
                $results[$type] = ['error' => 'Analysis failed'];
            }

            usleep(500000); // Rate limiting
        }

        // Calculate overall accessibility score
        $results['accessibility_score'] = $this->calculateAccessibilityScore($results);

        return $results;
    }

    protected function calculateDirection(float $lat1, float $lon1, float $lat2, float $lon2): string
    {
        $dLon = deg2rad($lon2 - $lon1);
        $y = sin($dLon) * cos(deg2rad($lat2));
        $x = cos(deg2rad($lat1)) * sin(deg2rad($lat2)) -
            sin(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos($dLon);

        $bearing = rad2deg(atan2($y, $x));
        $bearing = ($bearing + 360) % 360;

        $directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        $index = round($bearing / 45) % 8;

        return $directions[$index];
    }

    protected function haversineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // meters

        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
        $deltaLat = deg2rad($lat2 - $lat1);
        $deltaLon = deg2rad($lon2 - $lon1);

        $a = sin($deltaLat / 2) ** 2 +
             cos($lat1Rad) * cos($lat2Rad) * sin($deltaLon / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 1);
    }

    protected function calculateIsolationScore(array $distances): string
    {
        if (empty($distances)) {
            return 'unknown';
        }

        $avgDistance = array_sum($distances) / count($distances);

        if ($avgDistance > 1000) {
            return 'very_isolated';
        }
        if ($avgDistance > 500) {
            return 'isolated';
        }
        if ($avgDistance > 200) {
            return 'moderate';
        }
        if ($avgDistance > 100) {
            return 'suburban';
        }

        return 'dense';
    }

    protected function calculateAccessibilityScore(array $roadData): string
    {
        $highwayDist = $roadData['highway']['nearest_distance_meters'] ?? PHP_FLOAT_MAX;
        $mainRoadDist = $roadData['main_road']['nearest_distance_meters'] ?? PHP_FLOAT_MAX;
        $localRoadDist = $roadData['local_road']['nearest_distance_meters'] ?? PHP_FLOAT_MAX;

        // Score based on distance to nearest paved road
        $minPavedRoad = min($highwayDist, $mainRoadDist, $localRoadDist);

        if ($minPavedRoad <= 100) {
            return 'excellent';
        }
        if ($minPavedRoad <= 500) {
            return 'good';
        }
        if ($minPavedRoad <= 1000) {
            return 'moderate';
        }
        if ($minPavedRoad <= 2000) {
            return 'limited';
        }

        return 'poor';
    }
}
