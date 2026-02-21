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
        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
        });

        // Sessions
        Schema::table('sessions', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('last_activity');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Cache
        Schema::table('cache', function (Blueprint $table) {
            $table->primary('key');
            $table->index('expiration');
        });

        Schema::table('cache_locks', function (Blueprint $table) {
            $table->primary('key');
            $table->index('expiration');
        });

        // Jobs
        Schema::table('jobs', function (Blueprint $table) {
            $table->index('queue');
        });

        Schema::table('job_batches', function (Blueprint $table) {
            $table->primary('id');
        });

        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->unique('uuid');
        });

        // Teams (No extra constraints needed based on original migrations)

        // Neighborhoods
        Schema::table('neighborhoods', function (Blueprint $table) {
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
        });

        // Properties
        Schema::table('properties', function (Blueprint $table) {
            $table->index(['user_id', 'created_at']);
            $table->index(['latitude', 'longitude']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('neighborhood_id')->references('id')->on('neighborhoods')->onDelete('set null');
        });

        // Price Histories
        Schema::table('price_histories', function (Blueprint $table) {
            $table->index(['property_id', 'price_date']);
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
        });

        // Notes
        Schema::table('notes', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Notes
        Schema::table('notes', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        // Price Histories
        Schema::table('price_histories', function (Blueprint $table) {
            $table->dropForeign(['property_id']);
            $table->dropIndex(['property_id', 'price_date']);
        });

        // Properties
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['neighborhood_id']);
            $table->dropForeign(['user_id']);
            $table->dropIndex(['latitude', 'longitude']);
            $table->dropIndex(['user_id', 'created_at']);
        });

        // Neighborhoods
        Schema::table('neighborhoods', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
        });

        // Failed Jobs
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->dropUnique(['uuid']);
        });

        // Job Batches
        Schema::table('job_batches', function (Blueprint $table) {
            // primary key drop is handled by dropTable in individual migrations usually,
            // but if we need to drop it here:
            // $table->dropPrimary(['id']);
        });

        // Jobs
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropIndex(['queue']);
        });

        // Cache Locks
        Schema::table('cache_locks', function (Blueprint $table) {
            $table->dropIndex(['expiration']);
            // $table->dropPrimary(['key']);
        });

        // Cache
        Schema::table('cache', function (Blueprint $table) {
            $table->dropIndex(['expiration']);
            // $table->dropPrimary(['key']);
        });

        // Sessions
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['last_activity']);
            $table->dropIndex(['user_id']);
        });

        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropUnique(['email']);
        });
    }
};
