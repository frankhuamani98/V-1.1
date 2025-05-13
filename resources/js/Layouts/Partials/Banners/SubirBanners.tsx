import type React from "react"
import { useState } from "react"
import { useForm } from "@inertiajs/react"
import { Card, CardContent } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Calendar } from "@/Components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { cn } from "@/lib/utils"

type BannerFormData = {
  titulo: string;
  subtitulo: string;
  imagen_principal: string | File;
  tipo_imagen: "url" | "local";
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

const SubirBanners: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"url" | "local">("url")
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined)

  const { data, setData, post, processing, errors, reset } = useForm<BannerFormData>({
    titulo: "",
    subtitulo: "",
    imagen_principal: "",
    tipo_imagen: "url",
    fecha_inicio: null,
    fecha_fin: null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    
    formData.append("titulo", data.titulo)
    formData.append("subtitulo", data.subtitulo)
    formData.append("tipo_imagen", data.tipo_imagen)
    
    if (data.tipo_imagen === "local" && data.imagen_principal instanceof File) {
      formData.append("imagen_principal", data.imagen_principal)
    } else {
      formData.append("imagen_principal", String(data.imagen_principal))
    }
    
    if (data.fecha_inicio) {
      formData.append("fecha_inicio", data.fecha_inicio)
    }
    if (data.fecha_fin) {
      formData.append("fecha_fin", data.fecha_fin)
    }

    post("/banners/subir", {
      forceFormData: true,
      onSuccess: () => {
        reset()
        setSelectedStartDate(undefined)
        setSelectedEndDate(undefined)
        setSelectedTab("url")
      },
    })
  }

  const handleTabChange = (value: string) => {
    const tipo = value as "url" | "local"
    setSelectedTab(tipo)
    setData("tipo_imagen", tipo)
    setData("imagen_principal", "")
  }

  const handleDateSelect = (date: Date | undefined, field: keyof Pick<BannerFormData, "fecha_inicio" | "fecha_fin">) => {
    if (field === "fecha_inicio") {
      setSelectedStartDate(date)
    } else {
      setSelectedEndDate(date)
    }
    setData(field, date ? date.toISOString() : null)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Subir Nuevo Banner</h2>
        
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="url">URL Externa</TabsTrigger>
            <TabsTrigger value="local">Archivo Local</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={data.titulo}
                onChange={e => setData("titulo", e.target.value)}
                className="mt-1"
              />
              {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
            </div>

            <div>
              <Label htmlFor="subtitulo">Subtítulo (Opcional)</Label>
              <Input
                id="subtitulo"
                value={data.subtitulo}
                onChange={e => setData("subtitulo", e.target.value)}
                className="mt-1"
              />
            </div>

            <TabsContent value="url">
              <div>
                <Label htmlFor="url">URL de la Imagen</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={data.imagen_principal as string}
                  onChange={e => setData("imagen_principal", e.target.value)}
                  className="mt-1"
                />
                {errors.imagen_principal && (
                  <p className="text-red-500 text-sm mt-1">{errors.imagen_principal}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="local">
              <div>
                <Label htmlFor="file">Seleccionar Imagen</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setData("imagen_principal", file as unknown as string)
                    }
                  }}
                  className="mt-1"
                />
                {errors.imagen_principal && (
                  <p className="text-red-500 text-sm mt-1">{errors.imagen_principal}</p>
                )}
              </div>
            </TabsContent>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Fecha de Inicio (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !selectedStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedStartDate ? (
                        format(selectedStartDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={(date) => handleDateSelect(date ?? undefined, "fecha_inicio")}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1">
                <Label>Fecha de Fin (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !selectedEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedEndDate ? (
                        format(selectedEndDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedEndDate}
                      onSelect={(date) => handleDateSelect(date ?? undefined, "fecha_fin")}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Subiendo..." : "Subir Banner"}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default SubirBanners