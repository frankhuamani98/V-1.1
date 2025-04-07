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
        'precio',
        'descuento',
        'precio_con_descuento',
        'igv',
        'precio_final',
        'incluye_igv',
        'stock',
        'imagen_principal',
        'compatible_motos',
        'moto_especifica',
        'es_destacado',
        'es_mas_vendido',
        'calificacion',
        'subcategoria_id'
    ];

    protected $casts = [
        'incluye_igv' => 'boolean',
        'es_destacado' => 'boolean',
        'es_mas_vendido' => 'boolean',
    ];

    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    public function categoria()
    {
        return $this->hasOneThrough(
            Categoria::class,
            Subcategoria::class,
            'id',
            'id',
            'subcategoria_id',
            'categoria_id'
        );
    }

    // Accesor para la URL de la imagen
    public function getImagenUrlAttribute()
    {
        if (filter_var($this->imagen_principal, FILTER_VALIDATE_URL)) {
            return $this->imagen_principal;
        }
        
        return $this->imagen_principal ? asset('storage/'.$this->imagen_principal) : null;
    }
}