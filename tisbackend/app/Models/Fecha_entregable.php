<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fecha_entregable extends Model
{
    use HasFactory;

    protected $table = 'fecha_entrega';
    protected $primaryKey = 'ID_fecha_entregable';

    protected $fillable = [
        'ID_fecha_entregable',
        'fecha_entregable',
        'ID_entregable'
    ];
    
    public function entregable()
    {
        return $this->belongsTo(Entregable::class, 'ID_entregable');
    }

    public function seguimientoEstudiantes(){
        return $this->hasMany(SeguimientoEstudiantes::class, 'ID_fecha_entregable', 'ID_fecha_entregable');
    }

    public function retroalimentacion(){
        return $this->hasMany(SeguimientoEstudiantes::class, 'ID_fecha_entregable', 'ID_fecha_entregable');
    }
}
