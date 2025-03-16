<?php

namespace App\Http\Controllers\Api\Docente;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Criterio;
use App\Models\Entregable;
use App\Models\Fecha_entregable;
use App\Models\GrupoEmpresa;
use App\Models\Rubrica;
use App\Models\SeguimientoEstudiantes;
use App\Models\Retroalimentacion;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class EntregableController extends Controller
{

        public function getEntregables($empresaId)
    {
        try {
            $response = ["success" => false];

            // Buscar la grupoempresa con estudiantes y entregables (incluyendo fechas de entregables)
            $grupoEmpresa = GrupoEmpresa::with([
                'estudiantes.user',
                'entregables.fecha_entregable' // Incluye las fechas de los entregables
            ])->where('ID_empresa', $empresaId)->first();

            if (!$grupoEmpresa) {
                return response()->json(['error' => 'Grupo empresa no encontrada'], 404);
            }

            $datosFiltrados = [
                "grupoEmpresa" => [
                    "ID_empresa" => $grupoEmpresa->ID_empresa,
                    "nombre_empresa" => $grupoEmpresa->nombre_empresa,
                    "correo_empresa" => $grupoEmpresa->correo_empresa,
                    "nombre_representante" => $grupoEmpresa->nombre_representante,
                    "telf_representante" => $grupoEmpresa->telf_representante,
                ],
                "nombresEstudiantes" => $grupoEmpresa->estudiantes->map(function ($estudiante) {
                    // Verificar si existe el usuario antes de acceder al nombre, apellido e ID_usuario
                    return $estudiante->user ? [
                        "ID_usuario" => $estudiante->user->ID_usuario,
                        "nombre_completo" => $estudiante->user->nombre . ' ' . $estudiante->user->apellido
                    ] : null;
                })->filter()->toArray(), // Filtra los valores nulos
                "entregables" => $grupoEmpresa->entregables->map(function ($entregable) {
                    return [
                        "ID_entregable" => $entregable->ID_entregable,
                        "nombre_entregable" => $entregable->nombre_entregable,
                        "nota_entregable" => $entregable->nota_entregable,
                        "fechas_entregables" => $entregable->fecha_entregable->map(function ($fecha) {
                            return [
                                "ID_fecha_entregable" => $fecha->ID_fecha_entregable,
                                "fecha_entregable" => $fecha->fecha_entregable,
                            ];
                        })->toArray(),
                    ];
                })->toArray(),
            ];

            // Preparar la respuesta
            $response["success"] = true;
            $response["data"] = $datosFiltrados;

            return response()->json($response, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function exportarDatos($idEmpresa)
{
    try {
        // Obtener los datos de SeguimientoEstudiantes para la empresa
        $seguimientoEstudiantes = SeguimientoEstudiantes::with(['fecha_entregable.entregable.grupoEmpresa', 'users']) // Cargar relaciones
            ->whereHas('fecha_entregable.entregable.grupoEmpresa', function ($query) use ($idEmpresa) {
                $query->where('ID_empresa', $idEmpresa);
            })
            ->get()
            ->groupBy(fn($item) => $item->users->nombre); // Agrupar por nombre del usuario

        // Verificar si hay resultados
        if ($seguimientoEstudiantes->isEmpty()) {
            return response()->json(['error' => 'No se encontraron datos para exportar'], 404);
        }

        // Encabezados dinámicos para fechas y entregables
        $entregables = [];
        foreach ($seguimientoEstudiantes as $grupo) {
            foreach ($grupo as $item) {
                $entregables[$item->fecha_entregable->fecha_entregable] = $item->fecha_entregable->entregable->nombre_entregable;
            }
        }

        $fechas = array_keys($entregables); // Fechas únicas
        $entregablesHeader = array_values($entregables); // Nombres de entregables en orden

        // Crear encabezado del CSV
        $csvHeader = array_merge(
            ['VistaSoft', 'Nombre Estudiante'],
            $fechas,
            ['Nota sumativa', 'Tarde', 'Ausencia justificada', 'Ausencia injustificada']
        );

        // Crear datos para el CSV
        $csvData = [];
        foreach ($seguimientoEstudiantes as $nombreEstudiante => $items) {
            // Inicializar fila con datos comunes
            $row = [
                'VistaSoft' => 'VistaSoft',
                'Nombre Estudiante' => $nombreEstudiante,
            ];

            // Agregar notas según fecha
            foreach ($fechas as $fecha) {
                $nota = $items->firstWhere('fecha_entregable.fecha_entregable', $fecha)?->nota_estudiante ?? 0;
                $row[$fecha] = $nota;
            }

            // Calcular valores sumativos
            $row['Nota sumativa'] = $items->sum('nota_estudiante');
            $row['Tarde'] = $items->sum('retrasos');
            $row['Ausencia justificada'] = $items->sum('ausencias_justificadas');
            $row['Ausencia injustificada'] = $items->sum('ausencias_injustificadas');

            $csvData[] = $row;
        }

        // Generar contenido del CSV
        $csvContent = implode(",", $csvHeader) . "\n";
        foreach ($csvData as $row) {
            $csvContent .= implode(",", $row) . "\n";
        }

        // Nombre del archivo CSV
        $fileName = 'seguimiento_estudiantes_' . $idEmpresa . '.csv';

        // Devolver el archivo CSV como respuesta
        return Response::make($csvContent, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ]);
    } catch (\Exception $e) {
        // Si ocurre algún error, devolvemos una respuesta con el error
        return response()->json([
            'error' => 'Hubo un error al generar el archivo CSV',
            'detalle' => $e->getMessage()
        ], 500);
    }
}


    

public function getSeguimiento($idEmpresa)
{
    // Obtener la empresa según el ID proporcionado
    $grupoEmpresa = GrupoEmpresa::with([
        'entregables.fecha_entregable.seguimientoEstudiantes.users'
    ])->find($idEmpresa);

    // Verificar si existe la empresa
    if (!$grupoEmpresa) {
        return response()->json([
            'message' => 'La empresa no existe'
        ], 404);
    }

    // Obtener todos los seguimientos relacionados
    $seguimientos = $grupoEmpresa->entregables
        ->flatMap(function ($entregable) {
            return $entregable->fecha_entregable->flatMap(function ($fechaEntregable) {
                return $fechaEntregable->seguimientoEstudiantes;
            });
        });

    return response()->json($seguimientos);
}

public function guardarEntregable(Request $request, $idEmpresa)
{
    try {
        // Validar datos del formulario
        $validatedData = $request->validate([
            'nombre_entregable' => 'required|string|max:255',
            'fechas' => 'required|array',
            'fechas.*' => 'required|date',
            'rubricas' => 'required|array',
            'rubricas.*.titulo' => 'required|string|max:255',
            'rubricas.*.descripcion' => 'required|string|max:255',
            'rubricas.*.niveles' => 'required|array',
            'rubricas.*.niveles.*.puntos' => 'required|numeric|min:0',
            'rubricas.*.niveles.*.tituloNivel' => 'required|string|max:255',
            'rubricas.*.niveles.*.descripcionNivel' => 'nullable|string',
        ]);

        // Inicializar variables para calcular la nota total del entregable
        $notaEntregable = 0;

        // Crear el entregable sin asignar la nota todavía
        $entregable = Entregable::create([
            'nombre_entregable' => $validatedData['nombre_entregable'],
            'nota_entregable' => 0, // Temporalmente 0, lo actualizaremos después
            'ID_empresa' => $idEmpresa,
        ]);

        // Crear fechas del entregable y registros en la tabla Retroalimentacion
        foreach ($validatedData['fechas'] as $fecha) {
            $fechaEntregable = Fecha_entregable::create([
                'ID_entregable' => $entregable->ID_entregable,
                'fecha_entregable' => $fecha,
            ]);

            // Crear un registro en la tabla Retroalimentacion para cada fecha
            Retroalimentacion::create([
                'se_hizo' => '',
                'pendiente' => '',
                'ID_fecha_entregable' => $fechaEntregable->ID_fecha_entregable,
                'ID_empresa' => $idEmpresa,
            ]);
        }

        // Crear rúbricas y niveles
        foreach ($validatedData['rubricas'] as $rubricaData) {
            // Calcular la nota de la rúbrica como el puntaje mayor entre todos los niveles
            $notaRubrica = max(array_column($rubricaData['niveles'], 'puntos'));
            $notaEntregable += $notaRubrica; // Sumar la nota de la rúbrica al entregable

            // Crear la rúbrica
            $rubrica = Rubrica::create([
                'ID_entregable' => $entregable->ID_entregable,
                'titulo_rubrica' => $rubricaData['titulo'],
                'desc_rubrica' => $rubricaData['descripcion'],
                'nota_rubrica' => $notaRubrica,
            ]);

            // Crear los niveles de la rúbrica
            foreach ($rubricaData['niveles'] as $nivelData) {
                Criterio::create([
                    'ID_rubrica' => $rubrica->ID_rubrica,
                    'puntos_criterio' => $nivelData['puntos'],
                    'titulo_criterio' => $nivelData['tituloNivel'],
                    'desc_criterio' => $nivelData['descripcionNivel'],
                ]);
            }
        }

        // Actualizar la nota total del entregable
        $entregable->update([
            'nota_entregable' => $notaEntregable,
        ]);

        return response()->json(['success' => true, 'message' => 'Entregable creado exitosamente'], 201);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}


public function getRubricas($idEntregable)
{
    $rubricas = Rubrica::where('ID_entregable', $idEntregable)
        ->with([
            'criterios' => function ($query) {
                $query->select('ID_criterio', 'puntos_criterio', 'titulo_criterio', 'desc_criterio', 'ID_rubrica');
            },
            'entregables' => function ($query) {
                $query->select('ID_entregable', 'nombre_entregable', 'nota_entregable', 'ID_empresa');
            }
        ])
        ->get(['ID_rubrica', 'titulo_rubrica', 'desc_rubrica', 'nota_rubrica', 'ID_entregable']);

    if ($rubricas->isEmpty()) {
        return response()->json([
            'data' => [],
            'message' => 'No se encontraron rúbricas para este entregable.'
        ], 404);
    }

    return response()->json([
        'data' => $rubricas,
        'message' => 'Rúbricas obtenidas con éxito.'
    ], 200);
}

public function asignarNota(Request $request, $ID_entregable)
{
    $validated = $request->validate([
        'nota_estudiante' => 'nullable|numeric|min:0',
        'retroalimentacion' => 'nullable|string|max:240',
        'ID_fecha_entregable' => 'required|integer|exists:fecha_entrega,ID_fecha_entregable',
        'ID_usuario' => 'required|integer|exists:users,ID_usuario',
        'asistencia' => 'required|string|in:puntual,tarde,falta-justificada,falta-injustificada', // Validar el campo asistencia
    ]);

    // Mapear asistencia al campo correspondiente
    $asistencias = 0;
    $retrasos = 0;
    $ausencias_justificadas = 0;
    $ausencias_injustificadas = 0;

    switch ($validated['asistencia']) {
        case 'puntual':
            $asistencias = 1;
            break;
        case 'tarde':
            $retrasos = 1;
            break;
        case 'falta-justificada':
            $ausencias_justificadas = 1;
            break;
        case 'falta-injustificada':
            $ausencias_injustificadas = 1;
            break;
    }

    // Crear un nuevo registro en seguimiento_estudiantes
    $seguimiento = SeguimientoEstudiantes::create([
        'ID_fecha_entregable' => $validated['ID_fecha_entregable'],
        'ID_usuario' => $validated['ID_usuario'],
        'nota_estudiante' => $validated['nota_estudiante'], // Puede ser nulo
        'retroalimentacion' => $validated['retroalimentacion'], // Puede ser nulo
        'asistencias' => $asistencias,
        'retrasos' => $retrasos,
        'ausencias_justificadas' => $ausencias_justificadas,
        'ausencias_injustificadas' => $ausencias_injustificadas,
    ]);

    return response()->json([
        'message' => 'Nota y asistencia creadas correctamente',
        'data' => $seguimiento
    ], 201); // 201 para indicar que se creó un recurso
}


public function verificarEvaluacion(Request $request)
{
    // Validar los datos recibidos
    $request->validate([
        'ID_fecha_entregable' => 'required|integer',
        'ID_usuario' => 'required|integer',
    ]);

    // Buscar en la tabla seguimiento_estudiantes utilizando Eloquent
    $exists = SeguimientoEstudiantes::where('ID_fecha_entregable', $request->ID_fecha_entregable)
        ->where('ID_usuario', $request->ID_usuario)
        ->exists();

    // Retornar la respuesta basada en si se encontraron los datos o no
    return response()->json(['exists' => $exists]);
}

public function mostrarNota($fechaID, $usuarioID)
{
    // Obtiene los registros de seguimiento de acuerdo a la fecha y usuario
    $datos = SeguimientoEstudiantes::where('ID_fecha_entregable', $fechaID)
        ->where('ID_usuario', $usuarioID)
        ->get(); // Devuelve todos los registros que coinciden

    return $datos;
}

public function getRetroalimentacion($fechaEntregableId)
{
    try {
        // Verificar si el ID de fecha entregable existe
        $fechaEntregable = Fecha_entregable::find($fechaEntregableId);

        if (!$fechaEntregable) {
            return response()->json([
                'message' => 'No se encontró la fecha entregable con el ID proporcionado.'
            ], 404);
        }

        // Obtener las retroalimentaciones asociadas usando el modelo Retroalimentacion
        $retroalimentaciones = Retroalimentacion::where('ID_fecha_entregable', $fechaEntregableId)->get();

        // Verificar si existen retroalimentaciones
        if ($retroalimentaciones->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron retroalimentaciones para esta fecha entregable.'
            ], 404);
        }

        // Devolver los resultados con éxito
        return response()->json([
            'retroalimentaciones' => $retroalimentaciones
        ], 200);

    } catch (\Exception $e) {
        // Capturar cualquier error inesperado
        return response()->json([
            'message' => 'Hubo un error al procesar la solicitud.',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function updateRetroalimentacion(Request $request)
{
    // Validar los datos recibidos (opcional pero recomendable)
    $request->validate([
        'ID_retroalimentacion' => 'required|integer|exists:retroalimentacions,ID_retroalimentacion',
        'se_hizo' => 'required|string',
        'pendiente' => 'required|string',
    ]);

    // Buscar el registro a actualizar
    $retroalimentacion = Retroalimentacion::find($request->ID_retroalimentacion);

    if ($retroalimentacion) {
        // Actualizar los campos
        $retroalimentacion->se_hizo = $request->se_hizo;
        $retroalimentacion->pendiente = $request->pendiente;

        // Guardar los cambios
        $retroalimentacion->save();

        return response()->json([
            'message' => 'Retroalimentación actualizada exitosamente.',
            'data' => $retroalimentacion
        ], 200);
    } else {
        return response()->json([
            'message' => 'Retroalimentación no encontrada.'
        ], 404);
    }
}

}
