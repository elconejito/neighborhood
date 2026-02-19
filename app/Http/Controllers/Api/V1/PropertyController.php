<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Services\PropertyAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function __construct(
        protected PropertyAnalysisService $analysisService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->properties()->with('priceHistories');

        if ($request->has('favorite')) {
            $query->where('is_favorite', $request->boolean('favorite'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('zip_code', 'like', "%{$search}%");
            });
        }

        $properties = $query->orderByDesc('created_at')->paginate(15);

        return response()->json($properties);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'zip_code' => ['required', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'acreage' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'numeric', 'min:0'],
            'square_feet' => ['nullable', 'integer', 'min:0'],
            'listing_url' => ['nullable', 'url', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $property = $request->user()->properties()->create($validated);

        // Create initial price history if price provided
        if ($validated['price'] ?? null) {
            $property->priceHistories()->create([
                'price' => $validated['price'],
                'price_date' => now(),
                'type' => 'listing',
            ]);
        }

        return response()->json($property->load('priceHistories'), 201);
    }

    public function show(Request $request, Property $property): JsonResponse
    {
        $this->authorizeProperty($request, $property);

        return response()->json($property->load('priceHistories'));
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $this->authorizeProperty($request, $property);

        $validated = $request->validate([
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'required', 'string', 'max:255'],
            'state' => ['sometimes', 'required', 'string', 'size:2'],
            'zip_code' => ['sometimes', 'required', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'acreage' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'numeric', 'min:0'],
            'square_feet' => ['nullable', 'integer', 'min:0'],
            'listing_url' => ['nullable', 'url', 'max:255'],
            'notes' => ['nullable', 'string'],
            'is_favorite' => ['sometimes', 'boolean'],
        ]);

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

        return response()->json($property->load('priceHistories'));
    }

    public function destroy(Request $request, Property $property): JsonResponse
    {
        $this->authorizeProperty($request, $property);

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }

    public function analyze(Request $request, Property $property): JsonResponse
    {
        $this->authorizeProperty($request, $property);

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
            'message' => 'Analysis completed',
            'property' => $property->fresh(),
        ]);
    }

    public function toggleFavorite(Request $request, Property $property): JsonResponse
    {
        $this->authorizeProperty($request, $property);

        $property->update(['is_favorite' => !$property->is_favorite]);

        return response()->json([
            'message' => $property->is_favorite ? 'Added to favorites' : 'Removed from favorites',
            'is_favorite' => $property->is_favorite,
        ]);
    }

    protected function authorizeProperty(Request $request, Property $property): void
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
    }
}
