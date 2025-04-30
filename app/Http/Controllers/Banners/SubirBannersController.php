<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubirBannersController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Banners/SubirBanners');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'imagen_principal' => $request->tipo_imagen === 'url' 
                ? 'required|url|max:255'
                : 'required|image|max:5120', // 5MB max
            'tipo_imagen' => 'required|in:url,local',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        if ($request->tipo_imagen === 'local' && $request->hasFile('imagen_principal')) {
            $path = $request->file('imagen_principal')->store('banners', 'public');
            $validated['imagen_principal'] = $path;
        }

        Banner::create($validated);

        return redirect()->route('banners.historial')
            ->with('success', 'Banner creado exitosamente');
    }
}