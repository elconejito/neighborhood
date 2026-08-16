<?php

namespace App\Http\Requests\Api\V1\Property;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'neighborhood_id' => ['sometimes', 'nullable', 'exists:neighborhoods,id'],
            'is_pinned' => ['sometimes', 'boolean'],
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'required', 'string', 'max:255'],
            'state' => ['sometimes', 'required', 'string', 'size:2'],
            'zip_code' => ['sometimes', 'required', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'acreage' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'numeric', 'min:0'],
            'square_feet' => ['nullable', 'integer', 'min:0'],
            'year_built' => ['nullable', 'integer', 'min:1700', 'max:'.(date('Y') + 5)],
            'garage' => ['nullable', 'integer', 'min:0'],
            'basement' => ['nullable', 'string', 'in:Unknown,None,Unfinished,Finished,Partial'],
            'basement_walkout' => ['nullable', 'boolean'],
            'fireplace' => ['nullable', 'boolean'],
            'main_level_primary_bedroom' => ['nullable', 'boolean'],
            'pool' => ['nullable', 'boolean'],
            'fence' => ['nullable', 'string', 'in:Yes,No but allowed,No'],
            'deck' => ['nullable', 'string', 'in:Screened/Covered Porch,Deck,Patio,None'],
            'water' => ['nullable', 'string', 'in:Well,Public,Other'],
            'sewer' => ['nullable', 'string', 'in:Septic,Public,Other'],
            'reference_hvac_type_id' => ['nullable', 'exists:reference_hvac_types,id'],
            'hoa' => ['nullable', 'string', 'in:None,HOA,Condo,Coop'],
            'listing_url' => ['nullable', 'url', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
