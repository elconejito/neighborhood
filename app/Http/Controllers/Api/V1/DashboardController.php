<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ListingCycle;
use App\Models\Neighborhood;
use App\Models\PriceHistory;
use App\Models\Property;
use App\Transformers\Api\V1\PriceHistoryTransformer;
use App\Transformers\Api\V1\PropertyTransformer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request, ?Neighborhood $neighborhood = null): JsonResponse
    {
        $user = $request->user();

        if ($neighborhood && $neighborhood->exists) {
            $neighborhoodIds = collect([$neighborhood->id]);
        } else {
            $neighborhoodIds = $user->team_id
                ? $user->team->neighborhoods()->pluck('id')
                : collect();
        }

        $propertyScope = function ($query) use ($user, $neighborhoodIds, $neighborhood) {
            if ($neighborhood && $neighborhood->exists) {
                $query->where('neighborhood_id', $neighborhood->id);
            } elseif ($user->team_id) {
                $query->whereIn('neighborhood_id', $neighborhoodIds);
            } else {
                $query->where('user_id', $user->id);
            }
        };

        if ($neighborhood && $neighborhood->exists) {
            $propertiesQuery = Property::where('neighborhood_id', $neighborhood->id);
        } else {
            $propertiesQuery = $user->team_id
                ? Property::whereIn('neighborhood_id', $neighborhoodIds)
                : $user->properties();
        }

        $totalProperties = $propertiesQuery->count();
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
                'neighborhood_name' => $neighborhood && $neighborhood->exists ? $neighborhood->name : null,
                'total_properties' => $totalProperties,
                'analyzed_properties' => $analyzedProperties,
                'recently_sold' => fractal($recentlySold, new PriceHistoryTransformer)
                    ->parseIncludes(['property'])
                    ->toArray()['data'],
                'recently_listed' => fractal($recentlyListed, new PropertyTransformer)
                    ->toArray()['data'],
                'analytics' => $this->buildAnalytics($user, $neighborhoodIds, $propertyScope, $neighborhood),
            ],
        ]);
    }

    private function buildAnalytics($user, $neighborhoodIds, callable $propertyScope, ?Neighborhood $neighborhood = null): array
    {
        $twelveMonthsAgo = now()->subMonths(11)->startOfMonth();
        $monthKeys = collect(range(0, 11))->map(fn ($i) => $twelveMonthsAgo->copy()->addMonths($i)->format('Y-m'));

        $format = config('database.default') === 'sqlite' ? "strftime('%Y-%m', price_date)" : "DATE_FORMAT(price_date, '%Y-%m')";

        // 1. Monthly average sold price
        $rawPrices = PriceHistory::where('type', 'sold')
            ->where('price_date', '>=', $twelveMonthsAgo->toDateString())
            ->whereHas('property', $propertyScope)
            ->selectRaw("{$format} as month, ROUND(AVG(price)) as avg_price, COUNT(*) as sample_size")
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $monthlyAvgSalePrices = $monthKeys->map(function ($month) use ($rawPrices) {
            $observation = $rawPrices->get($month);

            return [
                'month' => Carbon::createFromFormat('Y-m', $month)->format('M'),
                'month_key' => $month,
                'avg_price' => $observation ? (int) $observation->avg_price : null,
                'sample_size' => $observation ? (int) $observation->sample_size : 0,
            ];
        })->values();

        // 2. Days on market by month
        $domFormat = config('database.default') === 'sqlite' ? "strftime('%Y-%m', listing_cycles.sold_at)" : "DATE_FORMAT(listing_cycles.sold_at, '%Y-%m')";

        $domQuery = ListingCycle::where('listing_cycles.status', 'sold')
            ->whereNotNull('listing_cycles.listed_at')
            ->whereNotNull('listing_cycles.sold_at')
            ->where('listing_cycles.sold_at', '>=', $twelveMonthsAgo->toDateString())
            ->join('properties', 'listing_cycles.property_id', '=', 'properties.id');

        if ($neighborhood && $neighborhood->exists) {
            $domQuery->where('properties.neighborhood_id', $neighborhood->id);
        } elseif ($user->team_id) {
            $domQuery->whereIn('properties.neighborhood_id', $neighborhoodIds);
        } else {
            $domQuery->where('properties.user_id', $user->id);
        }

        $diff = config('database.default') === 'sqlite'
            ? 'JULIANDAY(listing_cycles.sold_at) - JULIANDAY(listing_cycles.listed_at)'
            : 'DATEDIFF(listing_cycles.sold_at, listing_cycles.listed_at)';

        $rawDom = $domQuery
            ->selectRaw("{$domFormat} as month, ROUND(AVG({$diff})) as avg_days, COUNT(*) as sample_size")
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        $monthlyDaysOnMarket = $monthKeys->map(function ($month) use ($rawDom) {
            $observation = $rawDom->get($month);

            return [
                'month' => Carbon::createFromFormat('Y-m', $month)->format('M'),
                'month_key' => $month,
                'avg_days' => $observation ? (int) $observation->avg_days : null,
                'sample_size' => $observation ? (int) $observation->sample_size : 0,
            ];
        })->values();

        // 3. Monthly sold counts (absorption rate proxy)
        $rawCounts = PriceHistory::where('type', 'sold')
            ->where('price_date', '>=', $twelveMonthsAgo->toDateString())
            ->whereHas('property', $propertyScope)
            ->selectRaw("{$format} as month, COUNT(*) as count")
            ->groupBy('month')
            ->pluck('count', 'month');

        $monthlySoldCounts = $monthKeys->map(fn ($m) => [
            'month' => Carbon::createFromFormat('Y-m', $m)->format('M'),
            'month_key' => $m,
            'count' => (int) $rawCounts->get($m, 0),
        ])->values();

        return [
            'monthly_avg_sale_prices' => $monthlyAvgSalePrices,
            'monthly_days_on_market' => $monthlyDaysOnMarket,
            'monthly_sold_counts' => $monthlySoldCounts,
        ];
    }
}
