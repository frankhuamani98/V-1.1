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
    public function index(Request $request)
    {
        $mostrarInactivas = $request->has('mostrar_inactivas');
        
        $query = CategoriaServicio::query();
        
        // Si no se solicita ver inactivas, mostrar solo activas
        if (!$mostrarInactivas) {
            $query->where('estado', true);
        }
        
        $categorias = $query->with(['servicios' => function ($query) use ($mostrarInactivas) {
            // Si no se solicita ver inactivas, mostrar solo servicios activos
            if (!$mostrarInactivas) {
                $query->where('estado', true);
            }
        }])
        ->orderBy('orden')
        ->orderBy('nombre')
        ->get();

        return Inertia::render('Dashboard/Servicio/ListaGeneral', [
            'categorias' => $categorias,
            'mostrarInactivas' => $mostrarInactivas
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
            'nombre' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
                    // Verificar si ya existe un servicio con el mismo nombre en la misma categoría
                    $exists = Servicio::where('nombre', $value)
                        ->where('categoria_servicio_id', $request->categoria_servicio_id)
                        ->exists();
                    
                    if ($exists) {
                        $fail('Ya existe un servicio con este nombre en la categoría seleccionada.');
                    }
                },
            ],
            'descripcion' => 'nullable|string',
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
            'nombre' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request, $servicio) {
                    // Verificar si ya existe un servicio con el mismo nombre en la misma categoría (excepto el actual)
                    $exists = Servicio::where('nombre', $value)
                        ->where('categoria_servicio_id', $request->categoria_servicio_id)
                        ->where('id', '!=', $servicio->id)
                        ->exists();
                    
                    if ($exists) {
                        $fail('Ya existe un servicio con este nombre en la categoría seleccionada.');
                    }
                },
            ],
            'descripcion' => 'nullable|string',
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
        // Verificar si tiene reservas asociadas
        if ($servicio->reservas()->count() > 0) {
            return redirect()->route('servicios.lista')
                ->with('error', 'No se puede eliminar el servicio porque tiene reservas asociadas.');
        }

        $servicio->delete();

        return redirect()->route('servicios.lista')
            ->with('message', 'Servicio eliminado exitosamente');
    }

    /**
     * Helper para mapear servicios al formato necesario.
     */
    private function mapearServicios($servicios)
    {
        return $servicios->map(function ($servicio) {
            return [
                'id' => $servicio->id,
                'nombre' => $servicio->nombre,
                'descripcion' => $servicio->descripcion,
                'categoria_id' => $servicio->categoria_servicio_id,
                'categoria_servicio_id' => $servicio->categoria_servicio_id
            ];
        });
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
            ->get();
            
        $serviciosMapeados = $this->mapearServicios($servicios);

        return Inertia::render('Home/Partials/Servicio/CategoriaServicios', [
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $serviciosMapeados
        ]);
    }

    /**
     * Muestra los servicios de una categoría específica para el público.
     */
    public function publicCategory(CategoriaServicio $categoria)
    {
        // Verificar si la categoría está activa
        if (!$categoria->estado) {
            return redirect()->route('servicios.publico.index')
                ->with('error', 'La categoría seleccionada no está disponible.');
        }
        
        $categoriasServicio = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        // Obtener solo los servicios activos de esta categoría
        $servicios = Servicio::where('estado', true)
            ->where('categoria_servicio_id', $categoria->id)
            ->orderBy('nombre')
            ->get();
        
        $serviciosMapeados = $this->mapearServicios($servicios);

        return Inertia::render('Home/Partials/Servicio/ListaServicios', [
            'categoryId' => $categoria->id,
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $serviciosMapeados,
            'nombreCategoria' => $categoria->nombre,
            'descripcionCategoria' => $categoria->descripcion
        ]);
    }

    /**
     * Muestra los detalles de un servicio específico para el público.
     */
    public function publicShow(Servicio $servicio)
    {
        // Verificar si el servicio está activo
        if (!$servicio->estado) {
            return redirect()->route('servicios.publico.index')
                ->with('error', 'El servicio seleccionado no está disponible.');
        }

        // Verificar si la categoría está activa
        if (!$servicio->categoriaServicio || !$servicio->categoriaServicio->estado) {
            return redirect()->route('servicios.publico.index')
                ->with('error', 'La categoría del servicio no está disponible.');
        }
        
        $servicio->load('categoriaServicio');
        
        $serviciosRelacionados = Servicio::where('estado', true)
            ->where('categoria_servicio_id', $servicio->categoria_servicio_id)
            ->where('id', '!=', $servicio->id)
            ->limit(3)
            ->get();

        return Inertia::render('Home/Partials/Servicio/DetalleServicio', [
            'servicio' => $servicio,
            'serviciosRelacionados' => $serviciosRelacionados
        ]);
    }
}