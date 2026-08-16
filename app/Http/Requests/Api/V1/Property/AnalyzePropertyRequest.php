<?php

namespace App\Http\Requests\Api\V1\Property;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $property = $this->route('property');

        if (!$property) {
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
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
