<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Producto;
use App\Models\Moto;
use App\Models\Categoria;
use App\Models\Subcategoria;

class ResultadosController extends Controller
{
    public function index()
    {
        $year = request('year');
        $brand = request('brand');
        $model = request('model');

        // Buscar la moto en la base de datos
        $moto = Moto::where('marca', $brand)
                    ->where('modelo', $model)
                    ->first();

        // Obtener productos relacionados
        $productos = [];
        $categorias = [];
        $subcategorias = [];

        if ($moto) {
            // Productos específicos para esta moto con relaciones cargadas
            $productos = Producto::with(['categoria', 'subcategoria', 'moto'])
                ->where('moto_id', $moto->id)
                ->where('estado', 'Activo')
                ->get()
                ->map(function ($producto) {
                    return [
                        'id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'descripcion_corta' => $producto->descripcion_corta,
                        'precio' => $producto->precio,
                        'descuento' => $producto->descuento,
                        'precio_final' => $producto->descuento ? 
                            $producto->precio - ($producto->precio * $producto->descuento / 100) : 
                            $producto->precio,
                        'imagen_principal' => $producto->imagen_principal,
                        'calificacion' => $producto->calificacion,
                        'stock' => $producto->stock > 0 ? 'Disponible' : 'Agotado',
                        'categoria' => $producto->categoria->nombre,
                        'subcategoria' => $producto->subcategoria->nombre,
                        'compatibility' => '100% Compatible'
                    ];
                });

            // Obtener categorías únicas para los filtros
            $categorias = Categoria::whereHas('productos', function($query) use ($moto) {
                    $query->where('moto_id', $moto->id);
                })
                ->with(['subcategorias' => function($query) use ($moto) {
                    $query->whereHas('productos', function($q) use ($moto) {
                        $q->where('moto_id', $moto->id);
                    });
                }])
                ->get()
                ->map(function($categoria) {
                    return [
                        'id' => $categoria->id,
                        'nombre' => $categoria->nombre,
                        'subcategorias' => $categoria->subcategorias->map(function($sub) {
                            return [
                                'id' => $sub->id,
                                'nombre' => $sub->nombre
                            ];
                        })
                    ];
                });

            // Obtener todas las subcategorías para filtros secundarios
            $subcategorias = Subcategoria::whereHas('productos', function($query) use ($moto) {
                    $query->where('moto_id', $moto->id);
                })
                ->pluck('nombre', 'id')
                ->toArray();
        }

        return Inertia::render('Home/Partials/Resultado', [
            'year' => $year,
            'brand' => $brand,
            'model' => $model,
            'productos' => $productos,
            'categorias' => $categorias,
            'subcategorias' => $subcategorias,
            'motoEncontrada' => $moto !== null,
            'motoInfo' => $moto ? [
                'marca' => $moto->marca,
                'modelo' => $moto->modelo,
                'year' => $year
            ] : null
        ]);
    }
}