<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;

// Rotas de Autenticação (Públicas)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas de recuperação de senha (Públicas)
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Rotas Protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // CRUD de Contatos
    Route::apiResource('contacts', ContactController::class);
    
    // Endpoint para ViaCEP
    Route::post('/contacts/via-cep', [ContactController::class, 'viaCep']);

    // Gerenciamento de Conta
    Route::delete('/account', [AuthController::class, 'deleteAccount']);
});
