<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion_corta',
        'detalles',
        'categoria_id',
        'subcategoria_id',
        'moto_id',
        'precio',
        'descuento',
        'imagen_principal',
        'imagenes_adicionales',
        'calificacion',
        'incluye_igv',
        'stock',
        'destacado',
        'mas_vendido',
        'estado'
    ];

    protected $casts = [
        'imagenes_adicionales' => 'array',
        'destacado' => 'boolean',
        'mas_vendido' => 'boolean',
        'incluye_igv' => 'boolean',
        'precio' => 'decimal:2',
        'descuento' => 'decimal:2'
    ];

    // Estados disponibles
    const ESTADO_ACTIVO = 'Activo';
    const ESTADO_INACTIVO = 'Inactivo';
    const ESTADO_AGOTADO = 'Agotado';

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    public function moto()
    {
        return $this->belongsTo(Moto::class);
    }

    /**
     * Obtener los estados disponibles para un producto
     */
    public static function getEstadosDisponibles(): array
    {
        return [
            self::ESTADO_ACTIVO,
            self::ESTADO_INACTIVO,
            self::ESTADO_AGOTADO
        ];
    }

    /**
     * Scope para productos destacados
     */
    public function scopeDestacados($query)
    {
        return $query->where('destacado', true);
    }

    /**
     * Scope para productos más vendidos
     */
    public function scopeMasVendidos($query)
    {
        return $query->where('mas_vendido', true);
    }

    /**
     * Scope para productos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', self::ESTADO_ACTIVO);
    }
}