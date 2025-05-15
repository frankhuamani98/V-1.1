<?php

namespace App\Http\Controllers;

use App\Models\Moto;
use App\Models\Producto;
use App\Models\Banner;
use App\Models\Categoria;
use App\Models\Opinion;
use App\Models\CategoriaServicio;
use App\Models\Servicio;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $motos = Moto::where('estado', 'Activo')
            ->select('año', 'marca', 'modelo')
            ->orderBy('año', 'desc')
            ->orderBy('marca')
            ->orderBy('modelo')
            ->get();

        $years = $motos->pluck('año')->unique()->values();

        $marcasPorAño = $motos->groupBy('año')->map(function($motosPorAño) {
            return $motosPorAño->pluck('marca')->unique()->values();
        });

        $modelosPorAñoMarca = $motos->groupBy('año')->map(function($motosPorAño) {
            return $motosPorAño->groupBy('marca')->map(function($motosPorMarca) {
                return $motosPorMarca->pluck('modelo')->values();
            });
        });

        $banners = Banner::where('activo', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'imagen_principal' => $banner->imagen_principal,
                    'activo' => (bool)$banner->activo,
                    'fecha_inicio' => $banner->fecha_inicio,
                    'fecha_fin' => $banner->fecha_fin,
                    'created_at' => $banner->created_at,
                    'updated_at' => $banner->updated_at
                ];
            });

        $categoriasMenu = Categoria::with(['subcategorias' => function($query) {
            $query->where('estado', 'Activo');
        }])
        ->where('estado', 'Activo')
        ->get()
        ->map(function ($categoria) {
            return [
                'id' => $categoria->id,
                'nombre' => $categoria->nombre,
                'estado' => $categoria->estado,
                'subcategorias' => $categoria->subcategorias->map(function ($subcategoria) {
                    return [
                        'id' => $subcategoria->id,
                        'nombre' => $subcategoria->nombre,
                        'estado' => $subcategoria->estado,
                        'href' => "/productos/subcategoria/{$subcategoria->id}"
                    ];
                })
            ];
        });

        $opiniones = Opinion::with(['usuario', 'respuestas.usuario'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($opinion) {
                return [
                    'id' => $opinion->id,
                    'calificacion' => $opinion->calificacion,
                    'contenido' => $opinion->contenido,
                    'util' => $opinion->util,
                    'es_soporte' => $opinion->es_soporte,
                    'created_at' => $opinion->created_at->diffForHumans(),
                    'usuario' => [
                        'id' => $opinion->usuario->id,
                        'nombre' => $opinion->usuario->first_name . ' ' . $opinion->usuario->last_name,
                        'iniciales' => $opinion->es_soporte ? 'ES' :
                                    strtoupper(substr($opinion->usuario->first_name, 0, 1) . 
                                    substr($opinion->usuario->last_name, 0, 1))
                    ],
                    'respuestas' => $opinion->respuestas->map(function ($respuesta) {
                        return [
                            'id' => $respuesta->id,
                            'contenido' => $respuesta->contenido,
                            'es_soporte' => $respuesta->es_soporte,
                            'created_at' => $respuesta->created_at->diffForHumans(),
                            'usuario' => [
                                'id' => $respuesta->usuario->id,
                                'nombre' => $respuesta->usuario->first_name . ' ' . $respuesta->usuario->last_name,
                                'iniciales' => $respuesta->es_soporte ? 'ES' : 
                                             strtoupper(substr($respuesta->usuario->first_name, 0, 1) . 
                                             substr($respuesta->usuario->last_name, 0, 1))
                            ]
                        ];
                    })
                ];
            });

        $promedioCalificacion = $opiniones->count() > 0 ? $opiniones->avg('calificacion') : 0;
        $totalOpiniones = $opiniones->count();
        
        $conteoCalificaciones = [
            5 => $opiniones->where('calificacion', 5)->count(),
            4 => $opiniones->where('calificacion', 4)->count(),
            3 => $opiniones->where('calificacion', 3)->count(),
            2 => $opiniones->where('calificacion', 2)->count(),
            1 => $opiniones->where('calificacion', 1)->count(),
        ];

        $categoriasServicio = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get()
            ->map(function ($categoria) {
                return [
                    'id' => $categoria->id,
                    'nombre' => $categoria->nombre,
                    'descripcion' => $categoria->descripcion
                ];
            });

        $servicios = Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'descripcion' => $servicio->descripcion,
                    'precio_base' => $servicio->precio_base,
                    'duracion_estimada' => $servicio->duracion_estimada,
                    'categoria_id' => $servicio->categoria_servicio_id,
                    'categoria_servicio_id' => $servicio->categoria_servicio_id
                ];
            });

        // Obtener productos para la página principal
        $productosDestacados = Producto::with(['categoria', 'subcategoria', 'motos'])
            ->where('estado', 'Activo')
            ->where('destacado', true)
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($producto) {
                return $this->formatProductData($producto);
            });

        $productosMasVendidos = Producto::with(['categoria', 'subcategoria', 'motos'])
            ->where('estado', 'Activo')
            ->where('mas_vendido', true)
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($producto) {
                return $this->formatProductData($producto);
            });

        $todosProductos = Producto::with(['categoria', 'subcategoria', 'motos'])
            ->where('estado', 'Activo')
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($producto) {
                return $this->formatProductData($producto);
            });

        // Productos relacionados por subcategoría
        $productosRelacionadosPorSubcategoria = [];
        foreach ($todosProductos as $producto) {
            $productosRelacionadosPorSubcategoria[$producto['id']] = $this->getRelatedProductsBySubcategoria($producto['id']);
        }

        return Inertia::render('Welcome', [
            'banners' => $banners,
            'categoriasMenu' => $categoriasMenu, 
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios,
            'motoData' => [
                'years' => $years,
                'brandsByYear' => $marcasPorAño,
                'modelsByYearAndBrand' => $modelosPorAñoMarca
            ],
            'opiniones' => [
                'lista' => $opiniones,
                'promedio' => round($promedioCalificacion, 1),
                'total' => $totalOpiniones,
                'conteo' => $conteoCalificaciones
            ],
            'productosDestacados' => $productosDestacados,
            'productosMasVendidos' => $productosMasVendidos,
            'todosProductos' => $todosProductos,
            'productosRelacionadosPorSubcategoria' => $productosRelacionadosPorSubcategoria,
        ]);
    }

    private function formatProductData($producto)
    {
        return [
            'id' => $producto->id,
            'name' => $producto->nombre,
            'price' => 'S/ ' . number_format($producto->precio_final, 2, '.', ','),
            'originalPrice' => 'S/ ' . number_format($producto->precio, 2, '.', ','),
            'rating' => $producto->calificacion ?? 4.5,
            'reviews' => rand(10, 100),
            'image' => $producto->imagen_principal ? 
                     (str_starts_with($producto->imagen_principal, 'http') ? 
                      $producto->imagen_principal : 
                      asset('storage/' . ltrim($producto->imagen_principal, '/'))) :
                     'https://via.placeholder.com/300',
            'tag' => ($producto->destacado ? 'Destacado' : '') . 
                    ($producto->mas_vendido ? ($producto->destacado ? ', Más Vendido' : 'Más Vendido') : ''),
            'stock' => $producto->stock,
            'description' => $producto->descripcion_corta,
            'descuento' => isset($producto->descuento) ? $producto->descuento : 0,
        ];
    }

    private function getRelatedProductsBySubcategoria($productoId)
    {
        $producto = Producto::find($productoId);
        if (!$producto) {
            return [];
        }

        $relacionados = collect();

        // Primero por subcategoría (sin el producto actual)
        if ($producto->subcategoria_id) {
            $relacionados = Producto::where('estado', 'Activo')
                ->where('subcategoria_id', $producto->subcategoria_id)
                ->where('id', '!=', $productoId)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // Luego por categoría (sin duplicados)
        if ($producto->categoria_id) {
            $idsYaIncluidos = $relacionados->pluck('id')->push($productoId)->all();

            $relacionadosCategoria = Producto::where('estado', 'Activo')
                ->where('categoria_id', $producto->categoria_id)
                ->whereNotIn('id', $idsYaIncluidos)
                ->orderBy('created_at', 'desc')
                ->get();

            $relacionados = $relacionados->concat($relacionadosCategoria);
        }

        // Si aún faltan, agrega productos destacados (sin duplicados)
        if ($relacionados->count() < 8) {
            $idsYaIncluidos = $relacionados->pluck('id')->push($productoId)->all();

            $destacados = Producto::where('estado', 'Activo')
                ->where('destacado', true)
                ->whereNotIn('id', $idsYaIncluidos)
                ->orderBy('created_at', 'desc')
                ->limit(8 - $relacionados->count())
                ->get();

            $relacionados = $relacionados->concat($destacados);
        }

        // Limita a 8 productos relacionados
        return $relacionados->take(8)->map(function ($prod) {
            return $this->formatProductData($prod);
        })->values();
    }
}