<?php

namespace App\Transformers\Api\V1;

use App\Models\Property;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\TransformerAbstract;

class PropertyTransformer extends TransformerAbstract
{
    protected array $availableIncludes = [
        'neighborhood',
        'price_histories',
        'listing_cycles',
        'notes',
        'user',
    ];

    public function transform(Property $property): array
    {
        $lastSale = $property->relationLoaded('lastSoldHistory')
            ? $property->lastSoldHistory
            : $property->priceHistories
                ->where('type', 'sold')
                ->sortByDesc('price_date')
                ->first();

        $lastListing = $property->relationLoaded('lastListingHistory')
            ? $property->lastListingHistory
            : $property->priceHistories
                ->where('type', 'listing')
                ->sortByDesc('price_date')
                ->first();

        $lastSoldCycle = $property->lastSoldCycle;
        $lastListingCycle = $property->lastListingCycle;

        $lastSalePrice = $lastSale?->price;
        $lastSaleDate = $property->last_sale_date ?? $lastSale?->price_date;

        if ($lastSoldCycle?->sold_at && (! $lastSaleDate || $lastSoldCycle->sold_at->isAfter($lastSaleDate))) {
            $lastSalePrice = $lastSoldCycle->sold_price;
            $lastSaleDate = $lastSoldCycle->sold_at;
        }

        $lastListingPrice = $lastListing?->price;
        $lastListingDate = $lastListing?->price_date;
        $lastListingEventType = $lastListing?->type;

        if ($lastListingCycle?->listed_at && (! $lastListingDate || $lastListingCycle->listed_at->isAfter($lastListingDate))) {
            $lastListingPrice = $lastListingCycle->list_price;
            $lastListingDate = $lastListingCycle->listed_at;
            $lastListingEventType = 'listing';
        }

        $marketPrice = $lastSalePrice ?? $lastListingPrice;
        $marketActivityDate = $lastSaleDate ?? $lastListingDate;

        return [
            'id' => (int) $property->id,
            'user_id' => (int) $property->user_id,
            'neighborhood_id' => $property->neighborhood_id ? (int) $property->neighborhood_id : null,
            'is_pinned' => (bool) $property->is_pinned,
            'address' => $property->address,
            'city' => $property->city,
            'state' => $property->state,
            'zip_code' => $property->zip_code,
            'latitude' => $property->latitude ? (float) $property->latitude : null,
            'longitude' => $property->longitude ? (float) $property->longitude : null,
            'geocoding_source' => $property->geocoding_source,
            'geocoding_accuracy' => $property->geocoding_accuracy,
            'acreage' => $property->acreage ? (float) $property->acreage : null,
            'bedrooms' => $property->bedrooms ? (int) $property->bedrooms : null,
            'bathrooms' => $property->bathrooms ? (float) $property->bathrooms : null,
            'square_feet' => $property->square_feet ? (int) $property->square_feet : null,
            'year_built' => $property->year_built ? (int) $property->year_built : null,
            'garage' => (int) $property->garage,
            'basement' => $property->basement,
            'basement_walkout' => (bool) $property->basement_walkout,
            'fireplace' => (bool) $property->fireplace,
            'main_level_primary_bedroom' => (bool) $property->main_level_primary_bedroom,
            'pool' => (bool) $property->pool,
            'fence' => $property->fence,
            'deck' => $property->deck,
            'water' => $property->water,
            'sewer' => $property->sewer,
            'reference_hvac_type_id' => $property->reference_hvac_type_id ? (int) $property->reference_hvac_type_id : null,
            'hoa' => $property->hoa,
            'listing_url' => $property->listing_url,
            'analysis' => $property->analysis,
            'last_sale_price' => $lastSalePrice,
            'last_sale_date' => $lastSaleDate?->toDateString(),
            'last_listing_price' => $lastListingPrice,
            'last_listing_date' => $lastListingDate?->toDateString(),
            'last_listing_event_type' => $lastListingEventType,
            'market_price' => $marketPrice,
            'market_activity_date' => $marketActivityDate?->toDateString(),
            'analyzed_at' => $property->analyzed_at ? $property->analyzed_at->toDateTimeString() : null,
            'created_at' => $property->created_at ? $property->created_at->toDateTimeString() : null,
            'updated_at' => $property->updated_at ? $property->updated_at->toDateTimeString() : null,
        ];
    }

    public function includeNeighborhood(Property $property): ?Item
    {
        $neighborhood = $property->neighborhood;

        return $neighborhood ? $this->item($neighborhood, new NeighborhoodTransformer) : null;
    }

    public function includePriceHistories(Property $property): Collection
    {
        return $this->collection($property->priceHistories, new PriceHistoryTransformer);
    }

    public function includeListingCycles(Property $property): Collection
    {
        return $this->collection($property->listingCycles()->orderByDesc('created_at')->get(), new ListingCycleTransformer);
    }

    public function includeNotes(Property $property): Collection
    {
        return $this->collection($property->notes, new NoteTransformer);
    }

    public function includeUser(Property $property): Item
    {
        return $this->item($property->user, new UserTransformer);
    }
}
