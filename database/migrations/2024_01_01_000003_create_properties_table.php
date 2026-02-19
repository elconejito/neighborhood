<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Address
            $table->string('address');
            $table->string('city');
            $table->string('state', 2);
            $table->string('zip_code', 10);
            
            // Coordinates (for analysis)
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            
            // Property details
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('acreage', 8, 2)->nullable();
            $table->integer('bedrooms')->nullable();
            $table->decimal('bathrooms', 3, 1)->nullable();
            $table->integer('square_feet')->nullable();
            
            // External links
            $table->string('listing_url')->nullable();
            
            // Notes
            $table->text('notes')->nullable();
            
            // Analysis data (stored as JSON)
            $table->json('analysis')->nullable();
            $table->timestamp('analyzed_at')->nullable();
            
            // Favorites
            $table->boolean('is_favorite')->default(false);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'created_at']);
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
