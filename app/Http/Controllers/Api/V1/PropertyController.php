<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Property\AnalyzePropertyRequest;
use App\Http\Requests\Api\V1\Property\DestroyPropertyRequest;
use App\Http\Requests\Api\V1\Property\DistanceCheckRequest;
use App\Http\Requests\Api\V1\Property\IndexPropertyRequest;
use App\Http\Requests\Api\V1\Property\SetPropertyLocationRequest;
use App\Http\Requests\Api\V1\Property\ShowPropertyRequest;
use App\Http\Requests\Api\V1\Property\StorePropertyRequest;
use App\Http\Requests\Api\V1\Property\UpdatePropertyRequest;
use App\Jobs\AnalyzeNeighborDistanceJob;
use App\Jobs\AnalyzePointsOfInterestJob;
use App\Jobs\AnalyzePropertyJob;
use App\Jobs\AnalyzeRoadAccessibilityJob;
use App\Jobs\GeocodePropertyJob;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Services\PropertyAnalysisService;
use App\Transformers\Api\V1\PropertyTransformer;
use Illuminate\Http\JsonResponse;

class PropertyController extends Controller
{
    public function __construct(protected PropertyAnalysisService $analysisService) {}

    public function index(IndexPropertyRequest $request, Neighborhood $neighborhood): JsonResponse
    {
        $target = Property::where('neighborhood_id', $neighborhood->id)
            ->where('is_pinned', true)
            ->withMarketSummary()
            ->with(['neighborhood', 'lastSoldHistory', 'lastListingHistory', 'lastSoldCycle', 'lastListingCycle'])
            ->first();

        $properties = Property::where('neighborhood_id', $neighborhood->id)
            ->withMarketSummary()
            ->with(['neighborhood', 'lastSoldHistory', 'lastListingHistory', 'lastSoldCycle', 'lastListingCycle'])
            ->when($target, fn ($query) => $query->whereKeyNot($target->id))
            ->whereSaleStatus($request->input('sale_status'))
            ->filter($request)
            ->when(
                $request->input('orderBy') === 'similarity' && $target,
                fn ($query) => $target->applySimilaritySort($query, $target),
            )
            ->when(
                $request->input('orderBy') === 'price_gap' && $target?->market_price !== null,
                fn ($query) => $target->applyMarketPriceGapSort(
                    $query,
                    (float) $target->market_price,
                    $request->input('sortedBy', 'asc'),
                ),
            )
            ->when(
                $request->input('orderBy') === 'price_gap' && $target?->market_price === null,
                fn ($query) => (new Property)->applyMarketActivityDateSort($query, 'desc'),
            )
            ->when(
                $request->input('orderBy') !== 'created_at'
                    && $request->input('orderBy') !== 'price_gap'
                    && ($request->input('orderBy') !== 'similarity' || ! $target),
                fn ($query) => $query->orderByDesc('created_at'),
            )
            ->paginate($request->integer('per_page', 10));

        $targetData = $target ? (new PropertyTransformer)->transform($target) : null;

        if ($targetData !== null) {
            $filterRequest = $request->duplicate();
            $filterRequest->query->remove('orderBy');
            $filterRequest->query->remove('sortedBy');

            $targetData['matches_current_filter'] = Property::whereKey($target->id)
                ->whereSaleStatus($request->input('sale_status'))
                ->filter($filterRequest)
                ->exists();
        }

        return fractal($properties, PropertyTransformer::class)
            ->parseIncludes(['neighborhood'])
            ->addMeta(['target' => $targetData])
            ->respond();
    }

    public function store(StorePropertyRequest $request, Neighborhood $neighborhood): JsonResponse
    {
        $validated = $request->validated();
        $validated['neighborhood_id'] = $neighborhood->id;

        $property = $request->user()->properties()->create($validated);

        AnalyzePropertyJob::dispatch($property);

        return fractal()->item($property, PropertyTransformer::class)
            ->parseIncludes(['price_histories'])
            ->respond(201);
    }

    public function show(ShowPropertyRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        return fractal()->item($property, PropertyTransformer::class)
            ->parseIncludes(['price_histories', 'neighborhood', 'notes', 'listing_cycles'])
            ->respond();
    }

    public function update(UpdatePropertyRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        $validated = $request->validated();

        // Enforce one pinned property per neighborhood
        if (! empty($validated['is_pinned'])) {
            $neighborhoodId = $validated['neighborhood_id'] ?? $property->neighborhood_id;
            if ($neighborhoodId) {
                Property::where('neighborhood_id', $neighborhoodId)
                    ->where('id', '!=', $property->id)
                    ->where('is_pinned', true)
                    ->update(['is_pinned' => false]);
            }
        }

        $property->update($validated);
        $property->refresh();

        AnalyzePropertyJob::dispatch($property);

        return fractal()->item($property, PropertyTransformer::class)
            ->parseIncludes(['price_histories', 'neighborhood', 'notes'])
            ->respond();
    }

    public function destroy(DestroyPropertyRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        $property->delete();

        return response()->json([
            'data' => ['message' => 'Property deleted successfully'],
        ]);
    }

    public function analyze(AnalyzePropertyRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        AnalyzePropertyJob::dispatch($property);

        return response()->json([
            'data' => ['message' => 'Property analysis has been queued'],
        ]);
    }

    public function analyzeSection(AnalyzePropertyRequest $request, Neighborhood $neighborhood, Property $property, string $section): JsonResponse
    {
        /** @var array<string, class-string> */
        $jobMap = [
            'neighbor-distance' => AnalyzeNeighborDistanceJob::class,
            'points-of-interest' => AnalyzePointsOfInterestJob::class,
            'road-accessibility' => AnalyzeRoadAccessibilityJob::class,
        ];

        if (! isset($jobMap[$section])) {
            return response()->json(['message' => 'Invalid analysis section.'], 422);
        }

        if (! $property->latitude || ! $property->longitude) {
            return response()->json(['message' => 'Property coordinates are missing. Run the full analysis first.'], 422);
        }

        dispatch(new $jobMap[$section]($property));

        return response()->json([
            'data' => ['message' => "Section '{$section}' analysis has been queued"],
        ]);
    }

    public function setLocation(SetPropertyLocationRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        $property->update([
            'latitude' => $request->float('latitude'),
            'longitude' => $request->float('longitude'),
            'geocoding_source' => 'manual',
            'geocoding_accuracy' => 'manual',
            'geocoding_accuracy_score' => null,
            'geocoding_match_type' => null,
            'geocoding_data_source' => null,
            'geocoding_matched_address' => null,
        ]);

        AnalyzePropertyJob::dispatch($property->fresh());

        return fractal()->item($property->fresh(), PropertyTransformer::class)
            ->parseIncludes(['price_histories'])
            ->respond();
    }

    public function geocode(AnalyzePropertyRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        $property->update([
            'latitude' => null,
            'longitude' => null,
            'geocoding_source' => null,
            'geocoding_accuracy' => null,
            'geocoding_accuracy_score' => null,
            'geocoding_match_type' => null,
            'geocoding_data_source' => null,
            'geocoding_matched_address' => null,
        ]);

        GeocodePropertyJob::dispatch($property->fresh(), [AnalyzeNeighborDistanceJob::class]);

        return response()->json([
            'data' => ['message' => 'Property geocoding and analysis has been queued'],
        ]);
    }

    public function distanceCheck(DistanceCheckRequest $request): JsonResponse
    {
        $lat = $request->input('latitude');
        $lng = $request->input('longitude');

        if ($lat !== null && $lng !== null) {
            $coords = ['lat' => (float) $lat, 'lng' => (float) $lng];
        } else {
            $coords = $this->analysisService->geocodeAddress([
                'street' => $request->string('address')->toString(),
                'city' => $request->string('city')->toString(),
                'state' => $request->string('state')->toString(),
                'postalcode' => $request->string('zip_code')->toString(),
            ]);

            if (! $coords) {
                return response()->json([
                    'message' => 'Could not geocode the provided address. Please check the address and try again.',
                ], 422);
            }
        }

        $neighborDistance = $this->analysisService->analyzeNeighborDistance(
            $coords['lat'],
            $coords['lng'],
            $request->string('address')->toString(),
        );

        return response()->json([
            'data' => [
                'latitude' => $coords['lat'],
                'longitude' => $coords['lng'],
                'geocoding' => [
                    'source' => $coords['source'] ?? 'manual',
                    'accuracy_type' => $coords['accuracy'] ?? 'manual',
                    'accuracy_score' => $coords['accuracy_score'] ?? null,
                    'match_type' => $coords['match_type'] ?? null,
                    'data_source' => $coords['data_source'] ?? null,
                    'matched_address' => $coords['matched_address'] ?? null,
                ],
                'neighbor_distance' => $neighborDistance,
            ],
        ]);
    }
}
