<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Equipo extends Model
{
    use HasFactory;

    protected $table = 'equipo';

    protected $fillable = [
        'nombre',
        'cargo',
        'descripcion',
        'imagen',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];
}