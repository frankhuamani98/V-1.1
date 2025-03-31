<?php

namespace App\Http\Controllers\Categorias;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Subcategoria;
use App\Models\Categoria;
use Illuminate\Http\Request;

class SubcategoriasController extends Controller
{
    /**
     * Muestra la lista de subcategorías.
     */
    public function index()
    {
        $subcategorias = Subcategoria::with('categoria')->get();
        $categorias = Categoria::all();
        return Inertia::render('Dashboard/Categorias/Subcategorias', [ // Asegúrate de que esta ruta sea correcta
            'subcategorias' => $subcategorias,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Guarda una nueva subcategoría en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        Subcategoria::create($request->all());

        return redirect()->route('subcategorias.index')->with('success', 'Subcategoría creada exitosamente.');
    }

    /**
     * Actualiza una subcategoría en la base de datos.
     */
    public function update(Request $request, Subcategoria $subcategoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        $subcategoria->update($request->all());

        return redirect()->route('subcategorias.index')->with('success', 'Subcategoría actualizada exitosamente.');
    }

    /**
     * Elimina una subcategoría de la base de datos.
     */
    public function destroy(Subcategoria $subcategoria)
    {
        $subcategoria->delete();
        return redirect()->route('subcategorias.index')->with('success', 'Subcategoría eliminada exitosamente.');
    }
}