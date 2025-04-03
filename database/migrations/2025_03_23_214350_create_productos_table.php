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
            
            // Relaciones con categorías
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->foreignId('subcategoria_id')->constrained('subcategorias')->onDelete('cascade');
            
            $table->decimal('precio', 10, 2);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->string('imagen_principal');
            $table->json('imagenes_adicionales')->nullable();
            
            $table->tinyInteger('calificacion')->unsigned()->default(0);
            $table->boolean('incluye_igv')->default(false);
            $table->integer('stock')->default(0);
            
            $table->boolean('todas_las_motos')->default(false);
            $table->boolean('destacado')->default(false);
            $table->boolean('mas_vendido')->default(false);
            
            $table->enum('estado', ['Activo', 'Inactivo', 'Agotado'])->default('Activo');
            
            $table->timestamps();
        });

        // Tabla pivote para relación muchos-a-muchos
        Schema::create('moto_producto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('moto_id')->constrained('motos')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['producto_id', 'moto_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moto_producto');
        Schema::dropIfExists('productos');
    }
};