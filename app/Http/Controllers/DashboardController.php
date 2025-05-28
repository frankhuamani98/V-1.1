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

        // Fechas para el mes actual y el mes pasado
        $now = Carbon::now();
        $inicioMesActual = $now->copy()->startOfMonth();
        $finMesActual = $now->copy()->endOfMonth();
        $inicioMesPasado = $now->copy()->subMonth()->startOfMonth();
        $finMesPasado = $now->copy()->subMonth()->endOfMonth();

        // Pedidos completados este mes
        $completadosMesActual = Pedido::where('estado', 'completado')
            ->whereBetween('created_at', [$inicioMesActual, $finMesActual])
            ->count();

        // Pedidos completados el mes pasado
        $completadosMesPasado = Pedido::where('estado', 'completado')
            ->whereBetween('created_at', [$inicioMesPasado, $finMesPasado])
            ->count();

        // Calcular el cambio porcentual, evitando división por cero
        if ($completadosMesPasado > 0) {
            $cambioPedidosCompletados = (($completadosMesActual - $completadosMesPasado) / $completadosMesPasado) * 100;
        } else {
            $cambioPedidosCompletados = $completadosMesActual > 0 ? 100 : 0;
        }

        // Progreso respecto al mes pasado (puedes ajustar la lógica según tu necesidad)
        $progresoPedidosCompletados = $completadosMesPasado > 0
            ? min(100, ($completadosMesActual / $completadosMesPasado) * 100)
            : ($completadosMesActual > 0 ? 100 : 0);

        // Total de pedidos completados (histórico)
        $totalPedidosCompletados = Pedido::where('estado', 'completado')->count();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'email' => $user->email,
                ],
            ],
            'totalPedidosCompletados' => $totalPedidosCompletados,
            'cambioPedidosCompletados' => round($cambioPedidosCompletados, 1),
            'progresoPedidosCompletados' => round($progresoPedidosCompletados, 1),
        ]);
    }
}