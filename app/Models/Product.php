<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'imagen_principal'
    ];

    protected $appends = ['codigo'];

    public function getCodigoAttribute()
    {
        return 'PROD-' . str_pad($this->id, 5, '0', STR_PAD_LEFT);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}