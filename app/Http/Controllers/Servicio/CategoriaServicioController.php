<?php

namespace App\Http\Controllers\Servicio;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaServicioController extends Controller
{
    /**
     * Muestra el formulario para crear una nueva categoría de servicio.
     */
    public function create()
    {
        return Inertia::render('Dashboard/Servicio/AgregarCategoria');
    }

    /**
     * Almacena una nueva categoría de servicio.
     */
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

    /**
     * Muestra el formulario para editar una categoría de servicio.
     */
    public function edit(CategoriaServicio $categoriaServicio)
    {
        return Inertia::render('Dashboard/Servicio/AgregarCategoria', [
            'categoria' => $categoriaServicio,
            'isEditing' => true
        ]);
    }

    /**
     * Actualiza una categoría de servicio.
     */
    public function update(Request $request, CategoriaServicio $categoriaServicio)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias_servicios,nombre,' . $categoriaServicio->id,
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
            'orden' => 'integer'
        ]);

        $categoriaServicio->update($validated);

        return redirect()->route('servicios.lista')
            ->with('message', 'Categoría de servicio actualizada exitosamente');
    }

    /**
     * Elimina una categoría de servicio.
     */
    public function destroy(CategoriaServicio $categoriaServicio)
    {
        $categoriaServicio->delete();

        return redirect()->route('servicios.lista')
            ->with('message', 'Categoría de servicio eliminada exitosamente');
    }

    /**
     * Obtiene todas las categorías de servicio para listas desplegables.
     */
    public function getAll()
    {
        $categorias = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        return response()->json($categorias);
    }
}