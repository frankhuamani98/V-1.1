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
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio_base', 10, 2);
            $table->integer('duracion_estimada')->comment('Duración en minutos');
            $table->foreignId('categoria_servicio_id')->constrained('categorias_servicios')->onDelete('restrict');
            $table->boolean('estado')->default(true)->comment('true: activo, false: inactivo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicios');
    }
};