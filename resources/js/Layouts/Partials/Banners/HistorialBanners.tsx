import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { History, Search, SlidersHorizontal, Eye, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/Components/ui/alert-dialog";

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
  const { banners } = usePage().props as unknown as { banners: Banner[] };
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = 
      (banner.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (banner.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && banner.activo) || 
      (statusFilter === "inactive" && !banner.activo);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (active: boolean) => {
    return active ? "default" : "destructive"; // Map "success" to "default"
  };

  const handleDelete = (id: number) => {
    router.delete(route('banners.destroy', id), {
      onSuccess: () => toast.success('Banner eliminado correctamente'),
      onError: () => toast.error('Error al eliminar el banner')
    });
  };

  const toggleStatus = (id: number, currentStatus: boolean) => {
    router.put(route('banners.toggle-status', id), {}, {
      onSuccess: () => toast.success(`Banner ${!currentStatus ? 'activado' : 'desactivado'} correctamente`),
      onError: () => toast.error('Error al cambiar el estado del banner')
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
                  Registro histórico de todos los banners
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
                </div>
              </div>

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
                        <TableHead className="w-32 text-center">Acciones</TableHead>
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
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                title={banner.activo ? "Desactivar" : "Activar"}
                                onClick={() => toggleStatus(banner.id, banner.activo)}
                              >
                                {banner.activo ? (
                                  <ToggleRight className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Eliminar"
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará permanentemente el banner y no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(banner.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(banner.id, banner.activo)}
                          >
                            {banner.activo ? "Desactivar" : "Activar"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                Eliminar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el banner.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(banner.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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