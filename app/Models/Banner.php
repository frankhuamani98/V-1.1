<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'imagen_principal',
        'activo',
        'orden'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer'
    ];

    /**
     * Scope para banners activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
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
}