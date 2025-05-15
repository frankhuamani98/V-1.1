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
                $producto->precio_final = $producto->incluye_igv 
                    ? $producto->precio * 1.18 - ($producto->precio * 1.18 * ($producto->descuento / 100))
                    : $producto->precio - ($producto->precio * ($producto->descuento / 100));
                return $producto;
            });

        return Inertia::render('Dashboard/Productos/InventarioProductos', [
            'productos' => $productos,
        ]);
    }
}