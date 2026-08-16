<?php

namespace App\Transformers\Api\V1;

use App\Models\Note;
use League\Fractal\TransformerAbstract;

class NoteTransformer extends TransformerAbstract
{
    public function transform(Note $note): array
    {
        return [
            'id' => (int) $note->id,
            'user_id' => (int) $note->user_id,
            'content' => $note->content,
            'created_at' => $note->created_at ? $note->created_at->toDateTimeString() : null,
            'updated_at' => $note->updated_at ? $note->updated_at->toDateTimeString() : null,
        ];
    }
}
