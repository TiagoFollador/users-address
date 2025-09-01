<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            // Drop the existing unique constraint on cpf
            $table->dropUnique(['cpf']);
            
            // Add composite unique constraint (user_id + cpf)
            $table->unique(['user_id', 'cpf'], 'contacts_user_cpf_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            // Drop the composite unique constraint
            $table->dropUnique('contacts_user_cpf_unique');
            
            // Restore the original unique constraint on cpf
            $table->unique('cpf');
        });
    }
};
