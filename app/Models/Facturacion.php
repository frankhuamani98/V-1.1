<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Facturacion extends Model
{
    protected $table = 'facturacion';

    protected $fillable = [
        'pedido_id',
        'tipo_comprobante',
        'numero_comprobante',
        'dni',
        'nombre_cliente',
        'subtotal',
        'igv',
        'total',
        'estado',
        'observaciones'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'igv' => 'decimal:2',
        'total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    public function isFactura(): bool
    {
        return $this->tipo_comprobante === 'factura';
    }

    public function isBoleta(): bool
    {
        return $this->tipo_comprobante === 'boleta';
    }

    public function isNotaVenta(): bool
    {
        return $this->tipo_comprobante === 'nota_venta';
    }

    public function isAnulado(): bool
    {
        return $this->estado === 'anulado';
    }

    public function getTipoDocumento(): string
    {
        return match($this->tipo_comprobante) {
            'factura', 'boleta', 'nota_venta' => 'DNI',
            default => 'N/A'
        };
    }

    public function getNumeroDocumento(): ?string
    {
        return match($this->tipo_comprobante) {
            'factura', 'boleta', 'nota_venta' => $this->dni,
            default => null
        };
    }
}
