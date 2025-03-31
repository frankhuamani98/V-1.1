<?php

namespace App\Http\Controllers\Soporte;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ManualUsuarioController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Soporte/ManualUsuario');
    }
}