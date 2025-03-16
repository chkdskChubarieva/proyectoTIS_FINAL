<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\GrupoEmpresa;
use App\Models\ProductBacklog;
use App\Models\SprintBacklog;
use App\Models\Estudiante; 
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;


class GrupoEmpresaController extends Controller
{
    public function store(Request $request)
    {
        $grupoEmpresa = GrupoEmpresa::create([
            'nombre_empresa' => $request->nombre_empresa,
            'correo_empresa' => $request->correo_empresa,
            'nombre_representante' => $request->nombre_representante,
            'telf_representante' => $request->telf_representante,
            'ID_docente' => $request->ID_docente,
            'codigo' => $request->codigo,
            'logo_empresa' => $request->logo_empresa
        ]);

        $grupoEmpresa->save();
        ProductBacklog::create([
            'ID_empresa' => $grupoEmpresa->ID_empresa, 
        ]);

        $estudiante = Estudiante::where('ID_usuario', auth()->id())->first();
        if ($estudiante) {
            $estudiante->ID_empresa = $grupoEmpresa->ID_empresa;
            $estudiante->save();
        }

        return response()->json([
            'success' => true,
            'data' => $grupoEmpresa
        ], 201);
    }

    public function getGroupData($code): JsonResponse
    {
        try {
            $grupoEmpresa = GrupoEmpresa::where('codigo', $code)->first();

            if (!$grupoEmpresa) {
                return response()->json(['error' => 'Grupo empresa no encontrado'], 404);
            }

            return response()->json($grupoEmpresa);
        } catch (\Exception $e) {
            \Log::error("Error en getGroupData: " . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function checkCode($code): JsonResponse
    {
        \Log::info("Código recibido: $code");

        $exists = GrupoEmpresa::where('codigo', $code)->exists();

        return response()->json(['isUnique' => !$exists]);
    }

    public function joinGroup(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string',
            'ID_usuario' => 'required|integer|exists:users,ID_usuario'
        ]);

        $grupoEmpresa = GrupoEmpresa::where('codigo', $request->codigo)->first();

        if (!$grupoEmpresa) {
            return response()->json(['success' => false, 'message' => 'Código de grupo no válido.'], 400);
        }

        $estudiante = Estudiante::where('ID_usuario', $request->ID_usuario)->first();
        if (!$estudiante) {
            return response()->json(['success' => false, 'message' => 'Estudiante no encontrado.'], 404);
        }

        $estudiante->ID_empresa = $grupoEmpresa->ID_empresa;
        $estudiante->save();

        return response()->json(['success' => true, 'message' => 'Te has unido al grupo-empresa exitosamente.']);
    }


    public function show($id)
    {
        $grupoEmpresa = GrupoEmpresa::find($id);

        if (!$grupoEmpresa) {
            return response()->json([
                'success' => false,
                'message' => 'Grupo Empresa not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $grupoEmpresa,
        ]);
    }

    public function getHistoriasByGrupoEmpresa($empresaId)
{
    try {
        $grupoEmpresa = GrupoEmpresa::where('ID_empresa', $empresaId)
            ->with('productBacklogs.sprints.historiasUsuario')
            ->first();

        if (!$grupoEmpresa) {
            return response()->json(['error' => 'Grupo empresa no encontrado'], 404);
        }

        // Extraer historias de usuario junto con los datos del sprint
        $historias = $grupoEmpresa->productBacklogs->flatMap(function ($productBacklog) {
            return $productBacklog->sprints->flatMap(function ($sprint) {
                return $sprint->historiasUsuario->map(function ($historia) use ($sprint) {
                    return [
                        'ID_historia' => $historia->ID_historia,
                        'titulo' => $historia->titulo,
                        'descripcion' => $historia->descripcion,
                        // Otros datos de la historia de usuario
                        'sprint' => [
                            'ID_sprint' => $sprint->ID_sprint,
                            'nombre_sprint' => $sprint->nombre_sprint,
                            'fecha_inicio' => $sprint->fecha_inicio,
                            'fecha_fin' => $sprint->fecha_fin,
                            // Otros datos del sprint si es necesario
                        ],
                    ];
                });
            });
        });

        return response()->json($historias, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}



    public function getSprintsByGrupoEmpresa($empresaId)
{
    try {
        $productBacklog = ProductBacklog::where('ID_empresa', $empresaId)->first();

        if (!$productBacklog) {
            return response()->json(['error' => 'Product backlog no encontrado para esta empresa'], 404);
        }

        $sprints = SprintBacklog::where('ID_pb', $productBacklog->ID_pb)->get();

        return response()->json(['sprints' => $sprints], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
    
    public function getEmpresas(): JsonResponse
    {
        // Obtener el ID del docente autenticado
        $user = Auth::user();
        $docenteId =$user->docente->ID_docente;
        
        // Filtrar las grupo empresas según el ID del docente
        $grupoEmpresas = GrupoEmpresa::where('ID_docente', $docenteId)
            ->get(['ID_empresa', 'nombre_empresa', 'correo_empresa', 'logo_empresa']);

        return response()->json($grupoEmpresas);
    }

    public function findEmpresa($id): JsonResponse
    {
        $empresa = GrupoEmpresa::find($id);

        if (!$empresa) {
            return response()->json(['message' => 'Grupo empresa no encontrada'], 404);
        }

        $cantEstudiantes = Estudiante::where('ID_empresa', $id)->count();
                

        
        return response()->json([
            'empresa' => $empresa,
            'cantidad_estudiantes' => $cantEstudiantes,
        ]);
    }
}
