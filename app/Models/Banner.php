<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'titulo',
        'subtitulo',
        'imagen_principal',
        'tipo_imagen',
        'activo',
        'fecha_inicio',
        'fecha_fin',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'deleted_at' => 'datetime',
        'tipo_imagen' => 'string',
    ];
}