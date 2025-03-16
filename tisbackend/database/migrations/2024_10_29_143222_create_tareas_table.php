<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tareas', function (Blueprint $table) {
            $table->id('ID_tarea');
            $table->integer('nro_tarea');
            $table->integer('estimacion');
            $table->string('estado', 50);
            $table->text('contenido_tarea');
            $table->unsignedBigInteger('ID_estudiante');
            $table->unsignedBigInteger('ID_historia');

            $table->foreign('ID_estudiante')->references('ID_estudiante')->on('estudiantes')->onDelete('cascade');
            $table->foreign('ID_historia')->references('ID_historia')->on('historias_usuario')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};

