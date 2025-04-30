<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HistorialBannersController extends Controller
{
    public function index()
    {
        $banners = Banner::withTrashed()
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($banner) {
                return [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'imagen_principal' => $banner->imagen_principal,
                    'tipo_imagen' => $banner->tipo_imagen,
                    'activo' => $banner->activo,
                    'fecha_inicio' => $banner->fecha_inicio,
                    'fecha_fin' => $banner->fecha_fin,
                    'created_at' => $banner->created_at,
                    'deleted_at' => $banner->deleted_at,
                    'status' => $banner->deleted_at ? 'deleted' : 'active'
                ];
            });

        return Inertia::render('Dashboard/Banners/HistorialBanners', [
            'banners' => $banners
        ]);
    }

    public function toggleStatus(Banner $banner)
    {
        $banner->activo = !$banner->activo;
        $banner->save();

        return redirect()->back()
            ->with('success', 'Estado del banner actualizado exitosamente');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->tipo_imagen === 'local') {
            Storage::disk('public')->delete($banner->imagen_principal);
        }
        
        $banner->delete();

        return redirect()->back()
            ->with('success', 'Banner eliminado exitosamente');
    }

    public function restore($id)
    {
        $banner = Banner::withTrashed()->findOrFail($id);
        $banner->restore();

        return redirect()->back()
            ->with('success', 'Banner restaurado exitosamente');
    }
}