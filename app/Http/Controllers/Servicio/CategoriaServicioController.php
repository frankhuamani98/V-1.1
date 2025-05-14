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
        return Inertia::render('Dashboard/Servicio/AgregarCategoria');
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

        return redirect()->route('servicios.lista')
            ->with('message', 'Categoría de servicio creada exitosamente');
    }

    public function edit(CategoriaServicio $categoriaServicio)
    {
        return Inertia::render('Dashboard/Servicio/AgregarCategoria', [
            'categoria' => $categoriaServicio,
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
                return redirect()->back()
                    ->with('warning', "Esta categoría tiene {$serviciosActivos} servicios activos. Desactivar la categoría afectará la visibilidad de estos servicios en el catálogo público.")
                    ->withInput();
            }
        }

        $categoriaServicio->update($validated);

        return redirect()->route('servicios.lista')
            ->with('message', 'Categoría de servicio actualizada exitosamente');
    }

    public function destroy(CategoriaServicio $categoriaServicio)
    {
        $cantidadServicios = $categoriaServicio->servicios()->count();
        if ($cantidadServicios > 0) {
            $mensaje = "No se puede eliminar la categoría '{$categoriaServicio->nombre}' porque tiene {$cantidadServicios} servicio(s) asociado(s). Debe eliminar primero todos los servicios de esta categoría.";
            
            return back()->withErrors([
                'message' => $mensaje
            ]);
        }

        $categoriaServicio->delete();
        
        return redirect()->route('servicios.lista')
            ->with('message', 'Categoría de servicio eliminada exitosamente');
    }

    public function getAll()
    {
        $categorias = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        return response()->json($categorias);
    }
}