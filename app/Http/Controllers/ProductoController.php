<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function show($id)
    {
        $producto = Producto::with(['categoria', 'subcategoria', 'motosCompatibles'])
            ->findOrFail($id);

        // Get related products
        $relatedProducts = Producto::where('categoria_id', $producto->categoria_id)
            ->where('id', '!=', $producto->id)
            ->where('estado', 'Activo')
            ->limit(4)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'nombre' => $product->nombre,
                    'precio' => (float)$product->precio,
                    'descuento' => (float)$product->descuento,
                    'imagen_principal' => $product->imagen_principal,
                    'calificacion' => (float)$product->calificacion,
                ];
            });

        return Inertia::render('ProductoDetalle', [
            'producto' => [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'descripcion_corta' => $producto->descripcion_corta,
                'precio' => (float)$producto->precio,
                'descuento' => (float)$producto->descuento,
                'imagen_principal' => $producto->imagen_principal,
                'imagenes_secundarias' => $producto->imagenes_secundarias,
                'calificacion' => (float)$producto->calificacion,
                'stock' => $producto->stock,
                'categoria' => $producto->categoria ? $producto->categoria->nombre : null,
                'subcategoria' => $producto->subcategoria ? $producto->subcategoria->nombre : null,
                'especificaciones' => $producto->especificaciones,
                'motos_compatibles' => $producto->motosCompatibles->map(function ($moto) {
                    return $moto->marca . ' ' . $moto->modelo . ' ' . $moto->año;
                }),
            ],
            'relatedProducts' => $relatedProducts
        ]);
    }
}