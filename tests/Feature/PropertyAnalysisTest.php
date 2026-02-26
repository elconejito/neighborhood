<?php

namespace Tests\Feature;

use App\Jobs\AnalyzePropertyJob;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
        $user = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        Http::fake([
            'https://overpass-api.de/api/interpreter' => Http::response([
                'elements' => [],
            ], 200),
        ]);

        $job = new AnalyzePropertyJob($property);
        $job->handle(app(\App\Services\PropertyAnalysisService::class));

        $property->refresh();
        $this->assertNotNull($property->analysis);
        $this->assertNotNull($property->analyzed_at);
    }
}
