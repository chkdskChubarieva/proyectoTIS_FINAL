<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeguimientoEstudiantes extends Model
{
    use HasFactory;

    protected $table = 'seguimiento_estudiantes';
    protected $primaryKey = 'ID_seguimiento_estudiantes';

    protected $fillable = [
        'ID_seguimiento_estudiantes',
        'nota_estudiante',
        'retroalimentacion',
        'asistencias',
        'retrasos',
        'ausencias_justificadas',
        'ausencias_injustificadas',
        'ID_fecha_entregable',
        'ID_usuario'
    ];

    public function fecha_entregable()
    {
        return $this->belongsTo(Fecha_entregable::class, 'ID_fecha_entregable');
    }
    
    public function users()
    {
        return $this->belongsTo(User::class, 'ID_usuario');
    }

    
}
