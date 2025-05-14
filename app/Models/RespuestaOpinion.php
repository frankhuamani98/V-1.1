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

    public function opinion()
    {
        return $this->belongsTo(Opinion::class, 'opinion_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}