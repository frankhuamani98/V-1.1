<?php

namespace App\Http\Controllers\Productos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Product;

class InventarioProductosController extends Controller
{
    public function index()
    {
        $productos = Product::with('images')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'codigo' => 'PROD-' . str_pad($product->id, 5, '0', STR_PAD_LEFT),
                    'nombre' => $product->nombre,
                    'descripcion' => $product->descripcion,
                    'precio' => '$' . number_format($product->precio, 2),
                    'descuento' => '0%',
                    'precio_total' => '$' . number_format($product->precio, 2),
                    'stock' => 10, // Puedes añadir stock a tu modelo si lo necesitas
                    'estado' => 'Activo', // Puedes añadir estado a tu modelo
                    'imagen_principal' => $product->imagen_principal,
                    'imagenes_adicionales' => $product->images->map(function ($image) {
                        return [
                            'url' => $image->image_path,
                            'estilo' => $image->description
                        ];
                    }),
                    'destacado' => false, // Puedes añadir este campo a tu modelo
                    'mas_vendido' => false, // Puedes añadir este campo a tu modelo
                    'created_at' => $product->created_at->format('d/m/Y H:i'),
                    'detalles' => $product->descripcion
                ];
            });

        return Inertia::render('Dashboard/Productos/InventarioProductos', [
            'productos' => $productos
        ]);
    }
}