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
        Schema::create('control_evaluacions', function (Blueprint $table) {
            $table->id('ID_control_evaluacion');

            $table->unsignedBigInteger('ID_entregable')->nullable();
            $table->foreign('ID_entregable')
                ->references('ID_entregable')
                ->on('entregables')
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
        Schema::dropIfExists('control_evaluacions');
    }
};
