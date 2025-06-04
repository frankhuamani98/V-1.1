<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;

class NuevosPedidosController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['user', 'items'])
            ->where('estado', 'pendiente')
            ->orderByDesc('created_at')
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

        return Inertia::render('Dashboard/Pedidos/NuevosPedidosPage', [
            'pedidos' => $pedidos,
        ]);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,procesando,completado,cancelado',
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->estado = $request->estado;
        $pedido->save();

        return redirect()->back()->with([
            'success' => 'Estado actualizado correctamente',
            'estado' => ucfirst($pedido->estado),
        ]);
    }
}