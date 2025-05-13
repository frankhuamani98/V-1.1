<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardHorarioController extends Controller
{
    public function index()
    {
        $horariosRecurrentes = Horario::where('tipo', 'recurrente')
            ->orderBy('dia_semana')
            ->get()
            ->map(function ($horario) {
                return [
                    'id' => $horario->id,
                    'tipo' => $horario->tipo,
                    'dia_semana' => $horario->dia_semana,
                    'hora_inicio' => $horario->hora_inicio,
                    'hora_fin' => $horario->hora_fin,
                    'activo' => $horario->activo,
                ];
            });
        $excepciones = Horario::where('tipo', 'excepcion')
            ->orderBy('fecha')
            ->get()
            ->map(function ($horario) {
                return [
                    'id' => $horario->id,
                    'tipo' => $horario->tipo,
                    'fecha' => $horario->fecha->format('Y-m-d'),
                    'hora_inicio' => $horario->hora_inicio,
                    'hora_fin' => $horario->hora_fin,
                    'activo' => $horario->activo,
                    'motivo' => $horario->motivo,
                ];
            });
        
        return Inertia::render('Dashboard/Reserva/HorarioAtencion', [
            'horariosRecurrentes' => $horariosRecurrentes,
            'excepciones' => $excepciones,
        ]);
    }

    public function createRecurrente()
    {
        return Inertia::render('Dashboard/Reserva/HorarioAtencion/CreateRecurrente');
    }

    public function storeRecurrente(Request $request)
    {
        $validated = $request->validate([
            'dia_semana' => 'required|in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'activo' => 'boolean',
        ]);

        $validated['tipo'] = 'recurrente';

        $existente = Horario::where('tipo', 'recurrente')
            ->where('dia_semana', $validated['dia_semana'])
            ->first();
        
        if ($existente) {
            return back()->withErrors(['dia_semana' => 'Ya existe un horario para este día de la semana.']);
        }

        Horario::create($validated);

        return redirect()->route('dashboard.reservas.horario.index')
            ->with('success', 'Horario recurrente creado correctamente.');
    }

    public function createExcepcion()
    {
        return Inertia::render('Dashboard/Reserva/HorarioAtencion/CreateExcepcion');
    }

    public function storeExcepcion(Request $request)
    {
        logger("Fecha recibida en storeExcepcion: " . $request->fecha);
        
        $validated = $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'activo' => 'boolean',
            'motivo' => 'required|string|max:255',
        ]);

        $validated['fecha'] = $request->fecha;
        $validated['tipo'] = 'excepcion';

        $existente = Horario::where('tipo', 'excepcion')
            ->where('fecha', $validated['fecha'])
            ->first();
        
        if ($existente) {
            return back()->withErrors(['fecha' => 'Ya existe una excepción para esta fecha.']);
        }

        Horario::create($validated);

        return redirect()->route('dashboard.reservas.horario.index')
            ->with('success', 'Excepción creada correctamente.');
    }


    public function editRecurrente(Horario $horario)
    {
        if ($horario->tipo !== 'recurrente') {
            abort(404);
        }

        return Inertia::render('Dashboard/Reserva/HorarioAtencion/EditRecurrente', [
            'horario' => [
                'id' => $horario->id,
                'dia_semana' => $horario->dia_semana,
                'hora_inicio' => $horario->hora_inicio,
                'hora_fin' => $horario->hora_fin,
                'activo' => $horario->activo,
            ]
        ]);
    }

    public function updateRecurrente(Request $request, Horario $horario)
    {
        if ($horario->tipo !== 'recurrente') {
            abort(404);
        }

        $validated = $request->validate([
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'activo' => 'boolean',
        ]);

        $horario->update($validated);

        return redirect()->route('dashboard.reservas.horario.index')
            ->with('success', 'Horario recurrente actualizado correctamente.');
    }

    public function editExcepcion(Horario $horario)
    {
        if ($horario->tipo !== 'excepcion') {
            abort(404);
        }

        return Inertia::render('Dashboard/Reserva/HorarioAtencion/EditExcepcion', [
            'horario' => [
                'id' => $horario->id,
                'fecha' => $horario->fecha->format('Y-m-d'),
                'hora_inicio' => $horario->hora_inicio,
                'hora_fin' => $horario->hora_fin,
                'activo' => $horario->activo,
                'motivo' => $horario->motivo,
            ]
        ]);
    }

    public function updateExcepcion(Request $request, Horario $horario)
    {
        if ($horario->tipo !== 'excepcion') {
            abort(404);
        }
        
        logger("Fecha recibida en updateExcepcion: " . $request->fecha);

        $validated = $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'activo' => 'boolean',
            'motivo' => 'required|string|max:255',
        ]);
        
        $validated['fecha'] = $request->fecha;

        $existente = Horario::where('tipo', 'excepcion')
            ->where('fecha', $validated['fecha'])
            ->where('id', '!=', $horario->id)
            ->first();
            
        if ($existente) {
            return back()->withErrors(['fecha' => 'Ya existe una excepción para esta fecha.']);
        }

        $horario->update($validated);

        return redirect()->route('dashboard.reservas.horario.index')
            ->with('success', 'Excepción actualizada correctamente.');
    }

    public function destroyRecurrente(Horario $horario)
    {
        if ($horario->tipo !== 'recurrente') {
            abort(404);
        }

        if ($horario->reservas()->count() > 0) {
            return back()->withErrors(['error' => 'No se puede eliminar el horario porque tiene reservas asociadas.']);
        }

        $horario->delete();

        return back()->with('success', 'Horario recurrente eliminado correctamente.');
    }

    public function destroyExcepcion(Horario $horario)
    {
        if ($horario->tipo !== 'excepcion') {
            abort(404);
        }

        if ($horario->reservas()->count() > 0) {
            return back()->withErrors(['error' => 'No se puede eliminar la excepción porque tiene reservas asociadas.']);
        }

        $horario->delete();

        return back()->with('success', 'Excepción eliminada correctamente.');
    }

    public function horariosDisponibles(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
        ]);

        logger("Fecha recibida en horariosDisponibles: " . $request->fecha);

        $fecha = Carbon::parse($request->fecha)->startOfDay()->setTimezone('UTC');
        $diaSemana = strtolower($fecha->locale('es')->dayName);
        
        logger("Fecha procesada en horariosDisponibles: " . $fecha->format('Y-m-d'));
        logger("Día de la semana: " . $diaSemana);
        
        $excepcion = Horario::where('tipo', 'excepcion')
            ->whereDate('fecha', $request->fecha)
            ->first();
            
        $horarioId = null;
            
        if ($excepcion) {
            if (!$excepcion->activo) {
                return response()->json([
                    'disponible' => false,
                    'motivo' => $excepcion->motivo,
                    'horarios' => []
                ]);
            }
            
            $horaInicio = Carbon::parse($excepcion->hora_inicio);
            $horaFin = Carbon::parse($excepcion->hora_fin);
            $horarioId = $excepcion->id;
        } else {
            $horarioRecurrente = Horario::where('tipo', 'recurrente')
                ->where('dia_semana', $diaSemana)
                ->where('activo', true)
                ->first();
                
            if (!$horarioRecurrente) {
                return response()->json([
                    'disponible' => false,
                    'motivo' => 'No hay atención este día',
                    'horarios' => []
                ]);
            }
            
            $horaInicio = Carbon::parse($horarioRecurrente->hora_inicio);
            $horaFin = Carbon::parse($horarioRecurrente->hora_fin);
            $horarioId = $horarioRecurrente->id;
        }
        
        $slots = [];
        $current = $horaInicio->copy();
        
        while ($current < $horaFin) {
            $slots[] = $current->format('H:i');
            $current->addHour();
        }
        
        $reservasExistentes = Reserva::whereDate('fecha', $fecha)
            ->pluck('hora')
            ->toArray();
            
        $slotsDisponibles = array_values(array_filter($slots, function($slot) use ($reservasExistentes) {
            return !in_array($slot, $reservasExistentes);
        }));
        
        return response()->json([
            'disponible' => true,
            'fecha' => $fecha->format('Y-m-d'),
            'horas' => $slotsDisponibles,
            'horario_id' => $horarioId
        ]);
    }
}