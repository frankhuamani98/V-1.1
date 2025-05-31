import React, { useState } from "react"
import { router } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Switch } from "@/Components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/Components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { Trash2, RefreshCw, Calendar, Image, AlertTriangle, ListIcon, Eye, EyeOff } from "lucide-react"

interface Banner {
  id: number
  titulo: string
  subtitulo: string | null
  imagen_principal: string
  activo: boolean
  fecha_inicio: string | null
  fecha_fin: string | null
  created_at: string
  deleted_at: string | null
  status: "active" | "deleted"
  tipo_imagen: "local" | "url"
}

interface Props {
  banners: Banner[]
}

const HistorialBanners: React.FC<Props> = ({ banners }) => {
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const toggleStatus = (id: number, currentStatus: boolean) => {
    router.put(`/banners/${id}/toggle-status`, {}, {
      onSuccess: () => {
        toast.success(`Banner ${currentStatus ? 'desactivado' : 'activado'} correctamente`)
      },
      onError: () => {
        toast.error("Ha ocurrido un error al cambiar el estado del banner")
      }
    })
  }

  const openDeleteDialog = (banner: Banner) => {
    setBannerToDelete(banner)
    setIsDeleteDialogOpen(true)
  }

  const deleteBanner = () => {
    if (bannerToDelete) {
      router.delete(`/banners/${bannerToDelete.id}`, {
        onSuccess: () => {
          toast.success("Banner eliminado correctamente")
          setIsDeleteDialogOpen(false)
        },
        onError: () => {
          toast.error("Ha ocurrido un error al eliminar el banner")
        }
      })
    }
  }

  return (
    <Card className="border-slate-200 shadow-md overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-slate-50 pb-8 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ListIcon className="h-6 w-6 text-indigo-500" />
          Historial de Banners
        </CardTitle>
        <CardDescription className="text-slate-500">
          Administra los banners existentes, activa/desactiva o elimina según sea necesario
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {banners.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <Image className="h-16 w-16 mx-auto text-slate-400 mb-6" />
            <h3 className="text-xl font-medium text-slate-700 mb-3">No hay banners disponibles</h3>
            <p className="text-slate-500 text-lg mb-6">Comienza creando un nuevo banner desde la sección "Subir Nuevo Banner"</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
                      <img
                        src={banner.tipo_imagen === 'local' ? `/storage/${banner.imagen_principal}` : banner.imagen_principal}
                        alt={banner.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://placehold.co/300x200?text=Error+al+cargar'
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-800 mb-1">{banner.titulo}</h3>
                          {banner.subtitulo && (
                            <p className="text-sm text-slate-500">{banner.subtitulo}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          {banner.fecha_inicio && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                              <span><span className="font-medium">Inicio:</span> {format(new Date(banner.fecha_inicio), "PPP", { locale: es })}</span>
                            </div>
                          )}
                          {banner.fecha_fin && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                              <span><span className="font-medium">Fin:</span> {format(new Date(banner.fecha_fin), "PPP", { locale: es })}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          {banner.status === "active" ? (
                            <>
                              <Badge 
                                variant={banner.activo ? "default" : "outline"}
                                className={`${banner.activo ? "bg-green-100 text-green-800 hover:bg-green-100" : "border-slate-200 text-slate-500"} text-sm px-3 py-1`}
                              >
                                {banner.activo ? (
                                  <span className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" /> Visible
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <EyeOff className="h-4 w-4" /> Oculto
                                  </span>
                                )}
                              </Badge>
                              <Switch
                                checked={banner.activo}
                                onCheckedChange={() => toggleStatus(banner.id, banner.activo)}
                                className="data-[state=checked]:bg-indigo-600"
                              />
                            </>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 text-sm px-3 py-1">
                              <span className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Eliminado
                              </span>
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => openDeleteDialog(banner)}
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 flex items-center gap-2 ml-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block rounded-lg border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-slate-700 font-medium p-4 text-base">Vista Previa</TableHead>
                    <TableHead className="text-slate-700 font-medium p-4 text-base">Título</TableHead>
                    <TableHead className="text-slate-700 font-medium p-4 text-base">Fechas</TableHead>
                    <TableHead className="text-slate-700 font-medium p-4 text-base">Estado</TableHead>
                    <TableHead className="text-slate-700 font-medium p-4 text-base text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id} className="hover:bg-slate-50">
                      <TableCell className="p-4">
                        <div className="w-36 h-24 relative rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                          <img
                            src={banner.tipo_imagen === 'local' ? `/storage/${banner.imagen_principal}` : banner.imagen_principal}
                            alt={banner.titulo}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://placehold.co/300x200?text=Error+al+cargar'
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-800 text-base">{banner.titulo}</p>
                          {banner.subtitulo && (
                            <p className="text-sm text-slate-500">{banner.subtitulo}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="space-y-3">
                          {banner.fecha_inicio && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-indigo-500" />
                              <div className="space-x-1.5">
                                <span className="text-slate-700 font-medium">Inicio:</span>
                                <span className="text-slate-600">
                                  {format(new Date(banner.fecha_inicio), "PPP", { locale: es })}
                                </span>
                              </div>
                            </div>
                          )}
                          {banner.fecha_fin && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-indigo-500" />
                              <div className="space-x-1.5">
                                <span className="text-slate-700 font-medium">Fin:</span>
                                <span className="text-slate-600">
                                  {format(new Date(banner.fecha_fin), "PPP", { locale: es })}
                                </span>
                              </div>
                            </div>
                          )}
                          {!banner.fecha_inicio && !banner.fecha_fin && (
                            <p className="text-slate-500 italic flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              Sin fechas programadas
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        {banner.status === "active" ? (
                          <div className="flex items-center gap-4">
                            <Badge 
                              variant={banner.activo ? "default" : "outline"}
                              className={`${banner.activo ? "bg-green-100 text-green-800 hover:bg-green-100" : "border-slate-200 text-slate-500"} text-sm px-3 py-1`}
                            >
                              {banner.activo ? (
                                <span className="flex items-center gap-2">
                                  <Eye className="h-4 w-4" /> Visible
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <EyeOff className="h-4 w-4" /> Oculto
                                </span>
                              )}
                            </Badge>
                            <Switch
                              checked={banner.activo}
                              onCheckedChange={() => toggleStatus(banner.id, banner.activo)}
                              className="data-[state=checked]:bg-indigo-600"
                            />
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 text-sm px-3 py-1">
                            <span className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4" /> Eliminado
                            </span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <Button
                          variant="outline"
                          onClick={() => openDeleteDialog(banner)}
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar el banner "{bannerToDelete?.titulo}"?
              Esta acción se puede deshacer más tarde.
            </DialogDescription>
          </DialogHeader>
          
          {bannerToDelete && (
            <div className="my-2">
              <div className="aspect-video bg-slate-100 rounded-md overflow-hidden flex items-center justify-center border border-slate-200">
                <img 
                  src={bannerToDelete.tipo_imagen === 'local' ? `/storage/${bannerToDelete.imagen_principal}` : bannerToDelete.imagen_principal} 
                  alt={bannerToDelete.titulo} 
                  className="max-w-full max-h-full object-contain" 
                  onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400?text=Error+al+cargar'}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" className="border-slate-200" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteBanner}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default HistorialBanners