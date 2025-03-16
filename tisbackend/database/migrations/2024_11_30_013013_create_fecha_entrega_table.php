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
        Schema::create('fecha_entrega', function (Blueprint $table) {
            $table->id('ID_fecha_entregable');
            $table->date('fecha_entregable')->nullable();
            $table->unsignedBigInteger('ID_entregable');
            $table->foreign('ID_entregable')
                ->references('ID_entregable')
                ->on('entregables')
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
        Schema::dropIfExists('fecha_entrega');
    }
};
