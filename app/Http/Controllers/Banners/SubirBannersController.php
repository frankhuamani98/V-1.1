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
            'imagen_principal' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'imagen_url' => 'nullable|url|max:500',
            'activo' => 'required|boolean',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        // Validar que al menos una imagen esté presente
        if (empty($validated['imagen_principal']) && empty($validated['imagen_url'])) {
            return back()->withErrors(['imagen' => 'Debes subir una imagen o proporcionar una URL']);
        }

        $imagePath = null;

        // Procesar la imagen según el método proporcionado
        if ($request->hasFile('imagen_principal')) {
            $imagePath = $request->file('imagen_principal')->store('banners', 'public');
        } elseif (!empty($validated['imagen_url'])) {
            $imagePath = $validated['imagen_url']; // Guardamos la URL directamente
        }

        // Crear el banner
        Banner::create([
            'titulo' => $validated['titulo'],
            'subtitulo' => $validated['subtitulo'],
            'imagen_principal' => $imagePath,
            'activo' => (bool)$validated['activo'],
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
        ]);

        return redirect()->route('banners.historial')->with('success', 'Banner creado exitosamente');
    }
}