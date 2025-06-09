<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';

    protected $fillable = [
        'user_id',
        'nombre',
        'apellidos',
        'dni',
        'direccion',
        'direccion_alternativa',
        'subtotal',
        'total',
        'estado',
        'metodo_pago',
        'referencia_pago',
        'numero_orden',
        'tipo_comprobante'
    ];

    /**
     * Obtener el usuario al que pertenece el pedido
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener los items del pedido
     */
    public function items(): HasMany
    {
        return $this->hasMany(PedidoItem::class);
    }
}
