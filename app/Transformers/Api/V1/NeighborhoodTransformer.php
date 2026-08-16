<?php

namespace App\Transformers\Api\V1;

use App\Models\Neighborhood;
use League\Fractal\TransformerAbstract;

class NeighborhoodTransformer extends TransformerAbstract
{
    public function transform(Neighborhood $neighborhood): array
    {
        return [
            'id' => (int) $neighborhood->id,
            'team_id' => (int) $neighborhood->team_id,
            'name' => $neighborhood->name,
            'created_at' => $neighborhood->created_at ? $neighborhood->created_at->toDateTimeString() : null,
            'updated_at' => $neighborhood->updated_at ? $neighborhood->updated_at->toDateTimeString() : null,
        ];
    }
}
