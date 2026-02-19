<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $totalProperties = $user->properties()->count();
        $analyzedProperties = $user->properties()->whereNotNull('analyzed_at')->count();
        $favoriteProperties = $user->properties()->where('is_favorite', true)->count();
        
        $recentProperties = $user->properties()
            ->orderByDesc('created_at')
            ->take(5)
            ->get(['id', 'address', 'city', 'state', 'price', 'created_at']);

        return response()->json([
            'total_properties' => $totalProperties,
            'analyzed_properties' => $analyzedProperties,
            'favorite_properties' => $favoriteProperties,
            'recent_properties' => $recentProperties,
        ]);
    }
}
