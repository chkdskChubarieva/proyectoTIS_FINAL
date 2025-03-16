<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rubrica extends Model
{
    use HasFactory;

    protected $table = 'rubricas';
    protected $primaryKey = 'ID_rubrica';

    protected $fillable = [
        'ID_rubrica',
        'titulo_rubrica',
        'desc_rubrica',
        'nota_rubrica',
        'ID_entregable'
    ];
    
    public function entregables()
    {
        return $this->belongsTo(Entregable::class, 'ID_entregable');
    }
    
    public function criterios()
    {
        return $this->hasMany(Criterio::class, 'ID_rubrica');
    }
}