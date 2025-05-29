<?php

namespace App\Services;

use App\Models\Notificacion;
use App\Models\Pedido;
use App\Models\Reserva;
use App\Models\Opinion;
use App\Models\User;

class NotificacionService
{
    public function crearNotificacionPedido(Pedido $pedido, string $accion = 'creado')
    {
        $adminUsers = User::where('role', 'admin')->get();
        $cliente = $pedido->user;
        
        switch ($accion) {
            case 'creado':
                $titulo = "Nuevo pedido #{$pedido->numero_orden}";
                $mensaje = "{$cliente->name} ha realizado un pedido por S/. {$pedido->total}";
                $prioridad = 'alta';
                break;
            case 'pagado':
                $titulo = "Pago confirmado #{$pedido->numero_orden}";
                $mensaje = "Se ha confirmado el pago del pedido de {$cliente->name}";
                $prioridad = 'media';
                break;
            case 'enviado':
                $titulo = "Pedido enviado #{$pedido->numero_orden}";
                $mensaje = "El pedido de {$cliente->name} ha sido enviado";
                $prioridad = 'media';
                break;
            case 'entregado':
                $titulo = "Pedido entregado #{$pedido->numero_orden}";
                $mensaje = "El pedido de {$cliente->name} ha sido entregado";
                $prioridad = 'baja';
                break;
            case 'cancelado':
                $titulo = "Pedido cancelado #{$pedido->numero_orden}";
                $mensaje = "{$cliente->name} ha cancelado su pedido";
                $prioridad = 'alta';
                break;
            default:
                $titulo = "Actualización de pedido #{$pedido->numero_orden}";
                $mensaje = "El pedido de {$cliente->name} ha sido actualizado";
                $prioridad = 'media';
        }
        
        foreach ($adminUsers as $admin) {
            Notificacion::create([
                'user_id' => $admin->id,
                'tipo' => 'pedido',
                'titulo' => $titulo,
                'mensaje' => $mensaje,
                'data' => [
                    'pedido_id' => $pedido->id,
                    'cliente_id' => $cliente->id,
                    'cliente_nombre' => $cliente->name,
                    'total' => $pedido->total,
                    'estado' => $pedido->estado,
                    'accion' => $accion
                ],
                'leida' => false,
                'url' => "/pedidos/estado?id={$pedido->id}",
                'prioridad' => $prioridad,
                'referencia_id' => $pedido->id,
                'referencia_type' => Pedido::class,
            ]);
        }
    }
    
    public function crearNotificacionReserva(Reserva $reserva, string $accion = 'creada')
    {
        $adminUsers = User::where('role', 'admin')->get();
        $cliente = $reserva->user;
        $servicios = $reserva->servicios->pluck('nombre')->join(', ');
        
        switch ($accion) {
            case 'creada':
                $titulo = "Nueva reserva";
                $mensaje = "{$cliente->name} ha reservado {$servicios} para el {$reserva->fecha->format('d/m/Y')} a las {$reserva->hora}";
                $prioridad = 'alta';
                break;
            case 'confirmada':
                $titulo = "Reserva confirmada";
                $mensaje = "Se ha confirmado la reserva de {$cliente->name} para el {$reserva->fecha->format('d/m/Y')}";
                $prioridad = 'media';
                break;
            case 'reprogramada':
                $titulo = "Reserva reprogramada";
                $mensaje = "{$cliente->name} ha reprogramado su reserva para el {$reserva->fecha->format('d/m/Y')} a las {$reserva->hora}";
                $prioridad = 'alta';
                break;
            case 'cancelada':
                $titulo = "Reserva cancelada";
                $mensaje = "{$cliente->name} ha cancelado su reserva para el {$reserva->fecha->format('d/m/Y')}";
                $prioridad = 'alta';
                break;
            case 'recordatorio':
                $titulo = "Recordatorio de reserva";
                $mensaje = "Recordatorio: Reserva de {$cliente->name} mañana a las {$reserva->hora}";
                $prioridad = 'media';
                break;
            default:
                $titulo = "Actualización de reserva";
                $mensaje = "La reserva de {$cliente->name} ha sido actualizada";
                $prioridad = 'media';
        }
        
        foreach ($adminUsers as $admin) {
            Notificacion::create([
                'user_id' => $admin->id,
                'tipo' => 'reserva',
                'titulo' => $titulo,
                'mensaje' => $mensaje,
                'data' => [
                    'reserva_id' => $reserva->id,
                    'cliente_id' => $cliente->id,
                    'cliente_nombre' => $cliente->name,
                    'fecha' => $reserva->fecha->format('Y-m-d'),
                    'hora' => $reserva->hora,
                    'servicios' => $servicios,
                    'estado' => $reserva->estado,
                    'accion' => $accion
                ],
                'leida' => false,
                'url' => "/dashboard/reservas/{$reserva->id}",
                'prioridad' => $prioridad,
                'referencia_id' => $reserva->id,
                'referencia_type' => Reserva::class,
            ]);
        }
    }
    
    public function crearNotificacionOpinion(Opinion $opinion, string $accion = 'creada')
    {
        $adminUsers = User::where('role', 'admin')->get();
        $cliente = $opinion->usuario;
      
        switch ($accion) {
            case 'creada':
                $titulo = "Nueva reseña";
                $calificacionTexto = $opinion->calificacion > 3 ? "{$opinion->calificacion} estrellas" : "baja calificación ({$opinion->calificacion} estrellas)";
                $mensaje = "{$cliente->name} ha dejado una reseña con {$calificacionTexto}";
                $prioridad = $opinion->calificacion <= 3 ? 'alta' : 'media';
                break;
            case 'respondida':
                $titulo = "Reseña respondida";
                $mensaje = "Se ha respondido a la reseña de {$cliente->name}";
                $prioridad = 'baja';
                break;
            default:
                $titulo = "Actualización de reseña";
                $mensaje = "La reseña de {$cliente->name} ha sido actualizada";
                $prioridad = 'media';
        }
        
        foreach ($adminUsers as $admin) {
            Notificacion::create([
                'user_id' => $admin->id,
                'tipo' => 'opinion',
                'titulo' => $titulo,
                'mensaje' => $mensaje,
                'data' => [
                    'opinion_id' => $opinion->id,
                    'cliente_id' => $cliente->id,
                    'cliente_nombre' => $cliente->name,
                    'calificacion' => $opinion->calificacion,
                    'contenido' => $opinion->contenido,
                    'accion' => $accion
                ],
                'leida' => false,
                'url' => "/dashboard/opiniones?id={$opinion->id}",
                'prioridad' => $prioridad,
                'referencia_id' => $opinion->id,
                'referencia_type' => Opinion::class,
            ]);
        }
    }
    
    public function obtenerNotificaciones(User $user, $tipo = null, $soloNoLeidas = false)
    {
        $query = Notificacion::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');
            
        if ($tipo) {
            $query->where('tipo', $tipo);
        }
        
        if ($soloNoLeidas) {
            $query->where('leida', false);
        }
        
        return $query->get();
    }
    
    public function marcarTodasComoLeidas(User $user, $tipo = null)
    {
        $query = Notificacion::where('user_id', $user->id)
            ->where('leida', false);
            
        if ($tipo) {
            $query->where('tipo', $tipo);
        }
        
        return $query->update(['leida' => true]);
    }
    
    public function marcarComoLeida($id)
    {
        $notificacion = Notificacion::find($id);
        
        if ($notificacion) {
            return $notificacion->marcarComoLeida();
        }
        
        return false;
    }
}
