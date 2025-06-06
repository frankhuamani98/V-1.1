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
        ], [
            'codigo.required' => 'El código del producto es requerido.',
            'codigo.unique' => 'Este código ya está en uso.',
            'codigo.max' => 'El código no puede tener más de 50 caracteres.',
            'nombre.required' => 'El nombre del producto es requerido.',
            'nombre.max' => 'El nombre no puede tener más de 255 caracteres.',
            'descripcion_corta.required' => 'La descripción corta es requerida.',
            'descripcion_corta.max' => 'La descripción corta no puede tener más de 150 caracteres.',
            'categoria_id.required' => 'Debe seleccionar una categoría.',
            'categoria_id.exists' => 'La categoría seleccionada no es válida.',
            'subcategoria_id.required' => 'Debe seleccionar una subcategoría.',
            'subcategoria_id.exists' => 'La subcategoría seleccionada no es válida.',
            'precio.required' => 'El precio es requerido.',
            'precio.numeric' => 'El precio debe ser un número.',
            'precio.min' => 'El precio no puede ser negativo.',
            'descuento.numeric' => 'El descuento debe ser un número.',
            'descuento.min' => 'El descuento no puede ser negativo.',
            'descuento.max' => 'El descuento no puede ser mayor a 100%.',
            'imagen_principal_file.image' => 'El archivo debe ser una imagen.',
            'imagen_principal_file.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, gif, webp.',
            'imagen_principal_file.max' => 'La imagen no puede ser mayor a 2MB.',
            'calificacion.integer' => 'La calificación debe ser un número entero.',
            'calificacion.min' => 'La calificación no puede ser menor a 0.',
            'calificacion.max' => 'La calificación no puede ser mayor a 5.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.',
            'moto_ids.array' => 'Las motos compatibles deben ser una lista.',
            'moto_ids.*.exists' => 'Una o más motos seleccionadas no son válidas.'
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

            $precioBase = (float)$request->precio;
            $incluyeIgv = $request->has('incluye_igv') && $request->incluye_igv;

            $precioFinal = $incluyeIgv 
                ? $precioBase * 1.18 * (1 - ($request->descuento / 100))
                : $precioBase * (1 - ($request->descuento / 100));

            $producto = Producto::create([
                'codigo' => $request->codigo,
                'nombre' => $request->nombre,
                'descripcion_corta' => $request->descripcion_corta,
                'detalles' => $request->detalles,
                'categoria_id' => $request->categoria_id,
                'subcategoria_id' => $request->subcategoria_id,
                'precio' => $precioBase,
                'descuento' => (float)($request->descuento ?? 0),
                'imagen_principal' => $imagenPrincipalPath,
                'imagenes_adicionales' => !empty($imagenesAdicionales) ? json_encode($imagenesAdicionales) : null,
                'calificacion' => $request->calificacion ?? 0,
                'incluye_igv' => $incluyeIgv,
                'stock' => $request->stock ?? 0,
                'destacado' => $request->destacado ?? false,
                'mas_vendido' => $request->mas_vendido ?? false,
                'estado' => Producto::ESTADO_ACTIVO,
                'precio_final' => $precioFinal,
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