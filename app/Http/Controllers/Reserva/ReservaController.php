<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
{
    /**
     * Muestra el listado de reservas del usuario autenticado (Mis Citas)
     */
    public function index()
    {
        $reservas = Auth::user()->reservas()
            ->with(['servicio', 'horario'])
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'vehiculo' => $reserva->vehiculo,
                    'placa' => $reserva->placa,
                    'servicio' => $reserva->servicio ? $reserva->servicio->nombre : 'Servicio no disponible',
                    'horario_id' => $reserva->horario_id,
                    'fecha' => $reserva->fecha,
                    'hora' => $reserva->hora,
                    'detalles' => $reserva->detalles,
                    'estado' => $reserva->estado,
                    'created_at' => $reserva->created_at,
                    'updated_at' => $reserva->updated_at
                ];
            });
        
        return Inertia::render('Home/Partials/Reserva/MisCitas', [
            'reservas' => $reservas
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva reserva (Agendar Servicio)
     */
    public function create()
    {
        $servicios = $this->mapearServicios(Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get());
            
        $horarios = $this->getHorariosDisponibles();

        return Inertia::render('Home/Partials/Reserva/AgendarServicio', [
            'servicios' => $servicios,
            'horarios' => $horarios,
        ]);
    }

    /**
     * Almacena una nueva reserva en la base de datos
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehiculo' => 'required|string|max:255',
            'placa' => 'required|string|max:10',
            'servicio_id' => 'required|exists:servicios,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|string',
            'horario_id' => 'required|exists:horarios,id',
            'detalles' => 'nullable|string|max:500',
        ]);

        // Asegurar que servicio_id sea un entero
        $validated['servicio_id'] = (int) $validated['servicio_id'];
        $validated['horario_id'] = (int) $validated['horario_id'];

        // Verificar disponibilidad del horario
        $existeReserva = Reserva::where('fecha', $validated['fecha'])
            ->where('hora', $validated['hora'])
            ->where('estado', '!=', 'cancelada')
            ->exists();

        if ($existeReserva) {
            return back()->withErrors(['hora' => 'Este horario ya está reservado. Por favor seleccione otro.']);
        }

        $reserva = Reserva::create([
            'user_id' => Auth::id(),
            'vehiculo' => $validated['vehiculo'],
            'placa' => $validated['placa'],
            'servicio_id' => $validated['servicio_id'],
            'horario_id' => $validated['horario_id'],
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'],
            'detalles' => $validated['detalles'],
            'estado' => 'pendiente',
        ]);

        return redirect()->route('reservas.index')->with('success', 'Reserva creada exitosamente.');
    }

    /**
     * Muestra una reserva específica
     */
    public function show(Reserva $reserva)
    {
        // Verifica que el usuario actual sea el propietario de la reserva
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para ver esta reserva.');
        }

        // Carga la relación con el servicio
        $reserva->load('servicio');

        return Inertia::render('Home/Partials/Reserva/DetalleReserva', [
            'reserva' => $reserva
        ]);
    }

    /**
     * Muestra el formulario para editar una reserva
     */
    public function edit(Reserva $reserva)
    {
        // Verifica que el usuario actual sea el propietario de la reserva
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para editar esta reserva.');
        }

        // Solo permitir editar reservas pendientes
        if ($reserva->estado !== 'pendiente') {
            return redirect()->route('reservas.index')
                ->with('error', 'Solo se pueden editar reservas en estado pendiente.');
        }

        // Cargar el servicio relacionado
        $reserva->load(['servicio', 'horario']);
        
        // Formatear la reserva
        $reservaFormateada = [
            'id' => $reserva->id,
            'vehiculo' => $reserva->vehiculo,
            'placa' => $reserva->placa,
            'servicio_id' => $reserva->servicio_id,
            'horario_id' => $reserva->horario_id,
            'fecha' => $reserva->fecha->format('Y-m-d'), // Formatear la fecha
            'hora' => $reserva->hora,
            'detalles' => $reserva->detalles,
            'estado' => $reserva->estado
        ];

        // Obtener servicios disponibles con formato
        $serviciosDisponibles = $this->mapearServicios(Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get());
            
        $horariosDisponibles = $this->getHorariosDisponibles();

        return Inertia::render('Home/Partials/Reserva/AgendarServicio', [
            'reserva' => $reservaFormateada,
            'servicios' => $serviciosDisponibles,
            'horarios' => $horariosDisponibles,
            'isEditing' => true
        ]);
    }

    /**
     * Actualiza una reserva existente
     */
    public function update(Request $request, Reserva $reserva)
    {
        // Verifica que el usuario actual sea el propietario de la reserva
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para actualizar esta reserva.');
        }

        // Solo permitir editar reservas pendientes
        if ($reserva->estado !== 'pendiente') {
            return redirect()->route('reservas.index')
                ->with('error', 'Solo se pueden editar reservas en estado pendiente.');
        }

        $validated = $request->validate([
            'vehiculo' => 'required|string|max:255',
            'placa' => 'required|string|max:10',
            'servicio_id' => 'required|exists:servicios,id',
            'horario_id' => 'required|exists:horarios,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|string',
            'detalles' => 'nullable|string|max:500',
        ]);

        // Verificar disponibilidad del horario (si se cambió la fecha u hora)
        if ($reserva->fecha != $validated['fecha'] || $reserva->hora != $validated['hora']) {
            $existeReserva = Reserva::where('fecha', $validated['fecha'])
                ->where('hora', $validated['hora'])
                ->where('estado', '!=', 'cancelada')
                ->where('id', '!=', $reserva->id)
                ->exists();

            if ($existeReserva) {
                return back()->withErrors(['hora' => 'Este horario ya está reservado. Por favor seleccione otro.']);
            }
        }

        $reserva->update($validated);

        return redirect()->route('reservas.index')->with('success', 'Reserva actualizada exitosamente.');
    }

    /**
     * Elimina/Cancela una reserva
     */
    public function destroy(Reserva $reserva)
    {
        // Verifica que el usuario actual sea el propietario de la reserva
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para cancelar esta reserva.');
        }

        // Solo permitir cancelar reservas pendientes o confirmadas
        if (!in_array($reserva->estado, ['pendiente', 'confirmada'])) {
            return redirect()->route('reservas.index')
                ->with('error', 'No se puede cancelar una reserva que ya fue completada o cancelada.');
        }

        // Cambiar estado a cancelada
        $reserva->estado = 'cancelada';
        $reserva->save();

        return redirect()->route('reservas.index')->with('success', 'Reserva cancelada exitosamente.');
    }

    /**
     * Muestra los servicios disponibles
     */
    public function serviciosDisponibles()
    {
        try {
            $servicios = Servicio::where('estado', true)
                ->with('categoriaServicio')
                ->orderBy('categoria_servicio_id')
                ->orderBy('nombre')
                ->get();
            
            $serviciosMapeados = $this->mapearServicios($servicios);

            return Inertia::render('Home/Partials/Reserva/ServiciosDisponibles', [
                'servicios' => $serviciosMapeados
            ]);
        } catch (\Exception $e) {
            // Registrar el error para depuración
            \Log::error('Error al cargar servicios disponibles: ' . $e->getMessage());
            
            return Inertia::render('Home/Partials/Reserva/ServiciosDisponibles', [
                'servicios' => [],
                'error' => 'Ocurrió un error al cargar los servicios. Por favor, inténtelo de nuevo más tarde.'
            ]);
        }
    }

    /**
     * Muestra los horarios de atención
     */
    public function horariosAtencion()
    {
        // Redirigir al controlador específico para horarios
        return redirect()->route('reservas.horarios-atencion');
    }

    /**
     * Obtiene la lista de horarios disponibles de la base de datos
     */
    private function getHorariosDisponibles()
    {
        // Log para depuración
        \Log::info('Obteniendo horarios disponibles');
        
        // Obtener horarios recurrentes
        $horariosRecurrentes = \App\Models\Horario::where('tipo', 'recurrente')
            ->orderBy('dia_semana')
            ->get();
            
        // Log para horarios recurrentes
        \Log::info('Horarios recurrentes encontrados', [
            'cantidad' => $horariosRecurrentes->count(),
            'horarios' => $horariosRecurrentes->toArray()
        ]);
            
        // Crear un mapeo de días
        $mapDiasSemana = [
            'lunes' => 'Lunes',
            'martes' => 'Martes',
            'miercoles' => 'Miércoles',
            'jueves' => 'Jueves',
            'viernes' => 'Viernes',
            'sabado' => 'Sábado',
            'domingo' => 'Domingo',
        ];
        
        // Crear array de horarios por día
        $horariosPorDia = [];
        $diasDisponibles = [];
        
        foreach ($horariosRecurrentes as $horario) {
            $nombreDia = $mapDiasSemana[$horario->dia_semana] ?? null;
            
            if ($nombreDia) {
                // Añadir información del horario
                $horariosPorDia[$nombreDia] = "{$horario->hora_inicio} - {$horario->hora_fin}";
                
                // Si está activo, añadirlo a la lista de días disponibles
                if ($horario->activo) {
                    $diasDisponibles[] = $nombreDia;
                }
                
                // Log específico para cada día
                \Log::info("Horario configurado para: {$nombreDia}", [
                    'hora_inicio' => $horario->hora_inicio,
                    'hora_fin' => $horario->hora_fin,
                    'activo' => $horario->activo,
                    'dia_semana' => $horario->dia_semana
                ]);
            }
        }
        
        // Log de días disponibles
        \Log::info('Días disponibles generados', [
            'dias_disponibles' => $diasDisponibles,
            'horarios_por_dia' => $horariosPorDia
        ]);
        
        // Obtener excepciones para los próximos 30 días
        $hoy = \Carbon\Carbon::now()->startOfDay();
        $unMesDespues = \Carbon\Carbon::now()->addDays(30)->endOfDay();
        
        $excepciones = \App\Models\Horario::where('tipo', 'excepcion')
            ->whereBetween('fecha', [$hoy, $unMesDespues])
            ->get()
            ->map(function ($horario) {
                return [
                    'fecha' => $horario->fecha->format('Y-m-d'),
                    'activo' => $horario->activo,
                    'hora_inicio' => $horario->hora_inicio,
                    'hora_fin' => $horario->hora_fin,
                    'motivo' => $horario->motivo
                ];
            })->keyBy('fecha');
            
        // Generar lista de franjas horarias (de hora en hora, de 8 a 18)
        $franjas = [];
        for ($hora = 8; $hora <= 17; $hora++) {
            $franjas[] = sprintf('%02d:00', $hora);
        }
        
        return [
            'dias' => $diasDisponibles,
            'horarios' => $horariosPorDia,
            'franjas' => $franjas,
            'diasDisponibles' => $diasDisponibles, // Mantener por compatibilidad
            'excepciones' => $excepciones->all()
        ];
    }

    /**
     * API para obtener horas disponibles para una fecha específica
     */
    public function horasDisponibles(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
        ]);
        
        $fecha = \Carbon\Carbon::parse($request->fecha);
        $diaSemana = $fecha->dayOfWeek; // 0 (domingo) a 6 (sábado) en Carbon
        
        \Log::info('Procesando solicitud para horas disponibles', [
            'fecha' => $request->fecha,
            'dia_semana' => $diaSemana,
            'es_domingo' => $diaSemana === 0
        ]);
        
        // Rechazar solicitudes para domingo (día 0 en Carbon)
        if ($diaSemana === 0) {
            return response()->json([
                'disponible' => false,
                'motivo' => 'No hay atención los días domingo',
                'horas' => []
            ]);
        }
        
        // Verificar primero si hay una excepción para esta fecha
        $excepcion = \App\Models\Horario::where('tipo', 'excepcion')
            ->whereDate('fecha', $fecha->format('Y-m-d'))
            ->first();
        
        if ($excepcion) {
            \Log::info('Encontrada excepción para fecha', [
                'excepcion' => $excepcion->toArray()
            ]);
            
            // Si hay una excepción y está marcada como inactiva
            if (!$excepcion->activo) {
                return response()->json([
                    'disponible' => false,
                    'motivo' => $excepcion->motivo ?? 'Fecha no disponible por excepción',
                    'horas' => []
                ]);
            }
            
            // Usar horario de la excepción
            $horaInicio = \Carbon\Carbon::parse($excepcion->hora_inicio);
            $horaFin = \Carbon\Carbon::parse($excepcion->hora_fin);
            $horarioId = $excepcion->id;
        } else {
            // Si no hay excepción, buscar el horario para este día de la semana
            $nombresDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            $diaSemanaKey = $nombresDias[$diaSemana];
            
            $horarioRecurrente = \App\Models\Horario::where('tipo', 'recurrente')
                ->where('dia_semana', $diaSemanaKey)
                ->first();
            
            \Log::info('Buscando horario recurrente', [
                'dia_semana_key' => $diaSemanaKey,
                'encontrado' => $horarioRecurrente ? true : false
            ]);
            
            // Si no hay horario configurado para este día, usar valores predeterminados
            if (!$horarioRecurrente) {
                // Valores predeterminados para día laborable (9:00 - 18:00)
                $horaInicio = \Carbon\Carbon::parse('09:00:00');
                $horaFin = \Carbon\Carbon::parse('18:00:00');
                
                // Si es sábado, usar horario reducido
                if ($diaSemana === 6) { // 6 = sábado
                    $horaFin = \Carbon\Carbon::parse('14:00:00');
                }
                
                // Crear un horario temporal
                $horarioRecurrente = new \App\Models\Horario([
                    'tipo' => 'recurrente',
                    'dia_semana' => $diaSemanaKey,
                    'hora_inicio' => $horaInicio->format('H:i:s'),
                    'hora_fin' => $horaFin->format('H:i:s'),
                    'activo' => true
                ]);
                
                $horarioRecurrente->id = 0; // ID temporal
                
                \Log::info('Usando horario predeterminado', [
                    'dia' => $diaSemanaKey,
                    'horario' => $horarioRecurrente->toArray()
                ]);
            } else {
                $horaInicio = \Carbon\Carbon::parse($horarioRecurrente->hora_inicio);
                $horaFin = \Carbon\Carbon::parse($horarioRecurrente->hora_fin);
            }
            
            $horarioId = $horarioRecurrente->id;
        }
        
        // Generar franjas horarias de hora en hora
        $horas = [];
        $current = $horaInicio->copy();
        
        while ($current < $horaFin) {
            $horas[] = $current->format('H:i');
            $current->addHour();
        }
        
        // Buscar reservas ya existentes para esta fecha
        $reservasExistentes = \App\Models\Reserva::whereDate('fecha', $fecha->format('Y-m-d'))
            ->where('estado', '!=', 'cancelada')
            ->pluck('hora')
            ->toArray();
        
        // Filtrar horas disponibles
        $horasDisponibles = array_values(array_filter($horas, function($hora) use ($reservasExistentes) {
            return !in_array($hora, $reservasExistentes);
        }));
        
        return response()->json([
            'disponible' => true,
            'fecha' => $fecha->format('Y-m-d'),
            'horas' => $horasDisponibles,
            'horario_id' => $horarioId
        ]);
    }

    /**
     * Mapea los servicios para su formato de salida
     */
    private function mapearServicios($servicios)
    {
        return $servicios->map(function ($servicio) {
            return [
                'id' => $servicio->id,
                'nombre' => $servicio->nombre,
                'descripcion' => $servicio->descripcion,
                'categoria_servicio_id' => $servicio->categoria_servicio_id,
                'categoriaServicio' => $servicio->categoriaServicio ? [
                    'id' => $servicio->categoriaServicio->id,
                    'nombre' => $servicio->categoriaServicio->nombre,
                    'descripcion' => $servicio->categoriaServicio->descripcion,
                ] : null
            ];
        });
    }
}