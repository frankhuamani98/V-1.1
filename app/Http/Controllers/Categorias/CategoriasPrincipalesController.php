<?php

namespace App\Http\Controllers\Categorias;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriasPrincipalesController extends Controller
{
    public function index()
    {
        $categorias = Categoria::all();
        return Inertia::render('Dashboard/Categorias/CategoriasPrincipales', [
            'categorias' => $categorias,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias',
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        Categoria::create($request->all());

        return redirect()->back()->with('success', 'Categoría creada exitosamente');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre,' . $id,
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->all());

        return redirect()->back()->with('success', 'Categoría actualizada exitosamente');
    }

    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        
        if ($categoria->subcategorias()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar la categoría porque tiene subcategorías asociadas');
        }
        
        $categoria->delete();
        return redirect()->back()->with('success', 'Categoría eliminada exitosamente');
    }
}