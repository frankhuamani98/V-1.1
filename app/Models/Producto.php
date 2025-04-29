<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion_corta',
        'detalles',
        'categoria_id',
        'subcategoria_id',
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
        'incluye_igv' => 'boolean',
        'destacado' => 'boolean',
        'mas_vendido' => 'boolean',
        'precio' => 'decimal:2',
        'descuento' => 'decimal:2'
    ];

    // Estados disponibles
    const ESTADO_ACTIVO = 'Activo';
    const ESTADO_INACTIVO = 'Inactivo';
    const ESTADO_DESCONTINUADO = 'Descontinuado';

    /**
     * Obtener los estados disponibles para un producto
     */
    public static function getEstadosDisponibles(): array
    {
        return [
            self::ESTADO_ACTIVO,
            self::ESTADO_INACTIVO,
            self::ESTADO_DESCONTINUADO
        ];
    }

    // Relación con categoría
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Relación con subcategoría
    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    // Relación muchos a muchos con motos
    public function motos()
    {
        return $this->belongsToMany(Moto::class);
    }

    // Accesor para precio con descuento
    public function getPrecioConDescuentoAttribute()
    {
        return $this->precio * (1 - ($this->descuento / 100));
    }

    // Accesor para precio final (considerando IGV)
    public function getPrecioFinalAttribute()
    {
        return $this->incluye_igv 
            ? $this->precioConDescuento 
            : $this->precioConDescuento * 1.18;
    }

    /**
     * Scope para productos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', self::ESTADO_ACTIVO);
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
     * Scope para búsqueda de productos
     */
    public function scopeBuscar($query, $search)
    {
        return $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('descripcion_corta', 'like', "%{$search}%");
    }
}