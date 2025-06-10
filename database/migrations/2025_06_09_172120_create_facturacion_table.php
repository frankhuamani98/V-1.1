<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facturacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->string('tipo_comprobante');
            $table->string('numero_comprobante')->unique();
            $table->string('dni');
            $table->string('nombre_cliente');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('igv', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('estado')->default('emitido');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facturacion');
    }
};
