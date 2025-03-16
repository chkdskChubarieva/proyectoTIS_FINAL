<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sprint_backlogs', function (Blueprint $table) {
            $table->id('ID_sprint');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('nombre_sprint');
            $table->unsignedBigInteger('ID_pb');
            $table->foreign('ID_pb')->references('ID_pb')->on('product_backlogs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sprint_backlogs');
    }
};
