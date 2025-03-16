<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Estudiante;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions  ;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Artisan;
class RegisterTest extends TestCase
{   
    use DatabaseTransactions;
    
    /**
     * Configurar roles antes de cada prueba.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Simular roles sin depender de la base de datos
        Role::unguard();
        Artisan::call('migrate');
        Role::create(['name' => 'estudiante']);
        Role::create(['name' => 'docente']);
        Role::reguard();
    }

    /** @test */
    public function it_fails_when_required_fields_are_missing()
    {
        // Intentar enviar una solicitud sin los datos requeridos
        $response = $this->postJson('/api/v1/auth/register', []);

        // Asegurar que devuelve un error de validación
        $response->assertStatus(400)
                 ->assertJsonStructure(['error', 'messages']);
    }

    /** @test */
    public function it_registers_a_user_and_estudiante_correctly()
    {
        // Datos de prueba
        $data = [
            "nombre" => "Juan",
            "apellido" => "Pérez",
            "contrasenia" => "password123",
            "correo" => "202002515@est.umss.edu",
            "cod_sis" => "202002515"
        ];

        // Enviar la solicitud de registro
        $response = $this->postJson('/api/v1/auth/register', $data);

        // Comprobar que la respuesta fue exitosa
        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // Verificar que el usuario se creó correctamente
        $this->assertDatabaseHas('users', [
            'nombre' => $data['nombre'],
            'apellido' => $data['apellido'],
            'correo' => $data['correo']
        ]);

        // Verificar que la contraseña se haya cifrado correctamente
        $user = User::where('correo', $data['correo'])->first();
        $this->assertTrue(Hash::check($data['contrasenia'], $user->contrasenia));

        // Verificar que el estudiante se creó con el ID de usuario correspondiente
        $this->assertDatabaseHas('estudiantes', [
            'cod_sis' => $data['cod_sis'],
            'ID_usuario' => $user->ID_usuario
        ]);

        // Verificar que el rol 'estudiante' se asignó al usuario
        $this->assertTrue($user->hasRole('estudiante'));
    }

    /** @test */
    public function it_fails_with_invalid_email_format()
    {
        $data = [
            "nombre" => "Juan",
            "apellido" => "Pérez",
            "contrasenia" => "password123",
            "correo" => "invalid-email-format",
            "cod_sis" => "12345678",
        ];

        // Intentar enviar la solicitud de registro con un correo inválido
        $response = $this->postJson('/api/v1/auth/register', $data);

        // Comprobar que el sistema devuelva un error de validación
        $response->assertStatus(400)
                 ->assertJsonStructure(['error', 'messages']);
    }
}
