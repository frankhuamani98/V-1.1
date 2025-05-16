<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'producto_id',
        'nombre',
        'precio',
        'precio_original',
        'precio_final',
        'igv',
        'descuento',
        'quantity',
        'imagen',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio' => 'decimal:2',
        'precio_original' => 'decimal:2',
        'precio_final' => 'decimal:2',
        'igv' => 'decimal:2',
        'descuento' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function getTotalAttribute()
    {
        return $this->precio * $this->quantity;
    }
}
