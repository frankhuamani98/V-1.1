<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opinion extends Model
{
    use HasFactory;

    protected $table = 'opiniones';

    protected $fillable = [
        'user_id',
        'calificacion',
        'contenido',
        'util',
        'es_soporte'
    ];

    // Relación con el usuario que creó la opinión
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación con las respuestas a esta opinión
    public function respuestas()
    {
        return $this->hasMany(RespuestaOpinion::class, 'opinion_id');
    }
}