import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/Components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { History, Search, Trash2, ToggleLeft, ToggleRight, Filter, Calendar, ImageIcon } from "lucide-react"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { usePage, router } from "@inertiajs/react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Separator } from "@/Components/ui/separator"

export interface Banner {
  id: number
  titulo: string | null
  subtitulo: string | null
  imagen_principal: string
  activo: boolean
  fecha_inicio: string | null
  fecha_fin: string | null
  created_at: string
  updated_at: string
}

const HistorialBanners = () => {
  const { banners } = usePage().props as unknown as { banners: Banner[] }
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      (banner.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (banner.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && banner.activo) ||
      (statusFilter === "inactive" && !banner.activo)

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeVariant = (active: boolean) => {
    return active ? "default" : "destructive"
  }

  const handleDelete = (id: number) => {
    router.delete(route("banners.destroy", id), {
      onSuccess: () => toast.success("Banner eliminado correctamente"),
      onError: () => toast.error("Error al eliminar el banner"),
    })
  }

  const toggleStatus = (id: number, currentStatus: boolean) => {
    router.put(
      route("banners.toggle-status", id),
      {},
      {
        onSuccess: () => toast.success(`Banner ${!currentStatus ? "activado" : "desactivado"} correctamente`),
        onError: () => toast.error("Error al cambiar el estado del banner"),
      },
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <Card className="shadow-lg border-0 overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <History className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Historial de Banners</CardTitle>
                <CardDescription className="mt-1 text-slate-500 text-sm">
                  Gestiona y visualiza todos los banners de tu sitio
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-primary/90 hover:bg-primary text-xs sm:text-sm py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-full self-start sm:self-auto">
              {banners.length} banners en total
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="list" className="w-full">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center border-b">
              <TabsList className="w-full sm:w-auto bg-slate-100 p-1 rounded-lg h-auto">
                <TabsTrigger
                  value="list"
                  className="text-xs sm:text-sm py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Vista de Lista
                </TabsTrigger>
                <TabsTrigger
                  value="grid"
                  className="text-xs sm:text-sm py-1.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Vista de Cuadrícula
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar banners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary/30 text-sm"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="sm:flex border-slate-200 bg-slate-50 hover:bg-slate-100 h-9 w-9"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isFilterOpen && (
              <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Estado:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28 sm:w-32 bg-white border-slate-200 h-8 text-xs sm:text-sm">
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("all")
                      setSearchTerm("")
                    }}
                    className="text-slate-500 hover:text-slate-700 text-xs sm:text-sm h-8"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            )}

            <TabsContent value="list" className="p-0 m-0">
              {filteredBanners.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="w-12 sm:w-16 font-medium text-xs sm:text-sm">ID</TableHead>
                        <TableHead className="font-medium text-xs sm:text-sm">Imagen</TableHead>
                        <TableHead className="font-medium text-xs sm:text-sm">Título</TableHead>
                        <TableHead className="font-medium text-xs sm:text-sm hidden md:table-cell">Subtítulo</TableHead>
                        <TableHead className="font-medium text-xs sm:text-sm hidden sm:table-cell">Fecha</TableHead>
                        <TableHead className="font-medium text-xs sm:text-sm">Estado</TableHead>
                        <TableHead className="w-24 sm:w-32 text-center font-medium text-xs sm:text-sm">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBanners.map((banner) => (
                        <TableRow key={banner.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-mono text-xs text-slate-500">{banner.id}</TableCell>
                          <TableCell>
                            <div className="h-10 sm:h-14 w-16 sm:w-24 rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                              {banner.imagen_principal ? (
                                <img
                                  src={banner.imagen_principal || "/placeholder.svg"}
                                  alt={banner.titulo || "Banner sin título"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-100">
                                  <ImageIcon className="h-4 w-4 text-slate-400" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[120px] sm:max-w-[180px] truncate font-medium text-xs sm:text-sm">
                            {banner.titulo || "Sin título"}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate text-slate-600 text-xs sm:text-sm hidden md:table-cell">
                            {banner.subtitulo || "Sin subtítulo"}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {formatDate(banner.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(banner.activo)}
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                banner.activo
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {banner.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title={banner.activo ? "Desactivar" : "Activar"}
                                onClick={() => toggleStatus(banner.id, banner.activo)}
                                className="h-7 sm:h-8 w-7 sm:w-8 p-0 rounded-full"
                              >
                                {banner.activo ? (
                                  <ToggleRight className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-green-500" />
                                ) : (
                                  <ToggleLeft className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-slate-400" />
                                )}
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Eliminar"
                                    className="h-7 sm:h-8 w-7 sm:w-8 p-0 rounded-full text-red-700 hover:text-red-500 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará permanentemente el banner y no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-slate-200">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(banner.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
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
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className="bg-slate-50 rounded-full h-12 sm:h-16 w-12 sm:w-16 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 sm:h-8 w-6 sm:w-8 text-slate-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-1">No se encontraron banners</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Prueba con otros términos de búsqueda o ajusta los filtros aplicados"
                      : "Sube banners desde la sección 'Subir Banners' para comenzar a gestionar tu contenido"}
                  </p>
                  {(searchTerm || statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all")
                        setSearchTerm("")
                      }}
                      className="mt-4 text-xs sm:text-sm h-8"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="grid" className="p-3 sm:p-6 m-0">
              {filteredBanners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredBanners.map((banner) => (
                    <Card
                      key={banner.id}
                      className="overflow-hidden border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md group"
                    >
                      <div className="relative aspect-[16/9]">
                        {banner.imagen_principal ? (
                          <img
                            src={banner.imagen_principal || "/placeholder.svg"}
                            alt={banner.titulo || "Banner sin título"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <ImageIcon className="h-8 w-8 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-3 right-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleStatus(banner.id, banner.activo)}
                              className="h-7 sm:h-8 bg-white/90 hover:bg-white border-0 text-xs"
                            >
                              {banner.activo ? (
                                <ToggleRight className="h-3.5 w-3.5 mr-1 sm:mr-1.5 text-green-500" />
                              ) : (
                                <ToggleLeft className="h-3.5 w-3.5 mr-1 sm:mr-1.5 text-slate-400" />
                              )}
                              {banner.activo ? "Desactivar" : "Activar"}
                            </Button>
                          </div>
                        </div>
                        <Badge
                          className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                            banner.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {banner.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-medium text-sm sm:text-base text-slate-800 line-clamp-1">
                            {banner.titulo || "Sin título"}
                          </h3>
                          <span className="text-xs font-mono text-slate-400">#{banner.id}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                          {banner.subtitulo || "Sin subtítulo"}
                        </p>
                        <div className="flex items-center text-xs text-slate-400 mt-2 sm:mt-3 mb-3 sm:mb-4">
                          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                          {formatDate(banner.created_at)}
                        </div>
                        <Separator className="mb-3 sm:mb-4" />
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-0 h-7 sm:h-8 text-xs"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
                                Eliminar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el banner.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-slate-200">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(banner.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16 px-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="bg-white rounded-full h-12 sm:h-16 w-12 sm:w-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Search className="h-6 sm:h-8 w-6 sm:w-8 text-slate-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-1">No se encontraron banners</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                    {searchTerm || statusFilter !== "all"
                      ? "Prueba con otros términos de búsqueda o ajusta los filtros aplicados"
                      : "Sube banners desde la sección 'Subir Banners' para comenzar a gestionar tu contenido"}
                  </p>
                  {(searchTerm || statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusFilter("all")
                        setSearchTerm("")
                      }}
                      className="mt-4 text-xs sm:text-sm h-8"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        {filteredBanners.length > 0 && (
          <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-500 gap-2">
            <p>
              Mostrando {filteredBanners.length} de {banners.length} banners
            </p>
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default HistorialBanners

