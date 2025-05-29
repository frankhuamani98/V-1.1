import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Badge } from '@/Components/ui/badge';
import axios from 'axios';
import {
  ShoppingCart,
  Calendar,
  MessageSquare,
  Check,
  Clock,
  AlertCircle,
  Bell,
  CheckCircle2,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: number;
  tipo: 'pedido' | 'reserva' | 'opinion';
  titulo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  prioridad?: 'alta' | 'media' | 'baja';
  url?: string;
}

interface Props {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
  notificaciones: Notification[];
  filtros: {
    tipo: string | null;
    soloNoLeidas: boolean;
  };
  contadores?: {
    [key: string]: number;
  };
}

export default function Notificaciones({ auth, notificaciones: initialNotificaciones, filtros, contadores }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notification[]>(initialNotificaciones || []);
  const [activeTab, setActiveTab] = useState<string>(filtros.tipo || 'todas');
  const [soloNoLeidas, setSoloNoLeidas] = useState<boolean>(filtros.soloNoLeidas || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contadoresTipo, setContadoresTipo] = useState<{[key: string]: number}>(contadores || {});

  const fetchNotificaciones = () => {
    setIsLoading(true);
    
    axios.get('/dashboard/notificaciones/obtener', {
      params: {
        tipo: activeTab !== 'todas' ? activeTab : null,
        no_leidas: soloNoLeidas,
        limite: 50
      }
    })
      .then(response => {
        if (response.data && response.data.notificaciones) {
          setNotificaciones(response.data.notificaciones);
          
          if (response.data.contador_por_tipo) {
            setContadoresTipo(response.data.contador_por_tipo);
          }
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar notificaciones:', error);
        toast.error('Error al cargar notificaciones');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchNotificaciones();
  }, [activeTab, soloNoLeidas]);

  const marcarComoLeida = (id: number) => {
    axios.post(`/dashboard/notificaciones/marcar-leida/${id}`)
      .then(() => {
        setNotificaciones(
          notificaciones.map((notificacion) => 
            notificacion.id === id ? { ...notificacion, leida: true } : notificacion
          )
        );
        toast.success('Notificación marcada como leída');
      })
      .catch(error => {
        console.error(`Error al marcar notificación ${id} como leída:`, error);
        toast.error('Error al marcar notificación como leída');
      });
  };

  const marcarTodasComoLeidas = () => {
    axios.post('/dashboard/notificaciones/marcar-todas-leidas', {
      tipo: activeTab !== 'todas' ? activeTab : null
    })
      .then(() => {
        setNotificaciones(
          notificaciones.map((notificacion) => ({
            ...notificacion,
            leida: true,
          }))
        );
        toast.success('Todas las notificaciones marcadas como leídas');
      })
      .catch(error => {
        console.error('Error al marcar notificaciones como leídas:', error);
        toast.error('Error al marcar notificaciones como leídas');
      });
  };

  const getIconForType = (tipo: string) => {
    switch(tipo) {
      case 'pedido':
        return <ShoppingCart className="h-5 w-5 text-indigo-600" />;
      case 'reserva':
        return <Calendar className="h-5 w-5 text-slate-600" />;
      case 'opinion':
        return <MessageSquare className="h-5 w-5 text-amber-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityIcon = (prioridad: string) => {
    switch(prioridad) {
      case 'alta':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'media':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'baja':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredNotificaciones = notificaciones;

  return (
    <DashboardLayout auth={auth}>
      <Head title="Notificaciones" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 bg-card/50 p-4 rounded-lg shadow-sm border border-border/30">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800 leading-tight">Notificaciones</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSoloNoLeidas(!soloNoLeidas)}
                className={soloNoLeidas ? "bg-primary/10" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                {soloNoLeidas ? "Todas" : "Solo no leídas"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchNotificaciones}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                Actualizar
              </Button>
              {filteredNotificaciones.some(n => !n.leida) && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={marcarTodasComoLeidas}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-md border-border/40 overflow-hidden">
            <CardHeader className="pb-3 bg-muted/20 px-3 sm:px-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap w-full gap-2 sm:gap-1 md:gap-0 sm:grid sm:grid-cols-4 p-1 bg-background mb-1">
                  <TabsTrigger value="todas" className="flex-1 min-w-[80px] px-2 py-1.5 sm:py-2">
                    <span className="truncate">Todas</span>
                    {(contadoresTipo.pedido || 0) + (contadoresTipo.reserva || 0) + (contadoresTipo.opinion || 0) > 0 && (
                      <Badge variant="destructive" className="ml-1 sm:ml-2 shrink-0">
                        {(contadoresTipo.pedido || 0) + (contadoresTipo.reserva || 0) + (contadoresTipo.opinion || 0)}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="pedido" className="flex items-center flex-1 min-w-[80px] px-2 py-1.5 sm:py-2">
                    <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                    <span className="truncate">Pedidos</span>
                    {contadoresTipo.pedido > 0 && (
                      <Badge variant="destructive" className="ml-1 sm:ml-2 shrink-0">{contadoresTipo.pedido}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="reserva" className="flex items-center flex-1 min-w-[80px] px-2 py-1.5 sm:py-2">
                    <Calendar className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                    <span className="truncate">Reservas</span>
                    {contadoresTipo.reserva > 0 && (
                      <Badge variant="destructive" className="ml-1 sm:ml-2 shrink-0">{contadoresTipo.reserva}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="opinion" className="flex items-center flex-1 min-w-[80px] px-2 py-1.5 sm:py-2">
                    <MessageSquare className="h-4 w-4 mr-1 sm:mr-2 shrink-0" />
                    <span className="truncate">Opiniones</span>
                    {contadoresTipo.opinion > 0 && (
                      <Badge variant="destructive" className="ml-1 sm:ml-2 shrink-0">{contadoresTipo.opinion}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full opacity-70"></div>
                  <p className="text-sm text-muted-foreground mt-4 animate-pulse">Cargando notificaciones...</p>
                </div>
              ) : filteredNotificaciones.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotificaciones.map((notificacion) => (
                    <div 
                      key={notificacion.id}
                      className={cn(
                        "p-4 border rounded-lg transition-all hover:shadow-md",
                        !notificacion.leida ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30" : "hover:bg-muted/20 border-border/50"
                      )}
                    >
                      <div className="flex items-start flex-wrap sm:flex-nowrap gap-3">
                        <div className={cn(
                          "rounded-full p-3 shadow-sm",
                          notificacion.tipo === 'pedido' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300" : 
                          notificacion.tipo === 'reserva' ? "bg-slate-100 text-slate-600 dark:bg-slate-950/50 dark:text-slate-300" : 
                          "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
                        )}>
                          {getIconForType(notificacion.tipo)}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                            <div className="flex items-center flex-wrap gap-1">
                              <h3 className={cn("text-lg font-medium truncate max-w-full", !notificacion.leida && "text-primary font-semibold")}>{notificacion.titulo}</h3>
                              {notificacion.prioridad && (
                                <div className="ml-2">
                                  {getPriorityIcon(notificacion.prioridad)}
                                </div>
                              )}
                              {!notificacion.leida && (
                                <Badge variant="default" className="ml-2 bg-blue-500 animate-pulse">Nueva</Badge>
                              )}
                            </div>
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="text-sm text-muted-foreground">{notificacion.tiempo}</span>
                              {!notificacion.leida && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => marcarComoLeida(notificacion.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (!notificacion.leida) {
                                    marcarComoLeida(notificacion.id);
                                  }
                                  
                                  if (notificacion.url) {
                                    router.visit(notificacion.url);
                                  } else {
                                    switch(notificacion.tipo) {
                                      case 'pedido':
                                        router.visit('/pedidos/estado');
                                        break;
                                      case 'reserva':
                                        router.visit('/dashboard/reservas');
                                        break;
                                      case 'opinion':
                                        router.visit('/dashboard/opiniones');
                                        break;
                                      default:
                                        break;
                                    }
                                  }
                                }}
                              >
                                Ver detalles
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3 sm:line-clamp-2 text-sm">{notificacion.mensaje}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Bell className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No hay notificaciones</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {activeTab !== 'todas' 
                      ? `No tienes notificaciones de ${activeTab === 'pedido' ? 'pedidos' : activeTab === 'reserva' ? 'reservas' : 'opiniones'}`
                      : soloNoLeidas 
                        ? 'No tienes notificaciones sin leer'
                        : 'No tienes notificaciones'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
