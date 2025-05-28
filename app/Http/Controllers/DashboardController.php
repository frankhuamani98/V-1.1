<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pedido;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect('/')->with('error', 'Por favor, inicie sesión como administrador.');
        }

        if (Auth::user()->role !== 'admin') {
            return redirect('/')->with('error', 'Solo los administradores pueden acceder al dashboard.');
        }

        $user = Auth::user();

        // Meta mensual de pedidos completados (ajusta este valor según tu negocio)
        $metaPedidosMes = 50;

        $now = Carbon::now();
        $inicioMesActual = $now->copy()->startOfMonth();
        $finMesActual = $now->copy()->endOfMonth();

        // Pedidos completados este mes (SOLO MES ACTUAL)
        $pedidosCompletadosMesActual = Pedido::where('estado', 'completado')
            ->whereBetween('created_at', [$inicioMesActual, $finMesActual])
            ->count();

        // Porcentaje de avance respecto a la meta mensual
        $porcentajeMesActual = $metaPedidosMes > 0
            ? min(100, ($pedidosCompletadosMesActual / $metaPedidosMes) * 100)
            : 0;

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'email' => $user->email,
                ],
            ],
            // SOLO pedidos completados del mes actual
            'totalPedidosCompletados' => $pedidosCompletadosMesActual,
            'progresoPedidosCompletados' => round($porcentajeMesActual, 1),
            // Elimina cualquier referencia al mes pasado
        ]);
    }
}