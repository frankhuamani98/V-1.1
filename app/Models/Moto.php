<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Moto extends Model
{
    use HasFactory;

    protected $fillable = [
        'marca',
        'modelo',
        'año',
        'estado'
    ];

    // Estados disponibles
    const ESTADO_ACTIVO = 'Activo';
    const ESTADO_INACTIVO = 'Inactivo';
    const ESTADO_DESCONTINUADO = 'Descontinuado';

    /**
     * Relación muchos a muchos con productos
     */
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'moto_producto');
    }

    // Accesor para mostrar nombre completo
    public function getNombreCompletoAttribute()
    {
        return "{$this->marca} {$this->modelo} ({$this->año})";
    }

    /**
     * Obtener los estados disponibles para una moto
     */
    public static function getEstadosDisponibles(): array
    {
        return [
            self::ESTADO_ACTIVO,
            self::ESTADO_INACTIVO,
            self::ESTADO_DESCONTINUADO
        ];
    }

    /**
     * Scope para motos activas
     */
    public function scopeActivas($query)
    {
        return $query->where('estado', self::ESTADO_ACTIVO);
    }
}