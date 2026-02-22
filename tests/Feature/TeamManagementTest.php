<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_team_members(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $user->teams()->attach($team->id);

        $otherUser = User::factory()->create(['team_id' => $team->id]);
        $otherUser->teams()->attach($team->id);

        $response = $this->actingAs($user, 'api')->getJson('/api/v1/team/members');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_user_can_invite_member_to_team(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $user->teams()->attach($team->id);

        $invitedUser = User::factory()->create(); // User without team

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/team/invite', [
            'email' => $invitedUser->email,
        ]);

        $response->assertStatus(200);
        $this->assertTrue($invitedUser->teams()->where('teams.id', $team->id)->exists());
    }

    public function test_user_cannot_invite_user_already_on_this_team(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $user->teams()->attach($team->id);

        $otherUser = User::factory()->create();
        $otherUser->teams()->attach($team->id);

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/team/invite', [
            'email' => $otherUser->email,
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_remove_member_from_team(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $user->teams()->attach($team->id);

        $memberToRemove = User::factory()->create(['team_id' => $team->id]);
        $memberToRemove->teams()->attach($team->id);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/v1/team/members/{$memberToRemove->id}");

        $response->assertStatus(200);
        $this->assertFalse($memberToRemove->fresh()->teams()->where('teams.id', $team->id)->exists());
    }

    public function test_user_cannot_remove_themselves(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $user->teams()->attach($team->id);

        $response = $this->actingAs($user, 'api')->deleteJson("/api/v1/team/members/{$user->id}");

        $response->assertStatus(422);
    }

    public function test_registration_creates_private_team(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertStatus(201);

        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user->team_id);

        $team = Team::find($user->team_id);
        $this->assertEquals('Private', $team->name);
        $this->assertTrue($user->teams()->where('teams.id', $team->id)->exists());
    }

    public function test_user_can_switch_teams(): void
    {
        $user = User::factory()->create();
        $team1 = Team::factory()->create(['user_id' => $user->id, 'name' => 'Team 1']);
        $team2 = Team::factory()->create(['user_id' => $user->id, 'name' => 'Team 2']);

        $user->teams()->attach([$team1->id, $team2->id]);
        $user->update(['team_id' => $team1->id]);

        $response = $this->actingAs($user, 'api')->postJson("/api/v1/teams/{$team2->id}/switch");

        $response->assertStatus(200);
        $this->assertEquals($team2->id, $user->fresh()->team_id);
    }

    public function test_user_can_create_new_team(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')->postJson('/api/v1/teams', [
            'name' => 'New Team',
        ]);

        $response->assertStatus(201);
        $this->assertTrue($user->teams()->where('name', 'New Team')->exists());
    }

    public function test_user_can_rename_team(): void
    {
        $user = User::factory()->create();
        $team = Team::factory()->create(['user_id' => $user->id, 'name' => 'Old Name']);
        $user->teams()->attach($team->id);

        $response = $this->actingAs($user, 'api')->putJson("/api/v1/teams/{$team->id}", [
            'name' => 'New Name',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('New Name', $team->fresh()->name);
    }
}
