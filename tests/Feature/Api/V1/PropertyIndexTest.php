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

    public function test_property_index_uses_a_newer_listing_event_as_the_effective_market_event(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $newerListingProperty = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '10 Newer Listing St',
            'is_pinned' => false,
        ]);
        $soldComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '20 Sold Comparable St',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $newerListingProperty->id,
            'type' => 'sold',
            'price_date' => '2024-01-01',
            'price' => 500000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $newerListingProperty->id,
            'type' => 'reduction',
            'price_date' => '2024-03-01',
            'price' => 300000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $soldComparable->id,
            'type' => 'sold',
            'price_date' => '2024-02-01',
            'price' => 400000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=market_price&sortedBy=asc");

        $response->assertOk()
            ->assertJsonPath('data.0.id', $newerListingProperty->id)
            ->assertJsonPath('data.0.market_price', '300000.00')
            ->assertJsonPath('data.0.market_activity_date', '2024-03-01')
            ->assertJsonPath('data.0.price_event_type', 'reduction');
    }

    public function test_property_index_sorts_price_gaps_in_both_directions_with_missing_prices_last(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $target = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '1 Target Way',
            'is_pinned' => true,
        ]);
        $closestComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '2 Closest Comparable Way',
            'is_pinned' => false,
        ]);
        $olderEqualGapComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '3 Older Equal Gap Way',
            'is_pinned' => false,
        ]);
        $newerEqualGapComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '4 Newer Equal Gap Way',
            'is_pinned' => false,
        ]);
        $missingPriceComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '5 Missing Price Way',
            'is_pinned' => false,
        ]);

        $this->createSalePrice($target, 500000, '2024-01-01');
        $this->createSalePrice($closestComparable, 490000, '2024-02-01');
        $this->createSalePrice($olderEqualGapComparable, 450000, '2024-02-01');
        $this->createSalePrice($newerEqualGapComparable, 550000, '2024-03-01');

        $ascendingResponse = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=price_gap&sortedBy=asc");

        $ascendingResponse->assertOk();

        $this->assertSame([
            $closestComparable->id,
            $newerEqualGapComparable->id,
            $olderEqualGapComparable->id,
            $missingPriceComparable->id,
        ], array_column($ascendingResponse->json('data'), 'id'));

        $descendingResponse = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=price_gap&sortedBy=desc");

        $descendingResponse->assertOk();

        $this->assertSame([
            $newerEqualGapComparable->id,
            $olderEqualGapComparable->id,
            $closestComparable->id,
            $missingPriceComparable->id,
        ], array_column($descendingResponse->json('data'), 'id'));
    }

    public function test_price_gap_sort_falls_back_to_newest_market_activity_when_the_target_has_no_effective_price(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'is_pinned' => true,
        ]);
        $olderComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'is_pinned' => false,
        ]);
        $newerComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'is_pinned' => false,
        ]);

        $this->createSalePrice($olderComparable, 400000, '2024-01-01');
        $this->createSalePrice($newerComparable, 450000, '2024-02-01');

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=price_gap&sortedBy=asc");

        $response->assertOk();

        $this->assertSame([
            $newerComparable->id,
            $olderComparable->id,
        ], array_column($response->json('data'), 'id'));
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

    public function test_pinned_target_is_returned_outside_paginated_comparables_and_excluded_from_the_total(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $target = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '1 Target Way',
            'is_pinned' => true,
        ]);

        foreach (range(1, 11) as $number) {
            Property::factory()->create([
                'user_id' => $user->id,
                'neighborhood_id' => $neighborhood->id,
                'address' => "{$number} Comparable Lane",
                'is_pinned' => false,
            ]);
        }

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?page=2&per_page=10&orderBy=address&sortedBy=asc");

        $response->assertOk()
            ->assertJsonPath('meta.target.id', $target->id)
            ->assertJsonPath('meta.target.matches_current_filter', true)
            ->assertJsonPath('meta.pagination.total', 11)
            ->assertJsonPath('meta.pagination.current_page', 2)
            ->assertJsonCount(1, 'data');

        $this->assertNotContains($target->id, array_column($response->json('data'), 'id'));
    }

    public function test_target_persists_through_status_filters_and_reports_when_it_does_not_match(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $target = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '1 Sold Target Way',
            'is_pinned' => true,
        ]);
        $listedComparable = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => '2 Listed Comparable Way',
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $target->id,
            'type' => 'sold',
            'price_date' => '2024-01-01',
            'price' => 500000,
        ]);
        PriceHistory::factory()->create([
            'property_id' => $listedComparable->id,
            'type' => 'listing',
            'price_date' => '2024-02-01',
            'price' => 450000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?sale_status=unsold&orderBy=market_price&sortedBy=asc");

        $response->assertOk()
            ->assertJsonPath('meta.target.id', $target->id)
            ->assertJsonPath('meta.target.matches_current_filter', false)
            ->assertJsonPath('meta.target.price_event_type', 'sold')
            ->assertJsonPath('meta.pagination.total', 1)
            ->assertJsonPath('data.0.id', $listedComparable->id);
    }

    public function test_property_index_returns_a_null_target_when_no_property_is_pinned(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'is_pinned' => false,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties");

        $response->assertOk()
            ->assertJsonPath('meta.target', null)
            ->assertJsonPath('meta.pagination.total', 1)
            ->assertJsonPath('data.0.id', $property->id);
    }

    public function test_property_index_exposes_price_per_square_foot_and_closest_neighbor_distance(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'square_feet' => 2000,
            'analysis' => [
                'neighbor_distance' => [
                    'nearest_houses' => [['distance_meters' => 29.3]],
                ],
            ],
            'is_pinned' => false,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'type' => 'sold',
            'price_date' => '2024-01-01',
            'price' => 500000,
        ]);

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties");

        $response->assertOk()
            ->assertJsonPath('data.0.price_per_square_foot', 250)
            ->assertJsonPath('data.0.closest_neighbor_distance_meters', 29.3)
            ->assertJsonPath('data.0.price_event_type', 'sold');
    }

    public function test_property_index_sorts_similarity_across_the_full_result_set_before_pagination(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $target = $this->createSimilarityProperty($user, $neighborhood, '1 Target Way', true, [
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_feet' => 2000,
            'acreage' => 0.20,
            'year_built' => 2000,
        ], '2024-01-01');
        $oldExactMatch = $this->createSimilarityProperty($user, $neighborhood, '2 Older Exact Match', false, [
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_feet' => 2000,
            'acreage' => 0.20,
            'year_built' => 2000,
        ], '2024-02-01');
        $recentExactMatch = $this->createSimilarityProperty($user, $neighborhood, '3 Recent Exact Match', false, [
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_feet' => 2000,
            'acreage' => 0.20,
            'year_built' => 2000,
        ], '2024-03-01');
        $nearMatch = $this->createSimilarityProperty($user, $neighborhood, '4 Near Match', false, [
            'bedrooms' => 4,
            'bathrooms' => 2,
            'square_feet' => 2000,
            'acreage' => 0.20,
            'year_built' => 2000,
        ], '2024-04-01');

        foreach (range(5, 14) as $number) {
            $this->createSimilarityProperty($user, $neighborhood, "{$number} Distant Match", false, [
                'bedrooms' => 6,
                'bathrooms' => 4,
                'square_feet' => 4800,
                'acreage' => 1.50,
                'year_built' => 1950,
            ], "2024-04-{$number}");
        }

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=similarity&per_page=10");

        $response->assertOk()
            ->assertJsonPath('meta.target.id', $target->id)
            ->assertJsonPath('meta.pagination.total', 13);

        $this->assertSame([
            $recentExactMatch->id,
            $oldExactMatch->id,
            $nearMatch->id,
        ], array_slice(array_column($response->json('data'), 'id'), 0, 3));
    }

    public function test_similarity_sort_normalizes_available_axes_but_places_insufficient_data_last(): void
    {
        $user = User::factory()->create();
        $neighborhood = Neighborhood::factory()->create();
        $this->createSimilarityProperty($user, $neighborhood, '1 Target Way', true, [
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_feet' => 2000,
            'acreage' => 0.20,
            'year_built' => 2000,
        ], '2024-01-01');
        $completeMatch = $this->createSimilarityProperty($user, $neighborhood, '2 Complete Match', false, [
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_feet' => 2000,
            'acreage' => 0.20,
            'year_built' => 2001,
        ], '2024-02-01');
        $insufficientMatch = $this->createSimilarityProperty($user, $neighborhood, '3 Incomplete Match', false, [
            'bedrooms' => 3,
            'bathrooms' => 2,
            'square_feet' => null,
            'acreage' => null,
            'year_built' => null,
        ], '2024-03-01');

        $response = $this->actingAs($user, 'api')
            ->getJson("/api/v1/neighborhoods/{$neighborhood->id}/properties?orderBy=similarity");

        $response->assertOk();

        $this->assertSame([
            $completeMatch->id,
            $insufficientMatch->id,
        ], array_column($response->json('data'), 'id'));
    }

    /**
     * @param  array{bedrooms: int|null, bathrooms: float|int|null, square_feet: int|null, acreage: float|null, year_built: int|null}  $attributes
     */
    private function createSimilarityProperty(User $user, Neighborhood $neighborhood, string $address, bool $isPinned, array $attributes, string $activityDate): Property
    {
        $property = Property::factory()->create([
            'user_id' => $user->id,
            'neighborhood_id' => $neighborhood->id,
            'address' => $address,
            'is_pinned' => $isPinned,
            ...$attributes,
        ]);

        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'type' => 'sold',
            'price_date' => $activityDate,
            'price' => 500000,
        ]);

        return $property;
    }

    private function createSalePrice(Property $property, int $price, string $priceDate): void
    {
        PriceHistory::factory()->create([
            'property_id' => $property->id,
            'type' => 'sold',
            'price_date' => $priceDate,
            'price' => $price,
        ]);
    }
}
