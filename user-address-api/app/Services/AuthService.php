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
        if (!Auth::attempt($credentials)) {
            throw new \Exception('Credenciais inválidas', 401);
        }

        $user = Auth::user();
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
