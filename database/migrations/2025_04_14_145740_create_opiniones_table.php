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
        Schema::create('opiniones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('calificacion')->comment('Calificación de 1 a 5 estrellas');
            $table->text('contenido');
            $table->integer('util')->default(0)->comment('Contador de votos "Útil"');
            $table->boolean('es_soporte')->default(false)->comment('Indica si la opinión es del equipo de soporte');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opiniones');
    }
};