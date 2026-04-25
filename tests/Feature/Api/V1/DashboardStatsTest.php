<?php

namespace Tests\Feature\Api\V1;

use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_global_dashboard_stats(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $neighborhood = Neighborhood::factory()->create(['team_id' => $team->id]);
        Property::factory()->count(3)->create(['neighborhood_id' => $neighborhood->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/v1/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonPath('data.total_properties', 3);
    }

    public function test_user_can_view_neighborhood_scoped_dashboard_stats(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);

        $neighborhood1 = Neighborhood::factory()->create(['team_id' => $team->id, 'name' => 'Sunset Hills']);
        Property::factory()->count(2)->create(['neighborhood_id' => $neighborhood1->id]);

        $neighborhood2 = Neighborhood::factory()->create(['team_id' => $team->id]);
        Property::factory()->count(3)->create(['neighborhood_id' => $neighborhood2->id]);

        // Scoped to neighborhood 1
        $response = $this->actingAs($user, 'api')->getJson("/api/v1/neighborhoods/{$neighborhood1->id}/stats");

        $response->assertStatus(200)
            ->assertJsonPath('data.total_properties', 2)
            ->assertJsonPath('data.neighborhood_name', 'Sunset Hills')
            ->assertJsonCount(12, 'data.analytics.monthly_avg_sale_prices')
            ->assertJsonCount(12, 'data.analytics.monthly_days_on_market')
            ->assertJsonCount(12, 'data.analytics.monthly_sold_counts')
            ->assertJsonMissingPath('data.analytics.inventory_by_neighborhood');

        // Scoped to neighborhood 2
        $response = $this->actingAs($user, 'api')->getJson("/api/v1/neighborhoods/{$neighborhood2->id}/stats");

        $response->assertStatus(200)
            ->assertJsonPath('data.total_properties', 3)
            ->assertJsonPath('data.neighborhood_name', $neighborhood2->name)
            ->assertJsonCount(12, 'data.analytics.monthly_avg_sale_prices')
            ->assertJsonMissingPath('data.analytics.inventory_by_neighborhood');
    }
}
