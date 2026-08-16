<?php

namespace Database\Seeders;

use App\Models\ReferenceHvacType;
use Illuminate\Database\Seeder;

class ReferenceHvacTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Electric Cooling, Gas Heat',
            'Electric Cooling and Heat',
        ];

        foreach ($types as $type) {
            ReferenceHvacType::firstOrCreate(['label' => $type]);
        }
    }
}
