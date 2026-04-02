<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ListingCycleController;
use App\Http\Controllers\Api\V1\NeighborhoodController;
use App\Http\Controllers\Api\V1\PriceHistoryController;
use App\Http\Controllers\Api\V1\PropertyController;
use App\Http\Controllers\Api\V1\TeamController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public auth routes
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

    // Protected routes
    Route::middleware('auth:api')->group(function () {
        // Auth
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // Dashboard
        Route::get('dashboard/stats', [DashboardController::class, 'stats']);

        // Properties
        Route::apiResource('properties', PropertyController::class);
        Route::post('properties/{property}/analyze', [PropertyController::class, 'analyze']);
        Route::post('properties/{property}/geocode', [PropertyController::class, 'geocode']);

        // Listing Cycles
        Route::post('properties/{property}/listing-cycles', [ListingCycleController::class, 'store']);
        Route::put('listing-cycles/{listingCycle}', [ListingCycleController::class, 'update']);
        Route::delete('listing-cycles/{listingCycle}', [ListingCycleController::class, 'destroy']);

        // Price History Events
        Route::post('listing-cycles/{listingCycle}/price-histories', [PriceHistoryController::class, 'store']);
        Route::put('price-histories/{priceHistory}', [PriceHistoryController::class, 'update']);
        Route::delete('price-histories/{priceHistory}', [PriceHistoryController::class, 'destroy']);

        // Neighborhoods
        Route::apiResource('neighborhoods', NeighborhoodController::class);

        // Reference Data
        Route::get('reference/hvac-types', function () {
            return response()->json(['data' => \App\Models\ReferenceHvacType::all(['id', 'label'])]);
        });

        // Team
        Route::apiResource('teams', TeamController::class)->only(['index', 'store', 'update']);
        Route::prefix('teams')->group(function () {
            Route::post('{team}/switch', [TeamController::class, 'switch']);
            Route::get('members', [TeamController::class, 'members']);
            Route::post('invite', [TeamController::class, 'invite']);
            Route::delete('members/{member}', [TeamController::class, 'remove']);
        });
    });
});
