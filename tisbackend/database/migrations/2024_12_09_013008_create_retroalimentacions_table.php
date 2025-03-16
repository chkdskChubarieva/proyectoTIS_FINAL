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
        Schema::create('retroalimentacions', function (Blueprint $table) {
            $table->id("ID_retroalimentacion");
            $table->Text("se_hizo");
            $table->Text("pendiente");
            
            $table->unsignedBigInteger('ID_fecha_entregable')->nullable();
            $table->foreign('ID_fecha_entregable')
                ->references('ID_fecha_entregable')
                ->on('fecha_entrega')
                ->onDelete('cascade')
                ->onUpdate('cascade');
                
            $table->unsignedBigInteger('ID_empresa')->nullable();
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
        Schema::dropIfExists('retroalimentacions');
    }
};
