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
            ->with('servicio')
            ->orderBy('fecha', 'desc')
            ->orderBy('hora', 'asc')
            ->get()
            ->map(function ($reserva) {
                return [
                    'id' => $reserva->id,
                    'vehiculo' => $reserva->vehiculo,
                    'placa' => $reserva->placa,
                    'servicio' => $reserva->servicio ? $reserva->servicio->nombre : 'Servicio no disponible',
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
        $serviciosDisponibles = Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($servicio) {
                // Convertir explícitamente el precio a un float
                $precio = is_numeric($servicio->precio_base) 
                    ? (float) $servicio->precio_base 
                    : 0.0;
                
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'descripcion' => $servicio->descripcion,
                    'precio' => $precio,
                    'duracion' => $servicio->duracion_estimada . ' minutos'
                ];
            });
            
        $horariosDisponibles = $this->getHorariosDisponibles();
        
        return Inertia::render('Home/Partials/Reserva/AgendarServicio', [
            'servicios' => $serviciosDisponibles,
            'horarios' => $horariosDisponibles
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
            'detalles' => 'nullable|string|max:500',
        ]);

        // Asegurar que servicio_id sea un entero
        $validated['servicio_id'] = (int) $validated['servicio_id'];

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
        $reserva->load('servicio');
        
        // Formatear la reserva
        $reservaFormateada = [
            'id' => $reserva->id,
            'vehiculo' => $reserva->vehiculo,
            'placa' => $reserva->placa,
            'servicio_id' => $reserva->servicio_id,
            'fecha' => $reserva->fecha->format('Y-m-d'), // Formatear la fecha
            'hora' => $reserva->hora,
            'detalles' => $reserva->detalles,
            'estado' => $reserva->estado
        ];

        // Obtener servicios disponibles con formato
        $serviciosDisponibles = Servicio::where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($servicio) {
                // Convertir explícitamente el precio a un float
                $precio = is_numeric($servicio->precio_base) 
                    ? (float) $servicio->precio_base 
                    : 0.0;
                
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'descripcion' => $servicio->descripcion,
                    'precio' => $precio,
                    'duracion' => $servicio->duracion_estimada . ' minutos'
                ];
            });
            
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
            
            // Log para depuración
            \Log::info('Servicios antes del mapeo:', $servicios->map(function($s) {
                return [
                    'id' => $s->id,
                    'nombre' => $s->nombre,
                    'precio_base' => $s->precio_base,
                    'tipo_precio' => gettype($s->precio_base)
                ];
            })->toArray());
            
            $serviciosMapeados = $servicios->map(function ($servicio) {
                // Convertir explícitamente el precio a un float
                $precio = is_numeric($servicio->precio_base) 
                    ? (float) $servicio->precio_base 
                    : 0.0;
                
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'descripcion' => $servicio->descripcion,
                    'precio_base' => $precio,
                    'duracion_estimada' => $servicio->duracion_estimada,
                    'categoria_servicio_id' => $servicio->categoria_servicio_id,
                    'categoriaServicio' => $servicio->categoriaServicio ? [
                        'id' => $servicio->categoriaServicio->id,
                        'nombre' => $servicio->categoriaServicio->nombre,
                        'descripcion' => $servicio->categoriaServicio->descripcion,
                    ] : null
                ];
            });

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
        $horarios = $this->getHorariosDisponibles();

        return Inertia::render('Home/Partials/Reserva/HorariosAtencion', [
            'horarios' => $horarios
        ]);
    }

    /**
     * Obtiene la lista de horarios disponibles (simulado)
     */
    private function getHorariosDisponibles()
    {
        // Generar franjas horarias con formato 'H:i'
        $franjas = [];
        for ($hora = 8; $hora <= 17; $hora++) {
            if ($hora != 13) { // Excluir la hora de almuerzo (13:00)
                $franjas[] = sprintf('%02d:00', $hora);
            }
        }
        
        return [
            'dias' => ['Lunes a Viernes', 'Sábados'],
            'horarios' => [
                'Lunes a Viernes' => '8:00 AM - 6:00 PM',
                'Sábados' => '9:00 AM - 2:00 PM'
            ],
            'franjas' => $franjas
        ];
    }
}