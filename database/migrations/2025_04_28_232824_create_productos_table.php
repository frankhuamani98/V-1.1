
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->string('descripcion_corta', 150);
            $table->text('detalles')->nullable();
            $table->foreignId('categoria_id')->constrained()->onDelete('cascade');
            $table->foreignId('subcategoria_id')->constrained('subcategorias')->onDelete('cascade');
            $table->decimal('precio', 10, 2);
            $table->decimal('descuento', 5, 2)->default(0);
            $table->string('imagen_principal');
            $table->json('imagenes_adicionales')->nullable();
            $table->tinyInteger('calificacion')->default(0);
            $table->boolean('incluye_igv')->default(false);
            $table->integer('stock')->default(0);
            $table->boolean('destacado')->default(false);
            $table->boolean('mas_vendido')->default(false);
            $table->string('estado')->default('Activo');
            $table->timestamps();
            $table->softDeletes();
        });

        // Tabla pivote para la relación muchos a muchos con motos
        Schema::create('moto_producto', function (Blueprint $table) {
            $table->foreignId('moto_id')->constrained()->onDelete('cascade');
            $table->foreignId('producto_id')->constrained()->onDelete('cascade');
            $table->primary(['moto_id', 'producto_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('moto_producto');
        Schema::dropIfExists('productos');
    }
};
