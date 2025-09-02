<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ViaCepService
{
    public function getAddressByZipCode(string $zipCode): array
    {
        $zipCode = preg_replace('/[^0-9]/', '', $zipCode);

        $allowInsecure = filter_var(env('VIA_CEP_ALLOW_INSECURE', false), FILTER_VALIDATE_BOOLEAN);
        $cacert = storage_path('cacert.pem');

        if ($allowInsecure) {
            $response = Http::withOptions(['verify' => false])->get("https://viacep.com.br/ws/{$zipCode}/json/");
        } else {
            if (!file_exists($cacert)) {
                throw new \RuntimeException('CA bundle not found: place a valid cacert.pem at storage/cacert.pem or set VIA_CEP_ALLOW_INSECURE=true for development.');
            }
            $response = Http::withOptions(['verify' => $cacert])->get("https://viacep.com.br/ws/{$zipCode}/json/");
        }

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
