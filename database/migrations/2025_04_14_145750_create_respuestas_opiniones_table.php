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
        Schema::create('respuestas_opiniones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opinion_id')->constrained('opiniones')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('contenido');
            $table->boolean('es_soporte')->default(false)->comment('Indica si la respuesta es del equipo de soporte');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas_opiniones');
    }
};