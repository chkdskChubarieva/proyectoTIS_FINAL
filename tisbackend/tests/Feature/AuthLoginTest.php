<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

class AuthLoginTest extends TestCase
{
    use RefreshDatabase;

   


    /** @test */
    public function login_returns_token_on_success()
    {
        Artisan::call('migrate');
        // Crear un usuario de prueba
        $user = User::factory()->create([
            'cod_sis' => '12345678',
            'password' => bcrypt('password123'),
        ]);

        // Hacer la solicitud de inicio de sesión
        $response = $this->postJson('/api/login', [
            'cod_sis' => '12345678',
            'contrasenia' => 'password123',
        ]);

        // Verificar que se recibe un token en la respuesta
        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    /** @test */
    public function login_fails_with_invalid_credentials()
    {
        // Crear un usuario de prueba
        $user = User::factory()->create([
            'cod_sis' => '12345678',
            'password' => bcrypt('password123'),
        ]);

        // Intentar el login con una contraseña incorrecta
        $response = $this->postJson('/api/login', [
            'cod_sis' => '12345678',
            'contrasenia' => 'wrongpassword',
        ]);

        // Verificar que la autenticación falla
        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthorized']);
    }

    /** @test */
    public function redirects_authenticated_user_to_role_route()
    {
        // Crear un usuario con un rol específico (ej., estudiante)
        $user = User::factory()->create([
            'cod_sis' => '12345678',
            'password' => bcrypt('password123'),
            'role' => 'estudiante', // Agregar el rol como atributo o en la base de datos
        ]);

        // Autenticar al usuario
        $this->actingAs($user);

        // Redirigir al usuario según su rol
        $response = $this->get('/login-check');

        $response->assertRedirect('/estudiante'); // O '/docente', según el rol
    }
}
