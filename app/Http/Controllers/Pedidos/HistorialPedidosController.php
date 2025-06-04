<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;

class HistorialPedidosController extends Controller
{
    public function index()
    {
        $pedidos = \App\Models\Pedido::with(['items.producto'])
            ->whereIn('estado', ['completado', 'cancelado'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'numero_orden' => $pedido->numero_orden,
                    'cliente' => $pedido->nombre . ' ' . $pedido->apellidos,
                    'fecha' => $pedido->created_at->format('Y-m-d'),
                    'hora' => $pedido->created_at->format('H:i'),
                    'estado' => ucfirst($pedido->estado),
                    'metodo_pago' => $pedido->metodo_pago,
                    'total' => $pedido->total,
                    'referencia_pago' => $pedido->referencia_pago,
                    'items' => $pedido->items->map(function ($item) {
                        return [
                            'nombre_producto' => $item->nombre_producto,
                            'cantidad' => $item->cantidad,
                            'precio_unitario' => $item->precio_unitario,
                            'subtotal' => $item->subtotal,
                            'imagen' => $item->producto->imagen_principal ?? null,
                        ];
                    }),
                ];
            });

        return Inertia::render('Dashboard/Pedidos/HistorialPedidosPage', [
            'pedidos' => $pedidos,
        ]);
    }
}