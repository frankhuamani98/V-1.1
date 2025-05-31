<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motos', function (Blueprint $table) {
            $table->id();
            $table->integer('año');
            $table->string('modelo');
            $table->string('marca');
            $table->string('estado');
            $table->timestamps();
            $table->unique(['año', 'marca', 'modelo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motos');
    }
};