<?php

namespace App\Http\Requests\Api\V1\Property;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexPropertyRequest extends FormRequest
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
        return [
            'search' => ['sometimes', 'string', 'max:255'],
            'searchFields' => ['sometimes', 'string', 'regex:/^[\w,.:;]+$/'],
            'searchJoin' => ['sometimes', 'string', 'in:and,or'],
            'filter' => ['sometimes', 'string', 'regex:/^[\w;,]+$/'],
            'orderBy' => ['sometimes', 'string', 'alpha_dash', 'max:64'],
            'sortedBy' => ['sometimes', 'string', 'in:asc,desc'],
            'sale_status' => ['sometimes', 'string', 'in:sold,unsold'],
            'per_page' => ['sometimes', 'integer', 'in:10,25,50'],
        ];
    }
}
