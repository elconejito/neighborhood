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
        Schema::create('listing_cycles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id');
            $table->enum('status', ['listed', 'sold', 'off_market'])->default('listed');
            $table->decimal('list_price', 12, 2)->nullable();
            $table->decimal('sold_price', 12, 2)->nullable();
            $table->timestamp('listed_at')->nullable();
            $table->timestamp('sold_at')->nullable();
            $table->timestamp('off_market_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_cycles');
    }
};
