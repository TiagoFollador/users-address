<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCpf implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$this->isValidCpf($value)) {
            $fail('O campo :attribute deve conter um CPF válido.');
        }
    }

    /**
     * Validate CPF using the official algorithm
     */
    private function isValidCpf(string $cpf): bool
    {
        // Remove non-numeric characters
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        // Check if CPF has 11 digits
        if (strlen($cpf) !== 11) {
            return false;
        }

        // Check for known invalid CPFs (all same digits)
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }

        // Calculate first verification digit
        $sum = 0;
        for ($i = 0; $i < 9; $i++) {
            $sum += intval($cpf[$i]) * (10 - $i);
        }
        $firstDigit = 11 - ($sum % 11);
        if ($firstDigit >= 10) {
            $firstDigit = 0;
        }

        // Check first verification digit
        if (intval($cpf[9]) !== $firstDigit) {
            return false;
        }

        // Calculate second verification digit
        $sum = 0;
        for ($i = 0; $i < 10; $i++) {
            $sum += intval($cpf[$i]) * (11 - $i);
        }
        $secondDigit = 11 - ($sum % 11);
        if ($secondDigit >= 10) {
            $secondDigit = 0;
        }

        // Check second verification digit
        return intval($cpf[10]) === $secondDigit;
    }
}
