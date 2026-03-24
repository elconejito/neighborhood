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
        'notes',
        'user',
    ];

    public function transform(Property $property): array
    {
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

    public function includeNotes(Property $property): Collection
    {
        return $this->collection($property->notes, new NoteTransformer);
    }

    public function includeUser(Property $property): Item
    {
        return $this->item($property->user, new UserTransformer);
    }
}
