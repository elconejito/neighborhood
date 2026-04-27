<?php

namespace Tests\Feature;

use App\Jobs\AnalyzeNeighborDistanceJob;
use App\Jobs\AnalyzePointsOfInterestJob;
use App\Jobs\AnalyzePropertyJob;
use App\Jobs\AnalyzeRoadAccessibilityJob;
use App\Jobs\GeocodePropertyJob;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PropertyAnalysisTest extends TestCase
{
    use RefreshDatabase;

    private function analyzeUrl(Property $property): string
    {
        return "/api/v1/neighborhoods/{$property->neighborhood_id}/properties/{$property->id}/analyze";
    }

    private function geocodeUrl(Property $property): string
    {
        return "/api/v1/neighborhoods/{$property->neighborhood_id}/properties/{$property->id}/geocode";
    }

    private function analyzeSectionUrl(Property $property, string $section): string
    {
        return "/api/v1/neighborhoods/{$property->neighborhood_id}/properties/{$property->id}/analyze/{$section}";
    }

    public function test_analyze_method_dispatches_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user, 'api')->postJson($this->analyzeUrl($property));

        $response->assertStatus(200)
            ->assertJsonPath('data.message', 'Property analysis has been queued');

        Queue::assertPushed(AnalyzePropertyJob::class, function ($job) use ($property) {
            return $job->property->id === $property->id;
        });
    }

    private function setLocationUrl(Property $property): string
    {
        return "/api/v1/neighborhoods/{$property->neighborhood_id}/properties/{$property->id}/location";
    }

    public function test_set_location_updates_coordinates_and_queues_analysis(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => null,
            'longitude' => null,
        ]);

        $response = $this->actingAs($user, 'api')->postJson($this->setLocationUrl($property), [
            'latitude' => 38.2737142,
            'longitude' => -77.5011839,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.latitude', 38.2737142)
            ->assertJsonPath('data.longitude', -77.5011839)
            ->assertJsonPath('data.geocoding_source', 'manual')
            ->assertJsonPath('data.geocoding_accuracy', 'manual');

        $property->refresh();
        $this->assertEquals(38.2737142, $property->latitude);
        $this->assertEquals(-77.5011839, $property->longitude);
        $this->assertEquals('manual', $property->geocoding_source);
        $this->assertEquals('manual', $property->geocoding_accuracy);

        Queue::assertPushed(AnalyzePropertyJob::class, fn ($job) => $job->property->id === $property->id);
    }

    public function test_set_location_requires_authorization(): void
    {
        Queue::fake();

        $owner = User::factory()->create();
        $other = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($other, 'api')->postJson($this->setLocationUrl($property), [
            'latitude' => 38.2737142,
            'longitude' => -77.5011839,
        ])->assertStatus(403);

        Queue::assertNotPushed(AnalyzePropertyJob::class);
    }

    public function test_set_location_validates_coordinates(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user, 'api')->postJson($this->setLocationUrl($property), [
            'latitude' => 999,
            'longitude' => -77.5011839,
        ])->assertStatus(422)->assertJsonValidationErrors(['latitude']);

        $this->actingAs($user, 'api')->postJson($this->setLocationUrl($property), [
            'latitude' => 38.2737142,
            'longitude' => 999,
        ])->assertStatus(422)->assertJsonValidationErrors(['longitude']);

        $this->actingAs($user, 'api')->postJson($this->setLocationUrl($property), [
            'longitude' => -77.5011839,
        ])->assertStatus(422)->assertJsonValidationErrors(['latitude']);
    }

    public function test_geocode_endpoint_clears_coordinates_and_dispatches_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'geocoding_source' => 'geocodio',
            'geocoding_accuracy' => 'range_interpolation',
        ]);

        $response = $this->actingAs($user, 'api')->postJson($this->geocodeUrl($property));

        $response->assertStatus(200)
            ->assertJsonPath('data.message', 'Property geocoding and analysis has been queued');

        $property->refresh();
        $this->assertNull($property->latitude);
        $this->assertNull($property->longitude);
        $this->assertNull($property->geocoding_source);
        $this->assertNull($property->geocoding_accuracy);

        Queue::assertPushed(GeocodePropertyJob::class, function ($job) use ($property) {
            return $job->property->id === $property->id
                && $job->analysisJobClasses === [AnalyzeNeighborDistanceJob::class];
        });

        Queue::assertNotPushed(AnalyzePropertyJob::class);
    }

    public function test_geocode_endpoint_requires_authorization(): void
    {
        Queue::fake();

        $owner = User::factory()->create();
        $other = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($other, 'api')->postJson($this->geocodeUrl($property))
            ->assertStatus(403);

        Queue::assertNotPushed(AnalyzePropertyJob::class);
        Queue::assertNotPushed(GeocodePropertyJob::class);
    }

    public function test_analyze_section_dispatches_correct_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $sections = [
            'neighbor-distance' => AnalyzeNeighborDistanceJob::class,
            'points-of-interest' => AnalyzePointsOfInterestJob::class,
            'road-accessibility' => AnalyzeRoadAccessibilityJob::class,
        ];

        foreach ($sections as $section => $jobClass) {
            Queue::fake();
            $response = $this->actingAs($user, 'api')->postJson($this->analyzeSectionUrl($property, $section));

            $response->assertStatus(200)
                ->assertJsonPath('data.message', "Section '{$section}' analysis has been queued");

            Queue::assertPushed($jobClass, fn ($job) => $job->property->id === $property->id);
        }
    }

    public function test_analyze_section_returns_422_for_invalid_section(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $this->actingAs($user, 'api')
            ->postJson($this->analyzeSectionUrl($property, 'invalid-section'))
            ->assertStatus(422)
            ->assertJsonPath('message', 'Invalid analysis section.');
    }

    public function test_analyze_section_returns_422_when_coordinates_missing(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => null,
            'longitude' => null,
        ]);

        $this->actingAs($user, 'api')
            ->postJson($this->analyzeSectionUrl($property, 'neighbor-distance'))
            ->assertStatus(422)
            ->assertJsonPath('message', 'Property coordinates are missing. Run the full analysis first.');
    }

    public function test_analyze_section_requires_authorization(): void
    {
        Queue::fake();

        $owner = User::factory()->create();
        $other = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($other, 'api')
            ->postJson($this->analyzeSectionUrl($property, 'neighbor-distance'))
            ->assertStatus(403);

        Queue::assertNotPushed(AnalyzeNeighborDistanceJob::class);
    }

    public function test_geocode_job_runs_only_specified_analysis_jobs(): void
    {
        Bus::fake();

        $property = Property::factory()->create([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $job = new GeocodePropertyJob($property, [AnalyzeNeighborDistanceJob::class]);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        Bus::assertBatched(function ($batch) {
            return $batch->jobs->count() === 1
                && $batch->jobs->contains(fn ($job) => $job instanceof AnalyzeNeighborDistanceJob)
                && ! $batch->jobs->contains(fn ($job) => $job instanceof AnalyzePointsOfInterestJob)
                && ! $batch->jobs->contains(fn ($job) => $job instanceof AnalyzeRoadAccessibilityJob);
        });
    }

    public function test_analyze_job_performs_analysis(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $job = new AnalyzePropertyJob($property);
        $job->handle();

        Queue::assertPushed(GeocodePropertyJob::class, function ($job) use ($property) {
            return $job->property->id === $property->id;
        });
    }

    public function test_geocode_job_dispatches_batch_when_coordinates_exist(): void
    {
        Bus::fake();

        $property = Property::factory()->create([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $job = new GeocodePropertyJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        Bus::assertBatched(function ($batch) {
            return $batch->jobs->count() === 3 &&
                $batch->jobs->contains(fn ($job) => $job instanceof AnalyzeNeighborDistanceJob) &&
                $batch->jobs->contains(fn ($job) => $job instanceof AnalyzePointsOfInterestJob) &&
                $batch->jobs->contains(fn ($job) => $job instanceof AnalyzeRoadAccessibilityJob);
        });
    }

    public function test_geocode_job_stores_geocoding_metadata_on_property(): void
    {
        Bus::fake();

        Http::fake([
            'https://api.geocod.io/*' => Http::response([
                'results' => [
                    [
                        'formatted_address' => '12128 Kingswood Blvd, Fredericksburg, VA 22408',
                        'location' => ['lat' => 38.2737142, 'lng' => -77.5011839],
                        'accuracy_type' => 'rooftop',
                    ],
                ],
            ], 200),
        ]);

        $property = Property::factory()->create([
            'latitude' => null,
            'longitude' => null,
            'geocoding_source' => null,
            'geocoding_accuracy' => null,
        ]);

        $job = new GeocodePropertyJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        $property->refresh();
        $this->assertEquals(38.2737142, $property->latitude);
        $this->assertEquals(-77.5011839, $property->longitude);
        $this->assertEquals('geocodio', $property->geocoding_source);
        $this->assertEquals('rooftop', $property->geocoding_accuracy);
    }

    public function test_geocode_job_stores_coordinates_for_range_interpolation_accuracy(): void
    {
        Bus::fake();
        Log::spy();

        Http::fake([
            'https://api.geocod.io/*' => Http::response([
                'results' => [
                    [
                        'formatted_address' => '12128 Kingswood Blvd, Fredericksburg, VA 22408',
                        'location' => ['lat' => 38.2747164, 'lng' => -77.4988546],
                        'accuracy_type' => 'range_interpolation',
                    ],
                ],
            ], 200),
        ]);

        $property = Property::factory()->create([
            'latitude' => null,
            'longitude' => null,
        ]);

        $job = new GeocodePropertyJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        $property->refresh();
        $this->assertEquals(38.2747164, $property->latitude);
        $this->assertEquals(-77.4988546, $property->longitude);
        $this->assertEquals('geocodio', $property->geocoding_source);
        $this->assertEquals('range_interpolation', $property->geocoding_accuracy);
        Log::shouldNotHaveReceived('warning');
        Bus::assertBatched(fn ($batch) => $batch->jobs->count() === 3);
    }

    public function test_geocode_job_does_not_store_coordinates_for_low_accuracy_result(): void
    {
        Bus::fake();
        Log::spy();

        Http::fake([
            'https://nominatim.openstreetmap.org/*' => Http::response([
                ['lat' => '38.2747164', 'lon' => '-77.4988546'],
            ], 200),
            'https://api.geocod.io/*' => Http::response(['results' => []], 200),
            'https://geocoding.geo.census.gov/*' => Http::response(['result' => ['addressMatches' => []]], 200),
        ]);

        $property = Property::factory()->create([
            'latitude' => null,
            'longitude' => null,
        ]);

        $job = new GeocodePropertyJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        $property->refresh();
        $this->assertNull($property->latitude);
        $this->assertNull($property->longitude);
        $this->assertEquals('nominatim', $property->geocoding_source);
        $this->assertEquals('approximate', $property->geocoding_accuracy);
        Log::shouldHaveReceived('warning')->once();
        Bus::assertNothingBatched();
    }

    public function test_geocode_job_does_not_log_warning_for_rooftop_accuracy(): void
    {
        Bus::fake();
        Log::spy();

        Http::fake([
            'https://api.geocod.io/*' => Http::response([
                'results' => [
                    [
                        'formatted_address' => '12128 Kingswood Blvd, Fredericksburg, VA 22408',
                        'location' => ['lat' => 38.2737142, 'lng' => -77.5011839],
                        'accuracy_type' => 'rooftop',
                    ],
                ],
            ], 200),
        ]);

        $property = Property::factory()->create([
            'latitude' => null,
            'longitude' => null,
        ]);

        $job = new GeocodePropertyJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        Log::shouldNotHaveReceived('warning');
    }

    public function test_neighbor_distance_job_performs_analysis(): void
    {
        $property = Property::factory()->create([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $elements = ['elements' => [['type' => 'way', 'id' => 1, 'center' => ['lat' => 40.7128, 'lon' => -74.0061], 'tags' => ['building' => 'yes']]]];

        Http::fake([
            'https://overpass-api.de/api/interpreter' => Http::response($elements, 200),
            'https://lz4.overpass-api.de/api/interpreter' => Http::response($elements, 200),
            'https://overpass.kumi.systems/api/interpreter' => Http::response($elements, 200),
        ]);

        $job = new AnalyzeNeighborDistanceJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        $property->refresh();
        $this->assertNotNull($property->analysis['neighbor_distance']);
        $this->assertNotNull($property->analyzed_at);
    }
}
