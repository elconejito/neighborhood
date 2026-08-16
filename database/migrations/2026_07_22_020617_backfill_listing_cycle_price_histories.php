<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('listing_cycles')
            ->orderBy('id')
            ->chunkById(100, function (Collection $cycles): void {
                foreach ($cycles as $cycle) {
                    $now = now();

                    $hasListingEvent = DB::table('price_histories')
                        ->where('listing_cycle_id', $cycle->id)
                        ->where('type', 'listing')
                        ->exists();

                    if (! $hasListingEvent && $cycle->list_price !== null && $cycle->listed_at !== null) {
                        DB::table('price_histories')->insert([
                            'property_id' => $cycle->property_id,
                            'listing_cycle_id' => $cycle->id,
                            'price' => $cycle->list_price,
                            'price_date' => Carbon::parse($cycle->listed_at)->toDateString(),
                            'type' => 'listing',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }

                    $hasSoldEvent = DB::table('price_histories')
                        ->where('listing_cycle_id', $cycle->id)
                        ->where('type', 'sold')
                        ->exists();

                    if (! $hasSoldEvent && $cycle->sold_price !== null && $cycle->sold_at !== null) {
                        DB::table('price_histories')->insert([
                            'property_id' => $cycle->property_id,
                            'listing_cycle_id' => $cycle->id,
                            'price' => $cycle->sold_price,
                            'price_date' => Carbon::parse($cycle->sold_at)->toDateString(),
                            'type' => 'sold',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
