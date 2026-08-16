<?php

namespace Tests\Feature;

use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\PriceHistory;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PriceHistoryRefactorTest extends TestCase
{
    use RefreshDatabase;

    public function test_property_can_have_multiple_listing_cycles(): void
    {
        $property = Property::factory()->create();

        // Cycle 1: Sold
        $cycle1 = ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'sold',
            'list_price' => 500000,
            'sold_price' => 510000,
            'listed_at' => now()->subMonths(6),
            'sold_at' => now()->subMonths(5),
        ]);

        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'listing_cycle_id' => $cycle1->id,
            'price' => 500000,
            'type' => 'listing',
        ]);

        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'listing_cycle_id' => $cycle1->id,
            'price' => 510000,
            'type' => 'sold',
        ]);

        // Cycle 2: Off Market
        $cycle2 = ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'off_market',
            'list_price' => 550000,
            'listed_at' => now()->subMonths(2),
            'off_market_at' => now()->subMonths(1),
        ]);

        // Cycle 3: Currently Listed
        $cycle3 = ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'listed',
            'list_price' => 540000,
            'listed_at' => now(),
        ]);

        $this->assertCount(3, $property->listingCycles);
        $this->assertEquals($cycle3->id, $property->currentListingCycle()->id);
        $this->assertEquals(3, $property->listingCycles()->count());
    }

    public function test_it_calculates_price_difference_and_percent_correctly(): void
    {
        $cycle = ListingCycle::factory()->create([
            'status' => 'sold',
            'list_price' => 100000,
            'sold_price' => 110000,
        ]);

        $this->assertEquals(10000, $cycle->getPriceDifference());
        $this->assertTrue($cycle->getIsSoldOverList());
        $this->assertEquals(110, $cycle->getPercentOfListPrice());

        $cycleUnder = ListingCycle::factory()->create([
            'status' => 'sold',
            'list_price' => 100000,
            'sold_price' => 95000,
        ]);

        $this->assertEquals(-5000, $cycleUnder->getPriceDifference());
        $this->assertFalse($cycleUnder->getIsSoldOverList());
        $this->assertEquals(95, $cycleUnder->getPercentOfListPrice());
    }

    public function test_price_history_events_synchronize_the_listing_cycle_disposition(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);
        $cycle = ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'listed',
            'list_price' => null,
            'listed_at' => null,
            'sold_price' => null,
            'sold_at' => null,
            'off_market_at' => null,
        ]);

        $this->actingAs($user, 'api')
            ->postJson("/api/v1/listing-cycles/{$cycle->id}/price-histories", [
                'type' => 'listing',
                'price' => 500000,
                'price_date' => '2024-01-01',
            ])
            ->assertCreated();

        $cycle->refresh();

        $this->assertSame('listed', $cycle->status);
        $this->assertSame('500000.00', $cycle->list_price);
        $this->assertSame('2024-01-01', $cycle->listed_at->toDateString());

        $soldResponse = $this->actingAs($user, 'api')
            ->postJson("/api/v1/listing-cycles/{$cycle->id}/price-histories", [
                'type' => 'sold',
                'price' => 515000,
                'price_date' => '2024-02-15',
            ])
            ->assertCreated();

        $cycle->refresh();

        $this->assertSame('sold', $cycle->status);
        $this->assertSame('515000.00', $cycle->sold_price);
        $this->assertSame('2024-02-15', $cycle->sold_at->toDateString());

        $eventId = $soldResponse->json('data.id');

        $this->actingAs($user, 'api')
            ->putJson("/api/v1/price-histories/{$eventId}", [
                'type' => 'off_market',
                'price' => 500000,
                'price_date' => '2024-02-20',
            ])
            ->assertOk();

        $cycle->refresh();

        $this->assertSame('off_market', $cycle->status);
        $this->assertNull($cycle->sold_price);
        $this->assertNull($cycle->sold_at);
        $this->assertSame('2024-02-20', $cycle->off_market_at->toDateString());

        $this->actingAs($user, 'api')
            ->deleteJson("/api/v1/price-histories/{$eventId}")
            ->assertOk();

        $cycle->refresh();

        $this->assertSame('listed', $cycle->status);
        $this->assertNull($cycle->off_market_at);
    }

    public function test_legacy_listing_cycle_prices_are_backfilled_as_events_once(): void
    {
        $property = Property::factory()->create();
        $cycle = ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'sold',
            'list_price' => 500000,
            'listed_at' => '2024-01-01',
            'sold_price' => 515000,
            'sold_at' => '2024-02-15',
        ]);

        $migration = require database_path('migrations/2026_07_22_020617_backfill_listing_cycle_price_histories.php');

        $migration->up();
        $migration->up();

        $this->assertDatabaseCount('price_histories', 2);
        $this->assertDatabaseHas('price_histories', [
            'property_id' => $property->id,
            'listing_cycle_id' => $cycle->id,
            'price' => 500000,
            'price_date' => '2024-01-01',
            'type' => 'listing',
        ]);
        $this->assertDatabaseHas('price_histories', [
            'property_id' => $property->id,
            'listing_cycle_id' => $cycle->id,
            'price' => 515000,
            'price_date' => '2024-02-15',
            'type' => 'sold',
        ]);
    }

    public function test_it_calculates_neighborhood_average_correctly(): void
    {
        $neighborhood = Neighborhood::factory()->create();

        $property1 = Property::factory()->create(['neighborhood_id' => $neighborhood->id]);
        ListingCycle::factory()->create([
            'property_id' => $property1->id,
            'status' => 'sold',
            'list_price' => 100000,
            'sold_price' => 110000, // 110%
        ]);

        $property2 = Property::factory()->create(['neighborhood_id' => $neighborhood->id]);
        ListingCycle::factory()->create([
            'property_id' => $property2->id,
            'status' => 'sold',
            'list_price' => 200000,
            'sold_price' => 180000, // 90%
        ]);

        // Average should be 100%
        $this->assertEquals(100, $neighborhood->getAveragePercentOfListPrice());
    }
}
