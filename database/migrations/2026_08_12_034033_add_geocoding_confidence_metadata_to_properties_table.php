<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('geocoding_accuracy_score', 5, 4)->nullable()->after('geocoding_accuracy');
            $table->string('geocoding_match_type')->nullable()->after('geocoding_accuracy_score');
            $table->string('geocoding_data_source')->nullable()->after('geocoding_match_type');
            $table->string('geocoding_matched_address')->nullable()->after('geocoding_data_source');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'geocoding_accuracy_score',
                'geocoding_match_type',
                'geocoding_data_source',
                'geocoding_matched_address',
            ]);
        });
    }
};
