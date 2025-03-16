<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SprintBacklog;
use App\Models\ProductBacklog;
use App\Models\GrupoEmpresa;

class SprintController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre_sprint' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'ID_empresa' => 'required|exists:grupo_empresas,ID_empresa',
        ]);

        // Find the Product Backlog associated with the given Grupo Empresa
        $productBacklog = ProductBacklog::where('ID_empresa', $validatedData['ID_empresa'])->first();

        if (!$productBacklog) {
            return response()->json(['error' => 'Product backlog not found for this Grupo Empresa'], 404);
        }

        // Create a new Sprint associated with the Product Backlog
        $sprint = SprintBacklog::create([
            'nombre_sprint' => $validatedData['nombre_sprint'],
            'fecha_inicio' => $validatedData['fecha_inicio'],
            'fecha_fin' => $validatedData['fecha_fin'],
            'ID_pb' => $productBacklog->ID_pb, // Associate the Sprint with the Product Backlog
        ]);

        return response()->json(['message' => 'Sprint created successfully', 'sprint' => $sprint], 201);
    }
    public function getSprintDetails($id)
    {
        $sprintBacklog = SprintBacklog::with(['historiasUsuario.tareas'])
            ->where('ID_sprint', $id)
            ->first();

        if (!$sprintBacklog) {
            return response()->json(['success' => false, 'message' => 'Sprint not found.'], 404);
        }

        return response()->json(['success' => true, 'data' => $sprintBacklog]);
    }
}
