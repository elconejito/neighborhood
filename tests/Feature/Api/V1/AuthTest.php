<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\JWT;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_expired_access_token_can_be_refreshed_within_the_refresh_window(): void
    {
        $user = User::factory()->create();
        $token = app(JWT::class)->fromUser($user);

        $this->travel((int) config('jwt.ttl') + 1)->minutes();

        $response = $this->withToken($token)->postJson('/api/v1/auth/refresh');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => ['access_token', 'token_type', 'expires_in', 'user'],
            ])
            ->assertJsonPath('data.user.id', $user->id);

        $this->withToken($response->json('data.access_token'))
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_access_token_cannot_be_refreshed_after_the_refresh_window(): void
    {
        $user = User::factory()->create();
        $token = app(JWT::class)->fromUser($user);

        $this->travel((int) config('jwt.refresh_ttl') + 1)->minutes();

        $this->withToken($token)
            ->postJson('/api/v1/auth/refresh')
            ->assertUnauthorized();
    }
}
