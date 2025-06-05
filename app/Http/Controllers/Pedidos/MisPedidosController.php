<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Support\Facades\Auth;

class MisPedidosController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['items.producto'])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at') 
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'numero_orden' => $pedido->numero_orden,
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

        return Inertia::render('Home/Partials/Pedidos/MisPedidos', [
            'pedidos' => $pedidos,
        ]);
    }
}
