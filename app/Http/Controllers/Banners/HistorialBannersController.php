<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Inertia\Inertia;

class HistorialBannersController extends Controller
{
    public function index()
    {
        $banners = Banner::query()
            ->orderBy('orden', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'imagen_principal' => $banner->imagen_completa, // Usamos el accessor
                    'activo' => $banner->activo,
                    'fecha_inicio' => $banner->fecha_inicio?->toDateTimeString(),
                    'fecha_fin' => $banner->fecha_fin?->toDateTimeString(),
                    'created_at' => $banner->created_at->toDateTimeString(),
                    'updated_at' => $banner->updated_at->toDateTimeString(),
                ];
            });

        return Inertia::render('Dashboard/Banners/HistorialBanners', [
            'banners' => $banners
        ]);
    }
}