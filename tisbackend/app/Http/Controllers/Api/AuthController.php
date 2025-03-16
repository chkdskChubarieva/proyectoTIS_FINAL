<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Estudiante;
use App\models\Docente;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Hashing\HashManager;


class AuthController extends Controller

{
    public function register(Request $request)
    {
        $response = ["success"=>false];
        // Validaciones

        $validator = Validator::make($request->all(), [
            "nombre"=> "required",
            "apellido"=> "required",
            "contrasenia"=> "required",
            "correo" => "required|email",
        ]);

        if ($validator->fails()) {
            return response()->json([
                "error" => true,
                "messages" => $validator->errors()
            ], 400); // 400 Bad Request indica un error de validación
        }
        
        
        $input = $request->all();

        // Verificar si el cod_sis ya existe en la tabla 'estudiantes'
        $existingStudent = Estudiante::where('cod_sis', $input['cod_sis'])->first();

        if ($existingStudent) {
            return response()->json([
                "cod_sis" => true
            ]);
        }

        // Cifrar la contraseña
        $input["contrasenia"] = bcrypt($input['contrasenia']);
        
        // Insertar datos en la tabla 'users'
        $user = User::create([
            'nombre' => $input['nombre'],
            'apellido' => $input['apellido'],
            'correo' => $input['correo'],
            'contrasenia' => $input['contrasenia'],
        ]);

        $user->save();
        
        // Insertar datos en la tabla 'estudiantes' usando el ID del usuario creado
        Estudiante::create([
            'cod_sis' => $input['cod_sis'],
            'tipo_est' => $input['tipo_est'] ?? null,
            'rol_scrum' => $input['rol_scrum'] ?? null,
            'ID_empresa' => $input['ID_empresa'] ?? null,
            'ID_usuario' => $user->ID_usuario, // Relacionar con la tabla 'users'
        ]);

        // Asignar el rol de estudiante al usuario creado
        $user->assignRole('estudiante');
        $response["success"] = true;
        //$response["token"] = $user->createToken("Tis")->plainTextToken;
        return response()->json($response, 200);
    }

    public function registerDoc(Request $request)
    {
        $response = ["success"=>false];
        // Validaciones

        $validator = Validator::make($request->all(), [
            "nombre"=> "required",
            "apellido"=> "required",
            "contrasenia"=> "required",
            "correo" => "required|email",
        ]);

        if($validator->fails()){
            $response = ["error"=>"false"];
            return response()->json($response, 200);
        }
        
        $input = $request->all();
        // Cifrar la contraseña
        $input["contrasenia"] = bcrypt($input['contrasenia']);
        
        // Insertar datos en la tabla 'users'
        $user = User::create([
            'nombre' => $input['nombre'],
            'apellido' => $input['apellido'],
            'correo' => $input['correo'],
            'contrasenia' => $input['contrasenia'],
        ]);

        $user->save();
        
        // Insertar datos en la tabla 'estudiantes' usando el ID del usuario creado
        Docente::create([
            'nombre_usuario' => $input['nombre_usuario'],
            'ID_usuario' => $user->ID_usuario, // Relacionar con la tabla 'users'
        ]);

        // Asignar el rol de estudiante al usuario creado
        $user->assignRole('docente');
        $response["success"] = true;
        //$response["token"] = $user->createToken("Tis")->plainTextToken;
        return response()->json($response, 200);
    }

    public function login(Request $request)
{
    $response = ["success" => false];

    // Validaciones
    $validator = Validator::make($request->all(), [
        'cod_sis' => 'required',
        'contrasenia' => 'required',
    ]);

    if ($validator->fails()) {
        $response = ["error" => $validator->errors()];
        return response()->json($response, 200);
    }

    // Buscar al estudiante por su cod_sis
    $estudiante = Estudiante::where('cod_sis', $request->cod_sis)->first();

    if (!$estudiante) {
        $response['error'] = 'El código SIS no existe';
        return response()->json($response, 200);
    }

    // Buscar al usuario relacionado con el estudiante
    $user = User::find($estudiante->ID_usuario);

    if (!$user || !Hash::check($request->contrasenia, $user->contrasenia)) {
        $response['error'] = 'Las credenciales no son válidas';
        return response()->json($response, 200);
    }

    // Verificar si el usuario tiene el rol de estudiante
    if (!$user->hasRole('estudiante')) {
        $response['error'] = 'El usuario no tiene el rol de estudiante';
        return response()->json($response, 200);
    }

    // Crear token de acceso
    $response['token'] = $user->createToken("proyectoTIS")->plainTextToken;
    $response['user'] = $user;
    $response['success'] = true;
    $response['message'] = "Logeado";
    return response()->json($response, 200);
    } 

    
    
    public function loginDoc(Request $request)
{
    $response = ["success" => false];

    // Validaciones
    $validator = Validator::make($request->all(), [
        'nombre_usuario' => 'required',
        'contrasenia' => 'required',
    ]);

    if ($validator->fails()) {
        $response = ["error" => $validator->errors()];
        return response()->json($response, 200);
    }

    // Buscar al docente por su cod_sis
    $docente = Docente::where('nombre_usuario', $request->nombre_usuario)->first();

    if (!$docente) {
        $response['error'] = 'El nombre de usuario no existe';
        return response()->json($response, 200);
    }

    // Buscar al usuario relacionado con el docente
    $user = User::find($docente->ID_usuario);

    if (!$user || !Hash::check($request->contrasenia, $user->contrasenia)) {
        $response['error'] = 'Las credenciales no son válidas';
        return response()->json($response, 200);
    }

    // Verificar si el usuario tiene el rol de estudiante
    if (!$user->hasRole('docente')) {
        $response['error'] = 'El usuario no tiene el rol de docente';
        return response()->json($response, 200);
    }

    // Crear token de acceso
    $response['token'] = $user->createToken("proyectoTIS")->plainTextToken;
    $response['user'] = $user;
    $response['success'] = true;
    $response['message'] = "Logeado";
    return response()->json($response, 200);
    }

    public function logout(Request $request)
{
    $response = ["success" => false];

    if (auth::check()) { // Verificar si el usuario está autenticado
        // Revocar/eliminar el token actual del usuario
        $request->user()->currentAccessToken()->delete();

        $response = ["success"=>true, "message"=> "Sesión cerrada"];
        return response()->json($response, 200);
    }

    $response["error"] = "No hay usuario autenticado";
    return response()->json($response, 401); // 401 Unauthorized si no hay usuario autenticado
}


public function getAuthenticatedUser()
    {
        if (Auth::check()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'ID_usuario' => Auth::user()->id,
                    'nombre' => Auth::user()->name,
                ],
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No autenticado'], 401);
    }
}