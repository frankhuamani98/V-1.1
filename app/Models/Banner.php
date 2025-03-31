<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'subtitulo',
        'imagen_principal',
        'activo',
        'orden',
        'fecha_inicio',
        'fecha_fin'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime'
    ];

    protected $appends = ['imagen_url'];

    /**
     * Scope para banners activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para banners vigentes (entre fechas si están definidas)
     */
    public function scopeVigentes($query)
    {
        return $query->where(function($q) {
            $q->whereNull('fecha_inicio')
              ->orWhere('fecha_inicio', '<=', now());
        })->where(function($q) {
            $q->whereNull('fecha_fin')
              ->orWhere('fecha_fin', '>=', now());
        });
    }

    /**
     * Scope ordenado por el campo 'orden'
     */
    public function scopeOrdenados($query)
    {
        return $query->orderBy('orden');
    }

    /**
     * Obtiene la URL completa de la imagen
     */
    public function getImagenUrlAttribute()
    {
        if ($this->esImagenExterna()) {
            return $this->imagen_principal;
        }
        
        return $this->imagen_principal 
            ? Storage::url($this->imagen_principal)
            : $this->getDefaultImageUrl();
    }

    /**
     * URL de imagen por defecto
     */
    protected function getDefaultImageUrl()
    {
        return asset('images/default-banner.jpg');
    }

    /**
     * Elimina la imagen física al eliminar el registro
     */
    protected static function booted()
    {
        static::deleting(function ($banner) {
            $banner->eliminarImagenLocal();
        });

        static::updating(function ($banner) {
            if ($banner->isDirty('imagen_principal') && !$banner->esImagenExterna()) {
                $banner->eliminarImagenLocal($banner->getOriginal('imagen_principal'));
            }
        });
    }

    /**
     * Elimina la imagen local del almacenamiento
     */
    public function eliminarImagenLocal($path = null)
    {
        $path = $path ?: $this->imagen_principal;
        
        if (!$this->esImagenExterna($path) && Storage::exists($path)) {
            Storage::delete($path);
        }
    }

    /**
     * Verifica si la imagen es una URL externa
     */
    public function esImagenExterna($url = null)
    {
        $url = $url ?: $this->imagen_principal;
        
        if (empty($url)) {
            return false;
        }

        return filter_var($url, FILTER_VALIDATE_URL) && 
               !str_starts_with($url, Storage::url(''));
    }

    /**
     * Verifica si el banner está actualmente activo según sus fechas
     */
    public function estaActivo()
    {
        if (!$this->activo) {
            return false;
        }

        $now = now();
        $inicioValido = is_null($this->fecha_inicio) || $this->fecha_inicio <= $now;
        $finValido = is_null($this->fecha_fin) || $this->fecha_fin >= $now;

        return $inicioValido && $finValido;
    }

    /**
     * Guarda una nueva imagen y devuelve el path
     */
    public function guardarImagen($file, $directory = 'banners')
    {
        // Eliminar imagen anterior si existe
        $this->eliminarImagenLocal();

        // Guardar nueva imagen
        $path = $file->store($directory, 'public');
        
        // Actualizar el modelo
        $this->imagen_principal = $path;
        
        return $path;
    }

    /**
     * Actualiza la imagen desde una URL
     */
    public function actualizarImagenDesdeUrl($url)
    {
        // Eliminar imagen anterior si es local
        $this->eliminarImagenLocal();

        // Actualizar con nueva URL
        $this->imagen_principal = $url;
    }

    /**
     * Obtiene los banners para el carrusel
     */
    public static function obtenerParaCarrusel($limit = 5)
    {
        return static::activos()
            ->vigentes()
            ->ordenados()
            ->limit($limit)
            ->get();
    }
}