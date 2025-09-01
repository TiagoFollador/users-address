<?php

use App\Models\Contact;
use App\Services\GoogleMapsService;
use Illuminate\Support\Facades\App;

require __DIR__ . '/../vendor/autoload.php';

/**
 * Backfill contact coordinates using GoogleMapsService.
 * Run from repo root: php scripts/backfill_coordinates.php
 * Requires GOOGLE_MAPS_API_KEY to be set in environment or config.
 */

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$geocoder = App::make(GoogleMapsService::class);

if (!$geocoder->isConfigured()) {
    echo "Google Maps API key not configured. Aborting.\n";
    exit(1);
}

$contacts = Contact::whereNull('latitude')->orWhereNull('longitude')->get();

foreach ($contacts as $contact) {
    $address = [
        'street' => $contact->street,
        'number' => $contact->number,
        'complement' => $contact->complement,
        'neighborhood' => $contact->neighborhood,
        'city' => $contact->city,
        'state' => $contact->state,
        'cep' => $contact->cep,
    ];

    try {
        $coords = $geocoder->getCoordinatesFromAddress($address);
        $contact->latitude = $coords['latitude'];
        $contact->longitude = $coords['longitude'];
        $contact->save();
        echo "Updated contact {$contact->id} -> ({$coords['latitude']}, {$coords['longitude']})\n";
    } catch (Exception $e) {
        echo "Failed to geocode contact {$contact->id}: {$e->getMessage()}\n";
    }
}

echo "Done.\n";
