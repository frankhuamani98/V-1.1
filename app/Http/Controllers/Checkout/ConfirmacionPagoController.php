<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfirmacionPagoController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Partials/Checkout/ConfirmacionPago');
    }

    public function show($id)
    {
        $pedido = Pedido::findOrFail($id);
        return Inertia::render('Home/Partials/Checkout/ConfirmacionPago', [
            'pedido' => $pedido,
            'numero_orden' => $pedido->numero_orden,
            'redirectTo' => route('pedidos.mis-pedidos')
        ]);
    }
}

