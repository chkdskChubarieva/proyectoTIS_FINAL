<?php

use App\Http\Controllers\Api\FrontController;
use Illuminate\Http\Request;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Estudiante\EmpresaController;
use App\Http\Controllers\Api\Docente\EmpresaController as EmpresaDocente;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Controllers\Api\Estudiante\EstudianteController;

use App\Http\Controllers\Api\Docente\DocenteController;
use App\Http\Controllers\Api\Docente\EntregableController;
use App\Http\Controllers\Api\GrupoEmpresaController;
use App\Http\Controllers\Api\TareaController;
use App\Http\Controllers\Api\ProductBacklogController;
use App\Http\Controllers\Api\HistoriaUsuarioController;
use App\Http\Controllers\Api\SprintController;
use App\Http\Controllers\Api\Docente\EvaluacionController;
//Rutas publicas

Route::prefix('v1')->group(function () {

    //:public
    //Route::get('list', [FrontController::class, 'list']);
    //:auth
    Route::post("/auth/register", [AuthController::class, 'register']);
    Route::post("/auth/registerDoc", [AuthController::class, 'registerDoc']);
    Route::post("/auth/login", [AuthController::class, 'login']);
    Route::post("/auth/loginDoc", [AuthController::class, 'loginDoc']);

    
    
    Route::put('/estudiantes/{id}/grupo-empresa', [GrupoEmpresaController::class, 'joinGroup']);
    
    // Route::get('/tareas', [TareaController::class, 'tareas']);
    
    Route::middleware('auth:sanctum')->get('/auth/user', [AuthController::class, 'getAuthenticatedUser']);
    //Rutas privadas
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/autoEvaluacion/asignarNota', [EvaluacionController::class, 'asignarNota']);
        Route::post('/autoEvaluacion/controlAutoEvaluacion', [EvaluacionController::class, 'controlAutoEvaluacion']);
        Route::post('/evaluacionPares/guardarNotasPares', [EvaluacionController::class, 'guardarNotasPares']);
        Route::post('/evaluacionCruzada/guardarNotasCruzada', [EvaluacionController::class, 'guardarNotasCruzada']);
        

        Route::get('/estudiante/getInfoEst', [EstudianteController::class, 'getInfoEst']);  
        Route::get('/estudiante/info', [EstudianteController::class, 'infoEmpresa']);
        Route::get('/estudiante/{id}', [EstudianteController::class, 'getEstudianteByUserID']);
        Route::get('/estudiante/{id}/getDatosEstudiante', [EvaluacionController::class, 'getDatosEstudiante']);
        Route::get('/estudiante/{id}/getEstudiantesGrupo', [EvaluacionController::class, 'obtenerEstudiantesGrupo']);
        Route::get('/estudiante/{id}/getEmpresas', [EvaluacionController::class, 'obtenerEmpresas']);

        Route::get('/estudiante-info/{id}', [EstudianteController::class, 'showInfoEstudent']);

        Route::post('/tarea', [TareaController::class, 'store']);
        
        Route::get('/product-backlogs/{ID_pb}/estudiantes', [ProductBacklogController::class, 'obtenerEstudiantesPorBacklog']);
      
        Route::get('/obtener-productbacklog/{idEstudiante}', [ProductBacklogController::class, 'obtenerProductBacklogId']);
        //VISTA ESTUDIANTE
        
        
        // //Route::get('/estudiantes', [EstudianteController::class, 'index']);
        // Route::get('/estudiante/{id}', [EstudianteController::class, 'getEstudianteByUserID']);
        Route::get('/estudiantes/usuario/{ID_usuario}', [EstudianteController::class, 'getEstudianteByUserID']);
        Route::get('/estudiantes-grupo', [EstudianteController::class, 'getEstudiantesMismoGrupo']);

        Route::get('/grupo-empresa/data/{code}', [GrupoEmpresaController::class, 'getGroupData']);
        Route::get('/product-backlog/{idEmpresa}', [ProductBacklogController::class, 'getBacklogByEmpresa']);
        Route::post('/product-backlog/register', [ProductBacklogController::class, 'register']);

        Route::get('/sprints/{id}/details', [SprintController::class, 'getSprintDetails']);
        
        Route::post('grupo-empresa/guardar-autoevaluacion', [EvaluacionController::class, 'guardarAutoevaluacion']);

        Route::put('grupo-empresa/UpdateRetroalimentacion', [EntregableController::class, 'updateRetroalimentacion']);


        Route::get('grupo-empresa/{empresaId}/exportarDatos', [EntregableController::class, 'exportarDatos']);
        Route::get('grupo-empresa/{empresaId}/sprints', [GrupoEmpresaController::class, 'getSprintsByGrupoEmpresa']);
        Route::get('grupo-empresa/{empresaId}/historias', [GrupoEmpresaController::class, 'getHistoriasByGrupoEmpresa']);
        Route::get('grupo-empresa/{empresaId}/evaluacion', [EntregableController::class, 'getEntregables']);
        Route::get('grupo-empresa/{empresaId}/seguimientoEstudiantes', [EntregableController::class, 'getSeguimiento']);
        Route::post('grupo-empresa/{empresaId}/guardar-entregable', [EntregableController::class, 'guardarEntregable']);
        Route::get('grupo-empresa/{entregableId}/mostrarRubricas', [EntregableController::class, 'getRubricas']);
        Route::post('grupo-empresa/{entregableId}/asignarNota', [EntregableController::class, 'asignarNota']);
        Route::post('grupo-empresa/{empresaId}/verificarEvaluacion', [EntregableController::class, 'verificarEvaluacion']);

        Route::get('grupo-empresa/{fechaEntregableId}/getRetroalimentacion', [EntregableController::class, 'getRetroalimentacion']);


        Route::get('grupo-empresa/{fechaID}/{usuarioID}/mostrarNota', [EntregableController::class, 'mostrarNota']);
        Route::get('/docente/evaluaciones', [EvaluacionController::class, 'obtenerEvaluaciones']);




        Route::post('/sprints', [SprintController::class, 'store']);
        Route::post('/historias', [HistoriaUsuarioController::class, 'store']);

        //Route::middleware('auth:api')->get('/estudiantes-grupo', [EstudianteController::class, 'getEstudiantesMismoGrupo']);
        
        Route::post('/grupo-empresa/join', [GrupoEmpresaController::class, 'joinGroup']);
        

        Route::get('/estudiantes/{id}/grupo-empresa/getInfoPb', [GrupoEmpresaController::class, 'getInfoPb']);
        Route::get('/grupo-empresa/{id}', [GrupoEmpresaController::class, 'show']);
        Route::post("/grupo-empresa/register", [GrupoEmpresaController::class, 'store']);
        Route::get('/grupo-empresa/check-code/{code}', [GrupoEmpresaController::class, 'checkCode']);
        
        Route::patch('/tareas/{id}/estado', [TareaController::class, 'updateEstado']);

        Route::get('/docentes', [DocenteController::class, 'index']);
        Route::get('/docentes/usuario/{ID_usuario}', [DocenteController::class, 'getDocenteByUserID']);
        Route::get('/docentes/{id}', [DocenteController::class, 'show']);






        Route::get('/docente/empresas', [GrupoEmpresaController::class, 'getEmpresas']);
        Route::get('/docente/empresas/{id}', [GrupoEmpresaController::class, 'findEmpresa']);
        //:: rol estudiante
        //Route::apiResource('/estudiante/getInfoEst', EstudianteController::class);

        Route::apiResource('/estudiante/empresa', EmpresaController::class);

        //:: rol docente
        Route::get('/docente/getInfoDoc', [DocenteController::class, 'getInfoDoc']);
        Route::apiResource('/docente/empresa', EmpresaDocente::class);

        //::auth
        Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    });
});

Route::middleware([
    EnsureFrontendRequestsAreStateful::class,
    'auth:sanctum'
])->get('/user', function (Request $request) {
    return $request->user();
});

//Route::middleware(['cors'])->group(function () {
    //Route::get('/example', 'ExampleController@index');
//});