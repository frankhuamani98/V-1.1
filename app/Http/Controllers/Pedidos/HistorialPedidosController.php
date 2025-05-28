<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;

class HistorialPedidosController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['items'])
            ->select([
                'id',
                'numero_orden',
                \DB::raw("CONCAT(nombre, ' ', apellidos) as cliente"),
                'created_at as fecha',
                'estado',
                'metodo_pago',
                'total',
                'referencia_pago',
                // Si tienes campo 'hora', inclúyelo aquí
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard/Pedidos/HistorialPedidosPage', [
            'pedidos' => $pedidos,
        ]);
    }
}