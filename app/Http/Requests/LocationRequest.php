<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "number"    => "required|integer",
            "address"   => "required|string",
            "type"      => "required|integer",
            "bedrooms"  => "required|numeric",
            "bathrooms" => "required|numeric",
            "sqft"      => "required|integer",
            "built"     => "required|integer",
            "mlsid"     => "required|string",
            "details"   => "required|string",
        ];
    }
}
