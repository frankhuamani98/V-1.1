<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SubirBannersController extends Controller
{
    public function index()
    {
        $banners = Banner::latest()
            ->take(5)
            ->get()
            ->map(fn ($banner) => $this->formatBannerData($banner));

        return Inertia::render('Dashboard/Banners/SubirBanners', [
            'banners' => $banners
        ]);
    }

    public function store(Request $request)
    {
        $validator = $this->validateBannerRequest($request);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $banner = $this->createBanner($validator->validated(), $request);
            
            return back()
                ->with('success', 'Banner creado exitosamente')
                ->with('banner', $this->formatBannerData($banner));

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Error al crear el banner: ' . $e->getMessage())
                ->withInput();
        }
    }

    private function validateBannerRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:100',
            'subtitulo' => 'nullable|string|max:150',
            'imagen_principal' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'imagen_url' => 'nullable|url|max:500',
            'activo' => 'required|boolean',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ], [
            'imagen_principal.max' => 'La imagen no debe pesar más de 5MB',
            'imagen_url.url' => 'La URL de la imagen no es válida',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser posterior o igual a la fecha de inicio'
        ]);

        $validator->after(function ($validator) use ($request) {
            if (!$request->hasFile('imagen_principal') && !$request->input('imagen_url')) {
                $validator->errors()->add('imagen', 'Debes subir una imagen o proporcionar una URL');
            }
        });

        return $validator;
    }

    private function createBanner(array $validated, Request $request): Banner
    {
        $imagePath = $request->hasFile('imagen_principal')
            ? $request->file('imagen_principal')->store('banners', 'public')
            : ($validated['imagen_url'] ?? null);

        return Banner::create([
            'titulo' => $validated['titulo'],
            'subtitulo' => $validated['subtitulo'] ?? null,
            'imagen_principal' => $imagePath,
            'activo' => (bool)$validated['activo'],
            'fecha_inicio' => $validated['fecha_inicio'] ?? null,
            'fecha_fin' => $validated['fecha_fin'] ?? null,
        ]);
    }

    private function formatBannerData(Banner $banner): array
    {
        return [
            'id' => $banner->id,
            'titulo' => $banner->titulo,
            'subtitulo' => $banner->subtitulo,
            'imagen_principal' => $banner->imagen_principal 
                ? (filter_var($banner->imagen_principal, FILTER_VALIDATE_URL) 
                    ? $banner->imagen_principal 
                    : Storage::url($banner->imagen_principal))
                : null,
            'activo' => $banner->activo,
            'fecha_inicio' => $banner->fecha_inicio?->toDateTimeString(),
            'fecha_fin' => $banner->fecha_fin?->toDateTimeString(),
        ];
    }
}