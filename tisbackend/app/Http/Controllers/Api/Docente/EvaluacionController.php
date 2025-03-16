<?php

namespace App\Http\Controllers\Api\Docente;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Criterio;
use App\Models\Entregable;
use App\Models\Fecha_entregable;
use App\Models\GrupoEmpresa;
use App\Models\Rubrica;
use App\Models\Docente;
use App\Models\User;
use App\Models\SeguimientoEstudiantes;
use App\Models\ControlEvaluacion;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\Estudiante;

class EvaluacionController extends Controller
{
    

    public function guardarAutoevaluacion(Request $request)
    {
        $validatedData = $request->validate([
            'ID_usuario' => 'required|exists:users,ID_usuario',
            'nombre_entregable' => 'required|string',
            'fechas' => 'required|date', // Ahora es un solo valor, no un array
            'rubricas.titulo' => 'required|string',
            'rubricas.descripcion' => 'required|string',
            'rubricas.niveles.puntos' => 'required|numeric',
            'rubricas.niveles.tituloNivel' => 'required|string',
            'rubricas.niveles.descripcionNivel' => 'required|string',
        ]);
    
        // Buscar el docente y sus grupoEmpresas
        $docente = Docente::where('ID_usuario', $validatedData['ID_usuario'])->firstOrFail();
    
        if (!$docente) {
            return response()->json(['message' => 'Docente no encontrado'], 404);
        }
    
        $grupoEmpresas = $docente->grupoEmpresas;
    
        foreach ($grupoEmpresas as $grupoEmpresa) {
            $notaEntregable = 0;
    
            // Crear el entregable
            $entregable = Entregable::create([
                'nombre_entregable' => $validatedData['nombre_entregable'],
                'nota_entregable' => 0, // Temporal
                'ID_empresa' => $grupoEmpresa->ID_empresa,
            ]);
    
            // Crear fecha del entregable
            Fecha_entregable::create([
                'ID_entregable' => $entregable->ID_entregable,
                'fecha_entregable' => $validatedData['fechas'],
            ]);
    
            // Crear rúbrica y nivel
            $rubricaData = $validatedData['rubricas'];
            $nivelData = $rubricaData['niveles'];
    
            $notaRubrica = $nivelData['puntos'];
            $notaEntregable += $notaRubrica;
    
            $rubrica = Rubrica::create([
                'ID_entregable' => $entregable->ID_entregable,
                'titulo_rubrica' => $rubricaData['titulo'],
                'desc_rubrica' => $rubricaData['descripcion'],
                'nota_rubrica' => $notaRubrica,
            ]);
    
            Criterio::create([
                'ID_rubrica' => $rubrica->ID_rubrica,
                'puntos_criterio' => $nivelData['puntos'],
                'titulo_criterio' => $nivelData['tituloNivel'],
                'desc_criterio' => $nivelData['descripcionNivel'],
            ]);
    
            // Actualizar la nota del entregable
            $entregable->update([
                'nota_entregable' => $notaEntregable,
            ]);
        }
    
        return response()->json(['message' => 'Entregables asignados exitosamente'], 200);
    }   
    
    public function obtenerEvaluaciones()
{
    // Lista de nombres de entregables que deseamos obtener
    $nombresEntregables = ['Auto Evaluacion', 'Evaluacion Cruzada', 'Evaluacion Pares'];

    // Consultar entregables filtrando por nombres y agrupando para obtener una fila por nombre
    $entregables = Entregable::with(['rubrica'])
        ->whereIn('nombre_entregable', $nombresEntregables)
        ->get()
        ->unique('nombre_entregable') // Asegura que solo haya una fila por nombre
        ->values(); // Re-indexa la colección

    return response()->json($entregables, 200);
}


public function getDatosEstudiante($ID_usuario)
{
    try {
        // Obtener los datos del usuario
        $usuario = User::where('ID_usuario', $ID_usuario)->first();

        // Verificar si el usuario existe
        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        // Estructurar la respuesta
        return response()->json([
            'success' => true,
            'data' => [
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'correo' => $usuario->correo,
                'contrasenia' => $usuario->contrasenia // Solo incluir si es necesario
            ]
        ], 200);
    } catch (\Exception $e) {
        // Manejo de errores
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los datos del usuario',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function asignarNota(Request $request)
{
    $validatedData = $request->validate([
        'nota_estudiante' => 'required|numeric|min:0|max:100',
        'nombre_entregable' => 'required|string',
        'ID_usuario' => 'required|exists:users,ID_usuario',
    ]);

    try {
        // Obtener el entregable según el nombre
        $entregable = Entregable::where('nombre_entregable', $validatedData['nombre_entregable'])->first();

        if (!$entregable) {
            return response()->json([
                'success' => false,
                'message' => 'Entregable no encontrado.',
            ], 404);
        }

        // Obtener la fecha del entregable relacionada
        $fechaEntregable = Fecha_entregable::where('ID_entregable', $entregable->ID_entregable)->first();

        if (!$fechaEntregable) {
            return response()->json([
                'success' => false,
                'message' => 'Fecha del entregable no encontrada.',
            ], 404);
        }

        // Crear el registro en seguimiento_estudiantes
        $seguimiento = SeguimientoEstudiantes::create([
            'nota_estudiante' => $validatedData['nota_estudiante'],
            'retroalimentacion' => "Auto Evaluacion completada", // Puedes agregar un campo de retroalimentación si lo necesitas
            'asistencias' => 1,
            'retrasos' => null,
            'ausencias_justificadas' => null,
            'ausencias_injustificadas' => null,
            'ID_fecha_entregable' => $fechaEntregable->ID_fecha_entregable,
            'ID_usuario' => $validatedData['ID_usuario'],
        ]);

        // Registrar en la tabla ControlEvaluacion
        $controlEvaluacion = ControlEvaluacion::create([
            'ID_entregable' => $entregable ->ID_entregable,
            'ID_usuario' => $validatedData['ID_usuario'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Seguimiento del estudiante registrado exitosamente.',
            'data' => [
                'seguimiento' => $seguimiento,
                'controlEvaluacion' => $controlEvaluacion,
            ],
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Ocurrió un error al registrar el seguimiento del estudiante.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


public function controlAutoEvaluacion(Request $request)
{
    $validatedData = $request->validate([
        'nombre_entregable' => 'required|string',
        'ID_usuario' => 'required|exists:users,ID_usuario',
    ]);

    $nombreEntregable = $validatedData['nombre_entregable'];
    $ID_usuario = $validatedData['ID_usuario'];

    // Buscar el entregable por nombre
    $entregable = Entregable::where('nombre_entregable', $nombreEntregable)->first();

    if (!$entregable) {
        return response()->json([
            'success' => false,
            'message' => 'El entregable no existe.'
        ]);
    }

    // Verificar en control_evaluacions
    $controlEvaluacion = ControlEvaluacion::where('ID_entregable', $entregable->ID_entregable)
        ->where('ID_usuario', $ID_usuario)
        ->first();

    if ($controlEvaluacion) {
        return response()->json([
            'success' => true,
            'message' => 'El usuario está relacionado con el entregable en ControlEvaluacion.'
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'El usuario no está relacionado en ControlEvaluacion para este entregable.'
    ]);
}

public function obtenerEstudiantesGrupo($ID_usuario)
{
    try {
        // Obtener el estudiante actual
        $estudiante = Estudiante::where('ID_usuario', $ID_usuario)->first();

        if (!$estudiante) {
            return response()->json([
                'success' => false,
                'message' => 'Estudiante no encontrado.'
            ], 404);
        }

        // Obtener estudiantes del mismo grupo, excluyendo al actual
        $estudiantesGrupo = Estudiante::where('ID_empresa', $estudiante->ID_empresa)
            ->where('ID_usuario', '!=', $ID_usuario)
            ->with('user')
            ->get();

        // Estructurar respuesta
        $response = $estudiantesGrupo->map(function ($est) {
            return [
                'ID_usuario' => $est->user->ID_usuario,
                'nombre' => $est->user->nombre,
                'apellido' => $est->user->apellido,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $response
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los estudiantes del grupo.',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function guardarNotasPares(Request $request)
{
    // Validar los datos del request
    $validatedData = $request->validate([
        'ID_usuario' => 'required|integer',
        'notaEstudiantes' => 'required|array',
        'notaEstudiantes.*.ID_usuario' => 'required|integer',
        'notaEstudiantes.*.nota_estudiante' => 'required|numeric',
        'notaEstudiantes.*.nombre_entregable' => 'required|string',
    ]);

    // ID del evaluador
    $ID_usuario = $validatedData['ID_usuario'];

    // Obtener el número total de estudiantes
    $numeroEstudiantes = count($validatedData['notaEstudiantes']);

    if ($numeroEstudiantes === 0) {
        return response()->json([
            'success' => false,
            'message' => 'El array de estudiantes está vacío.'
        ], 400);
    }

    // Iterar sobre las notas de los estudiantes
    foreach ($validatedData['notaEstudiantes'] as $notaEstudiante) {
        $nombreEntregable = $notaEstudiante['nombre_entregable'];
        $idUsuarioEstudiante = $notaEstudiante['ID_usuario'];

        // Dividir la nota entre el número de estudiantes
        $notaDividida = $notaEstudiante['nota_estudiante'] / $numeroEstudiantes;

        // Verificar si el entregable existe
        $entregable = Entregable::where('nombre_entregable', $nombreEntregable)->first();
        if (!$entregable) {
            return response()->json([
                'success' => false,
                'message' => "El entregable '$nombreEntregable' no existe."
            ], 404);
        }

        // Obtener la fecha del entregable
        $fechaEntregable = Fecha_entregable::where('ID_entregable', $entregable->ID_entregable)->first();
        if (!$fechaEntregable) {
            return response()->json([
                'success' => false,
                'message' => 'No hay fechas asignadas para este entregable.'
            ], 404);
        }

        // Verificar si ya existe el seguimiento del estudiante
        $seguimiento = SeguimientoEstudiantes::where([
            'ID_usuario' => $idUsuarioEstudiante,
            'ID_fecha_entregable' => $fechaEntregable->ID_fecha_entregable,
        ])->first();

        if ($seguimiento) {
            // Si existe, sumamos la nueva nota a la ya existente
            $seguimiento->nota_estudiante += $notaDividida;
            $seguimiento->save();
        } else {
            // Si no existe, creamos un nuevo registro
            SeguimientoEstudiantes::create([
                'ID_usuario' => $idUsuarioEstudiante,
                'ID_fecha_entregable' => $fechaEntregable->ID_fecha_entregable,
                'nota_estudiante' => $notaDividida, // Guardar la nota dividida
                'retroalimentacion' => "Evaluación a pares",
                'asistencias' => 1,
                'retrasos' => 0,
                'ausencias_justificadas' => 0,
                'ausencias_injustificadas' => 0,
            ]);
        }

        // Verificar o crear el control de evaluación
        ControlEvaluacion::firstOrCreate(
            [
                'ID_entregable' => $entregable->ID_entregable,
                'ID_usuario' => $ID_usuario,
            ]
        );
    }

    return response()->json(['message' => 'Notas guardadas correctamente.'], 200);
}


public function obtenerEmpresas($ID_usuario)
    {
         // Obtener al estudiante asociado al ID_usuario
         $estudiante = Estudiante::with('grupoEmpresa')->where('ID_usuario', $ID_usuario)->first();

         // Validar que el estudiante existe
         if (!$estudiante) {
             return response()->json(['error' => 'Estudiante no encontrado.'], 404);
         }
 
         // Obtener el ID_empresa del estudiante
         $ID_empresa = $estudiante->ID_empresa;
 
         // Obtener al docente asociado a la misma empresa del estudiante
         $docenteID = GrupoEmpresa::where('ID_empresa', $ID_empresa)->value('ID_docente');
 
         // Validar que el docente existe
         if (!$docenteID) {
             return response()->json(['error' => 'Docente no encontrado para este estudiante.'], 404);
         }
 
         // Obtener todas las GrupoEmpresas del docente, excluyendo la del estudiante
         $grupoEmpresas = GrupoEmpresa::where('ID_docente', $docenteID)
             ->where('ID_empresa', '!=', $ID_empresa)
             ->get();
 
         // Retornar las GrupoEmpresas
         return response()->json($grupoEmpresas);
    }

    public function guardarNotasCruzada(Request $request)
{
    // Validar los datos del request
    $validatedData = $request->validate([
        'ID_usuario' => 'required|integer',
        'notasEmpresas' => 'required|array',
        'notasEmpresas.*.ID_empresa' => 'required|integer',
        'notasEmpresas.*.nota' => 'required|numeric',
        'notasEmpresas.*.nombre_entregable' => 'required|string',
    ]);

    // ID del evaluador
    $ID_usuario = $validatedData['ID_usuario'];

    // Iterar sobre las notas asignadas a las empresas
    foreach ($validatedData['notasEmpresas'] as $notaEmpresa) {
        $idEmpresa = $notaEmpresa['ID_empresa'];
        $nota = $notaEmpresa['nota'];
        $nombreEntregable = $notaEmpresa['nombre_entregable'];

        // Verificar si el entregable existe
        $entregable = Entregable::where('nombre_entregable', $nombreEntregable)->first();
        if (!$entregable) {
            return response()->json([
                'success' => false,
                'message' => "El entregable '$nombreEntregable' no existe."
            ], 404);
        }

        // Obtener la fecha del entregable
        $fechaEntregable = Fecha_entregable::where('ID_entregable', $entregable->ID_entregable)->first();
        if (!$fechaEntregable) {
            return response()->json([
                'success' => false,
                'message' => 'No hay fechas asignadas para este entregable.'
            ], 404);
        }

        // Obtener los IDs de los estudiantes relacionados con la empresa
        $miembros = GrupoEmpresa::find($idEmpresa)
            ->estudiantes()
            ->pluck('ID_usuario');

        $numeroMiembros = $miembros->count();

        if ($numeroMiembros === 0) {
            return response()->json([
                'success' => false,
                'message' => "La empresa con ID '$idEmpresa' no tiene miembros asignados."
            ], 400);
        }

        // Calcular la nota promedio
        $notaPromedio = $nota / $numeroMiembros;

        // Asignar la nota a cada miembro
        foreach ($miembros as $idUsuarioEstudiante) {
            $seguimiento = SeguimientoEstudiantes::where([
                'ID_usuario' => $idUsuarioEstudiante,
                'ID_fecha_entregable' => $fechaEntregable->ID_fecha_entregable,
            ])->first();

            if ($seguimiento) {
                // Si ya existe seguimiento, sumamos la nueva nota
                $seguimiento->nota_estudiante += $notaPromedio;
                $seguimiento->save();
            } else {
                // Si no existe, creamos un nuevo seguimiento
                SeguimientoEstudiantes::create([
                    'ID_usuario' => $idUsuarioEstudiante,
                    'ID_fecha_entregable' => $fechaEntregable->ID_fecha_entregable,
                    'nota_estudiante' => $notaPromedio,
                    'retroalimentacion' => "Evaluación Cruzada",
                    'asistencias' => 1,
                    'retrasos' => 0,
                    'ausencias_justificadas' => 0,
                    'ausencias_injustificadas' => 0,
                ]);
            }
        }

        // Verificar o crear el control de evaluación para el evaluador
        ControlEvaluacion::firstOrCreate(
            [
                'ID_entregable' => $entregable->ID_entregable,
                'ID_usuario' => $ID_usuario,
            ]
        );
    }

    return response()->json(['message' => 'Notas guardadas correctamente.'], 200);
}

}