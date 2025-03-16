<?php
// Archivo: app/Http/Controllers/HistoriaUsuarioController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoriaUsuario;
use Illuminate\Http\Request;
use Validator;

class HistoriaUsuarioController extends Controller
{
    // Método para registrar una nueva historia de usuario
    public function store(Request $request)
    {
        // Validación de los datos
        $validator = Validator::make($request->all(), [
            'desc_historia' => 'required|string|max:255',
            'titulo' => 'required|string|max:255',
            'ID_sprint' => 'required|exists:sprint_backlogs,ID_sprint',
            'prioridad' => 'required|integer|min:1|max:5', // Validación del campo prioridad
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Hubo un error al crear la historia de usuario',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Creación de la historia de usuario
        $historia = HistoriaUsuario::create([
            'desc_historia' => $request->desc_historia,
            'titulo' => $request->titulo,
            'ID_sprint' => $request->ID_sprint,
            'prioridad' => $request->prioridad,
        ]);

        // Respuesta exitosa
        return response()->json([
            'message' => 'Historia de usuario creada con éxito',
            'historia' => $historia,
        ], 201);
    }
}