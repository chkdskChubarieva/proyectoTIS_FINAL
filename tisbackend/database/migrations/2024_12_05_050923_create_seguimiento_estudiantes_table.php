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
        Schema::create('seguimiento_estudiantes', function (Blueprint $table) {
            $table->id('ID_seguimiento_estudiantes');
            $table->Integer('nota_estudiante')->nullable();
            $table->text('retroalimentacion')->nullable();
            $table->Integer('asistencias')->nullable();
            $table->Integer('retrasos')->nullable();
            $table->Integer('ausencias_justificadas')->nullable();
            $table->Integer('ausencias_injustificadas')->nullable();
            
            $table->unsignedBigInteger('ID_fecha_entregable')->nullable();
            $table->foreign('ID_fecha_entregable')
                ->references('ID_fecha_entregable')
                ->on('fecha_entrega')
                ->onDelete('cascade')
                ->onUpdate('cascade');
                
            $table->unsignedBigInteger('ID_usuario')->nullable();
            $table->foreign('ID_usuario')
                ->references('ID_usuario')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seguimiento_estudiantes');
    }
};
