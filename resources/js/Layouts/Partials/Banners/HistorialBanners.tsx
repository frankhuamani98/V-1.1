import React from "react"
import { router } from "@inertiajs/react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Switch } from "@/Components/ui/switch"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Trash2, RefreshCw } from "lucide-react"

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
  const toggleStatus = (id: number) => {
    router.put(`/banners/${id}/toggle-status`)
  }

  const deleteBanner = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este banner?")) {
      router.delete(`/banners/${id}`)
    }
  }

  const restoreBanner = (id: number) => {
    router.post(`/banners/${id}/restore`)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Historial de Banners</h2>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vista Previa</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="w-24 h-16 relative">
                      <img
                        src={banner.tipo_imagen === 'local' ? `/storage/${banner.imagen_principal}` : banner.imagen_principal}
                        alt={banner.titulo}
                        className="object-cover w-full h-full rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://via.placeholder.com/150?text=Error'
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{banner.titulo}</p>
                      {banner.subtitulo && (
                        <p className="text-sm text-gray-500">{banner.subtitulo}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {banner.fecha_inicio && (
                        <p>
                          Inicio:{" "}
                          {format(new Date(banner.fecha_inicio), "PPP", {
                            locale: es,
                          })}
                        </p>
                      )}
                      {banner.fecha_fin && (
                        <p>
                          Fin:{" "}
                          {format(new Date(banner.fecha_fin), "PPP", {
                            locale: es,
                          })}
                        </p>
                      )}
                      {!banner.fecha_inicio && !banner.fecha_fin && (
                        <p className="text-gray-500">Sin fechas programadas</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {banner.status === "active" ? (
                      <Switch
                        checked={banner.activo}
                        onCheckedChange={() => toggleStatus(banner.id)}
                      />
                    ) : (
                      <span className="text-red-500">Eliminado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {banner.status === "active" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBanner(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => restoreBanner(banner.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default HistorialBanners