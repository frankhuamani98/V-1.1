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
        'precio' => 'float',  // Cambiado a float para mejor manejo
        'descuento' => 'float' // Cambiado a float para mejor manejo
    ];

    const ESTADO_ACTIVO = 'Activo';
    const ESTADO_INACTIVO = 'Inactivo';
    const ESTADO_DESCONTINUADO = 'Descontinuado';

    public static function getEstadosDisponibles(): array
    {
        return [
            self::ESTADO_ACTIVO,
            self::ESTADO_INACTIVO,
            self::ESTADO_DESCONTINUADO
        ];
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    // Relación muchos a muchos con motos
    public function motos()
    {
        return $this->belongsToMany(Moto::class, 'moto_producto');
    }

    public function getPrecioConDescuentoAttribute()
    {
        return $this->precio * (1 - ($this->descuento / 100));
    }

    public function getPrecioFinalAttribute()
    {
        return $this->incluye_igv 
            ? $this->precioConDescuento 
            : $this->precioConDescuento * 1.18;
    }

    public function scopeActivos($query)
    {
        return $query->where('estado', self::ESTADO_ACTIVO);
    }

    public function scopeDestacados($query)
    {
        return $query->where('destacado', true);
    }

    public function scopeMasVendidos($query)
    {
        return $query->where('mas_vendido', true);
    }

    public function scopeBuscar($query, $search)
    {
        return $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('descripcion_corta', 'like', "%{$search}%");
    }
}