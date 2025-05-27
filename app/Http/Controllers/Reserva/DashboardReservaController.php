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
    public function index()
    {
        $reservas = Reserva::with(['user', 'servicios', 'horario', 'moto'])
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
                    'servicios' => $reserva->servicios->map(function($servicio) {
                        return [
                            'id' => $servicio->id,
                            'nombre' => $servicio->nombre
                        ];
                    }),
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

    public function confirmadas()
    {
        $reservas = Reserva::with(['user', 'servicios', 'horario', 'moto'])
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
                    'servicios' => $reserva->servicios->map(function($servicio) {
                        return [
                            'id' => $servicio->id,
                            'nombre' => $servicio->nombre
                        ];
                    }),
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

    public function horarioAtencion()
    {
        return redirect()->route('dashboard.reservas.horario.index');
    }

    public function actualizarEstado(Request $request, Reserva $reserva)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,confirmada,completada,cancelada',
        ]);

        $reserva->estado = $validated['estado'];
        $reserva->save();

        return back()->with('success', 'Estado de la reserva actualizado correctamente.');
    }

    
    public function show(Reserva $reserva)
    {
        $reserva->load(['user', 'servicios', 'horario', 'moto']);
        
        $reservaFormateada = [
            'id' => $reserva->id,
            'usuario' => $reserva->user ? [
                'id' => $reserva->user->id,
                'name' => $reserva->user->name,
                'telefono' => $reserva->user->phone,
            ] : null,
            'placa' => $reserva->placa,
            'moto' => $reserva->moto ? [
                'id' => $reserva->moto->id,
                'año' => $reserva->moto->año,
                'marca' => $reserva->moto->marca,
                'modelo' => $reserva->moto->modelo
            ] : null,
            'servicios' => $reserva->servicios->map(function($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre
                ];
            }),
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

    public function reprogramar(Request $request, Reserva $reserva)
    {
        $validated = $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|string',
        ]);

        $reserva->fecha = $validated['fecha'];
        $reserva->hora = $validated['hora'];
        $reserva->reprogramada_en = now();
        $reserva->save();

        return back()->with('success', 'Reserva reprogramada correctamente.');
    }
}