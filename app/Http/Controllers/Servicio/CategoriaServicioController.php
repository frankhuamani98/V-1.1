<?php

namespace App\Http\Controllers\Servicio;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaServicioController extends Controller
{
    public function create()
    {
        $categorias = CategoriaServicio::orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        return Inertia::render('Dashboard/Servicio/AgregarCategoria', [
            'categorias' => $categorias
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias_servicios',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
            'orden' => 'integer'
        ]);

        CategoriaServicio::create($validated);

        return back();
    }

    public function edit(CategoriaServicio $categoriaServicio)
    {
        $categorias = CategoriaServicio::orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        return Inertia::render('Dashboard/Servicio/AgregarCategoria', [
            'categoria' => $categoriaServicio,
            'categorias' => $categorias,
            'isEditing' => true
        ]);
    }

    public function update(Request $request, CategoriaServicio $categoriaServicio)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias_servicios,nombre,' . $categoriaServicio->id,
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
            'orden' => 'integer'
        ]);

        if ($categoriaServicio->estado && isset($validated['estado']) && !$validated['estado']) {
            $serviciosActivos = $categoriaServicio->servicios()->where('estado', true)->count();
            if ($serviciosActivos > 0) {
                return back()->withErrors(['warning' => "Esta categoría tiene {$serviciosActivos} servicios activos. Desactivar la categoría afectará la visibilidad de estos servicios en el catálogo público."]);
            }
        }

        $categoriaServicio->update($validated);

        return back();
    }

    public function destroy(CategoriaServicio $categoriaServicio)
    {
        $cantidadServicios = $categoriaServicio->servicios()->count();
        if ($cantidadServicios > 0) {
            return back()->withErrors(['message' => "No se puede eliminar la categoría porque tiene servicios asociados."]);
        }

        $categoriaServicio->delete();
        
        return back();
    }

    public function getAll()
    {
        $categorias = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        if (request()->wantsJson()) {
            return response()->json($categorias);
        }
        
        return Inertia::render('Dashboard/Servicio/AgregarCategoria', [
            'categorias' => $categorias
        ]);
    }
}