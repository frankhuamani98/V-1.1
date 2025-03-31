<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

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

    // Scope para banners activos
    public function scopeActivos(Builder $query)
    {
        return $query->where('activo', true);
    }

    // Scope para banners vigentes
    public function scopeVigentes(Builder $query)
    {
        $now = now();
        return $query->where(function($q) use ($now) {
            $q->whereNull('fecha_inicio')
              ->orWhere('fecha_inicio', '<=', $now);
        })->where(function($q) use ($now) {
            $q->whereNull('fecha_fin')
              ->orWhere('fecha_fin', '>=', $now);
        });
    }

    // Scope para ordenar banners
    public function scopeOrdenados(Builder $query)
    {
        return $query->orderBy('orden', 'asc');
    }

    // Accessor para obtener la URL completa de la imagen
    public function getImagenCompletaAttribute()
    {
        // Si ya es una URL completa (http/https), devolverla tal cual
        if (filter_var($this->imagen_principal, FILTER_VALIDATE_URL)) {
            return $this->imagen_principal;
        }
        
        // Si es una ruta local (/storage/...), convertirla a URL completa
        if (str_starts_with($this->imagen_principal, '/storage/')) {
            return asset($this->imagen_principal);
        }
        
        // Para cualquier otro caso (por seguridad), devolver la imagen original
        return $this->imagen_principal;
    }
}