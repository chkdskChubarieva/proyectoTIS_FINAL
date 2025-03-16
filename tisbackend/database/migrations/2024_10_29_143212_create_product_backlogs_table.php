<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_backlogs', function (Blueprint $table) {
            $table->id('ID_pb');
            $table->unsignedBigInteger('ID_empresa');

            $table->foreign('ID_empresa')->references('ID_empresa')->on('grupo_empresas')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_backlogs');
    }
};
