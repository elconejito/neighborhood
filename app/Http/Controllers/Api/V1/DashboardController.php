<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Property;
use App\Models\PriceHistory;
use App\Http\Controllers\Controller;
use App\Transformers\Api\V1\PriceHistoryTransformer;
use App\Transformers\Api\V1\PropertyTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->team_id) {
            $neighborhoodIds = $user->team->neighborhoods()->pluck('id');
            $propertiesQuery = Property::whereIn('neighborhood_id', $neighborhoodIds);
        } else {
            $propertiesQuery = $user->properties();
        }

        $totalProperties = $propertiesQuery->count();
        $analyzedProperties = (clone $propertiesQuery)->whereNotNull('analyzed_at')->count();

        $recentlySold = PriceHistory::where('type', 'sold')
            ->where('price_date', '>=', now()->subDays(30))
            ->whereHas('property', function ($query) use ($user) {
                if ($user->team_id) {
                    $query->whereIn('neighborhood_id', $user->team->neighborhoods()->pluck('id'));
                } else {
                    $query->where('user_id', $user->id);
                }
            })
            ->with('property')
            ->orderByDesc('price_date')
            ->take(5)
            ->get();

        $recentlyListed = (clone $propertiesQuery)
            ->where('created_at', '>=', now()->subDays(30))
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        return response()->json([
            'data' => [
                'total_properties' => $totalProperties,
                'analyzed_properties' => $analyzedProperties,
                'recently_sold' => fractal($recentlySold, new PriceHistoryTransformer())
                    ->parseIncludes(['property'])
                    ->toArray()['data'],
                'recently_listed' => fractal($recentlyListed, new PropertyTransformer())
                    ->toArray()['data'],
            ]
        ]);
    }
}
