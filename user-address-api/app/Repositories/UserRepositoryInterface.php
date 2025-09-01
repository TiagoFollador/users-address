<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function create(array $data): User;
    public function findByEmail(string $email): ?User;
    public function findById(int $id): ?User;
    public function update(User $user, array $data): User;
    public function delete(User $user): bool;
    public function deleteUserTokens(User $user): void;
}
