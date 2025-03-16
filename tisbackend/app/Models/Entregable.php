<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entregable extends Model
{
    use HasFactory;

    protected $table = 'entregables';
    protected $primaryKey = 'ID_entregable';

    protected $fillable = [
        'ID_entregable',
        'nombre_entregable',
        'nota_entregable',
        'ID_empresa'
    ];
    
    public function grupoEmpresa()
    {
        return $this->belongsTo(GrupoEmpresa::class, 'ID_empresa', 'ID_empresa');
    }

    public function rubrica()
    {
        return $this->hasMany(Rubrica::class, 'ID_entregable', 'ID_entregable');
    }

    public function fecha_entregable()
    {
        return $this->hasMany(Fecha_entregable::class, 'ID_entregable', 'ID_entregable');
    }

    public function controlEvaluacion(){
        return $this->hasMany(ControlEvaluacion::class, 'ID_entregable');
    }
}