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
                $producto->precio_final = (float)$producto->precio_final;
                return $producto;
            });

        return Inertia::render('Dashboard/Productos/InventarioProductos', [
            'productos' => $productos,
        ]);
    }

    public function destroy($producto)
    {
        $producto = \App\Models\Producto::findOrFail($producto);
        // Elimina completamente de la base de datos, incluso si usa SoftDeletes
        $producto->forceDelete();

        return redirect()->back()->with('success', 'Producto eliminado correctamente.');
    }
}