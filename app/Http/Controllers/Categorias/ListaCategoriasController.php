<?php

namespace App\Http\Controllers\Categorias;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Subcategoria;

class ListaCategoriasController extends Controller
{
    public function index()
    {
        $categorias = Categoria::all();

        $subcategorias = Subcategoria::with('categoria')->get();

        return Inertia::render('Dashboard/Categorias/ListaCategorias', [
            'categorias' => $categorias,
            'subcategorias' => $subcategorias,
        ]);
    }
}