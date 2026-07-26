<?php

namespace Tests\Feature\Api\V1;

use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\PriceHistory;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_property_index_includes_last_sale_date(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '123 Main St',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'listing_cycle_id' => null,
            'type' => 'sold',
            'price_date' => '2024-01-15',
            'price' => 315000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties");

        $response->assertOk()
            ->assertJsonPath('data.0.address', '123 Main St')
            ->assertJsonPath('data.0.last_sale_date', '2024-01-15')
            ->assertJsonPath('data.0.last_sale_price', '315000.00');
    }

    public function test_property_index_includes_the_most_recent_listing_details(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'listing_cycle_id' => null,
            'type' => 'listing',
            'price_date' => '2024-01-15',
            'price' => 350000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'listing_cycle_id' => null,
            'type' => 'reduction',
            'price_date' => '2024-03-01',
            'price' => 325000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties");

        $response->assertOk()
            ->assertJsonPath('data.0.last_sale_date', null)
            ->assertJsonPath('data.0.last_listing_date', '2024-03-01')
            ->assertJsonPath('data.0.last_listing_price', '325000.00')
            ->assertJsonPath('data.0.last_listing_event_type', 'reduction')
            ->assertJsonPath('data.0.market_price', '325000.00')
            ->assertJsonPath('data.0.market_activity_date', '2024-03-01');
    }

    public function test_property_index_falls_back_to_the_most_recent_legacy_listing_cycle(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'is_pinned' => false,
        ]);

        ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'off_market',
            'list_price' => 300000,
            'listed_at' => '2024-01-15',
        ]);
        ListingCycle::factory()->create([
            'property_id' => $property->id,
            'status' => 'listed',
            'list_price' => 335000,
            'listed_at' => '2024-04-01',
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties");

        $response->assertOk()
            ->assertJsonPath('data.0.last_listing_date', '2024-04-01')
            ->assertJsonPath('data.0.last_listing_price', '335000.00');
    }

    public function test_property_index_can_be_sorted_by_last_sale_date_descending(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        $olderSaleProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '10 Alpha Ave',
            'is_pinned' => false,
        ]);
        $newerSaleProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '20 Beta Blvd',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $olderSaleProperty->id,
            'listing_cycle_id' => null,
            'type' => 'sold',
            'price_date' => '2023-05-01',
        ]);
        PriceHistory::factory()->create([
            'property_id' => $newerSaleProperty->id,
            'listing_cycle_id' => null,
            'type' => 'sold',
            'price_date' => '2024-06-01',
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=last_sale_date&sortedBy=desc");

        $response->assertOk()
            ->assertJsonPath('data.0.address', '20 Beta Blvd')
            ->assertJsonPath('data.1.address', '10 Alpha Ave');
    }

    public function test_property_index_can_filter_sold_and_unsold_properties(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        $soldProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '10 Sold St',
            'is_pinned' => false,
        ]);
        $unsoldProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '20 Listed St',
            'is_pinned' => false,
        ]);
        Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '30 No History St',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $soldProperty->id,
            'listing_cycle_id' => null,
            'type' => 'sold',
            'price_date' => '2024-01-15',
        ]);
        PriceHistory::factory()->create([
            'property_id' => $unsoldProperty->id,
            'listing_cycle_id' => null,
            'type' => 'listing',
            'price_date' => '2024-02-15',
        ]);

        $soldResponse = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?sale_status=sold");

        $soldResponse->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.address', '10 Sold St');

        $unsoldResponse = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?sale_status=unsold");

        $unsoldResponse->assertOk()
            ->assertJsonCount(2, 'data');

        $this->assertSame(
            ['20 Listed St', '30 No History St'],
            collect($unsoldResponse->json('data'))->pluck('address')->sort()->values()->all(),
        );
    }

    public function test_property_index_can_sort_by_effective_market_price(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        $lowerListedProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '10 Lower Listed St',
            'is_pinned' => false,
        ]);
        $soldProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '20 Sold St',
            'is_pinned' => false,
        ]);
        $higherListedProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '30 Higher Listed St',
            'is_pinned' => false,
        ]);
        Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '40 No History St',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $lowerListedProperty->id,
            'listing_cycle_id' => null,
            'type' => 'listing',
            'price_date' => '2024-01-01',
            'price' => 350000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $lowerListedProperty->id,
            'listing_cycle_id' => null,
            'type' => 'reduction',
            'price_date' => '2024-02-01',
            'price' => 300000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $soldProperty->id,
            'listing_cycle_id' => null,
            'type' => 'sold',
            'price_date' => '2024-03-01',
            'price' => 400000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $higherListedProperty->id,
            'listing_cycle_id' => null,
            'type' => 'listing',
            'price_date' => '2024-04-01',
            'price' => 500000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=market_price&sortedBy=asc");

        $response->assertOk();

        $this->assertSame([
            '10 Lower Listed St',
            '20 Sold St',
            '30 Higher Listed St',
            '40 No History St',
        ], array_column($response->json('data'), 'address'));
    }

    public function test_property_index_rejects_an_invalid_sale_status(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?sale_status=pending")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('sale_status');
    }

    public function test_property_index_can_sort_by_latest_market_activity(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        $soldProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '10 Sold St',
            'is_pinned' => false,
        ]);
        $listedProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '20 Listed St',
            'is_pinned' => false,
        ]);
        $changedProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '30 Changed St',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $soldProperty->id,
            'listing_cycle_id' => null,
            'type' => 'sold',
            'price_date' => '2024-01-01',
        ]);
        PriceHistory::factory()->create([
            'property_id' => $listedProperty->id,
            'listing_cycle_id' => null,
            'type' => 'listing',
            'price_date' => '2024-03-01',
        ]);
        PriceHistory::factory()->create([
            'property_id' => $changedProperty->id,
            'listing_cycle_id' => null,
            'type' => 'listing',
            'price_date' => '2024-02-01',
            'price' => 450000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $changedProperty->id,
            'listing_cycle_id' => null,
            'type' => 'increase',
            'price_date' => '2024-04-01',
            'price' => 475000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=market_activity_date&sortedBy=desc");

        $response->assertOk();

        $this->assertSame([
            '30 Changed St',
            '20 Listed St',
            '10 Sold St',
        ], array_column($response->json('data'), 'address'));
    }

    public function test_property_index_sorts_addresses_by_street_name_then_house_number_ascending(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        foreach (['10 Oak Ave', '100 Apple St', '2 Oak Ave', '5 Birch Rd', '1 Apple St'] as $address) {
            Property::factory()->create([
                'user_id' => $user->id,
                'neighborhood_id' => $neighborhood->id,
                'address' => $address,
                'is_pinned' => false,
            ]);
        }

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=address&sortedBy=asc");

        $response->assertOk();

        $this->assertSame([
            '1 Apple St',
            '100 Apple St',
            '5 Birch Rd',
            '2 Oak Ave',
            '10 Oak Ave',
        ], array_column($response->json('data'), 'address'));
    }

    public function test_property_index_sorts_addresses_by_street_name_then_house_number_descending(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        foreach (['10 Oak Ave', '100 Apple St', '2 Oak Ave', '5 Birch Rd', '1 Apple St'] as $address) {
            Property::factory()->create([
                'user_id' => $user->id,
                'neighborhood_id' => $neighborhood->id,
                'address' => $address,
                'is_pinned' => false,
            ]);
        }

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=address&sortedBy=desc");

        $response->assertOk();

        $this->assertSame([
            '10 Oak Ave',
            '2 Oak Ave',
            '5 Birch Rd',
            '100 Apple St',
            '1 Apple St',
        ], array_column($response->json('data'), 'address'));
    }

    public function test_property_index_sorts_properties_without_sales_at_the_end(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();

        $soldProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '10 Sold St',
            'is_pinned' => false,
        ]);
        $unsoldProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '20 Unsold Ave',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $soldProperty->id,
            'type' => 'sold',
            'price_date' => '2024-01-01',
        ]);

        // Unsold property has no 'sold' price history

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=last_sale_date&sortedBy=desc");

        $response->assertOk()
            ->assertJsonPath('data.0.address', '10 Sold St')
            ->assertJsonPath('data.1.address', '20 Unsold Ave')
            ->assertJsonPath('data.1.last_sale_date', null);
    }
}
