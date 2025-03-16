<?php

namespace App\Http\Controllers\Api\Estudiante;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\GrupoEmpresa;
use Illuminate\Http\JsonResponse;

class EstudianteController extends Controller
{
    public function getInfoEst()
    {
        $user = Auth::user();
        $idGrupoEmpresa = $user->estudiante->ID_empresa;
        $datosEmpresa = GrupoEmpresa::where("ID_empresa", $idGrupoEmpresa)->first();
        if (!$datosEmpresa) {
            return response()->json([
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'correo' => $user->correo,
                'cod_sis' => $user->estudiante->cod_sis,
                'datosEmpresa' => null,
                'datosDocente' => null
            ]);
        } else {
            $idDocente = GrupoEmpresa::where("ID_empresa", $idGrupoEmpresa)->first()->ID_docente;
            $datosDocente = Docente::where("ID_docente", $idDocente)->first()->user;
            return response()->json([
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'correo' => $user->correo,
                'cod_sis' => $user->estudiante->cod_sis,
                'datosEmpresa' => $datosEmpresa,
                'datosDocente' => $datosDocente
            ]);
        }
    }

    public function getEmpresas(): JsonResponse
    {
        // Obtener el ID del docente autenticado
        $user = Auth::user();
        $docenteId = $user->docente->ID_docente;

        // Filtrar las grupo empresas según el ID del docente
        $grupoEmpresas = GrupoEmpresa::where('ID_docente', $docenteId)
            ->get(['ID_empresa', 'nombre_empresa', 'correo_empresa', 'logo_empresa']);

        return response()->json($grupoEmpresas);
        $idGrupoEmpresa = $user->estudiante->ID_empresa;
        $datosEmpresa = GrupoEmpresa::where("ID_empresa", $idGrupoEmpresa)->first();
        if (!$datosEmpresa) {
            return response()->json([
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'correo' => $user->correo,
                'cod_sis' => $user->estudiante->cod_sis,
                'datosEmpresa' => null,
                'datosDocente' => null
            ]);
        } else {
            $idDocente = GrupoEmpresa::where("ID_empresa", $idGrupoEmpresa)->first()->ID_docente;
            $datosDocente = Docente::where("ID_docente", $idDocente)->first()->user;
            return response()->json([
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'correo' => $user->correo,
                'cod_sis' => $user->estudiante->cod_sis,
                'datosEmpresa' => $datosEmpresa,
                'datosDocente' => $datosDocente
            ]);
        }
    }

    // public function getEmpresas(): JsonResponse
    // {
    //     // Obtener el ID del docente autenticado
    //     $user = Auth::user();
    //     $docenteId = $user->docente->ID_docente;

    //     // Filtrar las grupo empresas según el ID del docente
    //     $grupoEmpresas = GrupoEmpresa::where('ID_docente', $docenteId)
    //         ->get(['ID_empresa', 'nombre_empresa', 'correo_empresa', 'logo_empresa']);

    //     return response()->json($grupoEmpresas);
    // }


    public function updateGrupoEmpresa(Request $request, $id)
    {
        // Validar la entrada
        $request->validate([
            'ID_empresa' => 'required|exists:grupo_empresas,ID_empresa',
            
        ]);

        $validatedData = $request->validate([
            'ID_empresa' => 'required|exists:grupo_empresas,ID_empresa',
        ]);
        
        try {
        // Buscar al estudiante por su ID
        $estudiante = Estudiante::findOrFail($id);


        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        // Actualizar el ID de la empresa
        $estudiante->ID_empresa = $validatedData['ID_empresa'];
        $estudiante->save();

        return response()->json(['message' => 'ID de empresa actualizado exitosamente', 'estudiante' => $estudiante]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Estudiante no encontrado '], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el ID de empresa', 'error' => $e->getMessage()], 500);
        }
    }



    public function showInfoEstudent(int $id): JsonResponse
    {
        $estudiante = Estudiante::with('user')->find($id);

        if (!$estudiante) {
            return response()->json(['success' => false, 'message' => 'Estudiante no encontrado.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $estudiante,
        ]);
    }

    public function getEstudianteByUserID($ID_usuario)
    {
        // Intentar encontrar un estudiante con el ID_usuario proporcionado
        $estudiante = Estudiante::where('ID_usuario', $ID_usuario)->with(['user', 'grupoEmpresa', 'tareas'])->first();

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

    public function infoEmpresa(): JsonResponse
    {
        $user = Auth::user();
        $empresa_ID = $user->estudiante->ID_empresa;
        
        $empresa = GrupoEmpresa::find($empresa_ID);

        if (!$empresa) {
            return response()->json(['message' => 'Grupo empresa no encontrada'], 404);
        }

        $cantEstudiantes = Estudiante::where('ID_empresa', $empresa_ID)->count();
        
        return response()->json([
            'empresa' => $empresa,
            'cantidad_estudiantes' => $cantEstudiantes,
        ]);
    }
}

