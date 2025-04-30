<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'moto_id',
        'placa',
        'servicio_id',
        'horario_id',
        'fecha',
        'hora',
        'detalles',
        'estado',
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
        'hora' => 'string',
        'created_at' => 'datetime:Y-m-d H:i',
        'updated_at' => 'datetime:Y-m-d H:i',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relación con la moto
    public function moto(): BelongsTo
    {
        return $this->belongsTo(Moto::class);
    }

    // Relación con el servicio
    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class);
    }

    // Relación con el horario
    public function horario(): BelongsTo
    {
        return $this->belongsTo(Horario::class);
    }
}