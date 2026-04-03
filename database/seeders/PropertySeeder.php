<?php

namespace Database\Seeders;

use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class PropertySeeder extends Seeder
{
    private const BASE_LIST_PRICE   = 550_000;
    private const PRICE_SPREAD      = 100_000;
    private const PROPERTIES_PER_NEIGHBORHOOD = 15;

    public function run(): void
    {
        $user = User::where('email', config('app.seeder_user.email'))->firstOrFail();
        $zips = $this->parseZips();

        if (empty($zips)) {
            $this->command->warn('SEED_PROPERTY_ZIPS is not set. Skipping property seeding.');
            return;
        }

        $neighborhoods = Neighborhood::where('team_id', $user->team_id)->orderBy('id')->get();

        foreach ($zips as $index => $zip) {
            $neighborhood = $neighborhoods->get($index);

            if (! $neighborhood || $neighborhood->properties()->exists()) {
                continue;
            }

            $this->command->info("Fetching addresses for zip {$zip}...");
            $addresses = $this->fetchAddresses($zip);

            if (count($addresses) < self::PROPERTIES_PER_NEIGHBORHOOD) {
                $this->command->warn("Only found " . count($addresses) . " addresses for zip {$zip}, need " . self::PROPERTIES_PER_NEIGHBORHOOD . ". Skipping.");
                continue;
            }

            $this->seedNeighborhood($user->id, $neighborhood->id, $addresses);
        }
    }

    private function seedNeighborhood(int $userId, int $neighborhoodId, array $addresses): void
    {
        $pinnedAddress      = $addresses[0];
        $comparableAddresses = array_slice($addresses, 1);

        // Pinned subject property — fixed $550k list / $575k sold in 2024
        $pinned = Property::create(array_merge(
            $this->buildPropertySpecs(self::BASE_LIST_PRICE, $pinnedAddress),
            ['user_id' => $userId, 'neighborhood_id' => $neighborhoodId, 'is_pinned' => true],
        ));

        ListingCycle::create([
            'property_id' => $pinned->id,
            'status'      => 'sold',
            'list_price'  => self::BASE_LIST_PRICE,
            'sold_price'  => 575_000,
            'listed_at'   => now()->subYears(2)->format('Y-m-d'),
            'sold_at'     => now()->subYears(2)->addDays(35)->format('Y-m-d'),
        ]);

        // 14 comparables with varied prices and sale dates
        $pricePairs = $this->generateComparablePrices();
        $saleDates  = $this->generateSaleDates(14);

        foreach (array_slice($comparableAddresses, 0, 14) as $i => $address) {
            [$listPrice, $soldPrice] = $pricePairs[$i];
            [$listedAt, $soldAt]     = $saleDates[$i];

            $property = Property::create(array_merge(
                $this->buildPropertySpecs($listPrice, $address),
                ['user_id' => $userId, 'neighborhood_id' => $neighborhoodId, 'is_pinned' => false],
            ));

            ListingCycle::create([
                'property_id' => $property->id,
                'status'      => 'sold',
                'list_price'  => $listPrice,
                'sold_price'  => $soldPrice,
                'listed_at'   => $listedAt,
                'sold_at'     => $soldAt,
            ]);
        }
    }

    // -------------------------------------------------------------------------
    // Address fetching
    // -------------------------------------------------------------------------

    private function fetchAddresses(string $zip): array
    {
        $query = '[out:json][timeout:60];'
            . 'node["addr:housenumber"]["addr:street"]["addr:postcode"="' . $zip . '"];'
            . 'out ' . (self::PROPERTIES_PER_NEIGHBORHOOD + 10) . ';';

        try {
            $response = Http::timeout(90)->get('https://overpass-api.de/api/interpreter', ['data' => $query]);
        } catch (\Exception $e) {
            $this->command->warn("Overpass request failed for zip {$zip}: {$e->getMessage()}");
            return [];
        }

        if (! $response->successful()) {
            return [];
        }

        $elements = $response->json('elements', []);

        $addresses = collect($elements)
            ->filter(fn ($e) => isset($e['tags']['addr:housenumber'], $e['tags']['addr:street'])
                && mb_detect_encoding($e['tags']['addr:street'], 'ASCII', strict: true) !== false)
            ->map(fn ($e) => [
                'address'  => $e['tags']['addr:housenumber'] . ' ' . $e['tags']['addr:street'],
                'city'     => $e['tags']['addr:city'] ?? $e['tags']['addr:suburb'] ?? '',
                'state'    => $e['tags']['addr:state'] ?? '',
                'zip_code' => $zip,
            ])
            ->shuffle()
            ->values()
            ->toArray();

        // Backfill missing city/state from the most common values in the result set
        $city  = $this->mostCommon(array_column($addresses, 'city'));
        $state = $this->mostCommon(array_column($addresses, 'state'));

        return array_map(function ($a) use ($city, $state) {
            $a['city']  = $a['city']  ?: $city;
            $a['state'] = $a['state'] ?: $state;
            return $a;
        }, $addresses);
    }

    private function mostCommon(array $values): string
    {
        $counts = array_count_values(array_filter($values));
        if (empty($counts)) {
            return '';
        }
        arsort($counts);
        return array_key_first($counts);
    }

    // -------------------------------------------------------------------------
    // Property spec generation
    // -------------------------------------------------------------------------

    private function buildPropertySpecs(int $listPrice, array $address): array
    {
        [$beds, $baths, $sqft, $acreage] = $this->specsForPrice($listPrice);

        return [
            'address'                    => $address['address'],
            'city'                       => $address['city'],
            'state'                      => $address['state'],
            'zip_code'                   => $address['zip_code'],
            'bedrooms'                   => $beds,
            'bathrooms'                  => $baths,
            'square_feet'                => $sqft,
            'acreage'                    => $acreage,
            'year_built'                 => random_int(1985, 2015),
            'garage'                     => $beds >= 4 ? random_int(2, 3) : random_int(1, 2),
            'basement'                   => $this->randomElement(['Unfinished', 'Finished', 'Partial']),
            'basement_walkout'           => random_int(0, 3) === 0, // ~25% chance
            'fireplace'                  => (bool) random_int(0, 1),
            'main_level_primary_bedroom' => false,
            'pool'                       => false,
            'fence'                      => $this->randomElement(['Yes', 'Yes', 'No but allowed', 'No']),
            'deck'                       => $this->randomElement(['Deck', 'Patio', 'Screened/Covered Porch', 'None']),
            'water'                      => 'Public',
            'sewer'                      => 'Public',
            'hoa'                        => $this->randomElement(['HOA', 'HOA', 'HOA', 'None']),
            'reference_hvac_type_id'     => random_int(1, 2),
        ];
    }

    private function specsForPrice(int $price): array
    {
        if ($price < 500_000) {
            // Smaller starter home
            return [
                random_int(3, 3),
                $this->randomElement(['2.0', '2.5']),
                random_int(1800, 2400),
                number_format(random_int(20, 35) / 100, 2),
            ];
        }

        if ($price < 590_000) {
            // Mid-range
            return [
                random_int(3, 4),
                $this->randomElement(['2.5', '3.0']),
                random_int(2400, 3200),
                number_format(random_int(30, 55) / 100, 2),
            ];
        }

        // Larger home
        return [
            random_int(4, 5),
            $this->randomElement(['3.0', '3.5', '4.0']),
            random_int(3200, 4200),
            number_format(random_int(50, 80) / 100, 2),
        ];
    }

    // -------------------------------------------------------------------------
    // Pricing + date generation
    // -------------------------------------------------------------------------

    /**
     * Returns 14 [listPrice, soldPrice] pairs:
     * 5 sold over list, 4 sold at list, 5 sold under list — shuffled.
     */
    private function generateComparablePrices(): array
    {
        $pairs = [];

        // 5 over list (+1% to +8%)
        for ($i = 0; $i < 5; $i++) {
            $list = $this->randomListPrice();
            $pairs[] = [$list, $this->applyMultiplier($list, 1.01, 1.08)];
        }

        // 4 at list (exactly at)
        for ($i = 0; $i < 4; $i++) {
            $list = $this->randomListPrice();
            $pairs[] = [$list, $list];
        }

        // 5 under list (-2% to -8%)
        for ($i = 0; $i < 5; $i++) {
            $list = $this->randomListPrice();
            $pairs[] = [$list, $this->applyMultiplier($list, 0.92, 0.98)];
        }

        shuffle($pairs);
        return $pairs;
    }

    private function randomListPrice(): int
    {
        $base = self::BASE_LIST_PRICE + random_int(-self::PRICE_SPREAD, self::PRICE_SPREAD);
        // Round to nearest $1,000
        return (int) round($base / 1000) * 1000;
    }

    private function applyMultiplier(int $price, float $min, float $max): int
    {
        $multiplier = $min + (mt_rand() / mt_getrandmax()) * ($max - $min);
        return (int) round($price * $multiplier / 1000) * 1000;
    }

    /**
     * Returns $count [listedAt, soldAt] pairs spread from Jan 2024 to today, in chronological order.
     */
    private function generateSaleDates(int $count): array
    {
        $start = strtotime('2024-01-01');
        $end   = strtotime('-2 weeks'); // leave a buffer so sold_at < today

        $listedTimestamps = [];
        for ($i = 0; $i < $count; $i++) {
            $listedTimestamps[] = random_int($start, $end - (45 * 86400));
        }
        sort($listedTimestamps);

        return array_map(function ($listed) {
            $daysOnMarket = random_int(14, 60);
            return [
                date('Y-m-d', $listed),
                date('Y-m-d', $listed + ($daysOnMarket * 86400)),
            ];
        }, $listedTimestamps);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function randomElement(array $items): mixed
    {
        return $items[array_rand($items)];
    }

    private function parseZips(): array
    {
        return array_values(array_filter(array_map('trim', explode(',', config('app.seed_property_zips', '')))));
    }
}
