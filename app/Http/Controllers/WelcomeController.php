<?php

namespace App\Http\Controllers;

use App\Models\Moto;
use App\Models\Producto;
use App\Models\Banner;
use App\Models\Categoria;
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

        return Inertia::render('Welcome', [

            'banners' => $banners,
            'categoriasMenu' => $categoriasMenu, // Añadimos las categorías para el menú
            'motoData' => [
                'years' => $years,
                'brands' => $marcas,
                'models' => $modelos
            ],
            'laravelVersion' => app()->version(),
            'phpVersion' => phpversion(),
        ]);
    }
}