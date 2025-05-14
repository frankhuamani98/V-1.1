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

        $moto = Moto::where('marca', $brand)
                    ->where('modelo', $model)
                    ->first();

        $productos = [];
        $categorias = [];
        $subcategorias = [];

        if ($moto) {
            $productos = Producto::with(['categoria', 'subcategoria', 'motos'])
                ->whereHas('motos', function($query) use ($moto) {
                    $query->where('motos.id', $moto->id);
                })
                ->where('estado', 'Activo')
                ->get()
                ->map(function ($producto) {
                    return [
                        'id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'descripcion_corta' => $producto->descripcion_corta,
                        'precio' => $producto->precio,
                        'descuento' => $producto->descuento,
                        'precio_final' => (float)($producto->descuento ? 
                            $producto->precio - ($producto->precio * $producto->descuento / 100) : 
                            $producto->precio),
                        'imagen_principal' => $producto->imagen_principal,
                        'calificacion' => $producto->calificacion,
                        'stock' => (int)$producto->stock,
                        'categoria' => $producto->categoria->nombre,
                        'subcategoria' => $producto->subcategoria->nombre,
                        'compatibility' => '100% Compatible'
                    ];
                });

            $categorias = Categoria::whereHas('productos.motos', function($query) use ($moto) {
                    $query->where('motos.id', $moto->id);
                })
                ->with(['subcategorias' => function($query) use ($moto) {
                    $query->whereHas('productos.motos', function($q) use ($moto) {
                        $q->where('motos.id', $moto->id);
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

            $subcategorias = Subcategoria::whereHas('productos.motos', function($query) use ($moto) {
                    $query->where('motos.id', $moto->id);
                })
                ->pluck('nombre', 'id')
                ->toArray();
        }

        $categoriasMenu = Categoria::with(['subcategorias' => function($query) {
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
                        'estado' => $subcategoria->estado
                    ];
                })
            ];
        });

        return Inertia::render('Home/Partials/Productos/Resultado', [
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
            ] : null,
            'categoriasMenu' => $categoriasMenu
        ]);
    }
}