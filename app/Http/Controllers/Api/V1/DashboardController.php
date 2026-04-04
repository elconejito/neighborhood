<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\PriceHistory;
use App\Http\Controllers\Controller;
use App\Transformers\Api\V1\PriceHistoryTransformer;
use App\Transformers\Api\V1\PropertyTransformer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $neighborhoodIds = $user->team_id
            ? $user->team->neighborhoods()->pluck('id')
            : collect();

        $propertyScope = function ($query) use ($user, $neighborhoodIds) {
            if ($user->team_id) {
                $query->whereIn('neighborhood_id', $neighborhoodIds);
            } else {
                $query->where('user_id', $user->id);
            }
        };

        $propertiesQuery = $user->team_id
            ? Property::whereIn('neighborhood_id', $neighborhoodIds)
            : $user->properties();

        $totalProperties    = $propertiesQuery->count();
        $analyzedProperties = (clone $propertiesQuery)->whereNotNull('analyzed_at')->count();

        $recentlySold = PriceHistory::where('type', 'sold')
            ->where('price_date', '>=', now()->subDays(30))
            ->whereHas('property', $propertyScope)
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
                'total_properties'    => $totalProperties,
                'analyzed_properties' => $analyzedProperties,
                'recently_sold'       => fractal($recentlySold, new PriceHistoryTransformer())
                    ->parseIncludes(['property'])
                    ->toArray()['data'],
                'recently_listed'     => fractal($recentlyListed, new PropertyTransformer())
                    ->toArray()['data'],
                'analytics'           => $this->buildAnalytics($user, $neighborhoodIds, $propertyScope),
            ],
        ]);
    }

    private function buildAnalytics($user, $neighborhoodIds, callable $propertyScope): array
    {
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $monthKeys    = collect(range(0, 5))->map(fn ($i) => now()->subMonths(5 - $i)->format('Y-m'));

        // 1. Monthly average sold price
        $rawPrices = PriceHistory::where('type', 'sold')
            ->where('price_date', '>=', $sixMonthsAgo)
            ->whereHas('property', $propertyScope)
            ->selectRaw("DATE_FORMAT(price_date, '%Y-%m') as month, ROUND(AVG(price)) as avg_price")
            ->groupBy('month')
            ->pluck('avg_price', 'month');

        $monthlyAvgSalePrices = $monthKeys->map(fn ($m) => [
            'month'     => Carbon::createFromFormat('Y-m', $m)->format('M'),
            'avg_price' => (int) $rawPrices->get($m, 0),
        ])->values();

        // 2. Days on market by neighborhood
        $domQuery = ListingCycle::where('listing_cycles.status', 'sold')
            ->whereNotNull('listing_cycles.listed_at')
            ->whereNotNull('listing_cycles.sold_at')
            ->join('properties', 'listing_cycles.property_id', '=', 'properties.id')
            ->join('neighborhoods', 'properties.neighborhood_id', '=', 'neighborhoods.id');

        if ($user->team_id) {
            $domQuery->whereIn('properties.neighborhood_id', $neighborhoodIds);
        } else {
            $domQuery->where('properties.user_id', $user->id);
        }

        $daysOnMarket = $domQuery
            ->selectRaw('neighborhoods.name, ROUND(AVG(DATEDIFF(listing_cycles.sold_at, listing_cycles.listed_at))) as avg_days')
            ->groupBy('neighborhoods.id', 'neighborhoods.name')
            ->orderBy('avg_days')
            ->get()
            ->map(fn ($r) => ['name' => $r->name, 'avg_days' => (int) $r->avg_days])
            ->values();

        // 3. Monthly sold counts (absorption rate proxy)
        $rawCounts = PriceHistory::where('type', 'sold')
            ->where('price_date', '>=', $sixMonthsAgo)
            ->whereHas('property', $propertyScope)
            ->selectRaw("DATE_FORMAT(price_date, '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->pluck('count', 'month');

        $monthlySoldCounts = $monthKeys->map(fn ($m) => [
            'month' => Carbon::createFromFormat('Y-m', $m)->format('M'),
            'count' => (int) $rawCounts->get($m, 0),
        ])->values();

        // 4. Property inventory per neighborhood
        $inventoryByNeighborhood = $user->team_id
            ? Neighborhood::where('team_id', $user->team_id)
                ->withCount('properties')
                ->orderByDesc('properties_count')
                ->get()
                ->map(fn ($n) => ['name' => $n->name, 'count' => $n->properties_count])
                ->values()
            : collect();

        return [
            'monthly_avg_sale_prices'        => $monthlyAvgSalePrices,
            'days_on_market_by_neighborhood'  => $daysOnMarket,
            'monthly_sold_counts'             => $monthlySoldCounts,
            'inventory_by_neighborhood'       => $inventoryByNeighborhood,
        ];
    }
}
