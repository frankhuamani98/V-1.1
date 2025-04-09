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
        'nombre_cliente',
        'estrellas',
        'comentario',
        'util_count',
        'comentarios_count'
    ];
    
    // Relación con el usuario que dejó la opinión
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Relación con las respuestas/comentarios a esta opinión
    public function respuestas()
    {
        return $this->hasMany(RespuestaOpinion::class, 'opinion_id');
    }
    
    // Incrementar el contador de útil
    public function incrementarUtil()
    {
        $this->increment('util_count');
    }
    
    // Actualizar contador de comentarios
    public function actualizarComentariosCount()
    {
        $this->comentarios_count = $this->respuestas()->count();
        $this->save();
    }
}