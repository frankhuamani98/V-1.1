<?php

namespace App\Http\Controllers\Servicio;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServicio;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicioController extends Controller
{
    /**
     * Muestra la lista general de categorías y servicios.
     */
    public function index()
    {
        $categorias = CategoriaServicio::with(['servicios' => function ($query) {
            $query->where('estado', true);
        }])
        ->orderBy('orden')
        ->orderBy('nombre')
        ->get();

        return Inertia::render('Dashboard/Servicio/ListaGeneral', [
            'categorias' => $categorias
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo servicio.
     */
    public function create()
    {
        $categorias = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Dashboard/Servicio/AgregarServicio', [
            'categorias' => $categorias
        ]);
    }

    /**
     * Almacena un nuevo servicio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio_base' => 'required|numeric|min:0',
            'duracion_estimada' => 'required|integer|min:1',
            'categoria_servicio_id' => 'required|exists:categorias_servicios,id',
            'estado' => 'boolean'
        ]);

        Servicio::create($validated);

        return redirect()->route('servicios.lista')
            ->with('message', 'Servicio creado exitosamente');
    }

    /**
     * Muestra el formulario para editar un servicio.
     */
    public function edit(Servicio $servicio)
    {
        $categorias = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Dashboard/Servicio/AgregarServicio', [
            'servicio' => $servicio,
            'categorias' => $categorias,
            'isEditing' => true
        ]);
    }

    /**
     * Actualiza un servicio.
     */
    public function update(Request $request, Servicio $servicio)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio_base' => 'required|numeric|min:0',
            'duracion_estimada' => 'required|integer|min:1',
            'categoria_servicio_id' => 'required|exists:categorias_servicios,id',
            'estado' => 'boolean'
        ]);

        $servicio->update($validated);

        return redirect()->route('servicios.lista')
            ->with('message', 'Servicio actualizado exitosamente');
    }

    /**
     * Elimina un servicio.
     */
    public function destroy(Servicio $servicio)
    {
        $servicio->delete();

        return redirect()->route('servicios.lista')
            ->with('message', 'Servicio eliminado exitosamente');
    }

    /**
     * Muestra la página pública con todas las categorías de servicios y sus servicios.
     */
    public function publicIndex()
    {
        $categoriasServicio = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        $servicios = Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'descripcion' => $servicio->descripcion,
                    'precio_base' => $servicio->precio_base,
                    'duracion_estimada' => $servicio->duracion_estimada,
                    'categoria_id' => $servicio->categoria_servicio_id,
                    'categoria_servicio_id' => $servicio->categoria_servicio_id
                ];
            });

        return Inertia::render('Home/Partials/Servicio/ServiciosList', [
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios
        ]);
    }

    /**
     * Muestra los servicios de una categoría específica para el público.
     */
    public function publicCategory(CategoriaServicio $categoria)
    {
        $categoriasServicio = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        // Get all active services
        $servicios = Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'descripcion' => $servicio->descripcion,
                    'precio_base' => $servicio->precio_base,
                    'duracion_estimada' => $servicio->duracion_estimada,
                    'categoria_id' => $servicio->categoria_servicio_id,
                    'categoria_servicio_id' => $servicio->categoria_servicio_id
                ];
            });

        // Get services specific to this category
        $serviciosCategoria = Servicio::where('estado', true)
            ->where('categoria_servicio_id', $categoria->id)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Home/Partials/Servicio/CategoryServices', [
            'categoryId' => $categoria->id,
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios,
            'serviciosCategoria' => $serviciosCategoria, // Add this for debugging if needed
            'nombreCategoria' => $categoria->nombre,
            'descripcionCategoria' => $categoria->descripcion
        ]);
    }

    /**
     * Muestra los detalles de un servicio específico para el público.
     */
    public function publicShow(Servicio $servicio)
    {
        $servicio->load('categoriaServicio');
        
        $serviciosRelacionados = Servicio::where('estado', true)
            ->where('categoria_servicio_id', $servicio->categoria_servicio_id)
            ->where('id', '!=', $servicio->id)
            ->limit(3)
            ->get();

        return Inertia::render('Home/Partials/Servicio/ServiceDetail', [
            'servicio' => $servicio,
            'serviciosRelacionados' => $serviciosRelacionados
        ]);
    }
}