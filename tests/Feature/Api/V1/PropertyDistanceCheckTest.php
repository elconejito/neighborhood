<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use App\Services\PropertyAnalysisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyDistanceCheckTest extends TestCase
{
    use RefreshDatabase;

    private array $validPayload = [
        'address' => '123 Main St',
        'city' => 'Charleston',
        'state' => 'WV',
        'zip_code' => '25301',
    ];

    private array $mockNeighborDistance = [
        'total_buildings_nearby' => 42,
        'nearest_neighbor_meters' => 85.3,
        'average_distance_meters' => 120.5,
        'nearest_10_distances' => [85.3, 91.2, 104.0],
        'nearest_houses' => [
            ['distance_meters' => 85.3, 'direction' => 'N', 'lat' => 38.351, 'lng' => -81.633],
        ],
        'isolation_score' => 'suburban',
    ];

    public function test_guest_cannot_access_distance_check(): void
    {
        $response = $this->postJson('/api/v1/properties/distance-check', $this->validPayload);

        $response->assertStatus(401);
    }

    public function test_distance_check_requires_address_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/properties/distance-check', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['address', 'city', 'state', 'zip_code']);
    }

    public function test_distance_check_returns_analysis_on_success(): void
    {
        $user = User::factory()->create();

        $this->mock(PropertyAnalysisService::class, function ($mock) {
            $mock->shouldReceive('geocodeAddress')
                ->once()
                ->with([
                    'street' => '123 Main St',
                    'city' => 'Charleston',
                    'state' => 'WV',
                    'postalcode' => '25301',
                ])
                ->andReturn([
                    'lat' => 38.3498,
                    'lng' => -81.6326,
                    'source' => 'geocodio',
                    'accuracy' => 'rooftop',
                    'accuracy_score' => 1.0,
                    'match_type' => 'building_centroid',
                    'data_source' => 'Kanawha County',
                    'matched_address' => '123 Main St, Charleston, WV 25301',
                ]);

            $mock->shouldReceive('analyzeNeighborDistance')
                ->once()
                ->with(38.3498, -81.6326, '123 Main St')
                ->andReturn($this->mockNeighborDistance);
        });

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/properties/distance-check', $this->validPayload);

        $response->assertStatus(200)
            ->assertJsonPath('data.latitude', 38.3498)
            ->assertJsonPath('data.longitude', -81.6326)
            ->assertJsonPath('data.geocoding.accuracy_score', 1)
            ->assertJsonPath('data.geocoding.match_type', 'building_centroid')
            ->assertJsonPath('data.neighbor_distance.isolation_score', 'suburban')
            ->assertJsonPath('data.neighbor_distance.total_buildings_nearby', 42);
    }

    public function test_distance_check_returns_422_when_geocoding_fails(): void
    {
        $user = User::factory()->create();

        $this->mock(PropertyAnalysisService::class, function ($mock) {
            $mock->shouldReceive('geocodeAddress')
                ->once()
                ->andReturn(null);
        });

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/properties/distance-check', $this->validPayload);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Could not geocode the provided address. Please check the address and try again.');
    }

    public function test_distance_check_state_must_be_two_characters(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/properties/distance-check', [
            ...$this->validPayload,
            'state' => 'West Virginia',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['state']);
    }
}
