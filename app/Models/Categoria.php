<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'estado',
    ];

    // Relación con subcategorías (ya existente)
    public function subcategorias()
    {
        return $this->hasMany(Subcategoria::class);
    }

    // NUEVA RELACIÓN: Productos a través de subcategorías
    public function productos()
    {
        return $this->hasManyThrough(
            Producto::class,      // Modelo destino (Producto)
            Subcategoria::class,  // Modelo intermedio (Subcategoria)
            'categoria_id',       // FK en Subcategoria (referencia a Categoria)
            'subcategoria_id',   // FK en Producto (referencia a Subcategoria)
            'id',                 // PK de Categoria (local key)
            'id'                  // PK de Subcategoria (local key)
        );
    }
}