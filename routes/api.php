<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\NeighborhoodController;
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
