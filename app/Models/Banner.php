<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
     * Obtiene la URL de la imagen
     */
    public function getImagenUrlAttribute()
    {
        return $this->imagen_principal;
    }

    /**
     * Elimina la imagen física al eliminar el registro
     */
    protected static function booted()
    {
        static::deleting(function ($banner) {
            // Solo eliminar si es un archivo local (no URL externa)
            if (strpos($banner->imagen_principal, Storage::url('')) === 0) {
                $path = str_replace(Storage::url(''), '', $banner->imagen_principal);
                Storage::disk('public')->delete($path);
            }
        });

        static::updating(function ($banner) {
            // Si se cambia la imagen, eliminar la anterior
            if ($banner->isDirty('imagen_principal') && 
                strpos($banner->getOriginal('imagen_principal'), Storage::url('')) === 0) {
                $path = str_replace(Storage::url(''), '', $banner->getOriginal('imagen_principal'));
                Storage::disk('public')->delete($path);
            }
        });
    }

    /**
     * Verifica si la imagen es una URL externa
     */
    public function esImagenExterna()
    {
        return !str_starts_with($this->imagen_principal, Storage::url(''));
    }

    /**
     * Obtiene el path local de la imagen (si es local)
     */
    public function getImagenLocalPath()
    {
        if ($this->esImagenExterna()) {
            return null;
        }
        
        return str_replace(Storage::url(''), '', $this->imagen_principal);
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
}