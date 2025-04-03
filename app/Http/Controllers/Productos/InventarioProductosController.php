<?php

namespace App\Http\Controllers\Productos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Subcategoria;
use App\Models\Moto;

class InventarioProductosController extends Controller
{
    public function index()
    {
        $productos = Producto::with(['categoria', 'subcategoria', 'moto'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'codigo' => $producto->codigo,
                    'nombre' => $producto->nombre,
                    'categoria' => $producto->categoria->nombre ?? 'Sin categoría',
                    'subcategoria' => $producto->subcategoria->nombre ?? 'Sin subcategoría',
                    'precio' => 'S/ ' . number_format($producto->precio, 2),
                    'descuento' => $producto->descuento . '%',
                    'precio_total' => 'S/ ' . number_format($producto->precio - ($producto->precio * $producto->descuento / 100), 2),
                    'stock' => $producto->stock,
                    'estado' => $producto->estado,
                    'imagen_principal' => $producto->imagen_principal,
                    'imagenes_adicionales' => $producto->imagenes_adicionales ?? [], // Asegurarse de incluir esto
                    'moto' => $producto->moto ? $producto->moto->marca . ' ' . $producto->moto->modelo . ' (' . $producto->moto->año . ')' : 'No aplica',
                    'destacado' => $producto->destacado,
                    'mas_vendido' => $producto->mas_vendido,
                    'created_at' => $producto->created_at->format('d/m/Y H:i'),
                    'detalles' => $producto->detalles,
                    'descripcion_corta' => $producto->descripcion_corta,
                ];
            });

        return Inertia::render('Dashboard/Productos/InventarioProductos', [
            'productos' => $productos,
        ]);
    }

    public function destroy($id)
    {
        try {
            $producto = Producto::findOrFail($id);
            $producto->delete();
            
            return redirect()->back()->with('success', 'Producto eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar el producto');
        }
    }
}