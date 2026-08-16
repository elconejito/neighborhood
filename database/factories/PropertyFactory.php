<?php

namespace Database\Factories;

use App\Models\Neighborhood;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'neighborhood_id' => Neighborhood::factory(),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'state' => $this->faker->stateAbbr(),
            'zip_code' => $this->faker->postcode(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'acreage' => $this->faker->randomFloat(2, 0.1, 5),
            'bedrooms' => $this->faker->numberBetween(1, 6),
            'bathrooms' => $this->faker->randomFloat(1, 1, 4),
            'square_feet' => $this->faker->numberBetween(1000, 5000),
            'year_built' => $this->faker->numberBetween(1900, 2024),
            'garage' => $this->faker->numberBetween(0, 4),
            'basement' => $this->faker->randomElement(['Unfinished', 'Finished', 'Partial']),
            'basement_walkout' => $this->faker->boolean(),
            'fireplace' => $this->faker->boolean(),
            'main_level_primary_bedroom' => $this->faker->boolean(),
            'pool' => $this->faker->boolean(),
            'fence' => $this->faker->randomElement(['Yes', 'No but allowed', 'No']),
            'deck' => $this->faker->randomElement(['Screened/Covered Porch', 'Deck', 'Patio', 'None']),
            'water' => $this->faker->randomElement(['Well', 'Public', 'Other']),
            'sewer' => $this->faker->randomElement(['Septic', 'Public', 'Other']),
            'hoa' => $this->faker->randomElement(['None', 'HOA', 'Condo', 'Coop']),
            'listing_url' => $this->faker->url(),
        ];
    }
}
