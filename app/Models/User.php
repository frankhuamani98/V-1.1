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
}