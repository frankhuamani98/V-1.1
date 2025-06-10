<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;

class PedidosFinalizadosController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['items', 'items.producto', 'user', 'facturacion'])
            ->where('estado', 'completado')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($pedido) {
                $facturacion = $pedido->facturacion()->first();
                return [
                    'id' => $pedido->id,
                    'cliente' => $pedido->nombre . ' ' . $pedido->apellidos,
                    'fecha' => $pedido->created_at->format('Y-m-d'),
                    'estado' => ucfirst($pedido->estado),
                    'direccion' => $pedido->direccion,
                    'numeroOrden' => 'ORD-' . str_pad($pedido->id, 5, '0', STR_PAD_LEFT),
                    'tipo_comprobante' => strtolower($pedido->tipo_comprobante ?: ''),
                    'dni' => $pedido->dni,
                    'user' => [
                        'dni' => $pedido->user->dni ?? null
                    ],
                    'items' => $pedido->items->map(function ($item) {
                        return [
                            'nombre_producto' => $item->nombre_producto,
                            'cantidad' => $item->cantidad,
                            'precio_unitario' => $item->precio_unitario,
                            'subtotal' => $item->subtotal,
                            'imagen' => $item->producto->imagen_principal ?? null,
                        ];
                    }),
                    'comprobante_generado' => $facturacion ? [
                        'tipo' => $facturacion->tipo_comprobante,
                        'numero' => $facturacion->numero_comprobante,
                        'estado' => $facturacion->estado
                    ] : null
                ];
            });

        return Inertia::render('Dashboard/Pedidos/PedidosFinalizadosPage', [
            'pedidos' => $pedidos,
        ]);
    }
}