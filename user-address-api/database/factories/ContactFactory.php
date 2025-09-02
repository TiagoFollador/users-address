<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        $cep = preg_replace('/[^0-9]/', '', fake()->postcode());
        $cepFormatted = substr($cep, 0, 5) . '-' . substr($cep, 5, 3);

        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'cpf' => fake()->unique()->numerify('###.###.###-##'),
            'phone' => fake()->phoneNumber(),
            'cep' => $cepFormatted,
            'street' => fake()->streetName(),
            'number' => (string) fake()->buildingNumber(),
            'complement' => fake()->optional()->secondaryAddress(),
            'neighborhood' => fake()->citySuffix(),
            'city' => fake()->city(),
            'state' => strtoupper(fake()->stateAbbr()),
            // Generate plausible random coordinates as strings so DB non-null
            // constraints are satisfied during seeding. Real geocoding can be
            // performed by the app when creating contacts or by a backfill job.
            'latitude' => (string) number_format(fake()->randomFloat(6, -90, 90), 6, '.', ''),
            'longitude' => (string) number_format(fake()->randomFloat(6, -180, 180), 6, '.', ''),
        ];
    }
}
