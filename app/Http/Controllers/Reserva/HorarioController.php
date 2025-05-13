<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class HorarioController extends Controller
{
    public function index()
    {
        $horariosRecurrentes = Horario::where('tipo', 'recurrente')
            ->where('activo', true)
            ->orderBy('dia_semana')
            ->get();
            
        $diasSemana = [
            'lunes' => 'Lunes',
            'martes' => 'Martes',
            'miercoles' => 'Miércoles',
            'jueves' => 'Jueves',
            'viernes' => 'Viernes',
            'sabado' => 'Sábado',
            'domingo' => 'Domingo',
        ];
        
        $horariosPorDia = [];
        foreach ($diasSemana as $dia => $nombreDia) {
            $horario = $horariosRecurrentes->where('dia_semana', $dia)->first();
            if ($horario && $horario->activo) {
                $horariosPorDia[$nombreDia] = "{$horario->hora_inicio} - {$horario->hora_fin}";
            }
        }
        
        $hoy = Carbon::now()->subWeek();
        $tresMesesDespues = Carbon::now()->addMonths(3);
        
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
