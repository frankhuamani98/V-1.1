<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistorialBannersController extends Controller
{
    public function index()
    {
        $banners = Banner::withTrashed()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($banner) {
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
                    'status' => $banner->deleted_at ? 'deleted' : ($banner->activo ? 'active' : 'inactive'),
                    'tipo_imagen' => filter_var($banner->imagen_principal, FILTER_VALIDATE_URL) ? 'url' : 'local',
                ];
            });

        return Inertia::render('Dashboard/Banners/HistorialBanners', [
            'banners' => $banners,
        ]);
    }

    public function toggleStatus(Request $request, Banner $banner)
    {
        $banner->update(['activo' => !$banner->activo]);
        
        return back()->with('success', 'Estado del banner actualizado');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        
        return back()->with('success', 'Banner eliminado');
    }

    public function restore($id)
    {
        Banner::withTrashed()->find($id)->restore();
        
        return back()->with('success', 'Banner restaurado');
    }
}