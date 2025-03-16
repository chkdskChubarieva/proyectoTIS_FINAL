<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
class FrontController extends Controller
{
    function list(){
        return response()->json(['message' => 'Hola, este es un mensaje de prueba'], 200);
    }
}
