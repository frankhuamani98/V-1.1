<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('tipo');
            $table->string('titulo');
            $table->text('mensaje');
            $table->json('data')->nullable();
            $table->boolean('leida')->default(false);
            $table->string('url')->nullable();
            $table->string('prioridad')->default('media');
            $table->unsignedBigInteger('referencia_id')->nullable();
            $table->string('referencia_type')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'leida']);
            $table->index(['tipo', 'leida']);
            $table->index(['referencia_id', 'referencia_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
