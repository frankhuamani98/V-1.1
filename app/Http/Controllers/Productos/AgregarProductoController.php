<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Moto;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AgregarProductoController extends Controller
{
    public function index()
    {
        $categorias = Categoria::with('subcategorias')->get();
        $motos = Moto::where('estado', 'Activo')->get();

        return Inertia::render('Dashboard/Productos/AgregarProducto', [
            'categorias' => $categorias,
            'motos' => $motos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'codigo' => 'required|unique:productos|max:50',
            'nombre' => 'required|max:255',
            'descripcion_corta' => 'required|max:150',
            'detalles' => 'nullable',
            'categoria_id' => 'required|exists:categorias,id',
            'subcategoria_id' => 'required|exists:subcategorias,id',
            'precio' => 'required|numeric|min:0',
            'descuento' => 'numeric|min:0|max:100',
            'imagen_principal' => 'nullable|url',
            'imagen_principal_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'imagenes_adicionales' => 'nullable|json',
            'calificacion' => 'integer|min:0|max:5',
            'incluye_igv' => 'boolean',
            'stock' => 'integer|min:0',
            'destacado' => 'boolean',
            'mas_vendido' => 'boolean',
            'moto_ids' => 'array',
            'moto_ids.*' => 'exists:motos,id',
        ]);

        DB::beginTransaction();
        try {
            $imagenPrincipalPath = null;
            if ($request->hasFile('imagen_principal_file')) {
                $imagenPrincipalPath = $request->file('imagen_principal_file')->store('productos', 'public');
            } elseif ($request->imagen_principal) {
                $imagenPrincipalPath = $request->imagen_principal;
            }

            $imagenesAdicionales = [];
            if ($request->imagenes_adicionales) {
                $imagenesAdicionalesData = json_decode($request->imagenes_adicionales, true);
                
                foreach ($imagenesAdicionalesData as $imagenData) {
                    $imagenInfo = [
                        'estilo' => $imagenData['estilo'] ?? null
                    ];
                    
                    if (isset($imagenData['file'])) {
                        if (strpos($imagenData['file'], 'data:image') === 0) {
                            $fileData = explode(',', $imagenData['file']);
                            $fileContent = base64_decode($fileData[1]);
                            
                            $extension = 'jpg';
                            if (strpos($imagenData['file'], 'image/png') !== false) {
                                $extension = 'png';
                            } elseif (strpos($imagenData['file'], 'image/gif') !== false) {
                                $extension = 'gif';
                            } elseif (strpos($imagenData['file'], 'image/webp') !== false) {
                                $extension = 'webp';
                            }
                            
                            $fileName = 'productos/adicionales/' . Str::uuid() . '.' . $extension;
                            Storage::disk('public')->put($fileName, $fileContent);
                            $imagenInfo['url'] = $fileName;
                        }
                    } elseif (isset($imagenData['url']) && filter_var($imagenData['url'], FILTER_VALIDATE_URL)) {
                        $imagenInfo['url'] = $imagenData['url'];
                    }
                    
                    if (isset($imagenInfo['url'])) {
                        $imagenesAdicionales[] = $imagenInfo;
                    }
                }
            }

            $producto = Producto::create([
                'codigo' => $request->codigo,
                'nombre' => $request->nombre,
                'descripcion_corta' => $request->descripcion_corta,
                'detalles' => $request->detalles,
                'categoria_id' => $request->categoria_id,
                'subcategoria_id' => $request->subcategoria_id,
                'precio' => (float)$request->precio,
                'descuento' => (float)($request->descuento ?? 0),
                'imagen_principal' => $imagenPrincipalPath,
                'imagenes_adicionales' => !empty($imagenesAdicionales) ? json_encode($imagenesAdicionales) : null,
                'calificacion' => $request->calificacion ?? 0,
                'incluye_igv' => $request->incluye_igv ?? false,
                'stock' => $request->stock ?? 0,
                'destacado' => $request->destacado ?? false,
                'mas_vendido' => $request->mas_vendido ?? false,
                'estado' => Producto::ESTADO_ACTIVO,
            ]);

            if ($request->moto_ids) {
                $producto->motos()->sync($request->moto_ids);
            }

            DB::commit();

            return redirect()->route('productos.agregar')->with('success', 'Producto creado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al crear el producto: ' . $e->getMessage());
        }
    }
}