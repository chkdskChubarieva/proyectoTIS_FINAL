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
        Schema::create('criterios', function (Blueprint $table) {
            $table->id('ID_criterio');
            $table->Integer('puntos_criterio')->nullable();
            $table->string('titulo_criterio')->nullable();
            $table->string('desc_criterio')->nullable();
            $table->unsignedBigInteger('ID_rubrica');
            $table->foreign('ID_rubrica')
                ->references('ID_rubrica')
                ->on('rubricas')
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
        Schema::dropIfExists('criterios');
    }
};