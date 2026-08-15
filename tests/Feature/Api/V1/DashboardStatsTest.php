<?php

namespace Tests\Feature\Api\V1;

use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\PriceHistory;
use App\Models\Property;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

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

    public function test_dashboard_analytics_preserve_missing_observations_and_report_sample_sizes(): void
    {
        Carbon::setTestNow('2026-08-15 12:00:00');

        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $neighborhood = Neighborhood::factory()->create(['team_id' => $team->id]);
        $otherNeighborhood = Neighborhood::factory()->create(['team_id' => $team->id]);

        $firstSeptemberProperty = Property::factory()->create(['neighborhood_id' => $neighborhood->id]);
        $secondSeptemberProperty = Property::factory()->create(['neighborhood_id' => $neighborhood->id]);
        $novemberProperty = Property::factory()->create(['neighborhood_id' => $neighborhood->id]);
        $otherNeighborhoodProperty = Property::factory()->create(['neighborhood_id' => $otherNeighborhood->id]);

        PriceHistory::create([
            'property_id' => $firstSeptemberProperty->id,
            'price' => 400000,
            'price_date' => '2025-09-11',
            'type' => 'sold',
        ]);
        PriceHistory::create([
            'property_id' => $secondSeptemberProperty->id,
            'price' => 600000,
            'price_date' => '2025-09-30',
            'type' => 'sold',
        ]);
        PriceHistory::create([
            'property_id' => $novemberProperty->id,
            'price' => 550000,
            'price_date' => '2025-11-20',
            'type' => 'sold',
        ]);
        PriceHistory::create([
            'property_id' => $otherNeighborhoodProperty->id,
            'price' => 2000000,
            'price_date' => '2025-09-15',
            'type' => 'sold',
        ]);

        ListingCycle::factory()->create([
            'property_id' => $firstSeptemberProperty->id,
            'status' => 'sold',
            'listed_at' => '2025-09-01',
            'sold_at' => '2025-09-11',
        ]);
        ListingCycle::factory()->create([
            'property_id' => $secondSeptemberProperty->id,
            'status' => 'sold',
            'listed_at' => '2025-09-10',
            'sold_at' => '2025-09-30',
        ]);
        ListingCycle::factory()->create([
            'property_id' => $novemberProperty->id,
            'status' => 'sold',
            'listed_at' => '2025-10-21',
            'sold_at' => '2025-11-20',
        ]);
        ListingCycle::factory()->create([
            'property_id' => $otherNeighborhoodProperty->id,
            'status' => 'sold',
            'listed_at' => '2025-09-14',
            'sold_at' => '2025-09-15',
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/stats");

        $response->assertOk()
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.0.month', 'Sep')
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.0.month_key', '2025-09')
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.0.avg_price', 500000)
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.0.sample_size', 2)
            ->assertJsonPath('data.analytics.monthly_days_on_market.0.avg_days', 15)
            ->assertJsonPath('data.analytics.monthly_days_on_market.0.sample_size', 2)
            ->assertJsonPath('data.analytics.monthly_sold_counts.0.count', 2)
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.1.month', 'Oct')
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.1.avg_price', null)
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.1.sample_size', 0)
            ->assertJsonPath('data.analytics.monthly_days_on_market.1.avg_days', null)
            ->assertJsonPath('data.analytics.monthly_days_on_market.1.sample_size', 0)
            ->assertJsonPath('data.analytics.monthly_sold_counts.1.count', 0)
            ->assertJsonPath('data.analytics.monthly_avg_sale_prices.2.avg_price', 550000)
            ->assertJsonPath('data.analytics.monthly_days_on_market.2.avg_days', 30)
            ->assertJsonPath('data.analytics.monthly_sold_counts.2.count', 1);
    }
}
