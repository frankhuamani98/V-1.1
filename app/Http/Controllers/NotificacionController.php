<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use App\Services\NotificacionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificacionController extends Controller
{
    protected $notificacionService;

    public function __construct(NotificacionService $notificacionService)
    {
        $this->notificacionService = $notificacionService;
    }

    public function index(Request $request)
    {
        $tipo = $request->query('tipo');
        $soloNoLeidas = $request->boolean('no_leidas', false);
        
        $notificaciones = $this->notificacionService->obtenerNotificaciones(
            $request->user(),
            $tipo,
            $soloNoLeidas
        );
        
        $contadoresTipo = Notificacion::where('user_id', $request->user()->id)
            ->where('leida', false)
            ->selectRaw('tipo, count(*) as total')
            ->groupBy('tipo')
            ->pluck('total', 'tipo')
            ->toArray();
        
        $notificacionesFormateadas = $notificaciones->map(function ($notificacion) {
            return [
                'id' => $notificacion->id,
                'tipo' => $notificacion->tipo,
                'titulo' => $notificacion->titulo,
                'mensaje' => $notificacion->mensaje,
                'leida' => $notificacion->leida,
                'url' => $notificacion->url,
                'prioridad' => $notificacion->prioridad,
                'tiempo' => $this->formatearTiempo($notificacion->created_at),
                'created_at' => $notificacion->created_at,
            ];
        });
        
        return Inertia::render('Dashboard/Notificaciones', [
            'notificaciones' => $notificacionesFormateadas,
            'filtros' => [
                'tipo' => $tipo,
                'soloNoLeidas' => $soloNoLeidas,
            ],
            'contadores' => $contadoresTipo,
        ]);
    }

    public function obtenerNotificaciones(Request $request)
    {
        $tipo = $request->query('tipo');
        $soloNoLeidas = $request->boolean('no_leidas', false);
        $limite = $request->integer('limite', 10);
        
        $notificaciones = Notificacion::where('user_id', $request->user()->id)
            ->when($tipo, function ($query, $tipo) {
                return $query->where('tipo', $tipo);
            })
            ->when($soloNoLeidas, function ($query) {
                return $query->where('leida', false);
            })
            ->orderBy('created_at', 'desc')
            ->limit($limite)
            ->get();
            
        $formattedNotificaciones = $notificaciones->map(function ($notificacion) {
            return [
                'id' => $notificacion->id,
                'tipo' => $notificacion->tipo,
                'titulo' => $notificacion->titulo,
                'mensaje' => $notificacion->mensaje,
                'leida' => $notificacion->leida,
                'url' => $notificacion->url,
                'prioridad' => $notificacion->prioridad,
                'tiempo' => $this->formatearTiempo($notificacion->created_at),
                'created_at' => $notificacion->created_at,
            ];
        });
        
        $totalNoLeidas = Notificacion::where('user_id', $request->user()->id)
            ->where('leida', false)
            ->count();
            
        $contadorPorTipo = Notificacion::where('user_id', $request->user()->id)
            ->where('leida', false)
            ->selectRaw('tipo, count(*) as total')
            ->groupBy('tipo')
            ->pluck('total', 'tipo')
            ->toArray();
        
        return response()->json([
            'notificaciones' => $formattedNotificaciones,
            'total_no_leidas' => $totalNoLeidas,
            'contador_por_tipo' => $contadorPorTipo
        ]);
    }

    public function marcarComoLeida(Request $request, $id)
    {
        $notificacion = Notificacion::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();
        
        if (!$notificacion) {
            return response()->json(['error' => 'Notificación no encontrada'], 404);
        }
        
        $notificacion->leida = true;
        $notificacion->save();
        
        return response()->json(['success' => true]);
    }

    public function marcarTodasComoLeidas(Request $request)
    {
        $tipo = $request->input('tipo');
        
        $this->notificacionService->marcarTodasComoLeidas(
            $request->user(),
            $tipo
        );
        
        return response()->json(['success' => true]);
    }

    private function formatearTiempo($fecha)
    {
        if (!$fecha) {
            return 'Fecha desconocida';
        }
        
        $ahora = now();
        $diferencia = $ahora->diffInSeconds($fecha);
        
        if ($diferencia < 0) {
            return $fecha->format('d/m/Y H:i');
        } elseif ($diferencia < 60) {
            return 'Hace un momento';
        } elseif ($diferencia < 3600) {
            $minutos = floor($diferencia / 60);
            return "Hace {$minutos} " . ($minutos == 1 ? 'minuto' : 'minutos');
        } elseif ($diferencia < 86400) {
            $horas = floor($diferencia / 3600);
            return "Hace {$horas} " . ($horas == 1 ? 'hora' : 'horas');
        } elseif ($diferencia < 172800) {
            return 'Ayer a las ' . $fecha->format('H:i');
        } elseif ($diferencia < 604800) {
            $dias = floor($diferencia / 86400);
            return "Hace {$dias} días";
        } elseif ($ahora->year == $fecha->year) {
            return $fecha->format('d/m \a \l\a\s H:i');
        } else {
            return $fecha->format('d/m/Y');
        }
    }
}
