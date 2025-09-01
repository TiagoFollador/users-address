<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private ContactRepositoryInterface $contactRepository
    ) {}

    public function register(array $data): array
    {
        $user = $this->userRepository->create($data);
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ];
    }

    public function login(array $credentials): array
    {
    // Stateless login: find user by email and verify password without using session-based Auth::attempt
        $user = $this->userRepository->findByEmail($credentials['email'] ?? null);
        if (!$user || !\Illuminate\Support\Facades\Hash::check($credentials['password'] ?? '', $user->password)) {
            throw new \Exception('Credenciais inválidas', 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function deleteAccount(User $user): void
    {
        // Delete all user tokens
        $this->userRepository->deleteUserTokens($user);
        
        // Delete all user contacts
        $this->contactRepository->deleteUserContacts($user);
        
        // Delete the user
        $this->userRepository->delete($user);
    }
}
