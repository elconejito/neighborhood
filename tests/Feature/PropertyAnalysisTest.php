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

    public function test_analyze_method_dispatches_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user, 'api')->postJson("/api/v1/properties/{$property->id}/analyze");

        $response->assertStatus(200)
            ->assertJsonPath('data.message', 'Property analysis has been queued');

        Queue::assertPushed(AnalyzePropertyJob::class, function ($job) use ($property) {
            return $job->property->id === $property->id;
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

        Http::fake([
            'https://overpass-api.de/api/interpreter' => Http::response([
                'elements' => [
                    [
                        'type' => 'way',
                        'id' => 1,
                        'center' => ['lat' => 40.7128, 'lon' => -74.0061],
                        'tags' => ['building' => 'yes'],
                    ],
                ],
            ], 200),
        ]);

        $job = new AnalyzeNeighborDistanceJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        $property->refresh();
        $this->assertNotNull($property->analysis['neighbor_distance']);
        $this->assertNotNull($property->analyzed_at);
    }
}
