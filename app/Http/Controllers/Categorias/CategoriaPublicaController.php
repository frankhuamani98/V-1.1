<?php

namespace App\Http\Controllers\Categorias;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Subcategoria;
use App\Models\Producto;
use App\Models\CategoriaServicio;
use App\Models\Servicio;

class CategoriaPublicaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::where('estado', 'Activo')->get();
        
        $categoriasMenu = $this->getCategoriaMenuData();
        $categoriasServicio = $this->getCategoriaServicioData();
        $servicios = $this->getServiciosData();
        
        return Inertia::render('Home/Partials/Categorias/CategoriasLista', [
            'categorias' => $categorias,
            'categoriasMenu' => $categoriasMenu,
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios,
        ]);
    }

    public function show($id)
    {
        $categoria = Categoria::findOrFail($id);
        $subcategorias = Subcategoria::where('categoria_id', $id)
            ->where('estado', 'Activo')
            ->get();
        
        $subcategoriaIds = $subcategorias->pluck('id')->toArray();
        $productos = Producto::whereIn('subcategoria_id', $subcategoriaIds)
            ->activos()
            ->get();
        
        $categoriasMenu = $this->getCategoriaMenuData();
        $categoriasServicio = $this->getCategoriaServicioData();
        $servicios = $this->getServiciosData();
        
        return Inertia::render('Home/Partials/Categorias/CategoriaDetalle', [
            'categoria' => $categoria,
            'subcategorias' => $subcategorias,
            'productos' => $productos,
            'categoriasMenu' => $categoriasMenu,
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios,
        ]);
    }

    private function getCategoriaMenuData()
    {
        return Categoria::with(['subcategorias' => function($query) {
            $query->where('estado', 'Activo');
        }])
        ->where('estado', 'Activo')
        ->get()
        ->map(function ($categoria) {
            return [
                'id' => $categoria->id,
                'nombre' => $categoria->nombre,
                'estado' => $categoria->estado,
                'subcategorias' => $categoria->subcategorias->map(function ($subcategoria) {
                    return [
                        'id' => $subcategoria->id,
                        'nombre' => $subcategoria->nombre,
                        'estado' => $subcategoria->estado,
                        'href' => "/productos/subcategoria/{$subcategoria->id}"
                    ];
                })
            ];
        });
    }

    private function getCategoriaServicioData()
    {
        return CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get()
            ->map(function ($categoria) {
                return [
                    'id' => $categoria->id,
                    'nombre' => $categoria->nombre,
                    'descripcion' => $categoria->descripcion
                ];
            });
    }

    private function getServiciosData()
    {
        return Servicio::where('estado', true)
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
    }
} 