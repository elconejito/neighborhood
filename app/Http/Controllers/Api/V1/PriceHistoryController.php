<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ListingCycle;
use App\Models\PriceHistory;
use App\Transformers\Api\V1\PriceHistoryTransformer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PriceHistoryController extends Controller
{
    public function store(Request $request, ListingCycle $listingCycle): JsonResponse
    {
        abort_if($listingCycle->property->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'type'       => 'required|in:listing,reduction,increase,sold,off_market',
            'price'      => 'required|numeric|min:0',
            'price_date' => 'required|date',
        ]);

        $history = $listingCycle->priceHistories()->create([
            ...$validated,
            'property_id' => $listingCycle->property_id,
        ]);

        return fractal()->item($history, PriceHistoryTransformer::class)->respond(201);
    }

    public function update(Request $request, PriceHistory $priceHistory): JsonResponse
    {
        abort_if($priceHistory->listingCycle->property->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'type'       => 'sometimes|in:listing,reduction,increase,sold,off_market',
            'price'      => 'sometimes|numeric|min:0',
            'price_date' => 'sometimes|date',
        ]);

        $priceHistory->update($validated);

        return fractal()->item($priceHistory->fresh(), PriceHistoryTransformer::class)->respond();
    }

    public function destroy(Request $request, PriceHistory $priceHistory): JsonResponse
    {
        abort_if($priceHistory->listingCycle->property->user_id !== $request->user()->id, 403);

        $priceHistory->delete();

        return response()->json(['data' => ['message' => 'Price event deleted']]);
    }
}
