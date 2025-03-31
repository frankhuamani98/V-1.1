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
            'imagen_principal' => 'nullable|url|max:255',
            'imagen_archivo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB máximo
        ], [
            'imagen_principal.url' => 'Debe proporcionar una URL válida',
            'imagen_principal.max' => 'La URL no puede exceder los 255 caracteres',
            'imagen_archivo.image' => 'El archivo debe ser una imagen válida',
            'imagen_archivo.mimes' => 'Solo se aceptan formatos: jpeg, png, jpg, gif o webp',
            'imagen_archivo.max' => 'La imagen no puede pesar más de 5MB',
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
            'imagen_principal' => $imagenUrl,
            'activo' => true,
            'orden' => Banner::max('orden') + 1
        ]);

        return redirect()->back()->with('success', 'Banner creado exitosamente');
    }


    // Método para actualizar un banner (opcional)
    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'imagen_principal' => 'nullable|url|max:255',
            'imagen_archivo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'activo' => 'boolean',
        ]);

        if ($request->hasFile('imagen_archivo')) {
            // Eliminar la imagen anterior si existe
            if ($banner->imagen_principal) {
                $oldPath = str_replace(asset('storage/'), '', $banner->imagen_principal);
                Storage::disk('public')->delete($oldPath);
            }

            // Guardar la nueva imagen
            $imagenPath = $request->file('imagen_archivo')->store('banners', 'public');
            $validated['imagen_principal'] = asset('storage/'.$imagenPath);
        }

        $banner->update($validated);

        return redirect()->route('banners.historial')->with('success', 'Banner actualizado correctamente');
    }
}