<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Horario extends Model
{
    use HasFactory;

    protected $table = 'horarios';
    
    protected $fillable = [
        'tipo',
        'dia_semana',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'activo',
        'motivo'
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
        'hora_inicio' => 'string',
        'hora_fin' => 'string',
        'activo' => 'boolean',
    ];

    /**
     * Obtener las reservas asociadas a este horario
     */
    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }
}