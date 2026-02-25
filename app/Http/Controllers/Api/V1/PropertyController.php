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
use App\Transformers\Api\V1\PropertyTransformer;
use Illuminate\Http\JsonResponse;

class PropertyController extends Controller
{
    public function __construct(protected PropertyAnalysisService $analysisService) {}

    public function index(IndexPropertyRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->team_id) {
            $query = Property::whereIn('neighborhood_id', $user->team->neighborhoods()->pluck('id'));
        } else {
            $query = $user->properties();
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

        return fractal($properties, new PropertyTransformer)
            ->parseIncludes(['neighborhood', 'price_histories'])
            ->respond();
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $notesContent = $validated['notes'] ?? null;
        unset($validated['notes']);

        $property = $request->user()->properties()->create($validated);

        if ($notesContent) {
            $property->notes()->create([
                'user_id' => $request->user()->id,
                'content' => $notesContent,
            ]);
        }

        return fractal($property, new PropertyTransformer)
            ->parseIncludes(['price_histories'])
            ->respond(201);
    }

    public function show(ShowPropertyRequest $request, Property $property): JsonResponse
    {
        return fractal($property, new PropertyTransformer)
            ->parseIncludes(['price_histories', 'neighborhood', 'notes'])
            ->respond();
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        $validated = $request->validated();
        $notesContent = $validated['notes'] ?? null;
        unset($validated['notes']);

        if ($notesContent) {
            $property->notes()->create([
                'user_id' => $request->user()->id,
                'content' => $notesContent,
            ]);
        }

        $property->update($validated);

        return fractal($property, new PropertyTransformer)
            ->parseIncludes(['price_histories', 'neighborhood', 'notes'])
            ->respond();
    }

    public function destroy(DestroyPropertyRequest $request, Property $property): JsonResponse
    {
        $property->delete();

        return response()->json([
            'data' => ['message' => 'Property deleted successfully'],
        ]);
    }

    public function analyze(AnalyzePropertyRequest $request, Property $property): JsonResponse
    {
        if (! $property->latitude || ! $property->longitude) {
            // Try to geocode the address
            $coordinates = $this->analysisService->geocodeAddress([
                'street' => $property->address,
                'city' => $property->city,
                'state' => $property->state,
                'postalcode' => $property->zip_code,
            ]);

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

        return fractal($property->fresh(), new PropertyTransformer)
            ->respond();
    }
}
