<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubirBannersController extends Controller
{
    /**
     * Muestra el formulario para crear nuevos banners
     */
    public function index()
    {
        return Inertia::render('Dashboard/Banners/SubirBanners');
    }

    /**
     * Almacena un nuevo banner en la base de datos
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'nullable|string|max:100',
            'subtitulo' => 'nullable|string|max:200',
            'imagen_principal' => 'required_without:imagen_archivo|url|nullable',
            'imagen_archivo' => 'required_without:imagen_principal|file|image|max:5120', // 5MB máximo
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $data = $request->only(['titulo', 'subtitulo', 'fecha_inicio', 'fecha_fin']);
        $data['activo'] = true;

        // Manejar la imagen
        if ($request->hasFile('imagen_archivo')) {
            $path = $request->file('imagen_archivo')->store('banners', 'public');
            $data['imagen_principal'] = '/storage/' . $path;
        } else {
            $data['imagen_principal'] = $request->imagen_principal;
        }

        // Asignar orden automático
        $lastOrder = Banner::max('orden') ?? 0;
        $data['orden'] = $lastOrder + 1;

        Banner::create($data);

        return redirect()->route('banners.subir')->with('success', 'Banner creado exitosamente');
    }

    /**
     * Actualiza un banner existente
     */
    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'titulo' => 'nullable|string|max:100',
            'subtitulo' => 'nullable|string|max:200',
            'imagen_principal' => 'nullable|url',
            'imagen_archivo' => 'nullable|file|image|max:5120',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'activo' => 'boolean',
            'orden' => 'integer'
        ]);

        $data = $request->only(['titulo', 'subtitulo', 'fecha_inicio', 'fecha_fin', 'activo', 'orden']);

        // Manejar actualización de imagen
        if ($request->hasFile('imagen_archivo')) {
            // Eliminar imagen anterior si no es una URL
            if (!filter_var($banner->imagen_principal, FILTER_VALIDATE_URL)) {
                $oldPath = str_replace('/storage/', '', $banner->imagen_principal);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('imagen_archivo')->store('banners', 'public');
            $data['imagen_principal'] = '/storage/' . $path;
        } elseif ($request->has('imagen_principal')) {
            $data['imagen_principal'] = $request->imagen_principal;
        }

        $banner->update($data);

        return redirect()->back()->with('success', 'Banner actualizado correctamente');
    }

    /**
     * Elimina un banner
     */
    public function destroy(Banner $banner)
    {
        try {
            // Eliminar imagen física si no es una URL
            if (!filter_var($banner->imagen_principal, FILTER_VALIDATE_URL)) {
                $path = str_replace('/storage/', '', $banner->imagen_principal);
                Storage::disk('public')->delete($path);
            }

            $banner->delete();

            return redirect()->back()->with('success', 'Banner eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al eliminar el banner: ' . $e->getMessage());
        }
    }

    /**
     * Cambia el estado activo/inactivo de un banner
     */
    public function toggleStatus(Banner $banner)
    {
        $banner->update(['activo' => !$banner->activo]);
        
        return redirect()->back()->with('success', 'Estado del banner actualizado');
    }


}