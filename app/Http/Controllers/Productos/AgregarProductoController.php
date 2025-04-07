<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Subcategoria;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AgregarProductoController extends Controller
{
    public function index()
    {
        $categorias = Categoria::with('subcategorias')->where('estado', 'Activo')->get();
        
        return Inertia::render('Dashboard/Productos/AgregarProducto', [
            'categorias' => $categorias
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'codigo' => 'required|unique:productos',
            'nombre' => 'required|max:255',
            'descripcion_corta' => 'required',
            'detalles' => 'required',
            'precio' => 'required|numeric|min:0',
            'descuento' => 'numeric|min:0|max:100',
            'precio_con_descuento' => 'required|numeric|min:0',
            'igv' => 'required|numeric|min:0',
            'precio_final' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoria' => 'required|exists:categorias,id',
            'subcategoria' => 'required|exists:subcategorias,id',
            'imagen_principal' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'imagen_url' => 'nullable|url',
            'compatible_motos' => 'required|in:todas,especifica',
            'moto_especifica' => 'required_if:compatible_motos,especifica',
            'es_destacado' => 'boolean',
            'es_mas_vendido' => 'boolean',
            'calificacion' => 'integer|min:0|max:5'
        ]);

        // Manejo de la imagen principal
        $imagenPath = null;
        if ($request->hasFile('imagen_principal')) {
            $imagenPath = $request->file('imagen_principal')->store('productos', 'public');
        } elseif ($request->imagen_url) {
            // Aquí podrías implementar la descarga de la imagen desde la URL si es necesario
            $imagenPath = $request->imagen_url;
        }

        // Crear el producto
        $producto = Producto::create([
            'codigo' => $request->codigo,
            'nombre' => $request->nombre,
            'descripcion_corta' => $request->descripcion_corta,
            'detalles' => $request->detalles,
            'precio' => $request->precio,
            'descuento' => $request->descuento,
            'precio_con_descuento' => $request->precio_con_descuento,
            'igv' => $request->igv,
            'precio_final' => $request->precio_final,
            'incluye_igv' => $request->incluye_igv,
            'stock' => $request->stock,
            'imagen_principal' => $imagenPath,
            'compatible_motos' => $request->compatible_motos,
            'moto_especifica' => $request->moto_especifica,
            'es_destacado' => $request->es_destacado,
            'es_mas_vendido' => $request->es_mas_vendido,
            'calificacion' => $request->calificacion,
            'subcategoria_id' => $request->subcategoria
        ]);

        // Manejo de imágenes adicionales (puedes implementar esto después)
        
        return redirect()->route('productos.agregar')->with('success', 'Producto creado exitosamente!');
    }
}