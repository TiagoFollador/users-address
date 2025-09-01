<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class ViaCepRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'zip_code' => 'required|string|regex:/^\d{5}-?\d{3}$/'
        ];
    }

    public function messages(): array
    {
        return [
            'zip_code.required' => 'O CEP é obrigatório',
            'zip_code.regex' => 'O CEP deve ter um formato válido (XXXXX-XXX)',
        ];
    }
}
