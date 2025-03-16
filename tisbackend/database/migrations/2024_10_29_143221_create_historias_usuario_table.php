<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historias_usuario', function (Blueprint $table) {
            $table->id('ID_historia');
            $table->text('desc_historia');
            $table->string('prioridad')->nullable();
            $table->string('titulo');
            $table->unsignedBigInteger('ID_sprint')->nullable();
            $table->foreign('ID_sprint')->references('ID_sprint')->on('sprint_backlogs')->onDelete('cascade');
           
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historias_usuario');
    }
};

