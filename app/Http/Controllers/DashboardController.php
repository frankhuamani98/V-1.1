<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pedido;
use App\Models\Reserva;
use App\Models\User;
use App\Models\Producto;
use App\Models\Categoria; // Asegúrate de tener este modelo
use App\Models\Moto;
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

        // Reservas Completadas este mes (SOLO MES ACTUAL)
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

        // Top productos: destacados y más vendidos
        $totalDestacados = Producto::where('estado', 'Activo')->where('destacado', true)->count();
        $totalMasVendidos = Producto::where('estado', 'Activo')->where('mas_vendido', true)->count();

        // Obtener cantidad de productos por categoría (NO stock)
        $productosPorCategoria = Producto::where('estado', 'Activo')
            ->selectRaw('categoria_id, COUNT(*) as cantidad_productos')
            ->groupBy('categoria_id')
            ->with('categoria:id,nombre')
            ->get();

        $productosPorCategoriaData = $productosPorCategoria->map(function($item) {
            return [
                'name' => $item->categoria ? $item->categoria->nombre : 'Sin categoría',
                'value' => (int) $item->cantidad_productos,
            ];
        });

        // Obtener datos de ventas mensuales para el año actual
        $ventasMensuales = [];
        $reservasMensuales = [];
        $usuariosNuevosMensuales = [];
        $mesesDelAnio = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        foreach ($mesesDelAnio as $index => $mes) {
            $inicioMes = Carbon::now()->startOfYear()->addMonths($index)->startOfMonth();
            $finMes = $inicioMes->copy()->endOfMonth();

            $pedidosCompletados = Pedido::where('estado', 'completado')
                ->whereBetween('created_at', [$inicioMes, $finMes])
                ->count();

            $reservasCompletadas = Reserva::where('estado', 'completada')
                ->whereBetween('created_at', [$inicioMes, $finMes])
                ->count();

            $usuariosNuevos = User::whereBetween('created_at', [$inicioMes, $finMes])->count();

            $ventasMensuales[] = [
                'name' => $mes,
                'sales' => $pedidosCompletados
            ];
            $reservasMensuales[] = [
                'name' => $mes,
                'reservas' => $reservasCompletadas
            ];
            $usuariosNuevosMensuales[] = [
                'name' => $mes,
                'nuevos' => $usuariosNuevos,
            ];
        }

        // Obtener las últimas 5 motos registradas
        $ultimasMotos = Moto::orderBy('created_at', 'desc')->take(5)->get()->map(function($moto) {
            return [
                'id' => $moto->id,
                'name' => "{$moto->marca} {$moto->modelo} {$moto->año}",
                'estado' => $moto->estado,
                'date' => $moto->created_at->diffForHumans(),
            ];
        });

        // Obtener las últimas 5 reservas registradas
        $ultimasReservas = \App\Models\Reserva::with(['user', 'moto'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($reserva) {
                return [
                    'id' => $reserva->id,
                    'customer' => $reserva->user ? $reserva->user->name : 'Sin usuario',
                    'type' => $reserva->servicio_id, // Puedes ajustar para mostrar el nombre del servicio si tienes relación
                    'vehicle' => $reserva->moto ? "{$reserva->moto->marca} {$reserva->moto->modelo}" : 'Sin moto',
                    'time' => $reserva->created_at->diffForHumans(),
                ];
            });

        // Obtener las 5 opiniones más recientes con usuario
        $opiniones = \App\Models\Opinion::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($opinion) {
                return [
                    'id' => $opinion->id,
                    'user' => $opinion->user ? ['name' => $opinion->user->name] : null,
                    'calificacion' => $opinion->calificacion,
                    'contenido' => $opinion->contenido,
                    'created_at' => $opinion->created_at->diffForHumans(),
                    'util' => $opinion->util,
                    'es_soporte' => $opinion->es_soporte,
                ];
            });

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'dni' => $user->dni,
                    'sexo' => $user->sexo,
                    'phone' => $user->phone,
                    'address' => $user->address,
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
            'reservasMensuales' => $reservasMensuales,
            'usuariosNuevosMensuales' => $usuariosNuevosMensuales,
            'topProductosData' => [
                ['name' => 'Destacados', 'value' => $totalDestacados],
                ['name' => 'Más Vendidos', 'value' => $totalMasVendidos],
            ],
            'stockPorCategoriaData' => $productosPorCategoriaData, // <--- NUEVO
            'ultimasMotos' => $ultimasMotos,
            'upcomingAppointments' => $ultimasReservas, // Cambia aquí para pasar las últimas reservas
            'opiniones' => $opiniones,
        ]);
    }
} // End of DashboardController class

