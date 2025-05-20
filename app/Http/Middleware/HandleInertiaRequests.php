<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Categoria;
use App\Models\CategoriaServicio;
use App\Models\Servicio;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
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
        
        $categoriasServicio = CategoriaServicio::where('estado', true)
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
            
        $servicios = Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'categoria_id' => $servicio->categoria_servicio_id
                ];
            });
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'categoriasMenu' => $categoriasMenu,
            'categoriasServicio' => $categoriasServicio,
            'servicios' => $servicios,
        ];
    }
}
