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
        // Obtener marcas y modelos desde la base de datos
        $marcas = Moto::select('marca')->distinct()->get()->pluck('marca');
        $modelos = Moto::select('modelo', 'marca')->get();
        $years = Moto::select('año')->distinct()->orderBy('año', 'desc')->get()->pluck('año');


        // Obtener todos los banners activos
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

        // Obtener categorías principales activas con sus subcategorías para el menú
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

        // Obtener opiniones con sus respuestas y usuarios
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

        // Calcular promedio de calificaciones
        $promedioCalificacion = $opiniones->count() > 0 ? $opiniones->avg('calificacion') : 0;
        $totalOpiniones = $opiniones->count();
        
        // Contar opiniones por calificación
        $conteoCalificaciones = [
            5 => $opiniones->where('calificacion', 5)->count(),
            4 => $opiniones->where('calificacion', 4)->count(),
            3 => $opiniones->where('calificacion', 3)->count(),
            2 => $opiniones->where('calificacion', 2)->count(),
            1 => $opiniones->where('calificacion', 1)->count(),
        ];

        // Obtener categorías de servicios y servicios para el menú
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

        return Inertia::render('Welcome', [
            'banners' => $banners,
            'categoriasMenu' => $categoriasMenu, 
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios,
            'motoData' => [
                'years' => $years,
                'brands' => $marcas,
                'models' => $modelos
            ],
            'opiniones' => [
                'lista' => $opiniones,
                'promedio' => round($promedioCalificacion, 1),
                'total' => $totalOpiniones,
                'conteo' => $conteoCalificaciones
            ],
            'laravelVersion' => app()->version(),
            'phpVersion' => phpversion(),
        ]);
    }
}