<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    protected $table = 'tareas';
    protected $primaryKey = 'ID_tarea';

    protected $fillable = [
        'estimacion',
        'estado',
        'contenido_tarea',
        'nro_tarea',
        'ID_estudiante',
        'ID_historia',
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'ID_estudiante');
    }

    public function historiaUsuario()
    {
        return $this->belongsTo(HistoriaUsuario::class, 'ID_historia');
    }

    public function user()
    {
        return $this->hasOneThrough(User::class, Estudiante::class, 'ID_estudiante', 'ID_usuario', 'ID_estudiante', 'ID_usuario');
    }
    

}

