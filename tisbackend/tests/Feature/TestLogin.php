<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Models\User;
use App\Models\Estudiante;

class TestLogin extends TestCase
{
    use RefreshDatabase;

    /**
     * Prueba de inicio de sesión exitoso.
     */
    public function test_login_exitoso(): void
    {
        // Migrar la base de datos
        Artisan::call('migrate');

        // Registrar un usuario y un estudiante
        $registroDatos = [
            'nombre' => 'Juan',
            'apellido' => 'Perez',
            'contrasenia' => 'password123',
            'correo' => 'juan.perez@example.com',
            'cod_sis' => '202002515',
        ];

        $this->postJson('/api/v1/auth/register', $registroDatos)
            ->assertStatus(200); // Confirma que el registro fue exitoso

        // Enviar solicitud POST al endpoint de login
        $loginDatos = [
            'cod_sis' => '202002515',
            'contrasenia' => 'password123',
        ];

        $response = $this->postJson('/api/v1/auth/login', $loginDatos);

        // Verificar que la respuesta tenga un estado 200 y la estructura esperada
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logeado',
            ])
            ->assertJsonStructure(['token', 'user']);
    }

    /**
     * Prueba de inicio de sesión fallido por credenciales incorrectas.
     */
    public function test_login_fallido(): void
    {
        // Migrar la base de datos
        Artisan::call('migrate');

        // Registrar un usuario y un estudiante
        $registroDatos = [
            'nombre' => 'Juan',
            'apellido' => 'Perez',
            'contrasenia' => Hash::make('password123'),
            'correo' => 'juan.perez@example.com',
        ];

        $user = User::create($registroDatos);

        Estudiante::create([
            'cod_sis' => '202002515',
            'tipo_est' => 'regular',
            'rol_scrum' => 'developer',
            'ID_usuario' => $user->ID_usuario,
        ]);

        // Enviar solicitud POST al endpoint de login con contraseña incorrecta
        $response = $this->postJson('/api/v1/auth/login', [
            'cod_sis' => '202002515',
            'contrasenia' => 'wrongpassword',
        ]);

        // Verificar que la respuesta indique error
        $response->assertStatus(200)
            ->assertJson([
                'success' => false,
                'error' => 'Las credenciales no son válidas',
            ]);
    }

    /**
     * Prueba de inicio de sesión fallido por usuario inexistente.
     */
    public function test_login_fallido_usuario_inexistente(): void
    {
        // Migrar la base de datos
        Artisan::call('migrate');

        // Enviar solicitud POST al endpoint de login con un usuario inexistente
        $response = $this->postJson('/api/v1/auth/login', [
            'cod_sis' => '999999999',
            'contrasenia' => 'password123',
        ]);

        // Verificar que la respuesta indique error
        $response->assertStatus(200)
            ->assertJson([
                'success' => false,
                'error' => 'El código SIS no existe',
            ]);
    }
}
