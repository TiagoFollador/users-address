<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ViaCepService
{
    public function getAddressByZipCode(string $zipCode): array
    {
        $zipCode = preg_replace('/[^0-9]/', '', $zipCode);

        $response = Http::get("https://viacep.com.br/ws/{$zipCode}/json/");

        if ($response->failed()) {
            throw new \Exception('Erro ao consultar CEP', 500);
        }

        $data = $response->json();

        if (isset($data['erro'])) {
            throw new \Exception('CEP não encontrado', 404);
        }

        return [
            'zip_code' => $data['cep'],
            'address' => $data['logradouro'],
            'neighborhood' => $data['bairro'],
            'city' => $data['localidade'],
            'state' => $data['uf'],
            'complement' => $data['complemento'] ?? ''
        ];
    }
}
