<?php

namespace App\Http\Requests\Api\V1\Neighborhood;

use Illuminate\Foundation\Http\FormRequest;

class StoreNeighborhoodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->team_id !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
