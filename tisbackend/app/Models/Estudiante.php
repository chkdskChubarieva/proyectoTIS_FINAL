<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Estudiante extends Model
{
    use HasFactory;

    protected $table = 'estudiantes';
    protected $primaryKey = 'ID_estudiante';

    protected $fillable = [
        'ID_usuario',
        'cod_sis',
        'tipo_est',
        'rol_scrum',
        'ID_empresa'
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class, 'ID_usuario', 'ID_usuario');
    }


    public function users()
{
    return $this->belongsTo(User::class, 'ID_usuario', 'ID_usuario');
}
    public function grupoEmpresa()
    {
        return $this->belongsTo(GrupoEmpresa::class, 'ID_empresa');
    }
    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'ID_estudiante');
    }
}