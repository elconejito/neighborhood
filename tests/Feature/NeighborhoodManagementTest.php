<?php

namespace Tests\Feature;

use App\Models\Neighborhood;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NeighborhoodManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_team_neighborhoods(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        Neighborhood::factory()->count(3)->create(['team_id' => $team->id]);

        $response = $this->actingAs($user, 'api')->getJson('/api/v1/neighborhoods');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_create_neighborhood(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/neighborhoods', [
            'name' => 'Sunset Hills',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('neighborhoods', [
            'name' => 'Sunset Hills',
            'team_id' => $team->id,
        ]);
    }

    public function test_user_can_update_neighborhood(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $neighborhood = Neighborhood::factory()->create(['team_id' => $team->id]);

        $response = $this->actingAs($user, 'api')->putJson("/api/v1/neighborhoods/{$neighborhood->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('Updated Name', $neighborhood->fresh()->name);
    }

    public function test_user_can_delete_neighborhood(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $neighborhood = Neighborhood::factory()->create(['team_id' => $team->id]);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/v1/neighborhoods/{$neighborhood->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('neighborhoods', ['id' => $neighborhood->id]);
    }

    public function test_user_cannot_update_neighborhood_of_other_team(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);

        $otherTeam = Team::factory()->create();
        $otherNeighborhood = Neighborhood::factory()->create(['team_id' => $otherTeam->id]);

        $response = $this->actingAs($user, 'api')->putJson("/api/v1/neighborhoods/{$otherNeighborhood->id}", [
            'name' => 'Should fail',
        ]);

        $response->assertStatus(403);
    }
}
