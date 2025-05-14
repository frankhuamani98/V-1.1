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

    public function subcategorias()
    {
        return $this->hasMany(Subcategoria::class);
    }

    public function productos()
    {
        return $this->hasManyThrough(
            Producto::class,
            Subcategoria::class,
            'categoria_id',
            'subcategoria_id',
            'id',
            'id'
        );
    }
}