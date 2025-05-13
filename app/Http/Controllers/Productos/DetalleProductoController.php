<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DetalleProductoController extends Controller
{
    public function show($id)
    {
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

        $producto = Producto::with(['categoria', 'subcategoria', 'motos'])
            ->where('estado', 'Activo')
            ->findOrFail($id);

        $productosRelacionados = Producto::where('estado', 'Activo')
            ->where('id', '!=', $id)
            ->where('categoria_id', $producto->categoria_id)
            ->take(4)
            ->get()
            ->map(function ($prod) {return [
                    'id' => $prod->id,
                    'name' => $prod->nombre,
                    'description' => $prod->descripcion_corta,
                    'price' => 'S/'.number_format($prod->precio_final, 2),
                    'originalPrice' => $prod->descuento > 0 ? 'S/'.number_format($prod->precio, 2) : '',
                    'rating' => $prod->calificacion ?? 0,
                    'reviews' => $prod->total_reviews ?? 0,
                    'image' => $prod->imagen_principal,
                    'tag' => $this->getTags($prod),
                    'stock' => $prod->stock,
                    'masVendido' => $prod->mas_vendido ?? false,
                    'destacado' => $prod->destacado ?? false
                ];
            });

        $productoData = [
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'codigo' => $producto->codigo,
            'descripcion' => $producto->detalles,
            'descripcion_corta' => $producto->descripcion_corta,
            'precio' => (float)$producto->precio,
            'descuento' => (float)$producto->descuento,
            'precio_final' => $producto->precio_final,
            'imagen_principal' => $producto->imagen_principal,
            'imagenes_adicionales' => json_decode($producto->imagenes_adicionales) ?? [],
            'calificacion' => $producto->calificacion ?? 0,
            'total_reviews' => $producto->total_reviews ?? 0,
            'stock' => $producto->stock,
            'categoria' => $producto->categoria ? [
                'id' => $producto->categoria->id,
                'nombre' => $producto->categoria->nombre
            ] : null,
            'subcategoria' => $producto->subcategoria ? [
                'id' => $producto->subcategoria->id,
                'nombre' => $producto->subcategoria->nombre
            ] : null,
            'motos_compatibles' => $producto->motos->map(function($moto) {
                return [
                    'id' => $moto->id,
                    'marca' => $moto->marca,
                    'modelo' => $moto->modelo,
                    'año' => $moto->año
                ];
            })
        ];

        return Inertia::render('Home/Partials/Productos/Details', [
            'producto' => $productoData,
            'productosRelacionados' => $productosRelacionados,
            'categoriasMenu' => $categoriasMenu
        ]);
    }

    private function getTags($producto)
    {
        $tags = [];
        if ($producto->destacado) {
            $tags[] = "Nuevo";
        }
        if ($producto->mas_vendido) {
            $tags[] = "Más Vendido";
        }
        if ($producto->descuento > 0) {
            $tags[] = "Oferta";
        }
        if ($producto->stock <= 5) {
            $tags[] = "Últimas unidades";
        }
        return implode(", ", $tags);
    }
}
