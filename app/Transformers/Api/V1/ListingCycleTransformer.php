<?php

namespace App\Transformers\Api\V1;

use App\Models\ListingCycle;
use League\Fractal\Resource\Collection;
use League\Fractal\TransformerAbstract;

class ListingCycleTransformer extends TransformerAbstract
{
    protected array $defaultIncludes = ['price_histories'];

    public function transform(ListingCycle $cycle): array
    {
        return [
            'id'               => (int) $cycle->id,
            'property_id'      => (int) $cycle->property_id,
            'status'           => $cycle->status,
            'list_price'       => $cycle->list_price ? (float) $cycle->list_price : null,
            'sold_price'       => $cycle->sold_price ? (float) $cycle->sold_price : null,
            'listed_at'        => $cycle->listed_at?->toDateString(),
            'sold_at'          => $cycle->sold_at?->toDateString(),
            'off_market_at'    => $cycle->off_market_at?->toDateString(),
            'price_difference' => $cycle->getPriceDifference(),
            'percent_of_list'  => $cycle->getPercentOfListPrice(),
            'created_at'       => $cycle->created_at?->toDateTimeString(),
            'updated_at'       => $cycle->updated_at?->toDateTimeString(),
        ];
    }

    public function includePriceHistories(ListingCycle $cycle): Collection
    {
        return $this->collection($cycle->priceHistories, new PriceHistoryTransformer);
    }
}
