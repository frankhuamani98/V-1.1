<?php

namespace App\Http\Controllers\Categorias;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Subcategoria;
use App\Models\Categoria;
use Illuminate\Http\Request;

class SubcategoriasController extends Controller
{
    public function index()
    {
        $subcategorias = Subcategoria::with('categoria')->get();
        $categorias = Categoria::all();
        return Inertia::render('Dashboard/Categorias/Subcategorias', [
            'subcategorias' => $subcategorias,
            'categorias' => $categorias,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        Subcategoria::create($request->all());

        return redirect()->back()->with('success', 'Subcategoría creada exitosamente');
    }

    public function update(Request $request, Subcategoria $subcategoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
            'estado' => 'required|in:Activo,Inactivo,Pendiente',
        ]);

        $subcategoria->update($request->all());

        return redirect()->back()->with('success', 'Subcategoría actualizada exitosamente');
    }

    public function destroy(Subcategoria $subcategoria)
    {
        if ($subcategoria->productos()->count() > 0) {
            return redirect()->back()->with('error', 'No se puede eliminar la subcategoría porque tiene productos asociados');
        }

        $subcategoria->delete();
        return redirect()->back()->with('success', 'Subcategoría eliminada exitosamente');
    }
}