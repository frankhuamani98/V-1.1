<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RespuestaOpinion extends Model
{
    use HasFactory;
    
    protected $table = 'respuestas_opinion';
    
    protected $fillable = [
        'opinion_id',
        'user_id',
        'nombre_respondedor',
        'respuesta'
    ];
    
    // Relación con la opinión principal
    public function opinion()
    {
        return $this->belongsTo(Opinion::class, 'opinion_id');
    }
    
    // Relación con el usuario que respondió
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Al crear una nueva respuesta, actualizar el contador en la opinión
    protected static function booted()
    {
        static::created(function ($respuesta) {
            $respuesta->opinion->actualizarComentariosCount();
        });
        
        static::deleted(function ($respuesta) {
            $respuesta->opinion->actualizarComentariosCount();
        });
    }
}