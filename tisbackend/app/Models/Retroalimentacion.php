<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retroalimentacion extends Model
{
    use HasFactory;
    
    protected $table = 'retroalimentacions';
    protected $primaryKey = 'ID_retroalimentacion';

    protected $fillable = [
        'ID_retroalimentacion',
        'se_hizo',
        'pendiente',
        
        'ID_fecha_entregable',
        'ID_empresa'
    ];

    public function fecha_entregable()
    {
        return $this->belongsTo(Fecha_entregable::class, 'ID_fecha_entregable');
    }
    
    public function grupoEmpresa()
    {
        return $this->belongsTo(GrupoEmpresa::class, 'ID_empresa');
    }

}
