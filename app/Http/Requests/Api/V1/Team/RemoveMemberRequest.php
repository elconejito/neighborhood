<?php

namespace App\Http\Requests\Api\V1\Team;

use Illuminate\Foundation\Http\FormRequest;

class RemoveMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}
