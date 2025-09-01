<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Mail\ResetPasswordMail;

class PasswordResetService
{
    /**
     * Send password reset email
     */
    public function sendResetEmail(string $email): array
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Usuário não encontrado'
            ];
        }

        // Delete existing tokens for this user
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();

        // Generate new token
        $token = Str::random(64);
        
        // Store token in database
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => now()
        ]);

        // Send email with the reset link
        try {
            Mail::to($email)->send(new ResetPasswordMail($user, $token));
            
            return [
                'success' => true,
                'message' => 'Email de recuperação enviado com sucesso'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao enviar email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(string $email, string $token, string $password): array
    {
        // Check if token exists and is valid
        $tokenRecord = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$tokenRecord) {
            return [
                'success' => false,
                'message' => 'Token inválido'
            ];
        }

        // Check if token matches
        if (!Hash::check($token, $tokenRecord->token)) {
            return [
                'success' => false,
                'message' => 'Token inválido'
            ];
        }

        // Check if token is not expired (60 minutes)
        $tokenAge = now()->diffInMinutes($tokenRecord->created_at);
        if ($tokenAge > 60) {
            // Delete expired token
            DB::table('password_reset_tokens')
                ->where('email', $email)
                ->delete();
                
            return [
                'success' => false,
                'message' => 'Token expirado'
            ];
        }

        // Update user password
        $user = User::where('email', $email)->first();
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Usuário não encontrado'
            ];
        }

        $user->password = Hash::make($password);
        $user->save();

        // Delete used token
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();

        return [
            'success' => true,
            'message' => 'Senha alterada com sucesso'
        ];
    }
}
