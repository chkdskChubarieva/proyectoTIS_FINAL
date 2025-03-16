<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;
    protected $table = 'users';
    protected $primaryKey = 'ID_usuario';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre', 'apellido', 'correo', 'contrasenia'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }
    
    public function estudiante(){
        return $this->hasOne(Estudiante::class, 'ID_usuario');
    }

    public function docente(){
        return $this->hasOne(Docente::class, 'ID_usuario');
    }
    
    public function seguimientoEstudiantes(){
        return $this->hasMany(SeguimientoEstudiantes::class, 'ID_usuario');
    }

    public function controlEvaluacion(){
        return $this->hasMany(ControlEvaluacion::class, 'ID_usuario');
    }
}
