<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criterio extends Model
{
    use HasFactory;

    protected $table = 'criterios';
    protected $primaryKey = 'ID_criterio';

    protected $fillable = [
        'ID_criterio',
        'puntos_criterio',
        'titulo_criterio',
        'desc_criterio',
        'ID_rubrica'
    ];
    
    public function rubrica()
    {
        return $this->belongsTo(Rubrica::class, 'ID_rubrica');
    }
}
