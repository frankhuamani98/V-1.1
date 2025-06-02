<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pedido;
use App\Models\Reserva;
use App\Models\User;
use App\Models\Producto;
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

        // Meta mensual de pedidos y reservas completados (ajusta este valor según tu negocio)
        $metaPedidosMes = 50;
        $metaReservasMes = 50;
        $metaUsuariosMes = 30; // Meta mensual de usuarios nuevos

        $now = Carbon::now();
        $inicioMesActual = $now->copy()->startOfMonth();
        $finMesActual = $now->copy()->endOfMonth();

        // Pedidos completados este mes (SOLO MES ACTUAL)
        $pedidosCompletadosMesActual = Pedido::where('estado', 'completado')
            ->whereBetween('created_at', [$inicioMesActual, $finMesActual])
            ->count();

        // Porcentaje de avance respecto a la meta mensual de pedidos
        $porcentajeMesActual = $metaPedidosMes > 0
            ? min(100, ($pedidosCompletadosMesActual / $metaPedidosMes) * 100)
            : 0;

        // Reservas completadas este mes (SOLO MES ACTUAL)
        $reservasCompletadasMesActual = Reserva::where('estado', 'completada')
            ->whereBetween('created_at', [$inicioMesActual, $finMesActual])
            ->count();

        // Porcentaje de avance respecto a la meta mensual de reservas
        $porcentajeReservasMesActual = $metaReservasMes > 0
            ? min(100, ($reservasCompletadasMesActual / $metaReservasMes) * 100)
            : 0;

        // Nuevos usuarios registrados este mes
        $nuevosUsuariosMesActual = User::whereBetween('created_at', [$inicioMesActual, $finMesActual])->count();

        // Porcentaje de avance respecto a la meta mensual de usuarios
        $progresoUsuariosMesActual = $metaUsuariosMes > 0
            ? min(100, ($nuevosUsuariosMesActual / $metaUsuariosMes) * 100)
            : 0;

        // Total de productos activos
        $totalProductos = Producto::where('estado', 'Activo')->count();

        // Obtener datos de ventas mensuales para el año actual
        $ventasMensuales = [];
        $mesesDelAnio = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        foreach ($mesesDelAnio as $index => $mes) {
            $inicioMes = Carbon::now()->startOfYear()->addMonths($index)->startOfMonth();
            $finMes = $inicioMes->copy()->endOfMonth();

            $pedidosCompletados = Pedido::where('estado', 'completado')
                ->whereBetween('created_at', [$inicioMes, $finMes])
                ->count();

            $ventasMensuales[] = [
                'name' => $mes,
                'sales' => $pedidosCompletados
            ];
        }

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'email' => $user->email,
                ],
            ],
            // SOLO pedidos y reservas completados del mes actual
            'totalPedidosCompletados' => $pedidosCompletadosMesActual,
            'progresoPedidosCompletados' => round($porcentajeMesActual, 1),
            'totalReservasCompletadas' => $reservasCompletadasMesActual,
            'progresoReservasCompletadas' => round($porcentajeReservasMesActual, 1),
            'totalNuevosUsuarios' => $nuevosUsuariosMesActual,
            'progresoNuevosUsuarios' => round($progresoUsuariosMesActual, 1),
            'totalProductos' => $totalProductos,
            'ventasMensuales' => $ventasMensuales,
        ]);
    }
} // End of DashboardController class

