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

    public function test_geocode_endpoint_clears_coordinates_and_dispatches_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        $response = $this->actingAs($user, 'api')->postJson($this->geocodeUrl($property));

        $response->assertStatus(200)
            ->assertJsonPath('data.message', 'Property geocoding and analysis has been queued');

        $property->refresh();
        $this->assertNull($property->latitude);
        $this->assertNull($property->longitude);

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
