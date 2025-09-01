<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleMapsService
{
    private ?string $apiKey;
    private string $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
    }

    /**
     * Get coordinates (latitude and longitude) from address
     */
    public function getCoordinatesFromAddress(array $addressData): array
    {
        // If API key is not configured, return default coordinates immediately
        if (!$this->isConfigured()) {
            Log::info('Google Maps API key not configured, using default coordinates');
            return $this->getDefaultCoordinates();
        }

        $address = $this->buildAddressString($addressData);
        
        try {
            $response = Http::get($this->baseUrl, [
                'address' => $address,
                'key' => $this->apiKey
            ]);

            if ($response->failed()) {
                Log::warning('Google Maps API request failed', [
                    'address' => $address,
                    'status' => $response->status()
                ]);
                return $this->getDefaultCoordinates();
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || empty($data['results'])) {
                Log::warning('Google Maps API returned no results', [
                    'address' => $address,
                    'status' => $data['status'] ?? 'unknown'
                ]);
                return $this->getDefaultCoordinates();
            }

            $location = $data['results'][0]['geometry']['location'];

            return [
                'latitude' => $location['lat'],
                'longitude' => $location['lng']
            ];

        } catch (\Exception $e) {
            Log::error('Error calling Google Maps API', [
                'address' => $address,
                'error' => $e->getMessage()
            ]);
            
            return $this->getDefaultCoordinates();
        }
    }

    /**
     * Build address string from address components
     */
    private function buildAddressString(array $addressData): string
    {
        $parts = [];
        
        if (!empty($addressData['street'])) {
            $addressPart = $addressData['street'];
            if (!empty($addressData['number'])) {
                $addressPart .= ', ' . $addressData['number'];
            }
            $parts[] = $addressPart;
        }
        
        if (!empty($addressData['complement'])) {
            $parts[] = $addressData['complement'];
        }
        
        if (!empty($addressData['neighborhood'])) {
            $parts[] = $addressData['neighborhood'];
        }
        
        if (!empty($addressData['city'])) {
            $parts[] = $addressData['city'];
        }
        
        if (!empty($addressData['state'])) {
            $parts[] = $addressData['state'];
        }
        
        if (!empty($addressData['cep'])) {
            $parts[] = $addressData['cep'];
        }
        
        $parts[] = 'Brasil';
        
        return implode(', ', $parts);
    }

    /**
     * Return default coordinates (São Paulo center) when geocoding fails
     */
    private function getDefaultCoordinates(): array
    {
        return [
            'latitude' => -23.5505,
            'longitude' => -46.6333
        ];
    }

    /**
     * Check if Google Maps API is configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }
}
