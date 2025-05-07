<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'dni',
        'sexo',
        'email',
        'phone',
        'address',
        'password',
        'terms',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'terms' => 'boolean',
    ];

    // Mutator para normalizar el email a minúsculas al guardar
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = strtolower($value);
    }

    // Accessor para obtener el nombre completo del usuario
    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Mutator para hashear la contraseña
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    // Relación con las opiniones del usuario
    public function opiniones()
    {
        return $this->hasMany(Opinion::class, 'user_id');
    }

    // Relación con las respuestas del usuario
    public function respuestasOpiniones()
    {
        return $this->hasMany(RespuestaOpinion::class, 'user_id');
    }

    // Relación con las reservas del usuario
    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}