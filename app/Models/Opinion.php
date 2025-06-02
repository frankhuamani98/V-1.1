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

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function respuestas()
    {
        return $this->hasMany(RespuestaOpinion::class, 'opinion_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}