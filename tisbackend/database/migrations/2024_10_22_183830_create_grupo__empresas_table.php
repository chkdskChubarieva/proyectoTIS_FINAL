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
        Schema::create('grupo_empresas', function (Blueprint $table) {
            $table->id('ID_empresa');
            $table->string('nombre_empresa');
            $table->string('correo_empresa')->unique();
            $table->string('nombre_representante');
            $table->string('telf_representante', 8);
            $table->unsignedBigInteger('ID_docente');
            $table->foreign('ID_docente')
                ->references('ID_docente')
                ->on('docentes')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            
            $table->string('codigo');
            $table->string('logo_empresa', 200)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grupo_empresas');
    }
};
