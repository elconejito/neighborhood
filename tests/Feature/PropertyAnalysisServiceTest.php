<?php

namespace Tests\Feature;

use App\Services\PropertyAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PropertyAnalysisServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_geocode_address_returns_coordinates_on_success(): void
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/search*' => Http::response([
                [
                    'lat' => '40.7128',
                    'lon' => '-74.0060',
                    'display_name' => 'New York, USA',
                ],
            ], 200),
        ]);

        $service = new PropertyAnalysisService;
        $result = $service->geocodeAddress('New York');

        $this->assertNotNull($result);
        $this->assertEquals(40.7128, $result['lat']);
        $this->assertEquals(-74.0060, $result['lng']);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'format=json') &&
                   str_contains($request->url(), 'limit=1') &&
                   $request->header('User-Agent')[0] === 'NeighborhoodApp/1.0 (contact@neighborhood.app)';
        });
    }

    public function test_geocode_address_sends_structured_params_when_possible(): void
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/search*' => Http::response([
                [
                    'lat' => '40.7128',
                    'lon' => '-74.0060',
                    'display_name' => 'New York, USA',
                ],
            ], 200),
        ]);

        $service = new PropertyAnalysisService;
        $addressData = [
            'street' => '1600 Amphitheatre Parkway',
            'city' => 'Mountain View',
            'state' => 'CA',
            'postalcode' => '94043',
        ];

        // This test will fail initially if geocodeAddress only accepts strings
        $result = $service->geocodeAddress($addressData);

        $this->assertNotNull($result);

        Http::assertSent(function ($request) {
            $query = parse_url($request->url(), PHP_URL_QUERY);
            parse_str($query, $params);

            return $params['street'] === '1600 Amphitheatre Parkway' &&
                   $params['city'] === 'Mountain View' &&
                   $params['state'] === 'CA' &&
                   $params['postalcode'] === '94043';
        });
    }

    public function test_geocode_address_returns_null_on_empty_response(): void
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/search*' => Http::response([], 200),
        ]);

        $service = new PropertyAnalysisService;
        $result = $service->geocodeAddress('Nonexistent Place');

        $this->assertNull($result);
    }

    public function test_geocode_address_returns_null_on_error(): void
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/search*' => Http::response('Error', 500),
        ]);

        $service = new PropertyAnalysisService;
        $result = $service->geocodeAddress('New York');

        $this->assertNull($result);
    }

    public function test_geocode_address_performs_fallback_on_failure(): void
    {
        Http::fake([
            'https://nominatim.openstreetmap.org/search?street=11802+Berwick+Ct&city=Fredericksburg&state=VA&postalcode=22408&format=json&limit=1' => Http::response([], 200),
            'https://nominatim.openstreetmap.org/search?q=11802+Berwick+Ct%2C+Fredericksburg%2C+VA%2C+22408&format=json&limit=1' => Http::response([], 200),
            'https://nominatim.openstreetmap.org/search?street=11802+Berwick+Ct&state=VA&postalcode=22408&format=json&limit=1' => Http::response([
                [
                    'lat' => '38.2777996',
                    'lon' => '-77.5092532',
                ],
            ], 200),
        ]);

        $service = new PropertyAnalysisService;
        $addressData = [
            'street' => '11802 Berwick Ct',
            'city' => 'Fredericksburg',
            'state' => 'VA',
            'postalcode' => '22408',
        ];

        $result = $service->geocodeAddress($addressData);

        $this->assertNotNull($result);
        $this->assertEquals(38.2777996, $result['lat']);
        $this->assertEquals(-77.5092532, $result['lng']);

        Http::assertSentCount(3);
    }

    public function test_analyze_property_fetches_data_from_overpass(): void
    {
        Http::fake([
            'https://overpass-api.de/api/interpreter' => Http::response([
                'elements' => [
                    [
                        'type' => 'way',
                        'id' => 1,
                        'center' => ['lat' => 40.7128, 'lon' => -74.0061],
                        'tags' => ['building' => 'yes'],
                    ],
                    [
                        'type' => 'node',
                        'id' => 2,
                        'lat' => 40.7129,
                        'lon' => -74.0062,
                        'tags' => ['amenity' => 'hospital', 'name' => 'General Hospital'],
                    ],
                    [
                        'type' => 'way',
                        'id' => 3,
                        'geometry' => [
                            ['lat' => 40.7127, 'lon' => -74.0059],
                        ],
                        'tags' => ['highway' => 'primary', 'name' => 'Main St'],
                    ],
                ],
            ], 200),
        ]);

        $property = new \App\Models\Property([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $service = new PropertyAnalysisService;
        $result = $service->analyzeProperty($property);

        $this->assertArrayHasKey('neighbor_distance', $result);
        $this->assertArrayHasKey('points_of_interest', $result);
        $this->assertArrayHasKey('road_accessibility', $result);

        $this->assertEquals(3, $result['neighbor_distance']['total_buildings_nearby']);
        $this->assertCount(1, $result['neighbor_distance']['nearest_houses']);
        $this->assertEquals('W', $result['neighbor_distance']['nearest_houses'][0]['direction']);
        $this->assertEquals(8.4, $result['neighbor_distance']['nearest_houses'][0]['distance_meters']);

        $this->assertEquals(1, $result['points_of_interest']['hospital']['count']);
        $this->assertEquals('General Hospital', $result['points_of_interest']['hospital']['nearest']['name']);
        $this->assertEquals('Main St', $result['road_accessibility']['highway']['nearest_road']['name']);

        Http::assertSent(function ($request) {
            return $request->isForm() &&
                   str_contains($request['data'], '[out:json]');
        });
    }

    public function test_analyze_neighbor_distance_filters_out_impossibly_close_buildings(): void
    {
        // Building at ~0.8m (0.00001 lon diff) — should be excluded (own footprint)
        // Building at ~8.4m (0.0001 lon diff) — should be included
        Http::fake([
            'https://overpass-api.de/api/interpreter' => Http::response([
                'elements' => [
                    [
                        'type' => 'way',
                        'id' => 1,
                        'center' => ['lat' => 40.7128, 'lon' => -74.00601],
                        'tags' => ['building' => 'yes'],
                    ],
                    [
                        'type' => 'way',
                        'id' => 2,
                        'center' => ['lat' => 40.7128, 'lon' => -74.0061],
                        'tags' => ['building' => 'yes'],
                    ],
                ],
            ], 200),
        ]);

        $service = new PropertyAnalysisService;
        $result = $service->analyzeNeighborDistance(40.7128, -74.0060);

        $this->assertCount(1, $result['nearest_houses']);
        $this->assertGreaterThanOrEqual(3.0, $result['nearest_houses'][0]['distance_meters']);
    }

    public function test_analyze_property_handles_missing_names_with_fallbacks(): void
    {
        Http::fake([
            'https://overpass-api.de/api/interpreter' => Http::response([
                'elements' => [
                    [
                        'type' => 'node',
                        'id' => 1,
                        'lat' => 40.7129,
                        'lon' => -74.0062,
                        'tags' => ['amenity' => 'hospital', 'brand' => 'HealthCare Plus'],
                    ],
                    [
                        'type' => 'node',
                        'id' => 2,
                        'lat' => 40.7130,
                        'lon' => -74.0063,
                        'tags' => ['shop' => 'supermarket', 'operator' => 'FoodCorp'],
                    ],
                    [
                        'type' => 'way',
                        'id' => 3,
                        'geometry' => [
                            ['lat' => 40.7127, 'lon' => -74.0059],
                        ],
                        'tags' => ['highway' => 'primary', 'ref' => 'US-1'],
                    ],
                ],
            ], 200),
        ]);

        $property = new \App\Models\Property([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $service = new PropertyAnalysisService;
        $result = $service->analyzeProperty($property);

        // Hospital should fallback to brand
        $this->assertEquals('HealthCare Plus', $result['points_of_interest']['hospital']['nearest']['name']);

        // Grocery should fallback to operator
        $this->assertEquals('FoodCorp', $result['points_of_interest']['grocery']['nearest']['name']);

        // Road should fallback to ref
        $this->assertEquals('US-1', $result['road_accessibility']['highway']['nearest_road']['name']);
    }
}
