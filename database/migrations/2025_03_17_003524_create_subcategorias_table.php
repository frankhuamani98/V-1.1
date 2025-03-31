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
        Schema::create('subcategorias', function (Blueprint $table) {
            $table->id(); // Identificador único
            $table->string('nombre'); // Nombre de la subcategoría
            $table->foreignId('categoria_id') // Clave foránea
                  ->constrained('categorias') // Referencia a la tabla categorias
                  ->onDelete('cascade'); // Eliminación en cascada
            $table->enum('estado', ['Activo', 'Inactivo', 'Pendiente'])->default('Activo'); // Estado de la subcategoría
            $table->timestamps(); // Marcas de tiempo (created_at y updated_at)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcategorias'); // Eliminar la tabla si existe
    }
};