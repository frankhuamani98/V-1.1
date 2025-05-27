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
        'horario_id',
        'fecha',
        'hora',
        'detalles',
        'estado',
        'reprogramada_en',
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
        'hora' => 'string',
        'created_at' => 'datetime:Y-m-d H:i',
        'updated_at' => 'datetime:Y-m-d H:i',
        'reprogramada_en' => 'datetime:Y-m-d H:i',
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->setTimezone(new \DateTimeZone('America/Lima'))->format('Y-m-d H:i');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function moto(): BelongsTo
    {
        return $this->belongsTo(Moto::class);
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'reserva_servicio')
            ->withTimestamps();
    }

    public function horario(): BelongsTo
    {
        return $this->belongsTo(Horario::class);
    }
}