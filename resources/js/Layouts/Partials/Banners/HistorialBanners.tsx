import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { History, Search, SlidersHorizontal, Eye } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { usePage } from "@inertiajs/react";

// Define the Banner type based on your backend data
export interface Banner {
  id: number;
  titulo: string | null;
  subtitulo: string | null;
  imagen_principal: string;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
  updated_at: string;
}

const HistorialBanners = () => {
  // Get banners data from Inertia page props
  const { banners } = (usePage().props as unknown) as { banners: Banner[] };
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Filter banners based on search term and status
  const filteredBanners = banners.filter((banner) => {
    // Search by title or subtitle
    const matchesSearch = 
      (banner.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (banner.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && banner.activo) || 
      (statusFilter === "inactive" && !banner.activo);
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (active: boolean) => {
    return active ? "default" : "destructive";
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
                  Registro histórico de todos los banners, incluyendo los inactivos
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
              {/* Search and filters */}
              <div className="flex flex-wrap gap-4 mb-4 items-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por título o subtítulo..."
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
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" title="Más filtros">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Banners table */}
              {filteredBanners.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Subtítulo</TableHead>
                        <TableHead>Fecha de creación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-16 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBanners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell className="font-mono text-xs">{banner.id}</TableCell>
                          <TableCell>
                            <div className="h-12 w-20">
                              <img
                                src={banner.imagen_principal}
                                alt={banner.titulo || "Banner sin título"}
                                className="h-full w-full object-cover rounded border"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {banner.titulo || "Sin título"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {banner.subtitulo || "Sin subtítulo"}
                          </TableCell>
                          <TableCell>
                            {formatDate(banner.created_at)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(banner.activo)}>
                              {banner.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
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
            </TabsContent>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBanners.length > 0 ? (
                  filteredBanners.map((banner) => (
                    <Card key={banner.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={banner.imagen_principal}
                          alt={banner.titulo || "Banner sin título"}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          className="absolute top-2 right-2"
                          variant={getStatusBadgeVariant(banner.activo)}
                        >
                          {banner.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium truncate">
                          {banner.titulo || "Sin título"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {banner.subtitulo || "Sin subtítulo"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(banner.created_at)}
                        </p>
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