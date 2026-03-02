<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\ReferenceHvacType;
use App\Models\User;
use App\Serializers\IncludeUnwrappedDataArraySerializer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class PropertyManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_property_with_new_fields(): void
    {
        $user = User::factory()->create();
        $hvacType = ReferenceHvacType::create(['label' => 'Test HVAC']);

        $data = [
            'address' => '123 Test St',
            'city' => 'Test City',
            'state' => 'WV',
            'zip_code' => '25401',
            'price' => 250000,
            'year_built' => 2020,
            'garage' => 2,
            'basement' => 'Finished',
            'basement_walkout' => true,
            'fireplace' => true,
            'main_level_primary_bedroom' => true,
            'pool' => false,
            'fence' => 'Yes',
            'deck' => 'Deck',
            'water' => 'Public',
            'sewer' => 'Public',
            'reference_hvac_type_id' => $hvacType->id,
            'hoa' => 'HOA',
        ];

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/properties', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.address', '123 Test St')
            ->assertJsonPath('data.year_built', 2020)
            ->assertJsonPath('data.basement', 'Finished')
            ->assertJsonPath('data.basement_walkout', true)
            ->assertJsonPath('data.reference_hvac_type_id', $hvacType->id);

        $this->assertDatabaseHas('properties', [
            'address' => '123 Test St',
            'year_built' => 2020,
            'basement' => 'Finished',
            'reference_hvac_type_id' => $hvacType->id,
        ]);
    }

    public function test_user_can_update_property_with_new_fields(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $updateData = [
            'garage' => 3,
            'pool' => true,
            'hoa' => 'Condo',
        ];

        $response = $this->actingAs($user, 'api')->putJson("/api/v1/properties/{$property->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('data.garage', 3)
            ->assertJsonPath('data.pool', true)
            ->assertJsonPath('data.hoa', 'Condo');

        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'garage' => 3,
            'pool' => true,
            'hoa' => 'Condo',
        ]);
    }

    public function test_included_neighborhood_is_not_wrapped_in_data(): void
    {
        Config::set('fractal.default_serializer', IncludeUnwrappedDataArraySerializer::class);

        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/v1/properties');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.neighborhood.id', $property->neighborhood->id)
            ->assertJsonMissingPath('data.0.neighborhood.data');
    }
}
