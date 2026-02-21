<?php

namespace Database\Factories;

use App\Models\ListingCycle;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PriceHistory>
 */
class PriceHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'listing_cycle_id' => ListingCycle::factory(),
            'price' => $this->faker->numberBetween(200000, 1000000),
            'price_date' => $this->faker->date(),
            'type' => $this->faker->randomElement(['listing', 'reduction', 'increase', 'sold', 'off_market']),
        ];
    }
}
