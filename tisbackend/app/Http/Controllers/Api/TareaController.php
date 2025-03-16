<?php
// app/Http/Controllers/Api/TareaController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tarea;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class TareaController extends Controller
{
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'nro_tarea' => 'required|integer',
        'estimacion' => 'required|integer',
        'estado' => 'required|string|max:50',
        'contenido_tarea' => 'required|string',
        'ID_estudiante' => 'required|exists:estudiantes,ID_estudiante',
        'ID_historia' => 'required|exists:historias_usuario,ID_historia',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    $tarea = Tarea::create([
        'nro_tarea' => $request->nro_tarea,
        'estimacion' => $request->estimacion,
        'estado' => $request->estado,
        'contenido_tarea' => $request->contenido_tarea,
        'ID_estudiante' => $request->ID_estudiante,
        'ID_historia' => $request->ID_historia,
    ]);

    return response()->json(['success' => true, 'tarea' => $tarea], 201);
}

    public function tareas(Request $request)
    {
        $ID_estudiante = $request->input('ID_estudiante');
    
        if ($ID_estudiante) {
            $tareas = Tarea::where('ID_estudiante', $ID_estudiante)->with(['estudiante', 'historia'])->get();
        } else {
            $tareas = Tarea::with(['estudiante', 'historia'])->get();
        }
    
        return response()->json([
            'success' => true,
            'data' => $tareas,
        ]);
    }
    
    public function updateEstado(Request $request, $id)
    {
        // Validar que el estado esté presente en la solicitud
        $request->validate([
            'estado' => 'required|string|max:50',
        ]);

        // Buscar la tarea por su ID
        $tarea = Tarea::findOrFail($id);

        // Actualizar el estado de la tarea
        $tarea->estado = $request->estado;
        $tarea->save();

        return response()->json([
            'message' => 'Estado de la tarea actualizado correctamente',
            'tarea' => $tarea
        ], 200);
    }
    

    public function getTasksByUserStory($ID_historia)
    {
        try {
            $tareas = Tarea::where('ID_historia', $ID_historia)->get();

            if ($tareas->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'No hay tareas asociadas a esta historia de usuario'], 404);
            }

            return response()->json(['success' => true, 'tareas' => $tareas], 200);

        } catch (\Exception $e) {
            Log::error('Error en getTasksByUserStory: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => 'Error interno del servidor'], 500);
        }
    }

    public function index()
    {
        $tareas = Tarea::with(['estudiante.user', 'historiaUsuario'])->get();
        return response()->json($tareas);
    }


}
