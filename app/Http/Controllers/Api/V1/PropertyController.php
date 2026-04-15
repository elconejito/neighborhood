<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Property\AnalyzePropertyRequest;
use App\Http\Requests\Api\V1\Property\DestroyPropertyRequest;
use App\Http\Requests\Api\V1\Property\DistanceCheckRequest;
use App\Http\Requests\Api\V1\Property\IndexPropertyRequest;
use App\Http\Requests\Api\V1\Property\ShowPropertyRequest;
use App\Http\Requests\Api\V1\Property\StorePropertyRequest;
use App\Http\Requests\Api\V1\Property\UpdatePropertyRequest;
use App\Jobs\AnalyzeNeighborDistanceJob;
use App\Jobs\AnalyzePropertyJob;
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
        $properties = Property::where('neighborhood_id', $neighborhood->id)
            ->with('priceHistories')
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        return fractal($properties, PropertyTransformer::class)
            ->parseIncludes(['neighborhood', 'price_histories'])
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

    public function geocode(AnalyzePropertyRequest $request, Neighborhood $neighborhood, Property $property): JsonResponse
    {
        $property->update([
            'latitude' => null,
            'longitude' => null,
        ]);

        GeocodePropertyJob::dispatch($property->fresh(), [AnalyzeNeighborDistanceJob::class]);

        return response()->json([
            'data' => ['message' => 'Property geocoding and analysis has been queued'],
        ]);
    }

    public function distanceCheck(DistanceCheckRequest $request): JsonResponse
    {
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

        $neighborDistance = $this->analysisService->analyzeNeighborDistance($coords['lat'], $coords['lng']);

        return response()->json([
            'data' => [
                'latitude' => $coords['lat'],
                'longitude' => $coords['lng'],
                'neighbor_distance' => $neighborDistance,
            ],
        ]);
    }
}
