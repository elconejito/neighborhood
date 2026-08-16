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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('neighborhood_id')->nullable();
            // Address
            $table->string('address');
            $table->string('city');
            $table->string('state', 2);
            $table->string('zip_code', 10);
            // Coordinates (for analysis)
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            // Property details
            $table->decimal('acreage', 8, 2)->nullable();
            $table->integer('bedrooms')->nullable();
            $table->decimal('bathrooms', 3, 1)->nullable();
            $table->integer('square_feet')->nullable();
            $table->integer('year_built')->nullable();
            $table->integer('garage')->default(0);
            $table->enum('basement', ['Unfinished', 'Finished', 'Partial'])->nullable();
            $table->boolean('basement_walkout')->default(false);
            $table->boolean('fireplace')->default(false);
            $table->boolean('main_level_primary_bedroom')->default(false);
            $table->boolean('pool')->default(false);
            $table->enum('fence', ['Yes', 'No but allowed', 'No'])->nullable();
            $table->enum('deck', ['Screened/Covered Porch', 'Deck', 'Patio', 'None'])->nullable();
            $table->enum('water', ['Well', 'Public', 'Other'])->nullable();
            $table->enum('sewer', ['Septic', 'Public', 'Other'])->nullable();
            $table->foreignId('reference_hvac_type_id')->nullable()->constrained('reference_hvac_types');
            $table->enum('hoa', ['None', 'HOA', 'Condo', 'Coop'])->nullable();
            // External links
            $table->string('listing_url')->nullable();
            // Analysis data (stored as JSON)
            $table->json('analysis')->nullable();
            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
