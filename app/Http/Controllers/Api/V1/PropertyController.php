<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Property\AnalyzePropertyRequest;
use App\Http\Requests\Api\V1\Property\DestroyPropertyRequest;
use App\Http\Requests\Api\V1\Property\IndexPropertyRequest;
use App\Http\Requests\Api\V1\Property\ShowPropertyRequest;
use App\Http\Requests\Api\V1\Property\StorePropertyRequest;
use App\Http\Requests\Api\V1\Property\UpdatePropertyRequest;
use App\Jobs\AnalyzePropertyJob;
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

        // #TODO better filtering here for team > neighborhood
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

        return fractal($properties, PropertyTransformer::class)
            ->parseIncludes(['neighborhood', 'price_histories'])
            ->respond();
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $property = $request->user()->properties()->create($validated);

        AnalyzePropertyJob::dispatch($property);

        return fractal()->item($property, PropertyTransformer::class)
            ->parseIncludes(['price_histories'])
            ->respond(201);
    }

    public function show(ShowPropertyRequest $request, Property $property): JsonResponse
    {
        return fractal()->item($property, PropertyTransformer::class)
            ->parseIncludes(['price_histories', 'neighborhood', 'notes'])
            ->respond();
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        $validated = $request->validated();

        $property->update($validated);
        $property->refresh();

        AnalyzePropertyJob::dispatch($property);

        return fractal()->item($property, PropertyTransformer::class)
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
        AnalyzePropertyJob::dispatch($property);

        return response()->json([
            'data' => ['message' => 'Property analysis has been queued'],
        ]);
    }
}
