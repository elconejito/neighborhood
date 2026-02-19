<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            $table->decimal('price', 12, 2);
            $table->date('price_date');
            $table->enum('type', ['listing', 'reduction', 'increase', 'sold'])->default('listing');
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            $table->index(['property_id', 'price_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_histories');
    }
};
