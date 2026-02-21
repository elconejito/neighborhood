<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Property\AnalyzePropertyRequest;
use App\Http\Requests\Api\V1\Property\DestroyPropertyRequest;
use App\Http\Requests\Api\V1\Property\IndexPropertyRequest;
use App\Http\Requests\Api\V1\Property\ShowPropertyRequest;
use App\Http\Requests\Api\V1\Property\StorePropertyRequest;
use App\Http\Requests\Api\V1\Property\UpdatePropertyRequest;
use App\Models\Property;
use App\Services\PropertyAnalysisService;
use Illuminate\Http\JsonResponse;

class PropertyController extends Controller
{
    public function __construct(protected PropertyAnalysisService $analysisService) {}

    public function index(IndexPropertyRequest $request): JsonResponse
    {
        $query = $request->user()->properties()->with('priceHistories');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('zip_code', 'like', "%{$search}%");
            });
        }

        $properties = $query->orderByDesc('created_at')->paginate(15);

        return response()->json([
            'data' => $properties
        ]);
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $property = $request->user()->properties()->create($validated);

        // Create initial price history if price provided
        if ($validated['price'] ?? null) {
            $property->priceHistories()->create([
                'price' => $validated['price'],
                'price_date' => now(),
                'type' => 'listing',
            ]);
        }

        return response()->json([
            'data' => $property->load('priceHistories')
        ], 201);
    }

    public function show(ShowPropertyRequest $request, Property $property): JsonResponse
    {
        return response()->json([
            'data' => $property->load('priceHistories')
        ]);
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        $validated = $request->validated();

        // Track price changes
        if (isset($validated['price']) && $validated['price'] != $property->price) {
            $type = $property->price === null ? 'listing'
                : ($validated['price'] > $property->price ? 'increase' : 'reduction');

            $property->priceHistories()->create([
                'price' => $validated['price'],
                'price_date' => now(),
                'type' => $type,
            ]);
        }

        $property->update($validated);

        return response()->json([
            'data' => $property->load('priceHistories')
        ]);
    }

    public function destroy(DestroyPropertyRequest $request, Property $property): JsonResponse
    {
        $property->delete();

        return response()->json([
            'data' => ['message' => 'Property deleted successfully']
        ]);
    }

    public function analyze(AnalyzePropertyRequest $request, Property $property): JsonResponse
    {
        if (!$property->latitude || !$property->longitude) {
            // Try to geocode the address
            $coordinates = $this->analysisService->geocodeAddress($property->full_address);

            if ($coordinates) {
                $property->update([
                    'latitude' => $coordinates['lat'],
                    'longitude' => $coordinates['lng'],
                ]);
            } else {
                return response()->json([
                    'message' => 'Unable to geocode address. Please provide coordinates manually.',
                ], 422);
            }
        }

        $analysis = $this->analysisService->analyzeProperty($property);

        $property->update([
            'analysis' => $analysis,
            'analyzed_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'message' => 'Analysis completed',
                'property' => $property->fresh(),
            ]
        ]);
    }
}
