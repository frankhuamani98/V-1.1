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
        // Obtener todas las categorías principales
        $categorias = Categoria::all();

        // Obtener todas las subcategorías con su categoría principal asociada
        $subcategorias = Subcategoria::with('categoria')->get();

        // Pasar los datos a la vista
        return Inertia::render('Dashboard/Categorias/ListaCategorias', [
            'categorias' => $categorias,
            'subcategorias' => $subcategorias,
        ]);
    }
}