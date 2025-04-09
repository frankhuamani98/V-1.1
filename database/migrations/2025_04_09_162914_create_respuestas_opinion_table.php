<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('respuestas_opinion', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('opinion_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('nombre_respondedor');
            $table->text('respuesta');
            $table->timestamps();
            
            $table->foreign('opinion_id')->references('id')->on('opiniones')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('respuestas_opinion');
    }
};