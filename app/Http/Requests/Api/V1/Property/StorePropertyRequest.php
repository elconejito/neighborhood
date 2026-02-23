<?php

namespace App\Http\Requests\Api\V1\Property;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'neighborhood_id' => ['nullable', 'exists:neighborhoods,id'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2'],
            'zip_code' => ['required', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'acreage' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'numeric', 'min:0'],
            'square_feet' => ['nullable', 'integer', 'min:0'],
            'year_built' => ['nullable', 'integer', 'min:1700', 'max:'.(date('Y') + 5)],
            'garage' => ['nullable', 'integer', 'min:0'],
            'basement' => ['nullable', 'string', 'in:Unfinished,Finished,Partial'],
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
