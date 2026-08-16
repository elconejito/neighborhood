<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Neighborhood\StoreNeighborhoodRequest;
use App\Http\Requests\Api\V1\Neighborhood\UpdateNeighborhoodRequest;
use App\Models\Neighborhood;
use App\Transformers\Api\V1\NeighborhoodTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NeighborhoodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->team_id) {
            return response()->json(['data' => []]);
        }

        $neighborhoods = $user->team->neighborhoods()->orderBy('name')->get();

        return fractal($neighborhoods, new NeighborhoodTransformer())->respond();
    }

    public function store(StoreNeighborhoodRequest $request): JsonResponse
    {
        $neighborhood = $request->user()->team->neighborhoods()->create($request->validated());

        return fractal($neighborhood, new NeighborhoodTransformer())->respond(201);
    }

    public function show(Request $request, Neighborhood $neighborhood): JsonResponse
    {
        if ($neighborhood->team_id !== $request->user()->team_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return fractal($neighborhood, new NeighborhoodTransformer())->respond();
    }

    public function update(UpdateNeighborhoodRequest $request, Neighborhood $neighborhood): JsonResponse
    {
        if ($neighborhood->team_id !== $request->user()->team_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $neighborhood->update($request->validated());

        return fractal($neighborhood, new NeighborhoodTransformer())->respond();
    }

    public function destroy(Request $request, Neighborhood $neighborhood): JsonResponse
    {
        if ($neighborhood->team_id !== $request->user()->team_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $neighborhood->delete();

        return response()->json([
            'message' => 'Neighborhood deleted successfully'
        ]);
    }
}
