<?php

namespace App\Http\Controllers\Categorias;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriasPrincipalesController extends Controller
{
    // Método para mostrar la vista y listar categorías
    public function index()
    {
        $categorias = Categoria::all(); // Obtener todas las categorías
        return Inertia::render('Dashboard/Categorias/CategoriasPrincipales', [
            'categorias' => $categorias,
        ]);
    }

    // Método para guardar una nueva categoría
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias',
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        Categoria::create([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
        ]);

        return redirect()->route('categorias.principales')->with('success', 'Categoría creada exitosamente.');
    }

    // Método para actualizar una categoría
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre,' . $id,
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        $categoria = Categoria::findOrFail($id);
        $categoria->update([
            'nombre' => $request->nombre,
            'estado' => $request->estado,
        ]);

        return redirect()->route('categorias.principales')->with('success', 'Categoría actualizada exitosamente.');
    }

    // Método para eliminar una categoría
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return redirect()->route('categorias.principales')->with('success', 'Categoría eliminada exitosamente.');
    }
}