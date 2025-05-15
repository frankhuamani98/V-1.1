<?php

namespace App\Http\Controllers\Productos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Producto;

class InventarioProductosController extends Controller
{
    public function index()
    {
        $productos = Producto::with(['categoria', 'subcategoria', 'motos'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($producto) {
                $producto->precio = (float)$producto->precio;
                $producto->precio_final = $producto->descuento > 0 
                    ? $producto->precio - ($producto->precio * $producto->descuento / 100) 
                    : $producto->precio;
                return $producto;
            });

        return Inertia::render('Dashboard/Productos/InventarioProductos', [
            'productos' => $productos,
        ]);
    }
}