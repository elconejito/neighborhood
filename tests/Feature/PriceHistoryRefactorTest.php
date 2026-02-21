<?php

namespace Tests\Feature;

use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\PriceHistory;
use App\Models\Property;
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
