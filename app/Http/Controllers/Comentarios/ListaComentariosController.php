<?php

namespace App\Http\Controllers\Comentarios;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ListaComentariosController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Comentarios/ListaComentarios');
    }
}