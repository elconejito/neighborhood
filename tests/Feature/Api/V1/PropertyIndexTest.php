<?php

namespace Tests\Feature\Api\V1;

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
