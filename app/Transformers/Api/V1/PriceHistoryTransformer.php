<?php

namespace App\Transformers\Api\V1;

use App\Models\PriceHistory;
use League\Fractal\TransformerAbstract;

class PriceHistoryTransformer extends TransformerAbstract
{
    public function transform(PriceHistory $history): array
    {
        return [
            'id' => (int) $history->id,
            'property_id' => (int) $history->property_id,
            'price' => (float) $history->price,
            'price_date' => $history->price_date ? $history->price_date->toDateString() : null,
            'type' => $history->type,
            'created_at' => $history->created_at ? $history->created_at->toDateTimeString() : null,
            'updated_at' => $history->updated_at ? $history->updated_at->toDateTimeString() : null,
        ];
    }
}
