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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('dni');
            $table->text('direccion');
            $table->text('direccion_alternativa')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2); // El campo total YA existe aquí
            $table->string('estado')->default('pendiente'); // pendiente, procesando, completado, cancelado
            $table->string('metodo_pago')->nullable(); // almacena el método de pago seleccionado
            $table->string('referencia_pago')->nullable(); // almacena el comprobante o referencia
            $table->timestamps();
        });

        // Tabla para los items del pedido
        Schema::create('pedido_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained()->onDelete('cascade');
            $table->foreignId('producto_id')->constrained()->onDelete('cascade');
            $table->string('nombre_producto');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });

        // Tabla para guardar los métodos de pago disponibles
        Schema::create('metodos_pago', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->string('imagen')->nullable();
            $table->timestamps();
        });

        // Tabla para registrar los pagos realizados
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained()->onDelete('cascade');
            $table->foreignId('metodo_pago_id')->constrained('metodos_pago')->onDelete('cascade');
            $table->string('referencia')->nullable(); // referencia del pago o comprobante
            $table->string('archivo_comprobante')->nullable(); // ruta del archivo del comprobante
            $table->decimal('monto', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
        Schema::dropIfExists('metodos_pago');
        Schema::dropIfExists('pedido_items');
        Schema::dropIfExists('pedidos');
    }
};
