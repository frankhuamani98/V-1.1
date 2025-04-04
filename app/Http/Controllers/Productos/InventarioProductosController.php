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
        // Obtenemos todas las motos disponibles para usar en productos con "todas_las_motos"
        $todasLasMotos = Moto::where('estado', 'Activo')->get();

        $productos = Producto::with(['categoria', 'subcategoria', 'motos'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($producto) use ($todasLasMotos) {
                // Para productos con "todas_las_motos", usamos todas las motos disponibles
                $motosMostrar = $producto->todas_las_motos 
                    ? $todasLasMotos 
                    : $producto->motos;

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
                    'imagenes_adicionales' => $producto->imagenes_adicionales ?? [],
                    'moto_compatible' => $producto->todas_las_motos 
                        ? 'Todas las motos (' . $todasLasMotos->count() . ')' 
                        : ($producto->motos->count() > 0 
                            ? $producto->motos->count() . ' motos seleccionadas'
                            : 'No especificado'),
                    'motos_compatibles' => $motosMostrar->map(function($moto) {
                        return [
                            'id' => $moto->id,
                            'marca' => $moto->marca,
                            'modelo' => $moto->modelo,
                            'año' => $moto->año,
                            'nombre_completo' => $moto->marca . ' ' . $moto->modelo . ' (' . $moto->año . ')'
                        ];
                    })->toArray(),
                    'todas_las_motos' => $producto->todas_las_motos,
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