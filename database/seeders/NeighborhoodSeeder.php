<?php

namespace Database\Seeders;

use App\Models\Neighborhood;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class NeighborhoodSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', config('app.seeder_user.email'))->firstOrFail();
        $zips = $this->parseZips();

        if (empty($zips)) {
            $this->command->warn('SEED_PROPERTY_ZIPS is not set. Skipping neighborhood seeding.');
            return;
        }

        $faker = Faker::create();

        foreach ($zips as $zip) {
            $name = $faker->lastName() . ' ' . $faker->randomElement(['Estates', 'Commons', 'Ridge', 'Crossing', 'Glen', 'Creek', 'Heights', 'Landing', 'Farms', 'Park']);

            Neighborhood::firstOrCreate(
                ['team_id' => $user->team_id, 'name' => $name],
            );
        }
    }

    private function parseZips(): array
    {
        return array_values(array_filter(array_map('trim', explode(',', config('app.seed_property_zips', '')))));
    }
}
