import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import {
  Menu,
  Bell,
  Maximize,
  Minimize,
  LogOut,
  X,
  ShoppingCart,
  Calendar,
  MessageSquare,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import { ProfileModal } from "@/Components/Modals/ProfileModal";

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

interface HeaderProps {
  toggleSidebar: () => void;
  auth: {
    user: {
      username: string;
      email: string;
      first_name?: string;
      last_name?: string;
      dni?: string;
      phone?: string;
      address?: string;
      sexo?: string;
    };
  };
}

const Header = ({ toggleSidebar, auth }: HeaderProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'todas' | 'pedido' | 'reserva' | 'opinion'>('todas');
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = () => {
    setIsLoading(true);
    
    axios.get('/dashboard/notificaciones/obtener', {
      params: {
        limite: 10
      }
    })
      .then(response => {
        if (response.data && response.data.notificaciones) {
          setNotifications(response.data.notificaciones);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar notificaciones:', error);
        setIsLoading(false);
      });
  };

  const markAllAsRead = () => {
    axios.post('/dashboard/notificaciones/marcar-todas-leidas', {
      tipo: activeFilter !== 'todas' ? activeFilter : null
    })
      .then(() => {
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            leida: true,
          }))
        );
      })
      .catch(error => {
        console.error('Error al marcar notificaciones como leídas:', error);
      });
  };
  
  const markAsRead = (id: number) => {
    axios.post(`/dashboard/notificaciones/marcar-leida/${id}`)
      .then(() => {
        setNotifications(
          notifications.map((notification) => 
            notification.id === id ? { ...notification, leida: true } : notification
          )
        );
      })
      .catch(error => {
        console.error(`Error al marcar notificación ${id} como leída:`, error);
      });
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (notification.leida) return false; 
    if (activeFilter === 'todas') return true;
    return notification.tipo === activeFilter;
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.leida
  ).length;

  const getInitials = (username: string, first_name?: string, last_name?: string) => {
    // Si hay nombre y apellido, usar sus iniciales
    if (first_name && last_name) {
      return (
        (first_name[0] || '').toUpperCase() +
        (last_name[0] || '').toUpperCase()
      );
    }
    // Si solo hay username, usar iniciales del username
    const names = username.split(" ");
    return names
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={{
          first_name: auth.user.first_name || "",
          last_name: auth.user.last_name || "",
          email: auth.user.email,
          username: auth.user.username,
          dni: auth.user.dni || "",
          phone: auth.user.phone || "",
          address: auth.user.address || "",
          sexo: auth.user.sexo || "",
        }}
      />
      <header className="bg-card border-b sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center w-full justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 absolute left-4"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </Button>

            <h1
              className={cn(
                "text-3xl font-extrabold text-center w-full tracking-widest uppercase",
                "bg-gradient-to-r from-blue-900 via-blue-400 via-white via-blue-400 to-blue-900 bg-[length:400%_auto] bg-clip-text text-transparent animate-gradient-x",
                showSearchInput && "hidden sm:block"
              )}
              style={{
                WebkitBackgroundClip: "text",
                backgroundClip: "text"
              }}
            >
              RUDOLF MOTOS - Panel de Control
            </h1>
          </div>

          <div className="md:hidden flex items-center">
            {showSearchInput ? (
              <div className="absolute inset-x-0 top-0 bg-card z-50 px-4 py-2 flex items-center border-b">
                <Input
                  type="text"
                  placeholder="Buscar productos, pedidos o clientes..."
                  className="w-full"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => setShowSearchInput(false)}
                  aria-label="Cerrar búsqueda"
                >
                  <X size={18} />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-destructive text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-32px)] sm:w-80 md:w-96 p-0 shadow-lg border border-border/50 rounded-lg overflow-hidden" align="end" sideOffset={8}>
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                  <h3 className="font-semibold text-primary">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8"
                      onClick={markAllAsRead}
                    >
                      Marcar todo como leído
                    </Button>
                  )}
                </div>
                
                {/* Filtros de notificaciones */}
                <div className="flex flex-wrap items-center p-2 border-b gap-1 bg-card">
                  <Button 
                    variant={activeFilter === 'todas' ? 'default' : 'ghost'} 
                    size="sm" 
                    className="text-xs h-7 flex-grow flex-shrink-0 min-w-[60px]"
                    onClick={() => setActiveFilter('todas')}
                  >
                    Todas
                  </Button>
                  <Button 
                    variant={activeFilter === 'pedido' ? 'default' : 'ghost'} 
                    size="sm" 
                    className="text-xs h-7 flex-grow flex-shrink-0 min-w-[60px]"
                    onClick={() => setActiveFilter('pedido')}
                  >
                    <ShoppingCart size={12} className="mr-1" />
                    <span className="hidden xs:inline">Pedidos</span>
                  </Button>
                  <Button 
                    variant={activeFilter === 'reserva' ? 'default' : 'ghost'} 
                    size="sm" 
                    className="text-xs h-7 flex-grow flex-shrink-0 min-w-[60px]"
                    onClick={() => setActiveFilter('reserva')}
                  >
                    <Calendar size={12} className="mr-1" />
                    <span className="hidden xs:inline">Reservas</span>
                  </Button>
                  <Button 
                    variant={activeFilter === 'opinion' ? 'default' : 'ghost'} 
                    size="sm" 
                    className="text-xs h-7 flex-grow flex-shrink-0 min-w-[60px]"
                    onClick={() => setActiveFilter('opinion')}
                  >
                    <MessageSquare size={12} className="mr-1" />
                    <span className="hidden xs:inline">Opiniones</span>
                  </Button>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto bg-card/50 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/20">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-xs text-muted-foreground mt-2">Cargando notificaciones...</p>
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => {
                        let Icon;
                        let bgColor;
                        
                        switch(notification.tipo) {
                          case 'pedido':
                            Icon = ShoppingCart;
                            bgColor = 'bg-indigo-100 text-indigo-600';
                            break;
                          case 'reserva':
                            Icon = Calendar;
                            bgColor = 'bg-slate-100 text-slate-600';
                            break;
                          case 'opinion':
                            Icon = MessageSquare;
                            bgColor = 'bg-amber-100 text-amber-600';
                            break;
                          default:
                            Icon = Bell;
                            bgColor = 'bg-gray-100 text-gray-600';
                        }
                        
                        let PriorityIcon;
                        let priorityColor = '';
                        
                        if (notification.prioridad) {
                          switch(notification.prioridad) {
                            case 'alta':
                              PriorityIcon = AlertCircle;
                              priorityColor = 'text-red-500';
                              break;
                            case 'media':
                              PriorityIcon = Clock;
                              priorityColor = 'text-amber-500';
                              break;
                            case 'baja':
                              PriorityIcon = Check;
                              priorityColor = 'text-green-500';
                              break;
                          }
                        }
                        
                        return (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-4 border-b last:border-0 hover:bg-muted/50 transition-all cursor-pointer rounded-md my-1",
                              !notification.leida && "bg-blue-50/50 dark:bg-blue-950/20"
                            )}
                            onClick={() => {
                              markAsRead(notification.id);
                              
                              if (notification.url) {
                                router.visit(notification.url);
                              } else {
                                switch(notification.tipo) {
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
                                    router.visit('/dashboard/notificaciones');
                                }
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn("rounded-full p-2 shadow-sm", bgColor)}>
                                <Icon size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={cn("text-sm font-semibold line-clamp-1", !notification.leida && "text-primary")}>
                                    {notification.titulo}
                                  </p>
                                  {notification.prioridad && PriorityIcon && (
                                    <PriorityIcon size={14} className={priorityColor} />
                                  )}
                                </div>
                                <p className={cn("text-xs mt-1 line-clamp-2 text-muted-foreground")}>
                                  {notification.mensaje}
                                </p>
                                <p className="text-xs text-muted-foreground/70 mt-1 italic">
                                  {notification.tiempo}
                                </p>
                              </div>
                              {!notification.leida && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-2 flex-shrink-0 animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {activeFilter === 'todas' 
                        ? 'No hay notificaciones' 
                        : `No hay notificaciones de ${activeFilter === 'pedido' ? 'pedidos' : activeFilter === 'reserva' ? 'reservas' : 'opiniones'}`}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t bg-muted/20">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => router.visit('/dashboard/notificaciones')}
                  >
                    Ver todas las notificaciones
                  </Button>
                </div>
                <div className="p-2 pt-0 bg-muted/20">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={fetchNotifications}
                  >
                    Actualizar notificaciones
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* User profile - desktop version */}
            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-sm font-semibold text-primary/90">{auth.user.username}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 p-0 shadow border border-primary/20 bg-gradient-to-br from-primary/10 to-background/80 hover:from-primary/20 transition-all"
                  >
                    <div className="bg-primary/10 rounded-full h-9 w-9 flex items-center justify-center">
                      <span className="text-primary font-bold text-base tracking-wide">
                        {getInitials(auth.user.username, auth.user.first_name, auth.user.last_name)}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-xl border border-primary/10 bg-background/95">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-semibold text-primary">{auth.user.username}</p>
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold w-fit">Administrador</span>
                      <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary rounded-md transition"
                    onClick={() => setShowProfileModal(true)}
                  >
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive hover:bg-red-50 hover:text-red-700 rounded-md transition"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User profile - mobile version (just the avatar) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 p-0 shadow border border-primary/20 bg-gradient-to-br from-primary/10 to-background/80 hover:from-primary/20 transition-all"
                >
                  <div className="bg-primary/10 rounded-full h-9 w-9 flex items-center justify-center">
                    <span className="text-primary font-bold text-base tracking-wide">
                      {getInitials(auth.user.username, auth.user.first_name, auth.user.last_name)}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-xl border border-primary/10 bg-background/95">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-semibold text-primary">{auth.user.username}</p>
                    <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:bg-primary/10 hover:text-primary rounded-md transition"
                  onClick={() => setShowProfileModal(true)}
                >
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive hover:bg-red-50 hover:text-red-700 rounded-md transition"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
