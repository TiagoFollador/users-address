<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\ContactSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a default test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create a couple more users for manual testing
        User::factory()->create([
            'name' => 'Dev User',
            'email' => 'dev@example.com',
        ]);

        // Run contact seeder (which also creates users Alice and Bob)
        $this->call(ContactSeeder::class);
    }
}
