import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { History, Search, SlidersHorizontal, Eye, Trash2, Edit } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Link } from "@inertiajs/react";

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
  status: "active" | "deleted";
}

interface HistorialBannersProps {
  banners: Banner[];
}

const HistorialBanners: React.FC<HistorialBannersProps> = ({ banners }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = banner.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (banner.subtitulo && banner.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || banner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "deleted": return "destructive";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
                  Registro completo de todos los banners subidos
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-primary">{filteredBanners.length} banners encontrados</Badge>
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
                      <SelectItem value="deleted">Eliminados</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon" title="Más filtros">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tabla de banners */}
              {filteredBanners.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fechas</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBanners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell className="font-medium">{banner.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{banner.titulo}</div>
                            {banner.subtitulo && (
                              <div className="text-sm text-gray-500">{banner.subtitulo}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <img
                              src={banner.imagen_principal}
                              alt={banner.titulo}
                              className="h-12 w-20 object-cover rounded border"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(banner.status)}>
                              {banner.status === "active" ? "Activo" : "Eliminado"}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(banner.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {banner.fecha_inicio && (
                                <div>Inicio: {formatDate(banner.fecha_inicio)}</div>
                              )}
                              {banner.fecha_fin && (
                                <div>Fin: {formatDate(banner.fecha_fin)}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" title="Editar">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Eliminar">
                                <Trash2 className="h-4 w-4 text-red-500" />
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
                  <p className="text-slate-400 text-sm mt-2">
                    {searchTerm || statusFilter !== "all"
                      ? "Prueba con otros términos de búsqueda o filtros"
                      : "Sube tu primer banner para comenzar"}
                  </p>
                  <Link href={route('banners.subir')} className="mt-4 inline-block">
                    <Button>
                      Subir Nuevo Banner
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBanners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={banner.imagen_principal}
                        alt={banner.titulo}
                        className="w-full h-48 object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={getStatusBadgeVariant(banner.status)}
                      >
                        {banner.status === "active" ? "Activo" : "Eliminado"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{banner.titulo}</h3>
                      {banner.subtitulo && (
                        <p className="text-sm text-muted-foreground mt-1">{banner.subtitulo}</p>
                      )}
                      <div className="mt-3 text-sm text-gray-500">
                        {banner.fecha_inicio && (
                          <div>Inicio: {formatDate(banner.fecha_inicio)}</div>
                        )}
                        {banner.fecha_fin && (
                          <div>Fin: {formatDate(banner.fecha_fin)}</div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" size="sm" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistorialBanners;