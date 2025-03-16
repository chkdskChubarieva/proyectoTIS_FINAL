<?php

namespace App\Http\Controllers\Api\Docente;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Docente;
use App\Models\GrupoEmpresa;
use Illuminate\Http\JsonResponse;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getInfoDoc() {
        $user = Auth::user();
        $docenteId =$user->docente->ID_docente;
        
        // Filtrar las grupo empresas según el ID del docente
        $grupoEmpresas = GrupoEmpresa::where('ID_docente', $docenteId)->count();
            
        return response()->json([
            'nombre' => $user->nombre,
            'apellido' => $user->apellido,
            'correo' => $user->correo, 
            'nombre_usuario'=> $user->docente->nombre_usuario,
            'nroGrupoEmpresas'=> $grupoEmpresas,
        ]);
    }

    public function index(): JsonResponse
    {
        $docentes = Docente::with('user')->get();
        
        return response()->json([
            'success' => true,
            'data' => $docentes,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $docente = Docente::with('user')->find($id);

        if (!$docente) {
            return response()->json(['success' => false, 'message' => 'Docente no encontrado.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $docente,
        ]);
    }

    public function getDocenteByUserID($ID_usuario)
    {
        // Intentar encontrar un estudiante con el ID_usuario proporcionado
        $estudiante = Docente::where('ID_usuario', $ID_usuario)->with(['user', 'grupoEmpresas'])->first();

        if ($estudiante) {
            return response()->json([
                'success' => true,
                'data' => $estudiante,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Estudiante no encontrado con el ID de usuario proporcionado.',
            ], 404);
        }  
    }


    /**
     * Store a newly created resource in storage.
     */
    
}
