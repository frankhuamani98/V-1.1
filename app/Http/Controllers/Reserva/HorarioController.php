<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class HorarioController extends Controller
{
    /**
     * Muestra los horarios de atención al usuario
     */
    public function index()
    {
        // Obtener horarios recurrentes (semanales)
        $horariosRecurrentes = Horario::where('tipo', 'recurrente')
            ->where('activo', true)  // Solo horarios activos
            ->orderBy('dia_semana')
            ->get();
            
        // Crear un array con los días de la semana y sus horarios
        $diasSemana = [
            'lunes' => 'Lunes',
            'martes' => 'Martes',
            'miercoles' => 'Miércoles',
            'jueves' => 'Jueves',
            'viernes' => 'Viernes',
            'sabado' => 'Sábado',
            'domingo' => 'Domingo',
        ];
        
        // Crear array de horarios por día, solo para días activos
        $horariosPorDia = [];
        foreach ($diasSemana as $dia => $nombreDia) {
            $horario = $horariosRecurrentes->where('dia_semana', $dia)->first();
            if ($horario && $horario->activo) {  // Solo incluir si existe y está activo
                $horariosPorDia[$nombreDia] = "{$horario->hora_inicio} - {$horario->hora_fin}";
            }
        }
        
        // Obtener excepciones (días específicos) para un rango más amplio
        $hoy = Carbon::now()->subWeek(); // Incluir desde una semana antes
        $tresMesesDespues = Carbon::now()->addMonths(3); // Hasta tres meses después
        
        \Log::info('Buscando excepciones en el rango', [
            'desde' => $hoy->format('Y-m-d'),
            'hasta' => $tresMesesDespues->format('Y-m-d')
        ]);

        $excepciones = Horario::where('tipo', 'excepcion')
            ->whereBetween('fecha', [$hoy, $tresMesesDespues])
            ->orderBy('fecha')
            ->get();
            
        \Log::info('Excepciones encontradas', [
            'cantidad' => $excepciones->count(),
            'excepciones' => $excepciones->toArray()
        ]);
        
        $excepcionesFormateadas = $excepciones->map(function ($horario) {
            return [
                'fecha' => $horario->fecha->format('Y-m-d'),
                'fecha_formateada' => $horario->fecha->format('d/m/Y'),
                'hora_inicio' => $horario->hora_inicio,
                'hora_fin' => $horario->hora_fin,
                'activo' => $horario->activo,
                'motivo' => $horario->motivo
            ];
        });
        
        \Log::info('Excepciones formateadas', [
            'excepciones' => $excepcionesFormateadas->toArray()
        ]);
        
        return Inertia::render('Home/Partials/Reserva/HorariosAtencion', [
            'horarios' => [
                'dias' => array_keys($horariosPorDia),
                'horarios' => $horariosPorDia,
                'excepciones' => $excepcionesFormateadas
            ]
        ]);
    }
}
