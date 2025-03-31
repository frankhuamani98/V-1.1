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
        // Validación de los datos de entrada
        $validated = $request->validate([
            'titulo' => 'nullable|string|max:100',
            'subtitulo' => 'nullable|string|max:200',
            'imagen_principal' => 'nullable|url|max:255',
            'imagen_archivo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB máximo
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ], [
            'titulo.max' => 'El título no puede exceder los 100 caracteres',
            'subtitulo.max' => 'El subtítulo no puede exceder los 200 caracteres',
            'imagen_principal.url' => 'Debe proporcionar una URL válida',
            'imagen_principal.max' => 'La URL no puede exceder los 255 caracteres',
            'imagen_archivo.image' => 'El archivo debe ser una imagen válida',
            'imagen_archivo.mimes' => 'Solo se aceptan formatos: jpeg, png, jpg, gif o webp',
            'imagen_archivo.max' => 'La imagen no puede pesar más de 5MB',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida',
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio',
        ]);

        // Verificar que se haya proporcionado al menos un método de imagen
        if (empty($validated['imagen_principal']) && empty($validated['imagen_archivo'])) {
            return back()->withErrors([
                'imagen_principal' => 'Debe proporcionar una URL o seleccionar un archivo',
                'imagen_archivo' => 'Debe proporcionar una URL o seleccionar un archivo',
            ]);
        }

        // Procesar la imagen
        $imagenPath = null;

        if ($request->hasFile('imagen_archivo')) {
            // Guardar el archivo subido
            $imagenPath = $request->file('imagen_archivo')->store('banners', 'public');
            $imagenUrl = asset('storage/'.$imagenPath);
        } else {
            // Usar la URL proporcionada
            $imagenUrl = $validated['imagen_principal'];
        }

        // Crear el banner en la base de datos
        Banner::create([
            'titulo' => $validated['titulo'] ?? null,
            'subtitulo' => $validated['subtitulo'] ?? null,
            'imagen_principal' => $imagenUrl,
            'activo' => true,
            'orden' => Banner::max('orden') + 1,
            'fecha_inicio' => $validated['fecha_inicio'] ?? null,
            'fecha_fin' => $validated['fecha_fin'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Banner creado exitosamente');
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'titulo' => 'nullable|string|max:100',
            'subtitulo' => 'nullable|string|max:200',
            'imagen_principal' => 'nullable|url|max:255',
            'imagen_archivo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'activo' => 'boolean',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ], [
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio',
        ]);

        if ($request->hasFile('imagen_archivo')) {
            // Eliminar la imagen anterior si existe
            if ($banner->imagen_principal) {
                $oldPath = str_replace(Storage::url(''), '', $banner->imagen_principal);
                Storage::disk('public')->delete($oldPath);
            }

            // Guardar la nueva imagen
            $imagenPath = $request->file('imagen_archivo')->store('banners', 'public');
            $validated['imagen_principal'] = asset('storage/'.$imagenPath);
        }

        // Actualizar los campos adicionales
        $banner->update([
            'titulo' => $validated['titulo'] ?? null,
            'subtitulo' => $validated['subtitulo'] ?? null,
            'imagen_principal' => $validated['imagen_principal'] ?? $banner->imagen_principal,
            'activo' => $validated['activo'] ?? $banner->activo,
            'fecha_inicio' => $validated['fecha_inicio'] ?? $banner->fecha_inicio,
            'fecha_fin' => $validated['fecha_fin'] ?? $banner->fecha_fin,
        ]);

        return redirect()->route('banners.historial')->with('success', 'Banner actualizado correctamente');
    }
}