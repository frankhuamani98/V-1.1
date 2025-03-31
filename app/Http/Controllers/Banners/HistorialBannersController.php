<?php
 
namespace App\Http\Controllers\Banners;
 
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Inertia\Inertia;
 
class HistorialBannersController extends Controller
{
    public function index()
    {
        // Get all banners ordered by creation date (newest first)
        $banners = Banner::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'imagen_principal' => $banner->imagen_principal,
                    'activo' => $banner->activo,
                    'fecha_inicio' => $banner->fecha_inicio?->format('Y-m-d H:i:s'),
                    'fecha_fin' => $banner->fecha_fin?->format('Y-m-d H:i:s'),
                    'created_at' => $banner->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $banner->updated_at->format('Y-m-d H:i:s'),
                ];
            });
 
        return Inertia::render('Dashboard/Banners/HistorialBanners', [
            'banners' => $banners
        ]);
    }
}