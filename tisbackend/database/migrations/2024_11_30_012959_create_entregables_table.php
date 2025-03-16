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
        Schema::create('entregables', function (Blueprint $table) {
            $table->id('ID_entregable');
            $table->string('nombre_entregable')->nullable();
            $table->Integer('nota_entregable')->nullable();
            $table->unsignedBigInteger('ID_empresa');
            $table->foreign('ID_empresa')
                ->references('ID_empresa')
                ->on('grupo_empresas')
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
        Schema::dropIfExists('entregables');
    }
}; 