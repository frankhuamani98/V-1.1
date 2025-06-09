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
            $table->string('numero_orden', 20)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('dni');
            $table->text('direccion');
            $table->text('direccion_alternativa')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('estado')->default('pendiente');
            $table->string('metodo_pago')->nullable();
            $table->string('referencia_pago')->nullable();
            $table->enum('tipo_comprobante', ['factura', 'boleta', 'nota_venta'])->nullable();
            $table->timestamps();
        });

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

        Schema::create('metodos_pago', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion')->nullable();
            $table->string('imagen')->nullable();
            $table->timestamps();
        });

        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained()->onDelete('cascade');
            $table->foreignId('metodo_pago_id')->constrained('metodos_pago')->onDelete('cascade');
            $table->string('referencia')->nullable();
            $table->string('archivo_comprobante')->nullable();
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
