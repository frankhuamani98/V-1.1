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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('moto_id')->constrained('motos')->onDelete('cascade');
            $table->string('placa');
            $table->foreignId('servicio_id')->constrained('servicios')->onDelete('restrict');
            $table->foreignId('horario_id')->constrained('horarios')->onDelete('restrict');
            $table->date('fecha');
            $table->time('hora');
            $table->text('detalles')->nullable();
            $table->enum('estado', ['pendiente', 'confirmada', 'completada', 'cancelada'])->default('pendiente');
            $table->timestamp('reprogramada_en')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};