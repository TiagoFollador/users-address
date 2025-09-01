<?php

namespace App\Http\Requests\Contact;

use App\Rules\ValidCpf;
use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $contactId = $this->route('contact'); // Get contact ID from route
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'cpf' => [
                'sometimes', 
                'required', 
                'string', 
                'max:14', 
                new ValidCpf(),
                'unique:contacts,cpf,' . $contactId . ',id,user_id,' . ($this->user()->id ?? 'NULL')
            ],
            'cep' => 'sometimes|required|string|max:10',
            'street' => 'sometimes|required|string|max:500',
            'number' => 'sometimes|required|string|max:10',
            'complement' => 'nullable|string|max:255',
            'neighborhood' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'state' => 'sometimes|required|string|max:2',
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
            'neighborhood.required' => 'O bairro é obrigatório',
            'city.required' => 'A cidade é obrigatória',
            'state.required' => 'O estado é obrigatório',
        ];
    }
}
