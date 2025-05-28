import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
  Menu,
  Search,
  Bell,
  Maximize,
  Minimize,
  LogOut,
  X,
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

interface Notification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

interface HeaderProps {
  toggleSidebar: () => void;
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const Header = ({ toggleSidebar, auth }: HeaderProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const getInitials = (username: string) => {
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
    <header className="bg-card border-b sticky top-0 z-30 w-full">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </Button>

          <h1 className={cn("text-xl font-bold", showSearchInput && "hidden sm:block")}>
            Panel de Control
          </h1>
        </div>

        <div
          className={cn(
            "hidden md:flex items-center relative max-w-md",
            "md:absolute md:left-1/2 md:transform md:-translate-x-1/2"
          )}
        >
          <Input
            type="text"
            placeholder="Buscar..."
            className="pl-9 w-full md:w-80 lg:w-96"
          />
          <Search size={16} className="absolute left-3 text-muted-foreground" />
        </div>

        <div className="md:hidden flex items-center">
          {showSearchInput ? (
            <div className="absolute inset-x-0 top-0 bg-card z-50 px-4 py-2 flex items-center border-b">
              <Input
                type="text"
                placeholder="Buscar..."
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
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchInput(true)}
              aria-label="Abrir búsqueda"
            >
              <Search size={20} />
            </Button>
          )}
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
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-medium">Notificaciones</h3>
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
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b last:border-0 hover:bg-muted/50 transition-colors",
                          notification.unread && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start">
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm", notification.unread && "font-medium")}>
                              {notification.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-2 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No hay notificaciones
                  </div>
                )}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Ver todas las notificaciones
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User profile - desktop version */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm font-medium">{auth.user.username}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                  <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {getInitials(auth.user.username)}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{auth.user.username}</p>
                    <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User profile - mobile version (just the avatar) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {getInitials(auth.user.username)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{auth.user.username}</p>
                  <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;




































































































































