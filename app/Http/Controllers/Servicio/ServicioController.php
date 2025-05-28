<?php

namespace App\Http\Controllers\Servicio;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServicio;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicioController extends Controller
{
    public function index(Request $request)
    {
        $mostrarInactivas = $request->has('mostrar_inactivas');
        
        $query = CategoriaServicio::query();
        
        if (!$mostrarInactivas) {
            $query->where('estado', true);
        }
        
        $categorias = $query->with(['servicios' => function ($query) use ($mostrarInactivas) {
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request) {
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

    public function update(Request $request, Servicio $servicio)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($request, $servicio) {
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

    public function destroy(Servicio $servicio)
    {
        if ($servicio->reservas()->count() > 0) {
            return redirect()->route('servicios.lista')
                ->with('error', 'No se puede eliminar el servicio porque tiene reservas asociadas.');
        }

        $servicio->delete();

        return redirect()->route('servicios.lista')
            ->with('message', 'Servicio eliminado exitosamente');
    }

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

    public function publicCategory(CategoriaServicio $categoria)
    {
        if (!$categoria->estado) {
            return redirect()->route('servicios.publico.index')
                ->with('error', 'La categoría seleccionada no está disponible.');
        }
        
        $categoriasServicio = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
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

    public function publicShow(Servicio $servicio)
    {
        if (!$servicio->estado) {
            return redirect()->route('servicios.publico.index')
                ->with('error', 'El servicio seleccionado no está disponible.');
        }

        $servicio = Servicio::with(['categoriaServicio' => function($query) {
            $query->select('id', 'nombre', 'estado');
        }])->find($servicio->id);
        
        if (!$servicio->categoriaServicio || !$servicio->categoriaServicio->estado) {
            return redirect()->route('servicios.publico.index')
                ->with('error', 'La categoría del servicio no está disponible.');
        }
        
        $categoria = CategoriaServicio::find($servicio->categoria_servicio_id);
        
        $servicioData = [
            'id' => $servicio->id,
            'nombre' => $servicio->nombre,
            'descripcion' => $servicio->descripcion,
            'categoria_servicio_id' => $servicio->categoria_servicio_id,
            'categoriaServicio' => [
                'id' => $categoria->id,
                'nombre' => $categoria->nombre,
                'estado' => $categoria->estado
            ]
        ];
        
        $serviciosRelacionados = Servicio::where('estado', true)
            ->where('categoria_servicio_id', $servicio->categoria_servicio_id)
            ->where('id', '!=', $servicio->id)
            ->limit(3)
            ->get();

        return Inertia::render('Home/Partials/Servicio/DetalleServicio', [
            'servicio' => $servicioData,
            'serviciosRelacionados' => $serviciosRelacionados
        ]);
    }
}