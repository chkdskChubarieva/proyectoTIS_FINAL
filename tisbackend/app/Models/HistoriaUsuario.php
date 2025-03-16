<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriaUsuario extends Model
{
    use HasFactory;

    protected $table = 'historias_usuario';
    protected $primaryKey = 'ID_historia';

    protected $fillable = [
        'desc_historia',
        'titulo',
        'ID_sprint',
        'prioridad',
    ];

    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'ID_historia');
    }

    public function sprintBacklog()
    {
        return $this->belongsTo(SprintBacklog::class, 'ID_sprint');
    }

    public function productBacklog()
    {
        return $this->belongsTo(ProductBacklog::class, 'ID_pb', 'ID_pb');
    }
}

