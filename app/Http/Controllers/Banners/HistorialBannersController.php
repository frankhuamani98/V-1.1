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
                return [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'imagen_principal' => asset('storage/' . $banner->imagen_principal),
                    'activo' => (bool)$banner->activo,
                    'fecha_inicio' => $banner->fecha_inicio?->toDateTimeString(),
                    'fecha_fin' => $banner->fecha_fin?->toDateTimeString(),
                    'created_at' => $banner->created_at->toDateTimeString(),
                    'deleted_at' => $banner->deleted_at?->toDateTimeString(),
                    'status' => $banner->deleted_at ? 'deleted' : 'active',
                ];
            });

        return Inertia::render('Dashboard/Banners/HistorialBanners', [
            'banners' => $banners,
        ]);
    }
}