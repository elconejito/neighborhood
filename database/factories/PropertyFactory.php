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
            'price' => $this->faker->numberBetween(200000, 1000000),
            'acreage' => $this->faker->randomFloat(2, 0.1, 5),
            'bedrooms' => $this->faker->numberBetween(1, 6),
            'bathrooms' => $this->faker->randomFloat(1, 1, 4),
            'square_feet' => $this->faker->numberBetween(1000, 5000),
            'listing_url' => $this->faker->url(),
        ];
    }
}
