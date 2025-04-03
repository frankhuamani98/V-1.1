import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Link, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { History, Search, Plus, Filter, Power, RotateCw, Link as LinkIcon, Calendar, ArrowUpDown, Trash2 } from "lucide-react";

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen_principal: string;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
  deleted_at: string | null;
  status: "active" | "inactive" | "deleted";
  tipo_imagen: "local" | "url";
}

interface HistorialBannersProps {
  banners: Banner[];
}

const HistorialBanners: React.FC<HistorialBannersProps> = ({ banners }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredBanners = banners
    .filter((banner) => {
      const matchesSearch = 
        banner.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (banner.subtitulo && banner.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && banner.status === "active") ||
        (statusFilter === "inactive" && banner.status === "inactive") ||
        (statusFilter === "deleted" && banner.status === "deleted");

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "id") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      } else if (sortField === "titulo") {
        return sortDirection === "asc"
          ? a.titulo.localeCompare(b.titulo)
          : b.titulo.localeCompare(a.titulo);
      } else if (sortField === "fecha") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "deleted": return "destructive";
      default: return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Activo";
      case "inactive": return "Inactivo";
      case "deleted": return "Eliminado";
      default: return status;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleToggleStatus = (banner: Banner) => {
    if (banner.status === "deleted") {
      router.post(
        route("banners.restore", banner.id),
        {},
        {
          onSuccess: () => toast.success("Banner restaurado correctamente"),
          onError: () => toast.error("Error al restaurar el banner"),
        }
      );
    } else {
      router.put(
        route("banners.toggle-status", banner.id),
        {},
        {
          onSuccess: () => toast.success(`Banner ${banner.activo ? "desactivado" : "activado"} correctamente`),
          onError: () => toast.error("Error al actualizar el estado del banner"),
        }
      );
    }
  };

  const handleDelete = (bannerId: number, title: string) => {
    if (confirm(`¿Estás seguro de eliminar el banner "${title}"?`)) {
      router.delete(route("banners.destroy", bannerId), {
        onSuccess: () => toast.success("Banner eliminado correctamente"),
        onError: () => toast.error("Error al eliminar el banner"),
      });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 mx-auto">
      <Card className="shadow-sm rounded-lg">
        <CardHeader className="p-4 sm:p-6 border-b">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <History className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Historial de Banners</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Administra y visualiza todos los banners
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Link href={route("banners.subir")} className="w-full sm:w-auto">
                <Button className="w-full text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 flex items-center">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                  <span>Nuevo Banner</span>
                </Button>
              </Link>
              
              <Badge variant="outline" className="self-center px-2.5 py-1 text-xs">
                {filteredBanners.length} {filteredBanners.length === 1 ? "banner" : "banners"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="list">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm sm:text-base"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm sm:text-base w-full sm:w-[180px]">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="deleted">Eliminados</SelectItem>
                </SelectContent>
              </Select>

              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="list" className="text-xs sm:text-sm">
                  Lista
                </TabsTrigger>
                <TabsTrigger value="grid" className="text-xs sm:text-sm">
                  Cuadrícula
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredBanners.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg border flex flex-col items-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No se encontraron banners</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Prueba con otros términos de búsqueda"
                      : "Sube tu primer banner para comenzar"}
                  </p>
                  <Link href={route("banners.subir")}>
                    <Button className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 flex items-center">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                      Crear Nuevo Banner
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">
                          <button 
                            onClick={() => handleSort("id")} 
                            className="flex items-center space-x-1"
                          >
                            <span>ID</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button 
                            onClick={() => handleSort("titulo")} 
                            className="flex items-center space-x-1"
                          >
                            <span>Título</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">Imagen</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="hidden md:table-cell">
                          <button 
                            onClick={() => handleSort("fecha")} 
                            className="flex items-center space-x-1"
                          >
                            <span>Fecha</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBanners.map((banner) => (
                        <TableRow key={banner.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{banner.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{banner.titulo}</div>
                            {banner.subtitulo && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {banner.subtitulo}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="relative h-12 w-20 rounded-md overflow-hidden border">
                              <img
                                src={banner.imagen_principal}
                                alt={banner.titulo}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-image.jpg";
                                }}
                              />
                              {banner.tipo_imagen === "url" && (
                                <div className="absolute top-1 left-1 bg-background/80 rounded-full p-1">
                                  <LinkIcon className="h-3 w-3 text-blue-500" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(banner.status)}>
                              {getStatusText(banner.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-xs">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(banner.created_at)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleToggleStatus(banner)}
                                      className="h-8 w-8"
                                    >
                                      {banner.status === "deleted" ? (
                                        <RotateCw className="h-4 w-4" />
                                      ) : (
                                        <Power className={`h-4 w-4 ${
                                          banner.activo ? "text-green-500" : "text-muted-foreground"
                                        }`} />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {banner.status === "deleted"
                                      ? "Restaurar banner"
                                      : banner.activo
                                      ? "Desactivar banner"
                                      : "Activar banner"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              {banner.status !== "deleted" && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(banner.id, banner.titulo)}
                                        className="h-8 w-8 text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Eliminar banner</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="grid">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredBanners.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg border flex flex-col items-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No se encontraron banners</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Prueba con otros términos de búsqueda"
                      : "Sube tu primer banner para comenzar"}
                  </p>
                  <Link href={route("banners.subir")}>
                    <Button className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 flex items-center">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                      Crear Nuevo Banner
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBanners.map((banner) => (
                    <Card key={banner.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative aspect-video">
                        <img
                          src={banner.imagen_principal}
                          alt={banner.titulo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <Badge
                          variant={getStatusBadgeVariant(banner.status)}
                          className="absolute top-2 right-2"
                        >
                          {getStatusText(banner.status)}
                        </Badge>
                        {banner.tipo_imagen === "url" && (
                          <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
                            <LinkIcon className="h-3 w-3 text-blue-500" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{banner.titulo}</h3>
                        {banner.subtitulo && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {banner.subtitulo}
                          </p>
                        )}
                        <div className="mt-3 text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(banner.created_at)}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end p-4 pt-0 space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(banner)}
                                className="h-8"
                              >
                                {banner.status === "deleted" ? (
                                  <RotateCw className="h-3 w-3 mr-1" />
                                ) : (
                                  <Power className={`h-3 w-3 mr-1 ${
                                    banner.activo ? "text-green-500" : "text-muted-foreground"
                                  }`} />
                                )}
                                <span className="text-xs">
                                  {banner.status === "deleted" ? "Restaurar" : banner.activo ? "Desactivar" : "Activar"}
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {banner.status === "deleted"
                                ? "Restaurar banner"
                                : banner.activo
                                ? "Desactivar banner"
                                : "Activar banner"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {banner.status !== "deleted" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(banner.id, banner.titulo)}
                                  className="h-8 text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Eliminar</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar banner</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistorialBanners;