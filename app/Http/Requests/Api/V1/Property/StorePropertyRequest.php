<?php

namespace App\Http\Requests\Api\V1\Property;

use App\Models\Neighborhood;
use App\Models\Property;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Neighborhood $neighborhood */
        $neighborhood = $this->route('neighborhood');

        return [
            'neighborhood_id' => ['nullable', 'exists:neighborhoods,id'],
            'address' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Property::class, 'address')
                    ->where(fn (Builder $query): Builder => $query->where('neighborhood_id', $neighborhood->id)),
            ],
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

    /**
     * Get the validation error messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'address.unique' => 'This address is already in the neighborhood.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'address' => trim((string) $this->input('address')),
            'city' => trim((string) $this->input('city')),
            'state' => strtoupper(trim((string) $this->input('state'))),
            'zip_code' => trim((string) $this->input('zip_code')),
        ]);
    }
}
