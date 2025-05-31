<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subcategorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->foreignId('categoria_id')
                  ->constrained('categorias')
                  ->onDelete('cascade');
            $table->enum('estado', ['Activo', 'Inactivo', 'Pendiente'])->default('Activo');
            $table->timestamps();

            $table->unique(['nombre', 'categoria_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subcategorias');
    }
};