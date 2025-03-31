import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { History, Search, SlidersHorizontal, Eye } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

// Tipo para los datos del banner
export interface BannerRecord {
  id: number;
  name: string;
  url: string;
  date: string;
  status: "active" | "deleted";
  uploadedBy: string;
}

// Función para obtener banners del localStorage
const getBannersFromStorage = (): BannerRecord[] => {
  const storedBanners = localStorage.getItem('banners');
  if (storedBanners) {
    return JSON.parse(storedBanners);
  }
  return [];
};

const HistorialBanners = () => {
  // Estado para los banners
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Cargar banners del localStorage
  useEffect(() => {
    const loadBanners = () => {
      const storedBanners = getBannersFromStorage();
      setBanners(storedBanners);
      setIsLoading(false);
    };

    loadBanners();

    // Configurar un listener para detectar cambios en localStorage
    const handleStorageChange = () => {
      loadBanners();
    };

    // Escuchar eventos de almacenamiento para actualizaciones en tiempo real
    window.addEventListener('storage', handleStorageChange);

    // También podemos simular un evento de cambio para otros componentes en la misma página
    const intervalId = setInterval(loadBanners, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Filtrar banners
  const filteredBanners = banners.filter((banner) => {
    // Filtro por término de búsqueda
    const matchesSearch = banner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (banner.uploadedBy && banner.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro por estado
    const matchesStatus = statusFilter === "all" || banner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "deleted": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <History className="text-primary h-6 w-6" />
              <div>
                <CardTitle>Historial de Banners</CardTitle>
                <CardDescription className="mt-1">
                  Registro histórico de todos los banners, incluyendo los eliminados
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-primary">{banners.length} banners en total</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto">
              <TabsTrigger value="list">Vista de Lista</TabsTrigger>
              <TabsTrigger value="grid">Vista de Cuadrícula</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Filtros y búsqueda */}
              <div className="flex flex-wrap gap-4 mb-4 items-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="deleted">Eliminados</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" title="Más filtros">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabla de banners */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-slate-500">Cargando historial de banners...</p>
                </div>
              ) : filteredBanners.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border md:block hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead className="w-1/4">Nombre</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Subido por</TableHead>
                        <TableHead className="w-16 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBanners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell className="font-mono text-xs">{banner.id}</TableCell>
                          <TableCell className="truncate max-w-xs">
                            <div className="flex items-center gap-2">
                              <img
                                src={banner.url}
                                alt={banner.name}
                                className="h-8 w-12 object-cover rounded border"
                              />
                              <span className="truncate">{banner.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{banner.date}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(banner.status) as any}>
                              {banner.status === "active" ? "Activo" : "Eliminado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{banner.uploadedBy || "Usuario actual"}</TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No se encontraron banners</p>
                  <p className="text-slate-400 text-sm">
                    {searchTerm || statusFilter !== "all"
                      ? "Prueba con otros términos de búsqueda o filtros"
                      : "Sube banners desde la sección 'Subir Banners' para verlos aquí"}
                  </p>
                </div>
              )}

              {/* Vista móvil */}
              <div className="md:hidden">
                {filteredBanners.map((banner) => (
                  <div key={banner.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-mono text-xs">ID: {banner.id}</p>
                        <p className="truncate max-w-xs">{banner.name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={banner.url}
                      alt={banner.name}
                      className="w-full rounded border object-cover mb-2"
                    />
                    <p className="text-sm text-gray-500">{banner.date}</p>
                    <Badge variant={getStatusBadgeVariant(banner.status) as any}>
                      {banner.status === "active" ? "Activo" : "Eliminado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 flex flex-col gap-2 animate-pulse">
                      <div className="h-36 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : filteredBanners.length > 0 ? (
                  filteredBanners.map((banner) => (
                    <Card key={banner.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={banner.url}
                          alt={banner.name}
                          className="w-full h-36 object-cover"
                        />
                        <Badge
                          className="absolute top-2 right-2"
                          variant={getStatusBadgeVariant(banner.status) as any}
                        >
                          {banner.status === "active" ? "Activo" : "Eliminado"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium truncate">{banner.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{banner.date}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border">
                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No se encontraron banners</p>
                    <p className="text-slate-400 text-sm">
                      {searchTerm || statusFilter !== "all"
                        ? "Prueba con otros términos de búsqueda o filtros"
                        : "Sube banners desde la sección 'Subir Banners' para verlos aquí"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistorialBanners;
