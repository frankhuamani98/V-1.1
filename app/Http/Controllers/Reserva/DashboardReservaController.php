<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardReservaController extends Controller
{
    /**
     * Muestra todas las reservas para el administrador
     */
    public function index()
    {
        $reservas = Reserva::with(['user', 'servicio'])
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'usuario' => $reserva->user ? $reserva->user->name : 'Usuario eliminado',
                    'vehiculo' => $reserva->vehiculo,
                    'placa' => $reserva->placa,
                    'servicio' => $reserva->servicio ? $reserva->servicio->nombre : 'Servicio no disponible',
                    'fecha' => $reserva->fecha->format('Y-m-d'),
                    'hora' => $reserva->hora,
                    'detalles' => $reserva->detalles,
                    'estado' => $reserva->estado,
                    'created_at' => $reserva->created_at->format('Y-m-d H:i'),
                    'updated_at' => $reserva->updated_at->format('Y-m-d H:i')
                ];
            });
        
        return Inertia::render('Dashboard/Reserva/TodasReservas', [
            'reservas' => $reservas
        ]);
    }

    /**
     * Muestra las reservas confirmadas
     */
    public function confirmadas()
    {
        $reservas = Reserva::with(['user', 'servicio'])
            ->where('estado', 'confirmada')
            ->orderBy('fecha', 'asc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'usuario' => $reserva->user ? $reserva->user->name : 'Usuario eliminado',
                    'vehiculo' => $reserva->vehiculo,
                    'placa' => $reserva->placa,
                    'servicio' => $reserva->servicio ? $reserva->servicio->nombre : 'Servicio no disponible',
                    'fecha' => $reserva->fecha->format('Y-m-d'),
                    'hora' => $reserva->hora,
                    'detalles' => $reserva->detalles,
                    'estado' => $reserva->estado,
                    'created_at' => $reserva->created_at->format('Y-m-d H:i'),
                    'updated_at' => $reserva->updated_at->format('Y-m-d H:i')
                ];
            });
        
        return Inertia::render('Dashboard/Reserva/ReservasConfirmadas', [
            'reservas' => $reservas
        ]);
    }

    /**
     * Muestra el horario de atención para el administrador
     */
    public function horarioAtencion()
    {
        $horarios = [
            ['dia' => 'lunes', 'apertura' => '08:00', 'cierre' => '18:00'],
            ['dia' => 'martes', 'apertura' => '08:00', 'cierre' => '18:00'],
            ['dia' => 'miercoles', 'apertura' => '08:00', 'cierre' => '18:00'],
            ['dia' => 'jueves', 'apertura' => '08:00', 'cierre' => '18:00'],
            ['dia' => 'viernes', 'apertura' => '08:00', 'cierre' => '18:00'],
            ['dia' => 'sabado', 'apertura' => '09:00', 'cierre' => '13:00'],
        ];
        
        return Inertia::render('Dashboard/Reserva/HorarioAtencion', [
            'horarios' => $horarios
        ]);
    }

    /**
     * Cambia el estado de una reserva
     */
    public function actualizarEstado(Request $request, Reserva $reserva)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,confirmada,completada,cancelada',
        ]);

        $reserva->estado = $validated['estado'];
        $reserva->save();

        return back()->with('success', 'Estado de la reserva actualizado correctamente.');
    }

    /**
     * Muestra el detalle de una reserva específica
     */
    public function show(Reserva $reserva)
    {
        // Carga las relaciones
        $reserva->load(['user', 'servicio']);
        
        $reservaFormateada = [
            'id' => $reserva->id,
            'usuario' => $reserva->user ? [
                'id' => $reserva->user->id,
                'name' => $reserva->user->name,
                'email' => $reserva->user->email,
            ] : null,
            'vehiculo' => $reserva->vehiculo,
            'placa' => $reserva->placa,
            'servicio' => $reserva->servicio ? [
                'id' => $reserva->servicio->id,
                'nombre' => $reserva->servicio->nombre,
                'precio_base' => (float) $reserva->servicio->precio_base,
                'duracion_estimada' => $reserva->servicio->duracion_estimada,
            ] : null,
            'fecha' => $reserva->fecha->format('Y-m-d'),
            'hora' => $reserva->hora,
            'detalles' => $reserva->detalles,
            'estado' => $reserva->estado,
            'created_at' => $reserva->created_at->format('Y-m-d H:i'),
            'updated_at' => $reserva->updated_at->format('Y-m-d H:i')
        ];
        
        return Inertia::render('Dashboard/Reserva/DetalleReserva', [
            'reserva' => $reservaFormateada
        ]);
    }
}