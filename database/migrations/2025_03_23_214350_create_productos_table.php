<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->string('descripcion_corta', 255);
            $table->text('detalles')->nullable();

            // Relaciones
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->foreignId('subcategoria_id')->constrained('subcategorias')->onDelete('cascade');
            $table->foreignId('moto_id')->nullable()->constrained('motos')->onDelete('set null');

            // Precios y descuentos
            $table->decimal('precio', 10, 2);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->boolean('incluye_igv')->default(false);
            
            // Imágenes
            $table->string('imagen_principal');
            $table->json('imagenes_adicionales')->nullable();
            
            // Valoración y stock
            $table->tinyInteger('calificacion')->unsigned()->default(0);
            $table->integer('stock')->default(0);
            
            // Flags especiales
            $table->boolean('destacado')->default(false);
            $table->boolean('mas_vendido')->default(false);
            
            // Estado y timestamps
            $table->enum('estado', ['Activo', 'Inactivo', 'Agotado'])->default('Activo');
            $table->timestamps();
            $table->softDeletes(); // Considera añadir eliminación suave
            
            // Índices para mejorar rendimiento
            $table->index('destacado');
            $table->index('mas_vendido');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};