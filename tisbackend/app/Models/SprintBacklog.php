<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SprintBacklog extends Model
{
    use HasFactory;

    protected $table = 'sprint_backlogs';
    protected $primaryKey = 'ID_sprint';

    protected $fillable = [
        'fecha_inicio',
        'fecha_fin',
        'nombre_sprint',
        'ID_pb',
    ];

    public function historiasUsuario()
    {
        return $this->hasMany(HistoriaUsuario::class, 'ID_sprint');
    }
   

    
}

