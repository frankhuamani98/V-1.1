<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;

class EstadoPedidosController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['user', 'items', 'items.producto'])
            ->whereIn('estado', ['pendiente', 'procesando', 'completado', 'cancelado'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'cliente' => $pedido->nombre . ' ' . $pedido->apellidos,
                    'fecha' => $pedido->created_at->format('Y-m-d'),
                    'estado' => ucfirst($pedido->estado),
                ];
            });

        return Inertia::render('Dashboard/Pedidos/EstadoPedidosPage', [
            'pedidos' => $pedidos,
        ]);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,procesando,completado,cancelado',
        ]);

        $pedido = \App\Models\Pedido::findOrFail($id);
        $pedido->estado = $request->estado;
        $pedido->save();

        return response()->json(['success' => true]);
    }
}