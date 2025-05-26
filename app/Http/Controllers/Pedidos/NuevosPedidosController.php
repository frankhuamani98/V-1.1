<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pedido;

class NuevosPedidosController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['user'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'cliente' => $pedido->nombre . ' ' . $pedido->apellidos,
                    'servicio' => '', // Si tienes campo servicio, cámbialo aquí
                    'moto' => '',     // Si tienes campo moto, cámbialo aquí
                    'fecha' => $pedido->created_at->format('Y-m-d'),
                    'estado' => ucfirst($pedido->estado),
                ];
            });

        return Inertia::render('Dashboard/Pedidos/NuevosPedidosPage', [
            'pedidos' => $pedidos,
        ]);
    }
}