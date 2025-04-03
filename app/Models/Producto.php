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
        'descuento' => 'decimal:2',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i'
    ];

    // Estados disponibles
    const ESTADO_ACTIVO = 'Activo';
    const ESTADO_INACTIVO = 'Inactivo';
    const ESTADO_AGOTADO = 'Agotado';

    /**
     * Accesor para limpiar las URLs de las imágenes adicionales
     */
    public function getImagenesAdicionalesAttribute($value)
    {
        if (empty($value)) {
            return [];
        }

        $imagenes = json_decode($value, true) ?? [];
        
        return array_map(function ($img) {
            return [
                'url' => str_replace('\/', '/', $img['url'] ?? ''),
                'estilo' => $img['estilo'] ?? ''
            ];
        }, $imagenes);
    }

    /**
     * Accesor para el precio formateado
     */
    public function getPrecioFormateadoAttribute()
    {
        return 'S/ ' . number_format($this->precio, 2);
    }

    /**
     * Accesor para el precio con descuento formateado
     */
    public function getPrecioTotalAttribute()
    {
        $precioConDescuento = $this->precio - ($this->precio * $this->descuento / 100);
        return 'S/ ' . number_format($precioConDescuento, 2);
    }

    /**
     * Accesor para la descripción de la moto
     */
    public function getMotoDescripcionAttribute()
    {
        if (!$this->moto) {
            return 'No aplica';
        }
        return $this->moto->marca . ' ' . $this->moto->modelo . ' (' . $this->moto->año . ')';
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

    /**
     * Relación con la categoría
     */
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    /**
     * Relación con la subcategoría
     */
    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    /**
     * Relación con la moto
     */
    public function moto()
    {
        return $this->belongsTo(Moto::class);
    }

    /**
     * Mutador para asegurar que las imágenes adicionales sean un array válido
     */
    public function setImagenesAdicionalesAttribute($value)
    {
        if (is_string($value)) {
            $value = json_decode($value, true) ?? [];
        }

        $this->attributes['imagenes_adicionales'] = json_encode(array_map(function ($img) {
            return [
                'url' => $img['url'] ?? '',
                'estilo' => $img['estilo'] ?? ''
            ];
        }, (array)$value));
    }
}