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
        $validated = $this->validateBanner($request);

        if (empty($validated['imagen_principal']) && empty($validated['imagen_archivo'])) {
            return back()->withErrors([
                'imagen_principal' => 'Debe proporcionar una URL o seleccionar un archivo',
                'imagen_archivo' => 'Debe proporcionar una URL o seleccionar un archivo',
            ]);
        }

        $imagenUrl = $this->processImage($request, $validated);

        Banner::create([
            'titulo' => $validated['titulo'] ?? null,
            'subtitulo' => $validated['subtitulo'] ?? null,
            'imagen_principal' => $imagenUrl,
            'activo' => true,
            'orden' => Banner::max('orden') + 1,
            'fecha_inicio' => $validated['fecha_inicio'] ?? null,
            'fecha_fin' => $validated['fecha_fin'] ?? null,
        ]);

        return redirect()->route('banners.historial')->with('success', 'Banner creado exitosamente');
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $this->validateBanner($request, true);

        if ($request->hasFile('imagen_archivo')) {
            $this->deleteExistingImage($banner);
            $validated['imagen_principal'] = $this->storeUploadedImage($request->file('imagen_archivo'));
        }

        $banner->update([
            'titulo' => $validated['titulo'] ?? $banner->titulo,
            'subtitulo' => $validated['subtitulo'] ?? $banner->subtitulo,
            'imagen_principal' => $validated['imagen_principal'] ?? $banner->imagen_principal,
            'activo' => $validated['activo'] ?? $banner->activo,
            'fecha_inicio' => $validated['fecha_inicio'] ?? $banner->fecha_inicio,
            'fecha_fin' => $validated['fecha_fin'] ?? $banner->fecha_fin,
        ]);

        return redirect()->route('banners.historial')->with('success', 'Banner actualizado correctamente');
    }

    public function destroy(Banner $banner)
    {
        $this->deleteExistingImage($banner);
        $banner->delete();
        return redirect()->route('banners.historial')->with('success', 'Banner eliminado correctamente');
    }

    public function toggleStatus(Banner $banner)
    {
        $banner->update(['activo' => !$banner->activo]);
        return redirect()->route('banners.historial')->with('success', 'Estado del banner actualizado');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:banners,id',
        ]);

        foreach ($request->ids as $index => $id) {
            Banner::where('id', $id)->update(['orden' => $index + 1]);
        }

        return response()->json(['success' => true]);
    }

    protected function validateBanner(Request $request, $isUpdate = false)
    {
        $rules = [
            'titulo' => 'nullable|string|max:100',
            'subtitulo' => 'nullable|string|max:200',
            'imagen_principal' => 'nullable|url|max:255',
            'imagen_archivo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ];

        $messages = [
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
        ];

        if ($isUpdate) {
            $rules['activo'] = 'boolean';
        }

        return $request->validate($rules, $messages);
    }

    protected function processImage(Request $request, array $validated): string
    {
        if ($request->hasFile('imagen_archivo')) {
            return $this->storeUploadedImage($request->file('imagen_archivo'));
        }
        return $validated['imagen_principal'];
    }

    protected function storeUploadedImage($file): string
    {
        $path = $file->store('banners', 'public');
        return asset('storage/'.$path);
    }

    protected function deleteExistingImage(Banner $banner): void
    {
        if ($banner->imagen_principal && strpos($banner->imagen_principal, asset('storage/')) === 0) {
            $path = str_replace(asset('storage/'), '', $banner->imagen_principal);
            Storage::disk('public')->delete($path);
        }
    }
}