<?php

namespace App\Http\Requests\Api\V1\Property;

use Illuminate\Foundation\Http\FormRequest;

class SetPropertyLocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $property = $this->route('property');

        if (! $property) {
            return false;
        }

        if ($property->user_id === $user->id) {
            return true;
        }

        if ($user->team_id && $property->neighborhood_id) {
            return $user->team->neighborhoods()
                ->where('id', $property->neighborhood_id)
                ->exists();
        }

        return false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ];
    }
}
