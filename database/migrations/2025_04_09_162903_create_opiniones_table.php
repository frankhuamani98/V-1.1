<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('opiniones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('nombre_cliente');
            $table->integer('estrellas'); // 1-5 estrellas
            $table->text('comentario');
            $table->integer('util_count')->default(0); // Contador para "Útil"
            $table->integer('comentarios_count')->default(0); // Contador de comentarios
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('opiniones');
    }
};