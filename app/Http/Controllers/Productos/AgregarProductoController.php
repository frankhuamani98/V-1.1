<?php

namespace App\Http\Controllers\Productos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Moto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AgregarProductoController extends Controller
{
    public function index()
    {
        $categorias = Categoria::with(['subcategorias' => function($query) {
            $query->where('estado', 'Activo');
        }])->where('estado', 'Activo')->get();

        $motos = Moto::where('estado', 'Activo')->get();

        return Inertia::render('Dashboard/Productos/AgregarProducto', [
            'categorias' => $categorias,
            'motos' => $motos
        ]);
    }

    /**
     * Normaliza un valor numérico con formato de moneda a un float
     */
    protected function normalizeCurrency($value)
    {
        if (is_null($value)) {
            return 0.00;
        }

        // Eliminar todos los caracteres no numéricos excepto el punto decimal
        $normalized = preg_replace('/[^0-9.]/', '', str_replace(',', '', $value));

        return (float) $normalized;
    }

    /**
     * Valida y procesa las imágenes adicionales
     */
    protected function processAdditionalImages($images)
    {
        // Si es una cadena JSON, decodifícala primero
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }

        if (empty($images) || !is_array($images)) {
            return null;
        }

        $processed = [];
        foreach ($images as $image) {
            if (is_array($image)) {
                // Si ya es un array con url y estilo
                $url = filter_var($image['url'] ?? $image, FILTER_VALIDATE_URL);
                if ($url !== false) {
                    $processed[] = [
                        'url' => $url,
                        'estilo' => $image['estilo'] ?? ''
                    ];
                }
            } elseif (filter_var($image, FILTER_VALIDATE_URL)) {
                // Si es solo una URL string válida
                $processed[] = [
                    'url' => $image,
                    'estilo' => ''
                ];
            }
        }

        return !empty($processed) ? $processed : null;
    }

    public function store(Request $request)
    {
        // Procesar imágenes adicionales primero
        $imagenesProcesadas = $this->processAdditionalImages($request->imagenes_adicionales);

        // Normalizar los campos numéricos antes de validar
        $request->merge([
            'precio' => $this->normalizeCurrency($request->precio),
            'descuento' => $this->normalizeCurrency($request->descuento),
            'imagenes_adicionales' => $imagenesProcesadas
        ]);

        $validator = Validator::make($request->all(), [
            'codigo' => 'required|string|max:50|unique:productos',
            'nombre' => 'required|string|max:255',
            'descripcion_corta' => 'required|string|max:255',
            'detalles' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias,id',
            'subcategoria_id' => 'required|exists:subcategorias,id',
            'motos_compatibles' => 'nullable|array',
            'motos_compatibles.*' => 'exists:motos,id',
            'todas_las_motos' => 'required|boolean',
            'precio' => 'required|numeric|min:0|max:9999999.99',
            'descuento' => 'required|numeric|min:0|max:100',
            'imagen_principal' => 'required|url|max:500',
            'imagenes_adicionales' => 'nullable|array|max:10',
            'imagenes_adicionales.*.url' => 'required|url|max:500',
            'imagenes_adicionales.*.estilo' => 'nullable|string|max:100',
            'calificacion' => 'required|integer|min:0|max:5',
            'incluye_igv' => 'required|boolean',
            'stock' => 'required|integer|min:0',
            'destacado' => 'required|boolean',
            'mas_vendido' => 'required|boolean',
        ], [
            'imagenes_adicionales.max' => 'No se pueden agregar más de 10 imágenes adicionales',
            'subcategoria_id.required' => 'Debe seleccionar una subcategoría',
            'imagenes_adicionales.*.url.required' => 'La URL de la imagen es requerida',
            'imagenes_adicionales.*.url.url' => 'La URL de la imagen no es válida',
            'precio.max' => 'El precio no puede ser mayor a 9,999,999.99',
            'descuento.max' => 'El descuento no puede ser mayor a 100%',
            'motos_compatibles.*.exists' => 'Una o más motos seleccionadas no existen'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            DB::beginTransaction();

            $producto = Producto::create([
                'codigo' => $request->codigo,
                'nombre' => $request->nombre,
                'descripcion_corta' => $request->descripcion_corta,
                'detalles' => $request->detalles,
                'categoria_id' => $request->categoria_id,
                'subcategoria_id' => $request->subcategoria_id,
                'precio' => $request->precio,
                'descuento' => $request->descuento,
                'imagen_principal' => $request->imagen_principal,
                'imagenes_adicionales' => $request->imagenes_adicionales,
                'calificacion' => $request->calificacion,
                'incluye_igv' => $request->incluye_igv,
                'stock' => $request->stock,
                'todas_las_motos' => $request->todas_las_motos,
                'destacado' => $request->destacado,
                'mas_vendido' => $request->mas_vendido,
                'estado' => 'Activo'
            ]);

            // Asignar motos compatibles si no es para todas las motos
            if (!$request->todas_las_motos && !empty($request->motos_compatibles)) {
                $producto->motos()->sync($request->motos_compatibles);
            }

            DB::commit();

            return redirect()->route('productos.agregar')
                ->with('success', 'Producto creado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error al crear el producto: ' . $e->getMessage())
                ->withInput();
        }
    }
}