<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Inertia\Inertia;

class HistorialBannersController extends Controller
{
    public function index()
    {
        $banners = Banner::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($banner) {
                // Determinar si la imagen es una URL o un archivo local
                $imagen = filter_var($banner->imagen_principal, FILTER_VALIDATE_URL) 
                    ? $banner->imagen_principal
                    : asset('storage/' . $banner->imagen_principal);

                return [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'imagen_principal' => $imagen,
                    'activo' => (bool)$banner->activo,
                    'fecha_inicio' => $banner->fecha_inicio?->toDateTimeString(),
                    'fecha_fin' => $banner->fecha_fin?->toDateTimeString(),
                    'created_at' => $banner->created_at->toDateTimeString(),
                    'deleted_at' => $banner->deleted_at?->toDateTimeString(),
                    'status' => $banner->deleted_at ? 'deleted' : 'active',
                    'tipo_imagen' => filter_var($banner->imagen_principal, FILTER_VALIDATE_URL) ? 'url' : 'local',
                ];
            });

        return Inertia::render('Dashboard/Banners/HistorialBanners', [
            'banners' => $banners,
        ]);
    }
}