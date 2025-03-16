<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ControlEvaluacion extends Model
{
    use HasFactory;

    protected $table = 'control_evaluacions';
    protected $primaryKey = 'ID_control_evaluacion';

    protected $fillable = [
        'ID_control_evaluacion',
        'ID_entregable',
        'ID_usuario'
    ];


    public function entregable()
    {
        return $this->belongsTo(Entregable::class, 'ID_entregable');
    }
    
    public function users()
    {
        return $this->belongsTo(User::class, 'ID_usuario');
    }
}
