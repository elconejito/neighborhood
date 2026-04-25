<?php

namespace Tests\Feature;

use App\Models\Neighborhood;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\PropertySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PropertySeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_property_seeder_outputs_overpass_http_error_details_when_rejected(): void
    {
        $team = Team::factory()->create();
        User::factory()->create([
            'team_id' => $team->id,
            'email' => config('app.seeder_user.email'),
        ]);

        Neighborhood::factory()->create([
            'team_id' => $team->id,
        ]);

        config()->set('app.seed_property_zips', '22407');

        Http::fake([
            'https://overpass-api.de/api/interpreter*' => Http::response('Not acceptable', 406),
        ]);

        $this->artisan('db:seed', ['--class' => PropertySeeder::class, '--no-interaction' => true])
            ->expectsOutput('Overpass request rejected for zip 22407 (HTTP 406). Response: Not acceptable')
            ->expectsOutput('Only found 0 addresses for zip 22407, need 15. Skipping.')
            ->assertSuccessful();

        Http::assertSent(function ($request) {
            return str_starts_with($request->url(), 'https://overpass-api.de/api/interpreter?')
                && str_contains($request->url(), '22407')
                && $request->hasHeader('User-Agent', 'neighborhood@syde.app');
        });
    }
}
