<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Estudiante;  // Asegúrate de importar el modelo Estudiante

class GrupoEmpresa extends Model
{
    use HasFactory;

    protected $table = 'grupo_empresas';
    protected $primaryKey = 'ID_empresa';
    public $timestamps = true;

    protected $fillable = [
        'nombre_empresa',
        'correo_empresa',
        'nombre_representante',
        'telf_representante',
        'ID_docente',
        'codigo',
        'logo_empresa'
    ];

    public function productBacklog()
     {
         return $this->hasOne(ProductBacklog::class, 'ID_empresa');
    }

    // Relación con Estudiantes
    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class, 'ID_empresa', 'ID_empresa');
    }
    

    public function grupoEmpresa()
{
    return $this->belongsTo(GrupoEmpresa::class, 'ID_empresa', 'ID_empresa');
}
    public function productBacklogs()
    {
        return $this->hasMany(ProductBacklog::class, 'ID_empresa', 'ID_empresa');
    }

    public function entregables()
    {
        return $this->hasMany(Entregable::class, 'ID_empresa', 'ID_empresa');
    }

    public function retroalimentacion()
    {
        return $this->hasMany(Retroalimentacion::class, 'ID_empresa', 'ID_empresa');
    }
}

// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Grupo_Empresa extends Model
// {
//     use HasFactory;
//     protected $guarded = [];
//     protected $table = 'grupo_empresas';
//     public function docente()
//     {
//         return $this->belongsTo(Docente::class, 'ID_docente');
//     }

//     public function estudiante()
//     {
//         return $this->hasMany(Estudiante::class, 'ID_empresa');
//     }

// }
