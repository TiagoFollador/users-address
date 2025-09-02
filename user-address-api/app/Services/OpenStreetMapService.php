<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenStreetMapService
{
    private string $baseUrl = 'https://nominatim.openstreetmap.org/search';

    /**
     * Get coordinates from address using OpenStreetMap Nominatim API
     */
    public function getCoordinatesFromAddress(array $addressData): array
    {
        $address = $this->buildAddressString($addressData);
        
        $this->log('Attempting to geocode address', ['address' => $address]);
        
        try {
            $httpClient = Http::withHeaders([
                'User-Agent' => 'Laravel User Address API/1.0'
            ]);

            $caBundle = storage_path('cacert.pem');
            if (file_exists($caBundle)) {
                $httpClient = $httpClient->withOptions([
                    'verify' => $caBundle
                ]);
            } elseif (config('app.env') === 'local' && env('OPENSTREETMAP_ALLOW_INSECURE', false)) {
                $httpClient = $httpClient->withOptions([
                    'verify' => false
                ]);
            }

            $response = $httpClient->get($this->baseUrl, [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
                'countrycodes' => 'br',
                'addressdetails' => 1
            ]);

            $this->log('API response received', [
                'status' => $response->status(),
                'successful' => $response->successful()
            ]);

            if ($response->failed()) {
                $this->log('OpenStreetMap API request failed', [
                    'address' => $address,
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return $this->getDefaultCoordinates();
            }

            $data = $response->json();
            $this->log('API response data', ['data_count' => count($data)]);

            if (empty($data)) {
                $this->log('OpenStreetMap API returned no results', [
                    'address' => $address
                ]);
                return $this->getDefaultCoordinates();
            }

            $result = $data[0];
            $coordinates = [
                'latitude' => (string) $result['lat'],
                'longitude' => (string) $result['lon']
            ];

            $this->log('Geocoding successful', $coordinates);
            return $coordinates;

        } catch (\Exception $e) {
            $this->log('Error calling OpenStreetMap API', [
                'address' => $address,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
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
     * Return default coordinates when geocoding fails
     */
    private function getDefaultCoordinates(): array
    {
        return [
            'latitude' => '-23.5505',
            'longitude' => '-46.6333'
        ];
    }

    /**
     * Check if service is available
     */
    public function isConfigured(): bool
    {
        return true;
    }

    /**
     * Safe logging that works both in Laravel context and standalone
     */
    private function log(string $message, array $context = []): void
    {
        try {
            if (function_exists('app') && app()->bound('log')) {
                Log::info("[OpenStreetMapService] " . $message, $context);
            }
        } catch (\Exception $e) {
            // Ignore logging errors
        }
    }
}
