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
            Producto::class,      // The final model we want to access
            Subcategoria::class,  // The intermediate model
            'categoria_id',       // Foreign key on the subcategorias table
            'subcategoria_id',    // Foreign key on the productos table
            'id',                 // Local key on the categorias table
            'id'                  // Local key on the subcategorias table
        );
    }
}