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
        Schema::create('favorite_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->string('nombre');
            $table->decimal('precio', 10, 2);
            $table->decimal('precio_original', 10, 2)->nullable();
            $table->decimal('precio_final', 10, 2)->nullable();
            $table->decimal('igv', 10, 2)->nullable();
            $table->decimal('descuento', 10, 2)->default(0);
            $table->string('imagen')->nullable();
            $table->timestamps();
            
            // Ensure each product is only added once per user
            $table->unique(['user_id', 'producto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_items');
    }
};
