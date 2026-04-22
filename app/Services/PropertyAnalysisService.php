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

        $neighborDistance = $this->analyzeNeighborDistance($lat, $lng);
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

    public function analyzeNeighborDistance(float $lat, float $lng): array
    {
        $radiusMeters = 1609;

        // Any "building" tag value covers rural types (detached, farm, barn, etc.)
        $query = <<<QUERY
[out:json][timeout:25];
(
  way["building"](around:{$radiusMeters},{$lat},{$lng});
);
out center;
QUERY;

        try {
            $data = $this->queryOverpass($query, 35);

            if ($data !== null) {
                $buildings = $data['elements'] ?? [];

                $distances = [];
                foreach ($buildings as $building) {
                    if (isset($building['center'])) {
                        $distance = $this->haversineDistance(
                            $lat, $lng,
                            $building['center']['lat'],
                            $building['center']['lon']
                        );
                        if ($distance < $this->minimumNeighborDistanceMeters) {
                            continue;
                        }
                        $distances[] = $distance;
                    }
                }

                sort($distances);
                $nearestDistances = array_slice($distances, 0, 10);

                $nearestHouses = [];
                foreach ($buildings as $building) {
                    if (isset($building['center'])) {
                        $dist = $this->haversineDistance(
                            $lat, $lng,
                            $building['center']['lat'],
                            $building['center']['lon']
                        );
                        if ($dist < $this->minimumNeighborDistanceMeters) {
                            continue;
                        }
                        $direction = $this->calculateDirection(
                            $lat, $lng,
                            $building['center']['lat'],
                            $building['center']['lon']
                        );
                        $nearestHouses[] = [
                            'distance_meters' => $dist,
                            'direction' => $direction,
                            'lat' => $building['center']['lat'],
                            'lng' => $building['center']['lon'],
                        ];
                    }
                }

                usort($nearestHouses, fn ($a, $b) => $a['distance_meters'] <=> $b['distance_meters']);
                $nearestHouses = array_slice($nearestHouses, 0, 10);

                return [
                    'total_buildings_nearby' => count($buildings),
                    'nearest_neighbor_meters' => $nearestDistances[0] ?? null,
                    'average_distance_meters' => count($nearestDistances) > 0
                        ? round(array_sum($nearestDistances) / count($nearestDistances), 1)
                        : null,
                    'nearest_10_distances' => $nearestDistances,
                    'nearest_houses' => $nearestHouses,
                    'isolation_score' => $this->calculateIsolationScore($nearestDistances),
                ];
            }
        } catch (\Exception $e) {
            Log::error('Neighbor distance analysis failed: '.$e->getMessage());
        }

        return ['error' => 'Analysis failed'];
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
        } catch (\Exception $e) {
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
            } catch (\Exception $e) {
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
