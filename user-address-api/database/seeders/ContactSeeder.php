<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        // Create two users with known emails for testing
        $alice = User::factory()->create([
            'name' => 'Alice Example',
            'email' => 'alice@example.com',
        ]);

        $bob = User::factory()->create([
            'name' => 'Bob Example',
            'email' => 'bob@example.com',
        ]);

        // Create some contacts for Alice
        Contact::factory()->count(3)->create([
            'user_id' => $alice->id,
        ]);

        // Create some contacts for Bob
        Contact::factory()->count(2)->create([
            'user_id' => $bob->id,
        ]);

        // Additional random contacts
        Contact::factory()->count(10)->create();
    }
}
