<?php

namespace App\Http\Requests\Contact;

use App\Rules\ValidCpf;
use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'cpf' => [
                'required', 
                'string', 
                'max:14', 
                new ValidCpf(),
                'unique:contacts,cpf,NULL,id,user_id,' . ($this->user()->id ?? 'NULL')
            ],
            'cep' => 'required|string|max:10',
            'street' => 'required|string|max:500',
            'number' => 'required|string|max:10',
            'complement' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:2',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ter um formato válido',
            'phone.required' => 'O telefone é obrigatório',
            'cpf.required' => 'O CPF é obrigatório',
            'cpf.unique' => 'Este CPF já está cadastrado para você',
            'cep.required' => 'O CEP é obrigatório',
            'street.required' => 'O logradouro é obrigatório',
            'number.required' => 'O número é obrigatório',
        ];
    }
}
