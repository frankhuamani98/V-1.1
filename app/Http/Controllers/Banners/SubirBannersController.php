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
            'imagen_principal' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'activo' => 'required|boolean',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        // Procesar la imagen
        $imagePath = $request->file('imagen_principal')->store('banners', 'public');

        // Crear el banner
        Banner::create([
            'titulo' => $validated['titulo'],
            'subtitulo' => $validated['subtitulo'],
            'imagen_principal' => $imagePath,
            'activo' => (bool)$validated['activo'], // Asegurar que es booleano
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
        ]);

        return redirect()->route('banners.historial')->with('success', 'Banner creado exitosamente');
    }
}