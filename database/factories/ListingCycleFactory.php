<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ListingCycle>
 */
class ListingCycleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['listed', 'sold', 'off_market']);
        $listPrice = $this->faker->numberBetween(200000, 1000000);
        $listedAt = $this->faker->dateTimeBetween('-1 year', 'now');

        $soldPrice = null;
        $soldAt = null;
        $offMarketAt = null;

        if ($status === 'sold') {
            $soldPrice = $listPrice * $this->faker->randomFloat(2, 0.9, 1.1);
            $soldAt = $this->faker->dateTimeBetween($listedAt, 'now');
        } elseif ($status === 'off_market') {
            $offMarketAt = $this->faker->dateTimeBetween($listedAt, 'now');
        }

        return [
            'property_id' => Property::factory(),
            'status' => $status,
            'list_price' => $listPrice,
            'sold_price' => $soldPrice,
            'listed_at' => $listedAt,
            'sold_at' => $soldAt,
            'off_market_at' => $offMarketAt,
        ];
    }
}
