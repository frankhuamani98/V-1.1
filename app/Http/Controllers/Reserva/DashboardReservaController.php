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
        $reservas = Reserva::with(['user', 'servicio', 'horario', 'moto'])
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'usuario' => $reserva->user ? $reserva->user->name : 'Usuario eliminado',
                    'placa' => $reserva->placa,
                    'moto' => $reserva->moto ? [
                        'año' => $reserva->moto->año,
                        'marca' => $reserva->moto->marca,
                        'modelo' => $reserva->moto->modelo
                    ] : null,
                    'servicio' => $reserva->servicio ? $reserva->servicio->nombre : 'Servicio no disponible',
                    'horario_id' => $reserva->horario_id,
                    'horario' => $reserva->horario ? [
                        'id' => $reserva->horario->id,
                        'tipo' => $reserva->horario->tipo,
                        'hora_inicio' => $reserva->horario->hora_inicio,
                        'hora_fin' => $reserva->horario->hora_fin
                    ] : null,
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
        $reservas = Reserva::with(['user', 'servicio', 'horario', 'moto'])
            ->where('estado', 'confirmada')
            ->orderBy('fecha', 'asc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'usuario' => $reserva->user ? $reserva->user->name : 'Usuario eliminado',
                    'placa' => $reserva->placa,
                    'moto' => $reserva->moto ? [
                        'año' => $reserva->moto->año,
                        'marca' => $reserva->moto->marca,
                        'modelo' => $reserva->moto->modelo
                    ] : null,
                    'servicio' => $reserva->servicio ? $reserva->servicio->nombre : 'Servicio no disponible',
                    'horario_id' => $reserva->horario_id,
                    'horario' => $reserva->horario ? [
                        'id' => $reserva->horario->id,
                        'tipo' => $reserva->horario->tipo,
                        'hora_inicio' => $reserva->horario->hora_inicio,
                        'hora_fin' => $reserva->horario->hora_fin
                    ] : null,
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
        return redirect()->route('dashboard.reservas.horario.index');
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
        $reserva->load(['user', 'servicio', 'horario', 'moto']);
        
        $reservaFormateada = [
            'id' => $reserva->id,
            'usuario' => $reserva->user ? [
                'id' => $reserva->user->id,
                'name' => $reserva->user->name,
                'email' => $reserva->user->email,
            ] : null,
            'placa' => $reserva->placa,
            'moto' => $reserva->moto ? [
                'id' => $reserva->moto->id,
                'año' => $reserva->moto->año,
                'marca' => $reserva->moto->marca,
                'modelo' => $reserva->moto->modelo
            ] : null,
            'servicio' => $reserva->servicio ? [
                'id' => $reserva->servicio->id,
                'nombre' => $reserva->servicio->nombre,
                'precio_base' => (float) $reserva->servicio->precio_base,
                'duracion_estimada' => $reserva->servicio->duracion_estimada,
            ] : null,
            'horario_id' => $reserva->horario_id,
            'horario' => $reserva->horario ? [
                'id' => $reserva->horario->id,
                'tipo' => $reserva->horario->tipo,
                'dia_semana' => $reserva->horario->dia_semana ?? null,
                'fecha' => $reserva->horario->fecha ? $reserva->horario->fecha->format('Y-m-d') : null,
                'hora_inicio' => $reserva->horario->hora_inicio,
                'hora_fin' => $reserva->horario->hora_fin,
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