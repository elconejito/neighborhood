<?php

namespace App\Transformers\Api\V1;

use App\Models\Team;
use League\Fractal\TransformerAbstract;

class TeamTransformer extends TransformerAbstract
{
    public function transform(Team $team): array
    {
        return [
            'id' => (int) $team->id,
            'name' => $team->name,
            'created_at' => $team->created_at ? $team->created_at->toDateTimeString() : null,
            'updated_at' => $team->updated_at ? $team->updated_at->toDateTimeString() : null,
        ];
    }
}
