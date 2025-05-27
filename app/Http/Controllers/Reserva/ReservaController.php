<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use App\Models\Reserva;
use App\Models\Servicio;
use App\Models\Moto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Auth::user()->reservas()
            ->with(['servicios', 'horario', 'moto'])
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'placa' => $reserva->placa,
                    'servicios' => $reserva->servicios->map(function($servicio) {
                        return [
                            'id' => $servicio->id,
                            'nombre' => $servicio->nombre
                        ];
                    }),
                    'moto' => $reserva->moto ? [
                        'año' => $reserva->moto->año,
                        'marca' => $reserva->moto->marca,
                        'modelo' => $reserva->moto->modelo
                    ] : null,
                    'fecha' => $reserva->fecha->format('Y-m-d'),
                    'hora' => $reserva->hora,
                    'detalles' => $reserva->detalles,
                    'estado' => $reserva->estado,
                    'created_at' => $reserva->created_at,
                    'updated_at' => $reserva->updated_at,
                    'reprogramada_en' => $reserva->reprogramada_en ? $reserva->reprogramada_en->format('Y-m-d H:i') : null,
                ];
            });
        
        return Inertia::render('Home/Partials/Reserva/MisCitas', [
            'reservas' => $reservas
        ]);
    }

    public function create()
    {
        $servicios = $this->mapearServicios(Servicio::where('estado', true)
            ->with('categoriaServicio')
            ->orderBy('nombre')
            ->get());
            
        $horarios = $this->getHorariosDisponibles();
        
        $years = Moto::select('año')
            ->where('estado', 'Activo')
            ->distinct()
            ->orderBy('año', 'desc')
            ->pluck('año');

        $marcas = Moto::select('marca')
            ->where('estado', 'Activo')
            ->distinct()
            ->orderBy('marca')
            ->pluck('marca');

        $modelos = Moto::select('id', 'modelo', 'marca', 'año')
            ->where('estado', 'Activo')
            ->orderBy('marca')
            ->orderBy('modelo')
            ->get()
            ->map(function($moto) {
                return [
                    'id' => $moto->id,
                    'modelo' => $moto->modelo,
                    'marca' => $moto->marca,
                    'año' => $moto->año
                ];
            });

        return Inertia::render('Home/Partials/Reserva/AgendarServicio', [
            'servicios' => $servicios,
            'horarios' => $horarios,
            'motoData' => [
                'years' => $years,
                'brands' => $marcas,
                'models' => $modelos
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'moto_id' => 'required|exists:motos,id',
            'placa' => 'required|string|max:10',
            'servicios_ids' => 'required|array|min:1',
            'servicios_ids.*' => 'exists:servicios,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|string',
            'horario_id' => 'required|exists:horarios,id',
            'detalles' => 'nullable|string|max:500',
        ]);

        $validated['moto_id'] = (int) $validated['moto_id'];
        $validated['horario_id'] = (int) $validated['horario_id'];

        $existeReserva = Reserva::where('fecha', $validated['fecha'])
            ->where('hora', $validated['hora'])
            ->where('estado', '!=', 'cancelada')
            ->exists();

        if ($existeReserva) {
            return back()->withErrors(['hora' => 'Este horario ya está reservado. Por favor seleccione otro.']);
        }

        $reserva = Reserva::create([
            'user_id' => Auth::id(),
            'moto_id' => $validated['moto_id'],
            'placa' => $validated['placa'],
            'horario_id' => $validated['horario_id'],
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'],
            'detalles' => $validated['detalles'],
            'estado' => 'pendiente',
        ]);

        $reserva->servicios()->attach($validated['servicios_ids']);

        return redirect()->route('reservas.index')->with('success', 'Reserva creada exitosamente.');
    }

    public function show(Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para ver esta reserva.');
        }

        $reserva->load(['servicios', 'moto']);

        $reservaFormateada = [
            'id' => $reserva->id,
            'placa' => $reserva->placa,
            'servicios' => $reserva->servicios->map(function($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre
                ];
            }),
            'moto' => $reserva->moto ? [
                'año' => $reserva->moto->año,
                'marca' => $reserva->moto->marca,
                'modelo' => $reserva->moto->modelo
            ] : null,
            'fecha' => $reserva->fecha->format('Y-m-d'),
            'hora' => $reserva->hora,
            'detalles' => $reserva->detalles,
            'estado' => $reserva->estado
        ];

        return Inertia::render('Home/Partials/Reserva/DetalleReserva', [
            'reserva' => $reservaFormateada
        ]);
    }

    public function edit(Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para editar esta reserva.');
        }

        if ($reserva->estado !== 'pendiente') {
            return redirect()->route('reservas.index')
                ->with('error', 'Solo se pueden editar reservas en estado pendiente.');
        }

        $reserva->load(['servicios', 'horario', 'moto']);
        
        $reservaFormateada = [
            'id' => $reserva->id,
            'moto_id' => $reserva->moto_id,
            'placa' => $reserva->placa,
            'servicios_ids' => $reserva->servicios->pluck('id')->toArray(),
            'horario_id' => $reserva->horario_id,
            'fecha' => $reserva->fecha->format('Y-m-d'),
            'hora' => $reserva->hora,
            'detalles' => $reserva->detalles,
            'estado' => $reserva->estado,
            'moto' => $reserva->moto ? [
                'id' => $reserva->moto->id,
                'año' => $reserva->moto->año,
                'marca' => $reserva->moto->marca,
                'modelo' => $reserva->moto->modelo
            ] : null
        ];

        $serviciosDisponibles = $this->mapearServicios(Servicio::where('estado', true)
            ->with('categoriaServicio')
            ->orderBy('nombre')
            ->get());
            
        $horariosDisponibles = $this->getHorariosDisponibles();

        return Inertia::render('Home/Partials/Reserva/AgendarServicio', [
            'reserva' => $reservaFormateada,
            'servicios' => $serviciosDisponibles,
            'horarios' => $horariosDisponibles,
            'motoData' => [
                'years' => Moto::select('año')->where('estado', 'Activo')->distinct()->orderBy('año', 'desc')->pluck('año'),
                'brands' => Moto::select('marca')->where('estado', 'Activo')->distinct()->orderBy('marca')->pluck('marca'),
                'models' => Moto::select('id', 'modelo', 'marca', 'año')->where('estado', 'Activo')->orderBy('marca')->orderBy('modelo')->get()->map(function($moto) {
                    return [
                        'id' => $moto->id,
                        'modelo' => $moto->modelo,
                        'marca' => $moto->marca,
                        'año' => $moto->año
                    ];
                })
            ],
            'isEditing' => true
        ]);
    }

    public function update(Request $request, Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para actualizar esta reserva.');
        }

        if ($reserva->estado !== 'pendiente') {
            return redirect()->route('reservas.index')
                ->with('error', 'Solo se pueden editar reservas en estado pendiente.');
        }

        $validated = $request->validate([
            'moto_id' => 'required|exists:motos,id',
            'placa' => 'required|string|max:10',
            'servicios_ids' => 'required|array|min:1',
            'servicios_ids.*' => 'exists:servicios,id',
            'horario_id' => 'required|exists:horarios,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|string',
            'detalles' => 'nullable|string|max:500',
        ]);

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

        $reserva->update([
            'moto_id' => $validated['moto_id'],
            'placa' => $validated['placa'],
            'horario_id' => $validated['horario_id'],
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'],
            'detalles' => $validated['detalles'],
        ]);

        $reserva->servicios()->sync($validated['servicios_ids']);

        return redirect()->route('reservas.index')->with('success', 'Reserva actualizada exitosamente.');
    }

    public function destroy(Reserva $reserva)
    {
        if ($reserva->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para cancelar esta reserva.');
        }

        if (!in_array($reserva->estado, ['pendiente', 'confirmada'])) {
            return redirect()->route('reservas.index')
                ->with('error', 'No se puede cancelar una reserva que ya fue completada o cancelada.');
        }

        $reserva->estado = 'cancelada';
        $reserva->save();

        return redirect()->route('reservas.index')->with('success', 'Reserva cancelada exitosamente.');
    }

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
            \Log::error('Error al cargar servicios disponibles: ' . $e->getMessage());
            
            return Inertia::render('Home/Partials/Reserva/ServiciosDisponibles', [
                'servicios' => [],
                'error' => 'Ocurrió un error al cargar los servicios. Por favor, inténtelo de nuevo más tarde.'
            ]);
        }
    }

    public function horariosAtencion()
    {
        return redirect()->route('reservas.horarios-atencion');
    }

    private function getHorariosDisponibles()
    {
        \Log::info('Obteniendo horarios disponibles');
        
        $horariosRecurrentes = \App\Models\Horario::where('tipo', 'recurrente')
            ->where('activo', true)
            ->orderBy('dia_semana')
            ->get();
            
        \Log::info('Horarios recurrentes encontrados', [
            'cantidad' => $horariosRecurrentes->count(),
            'horarios' => $horariosRecurrentes->toArray()
        ]);
            
        $mapDiasSemana = [
            'lunes' => 'Lunes',
            'martes' => 'Martes',
            'miercoles' => 'Miércoles',
            'jueves' => 'Jueves',
            'viernes' => 'Viernes',
            'sabado' => 'Sábado',
            'domingo' => 'Domingo',
        ];
        
        $horariosPorDia = [];
        $diasDisponibles = [];
        
        foreach ($horariosRecurrentes as $horario) {
            $nombreDia = $mapDiasSemana[$horario->dia_semana] ?? null;
            
            if ($nombreDia) {
                $horariosPorDia[$nombreDia] = "{$horario->hora_inicio} - {$horario->hora_fin}";
                $diasDisponibles[] = $nombreDia;
            }
        }
        
        \Log::info('Días disponibles generados', [
            'dias_disponibles' => $diasDisponibles,
            'horarios_por_dia' => $horariosPorDia
        ]);
        
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
        
        $franjas = [];
        for ($hora = 8; $hora <= 17; $hora++) {
            $franjas[] = sprintf('%02d:00', $hora);
        }
        
        return [
            'dias' => $diasDisponibles,
            'horarios' => $horariosPorDia,
            'franjas' => $franjas,
            'diasDisponibles' => $diasDisponibles,
            'excepciones' => $excepciones->all()
        ];
    }

    public function horasDisponibles(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
        ]);
        
        $fecha = \Carbon\Carbon::parse($request->fecha);
        $diaSemana = $fecha->dayOfWeek;
        
        \Log::info('Procesando solicitud para horas disponibles', [
            'fecha' => $request->fecha,
            'dia_semana' => $diaSemana,
            'es_domingo' => $diaSemana === 0
        ]);

        $excepcion = \App\Models\Horario::where('tipo', 'excepcion')
            ->whereDate('fecha', $fecha->format('Y-m-d'))
            ->first();
        
        if ($excepcion) {
            if (!$excepcion->activo) {
                return response()->json([
                    'disponible' => false,
                    'motivo' => $excepcion->motivo ?? 'Este día no hay atención por excepción',
                    'horas' => [],
                    'horario_id' => null
                ]);
            }
            
            $horaInicio = \Carbon\Carbon::parse($excepcion->hora_inicio);
            $horaFin = \Carbon\Carbon::parse($excepcion->hora_fin);
            $horarioId = $excepcion->id;
        } else {
            $nombresDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            $diaSemanaKey = $nombresDias[$diaSemana];
            
            $horarioRecurrente = \App\Models\Horario::where('tipo', 'recurrente')
                ->where('dia_semana', $diaSemanaKey)
                ->first();

            if (!$horarioRecurrente) {
                return response()->json([
                    'disponible' => false,
                    'motivo' => 'No hay horario de atención configurado para este día',
                    'horas' => [],
                    'horario_id' => null
                ]);
            }

            if (!$horarioRecurrente->activo) {
                return response()->json([
                    'disponible' => false,
                    'motivo' => 'Este día no hay atención',
                    'horas' => [],
                    'horario_id' => null
                ]);
            }

            $horaInicio = \Carbon\Carbon::parse($horarioRecurrente->hora_inicio);
            $horaFin = \Carbon\Carbon::parse($horarioRecurrente->hora_fin);
            $horarioId = $horarioRecurrente->id;
        }
        
        $horas = [];
        $current = $horaInicio->copy();
        
        while ($current < $horaFin) {
            $horas[] = $current->format('H:i');
            $current->addHour();
        }
        
        $reservasExistentes = \App\Models\Reserva::whereDate('fecha', $fecha->format('Y-m-d'))
            ->where('estado', '!=', 'cancelada')
            ->pluck('hora')
            ->toArray();
        
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