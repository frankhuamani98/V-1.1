<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespuestaOpinion extends Model
{
    use HasFactory;

    protected $table = 'respuestas_opiniones';

    protected $fillable = [
        'opinion_id',
        'user_id',
        'contenido',
        'es_soporte'
    ];

    // Relación con la opinión a la que pertenece esta respuesta
    public function opinion()
    {
        return $this->belongsTo(Opinion::class, 'opinion_id');
    }

    // Relación con el usuario que creó la respuesta
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}