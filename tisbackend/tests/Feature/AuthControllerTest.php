<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Estudiante;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear un usuario de prueba con el rol de estudiante
        $this->user = User::factory()->create([
            'nombre' => 'Juan',
            'apellido' => 'Perez',
            'correo' => 'juan.perez@example.com',
            'contrasenia' => Hash::make('password123'),
        ]);

        // Asignar el rol de estudiante al usuario
        $this->user->assignRole('estudiante');

        // Crear un registro en la tabla estudiantes vinculado al usuario
        Estudiante::factory()->create([
            'ID_usuario' => $this->user->ID_usuario,
            'cod_sis' => '123456789',
            'tipo_est' => 'regular',
            'rol_scrum' => 'developer',
        ]);
    }

    public function test_user_can_login_with_valid_credentials()
    {
        // Enviar solicitud de inicio de sesión
        $response = $this->postJson('/api/v1/auth/login', [
            'correo' => 'juan.perez@example.com',
            'contrasenia' => 'password123',
        ]);

        // Verificar respuesta correcta y token en la estructura de JSON
        $response->assertStatus(200)
                 ->assertJsonStructure(['token']);
    }

    public function test_user_cannot_login_with_invalid_credentials()
    {
        // Enviar solicitud de inicio de sesión con credenciales incorrectas
        $response = $this->postJson('/api/v1/auth/login', [
            'correo' => 'juan.perez@example.com',
            'contrasenia' => 'wrongpassword',
        ]);

        // Verificar que la respuesta sea un error 401 no autorizado
        $response->assertStatus(401)
                 ->assertJson(['message' => 'Credenciales inválidas']);
    }

    public function test_authenticated_user_can_access_protected_route()
    {
        // Autenticar al usuario usando Sanctum para simular un inicio de sesión
        Sanctum::actingAs($this->user);

        // Enviar solicitud a una ruta protegida que requiera autenticación
        $response = $this->getJson('/api/protected-route');

        // Verificar acceso permitido a la ruta protegida
        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_access_protected_route()
    {
        // Enviar solicitud a una ruta protegida sin autenticar al usuario
        $response = $this->getJson('/api/protected-route');

        // Verificar que el acceso es negado con un código de estado 401
        $response->assertStatus(401);
    }
}
