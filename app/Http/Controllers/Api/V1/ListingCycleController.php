<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ListingCycle;
use App\Models\Property;
use App\Transformers\Api\V1\ListingCycleTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListingCycleController extends Controller
{
    public function store(Request $request, Property $property): JsonResponse
    {
        abort_if($property->user_id !== $request->user()->id, 403);

        // A cycle is just a container — all price data lives in PriceHistories
        $cycle = $property->listingCycles()->create(['status' => 'listed']);
        $cycle->load('priceHistories');

        return fractal()->item($cycle, ListingCycleTransformer::class)->respond(201);
    }

    public function update(Request $request, ListingCycle $listingCycle): JsonResponse
    {
        abort_if($listingCycle->property->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'status'        => 'sometimes|in:listed,sold,off_market',
            'list_price'    => 'sometimes|numeric|min:0',
            'listed_at'     => 'sometimes|date',
            'sold_price'    => 'sometimes|nullable|numeric|min:0',
            'sold_at'       => 'sometimes|nullable|date',
            'off_market_at' => 'sometimes|nullable|date',
        ]);

        $listingCycle->update($validated);
        $listingCycle->load('priceHistories');

        return fractal()->item($listingCycle, ListingCycleTransformer::class)->respond();
    }

    public function destroy(Request $request, ListingCycle $listingCycle): JsonResponse
    {
        abort_if($listingCycle->property->user_id !== $request->user()->id, 403);

        // Price histories are cascade-deleted via the FK constraint
        $listingCycle->delete();

        return response()->json(['data' => ['message' => 'Listing cycle deleted']]);
    }
}
