import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Calendar } from "@/Components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ImageIcon, LinkIcon, UploadIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset, progress } = useForm<BannerFormData>({
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
        toast.success("¡Banner subido exitosamente!")
      },
      onError: () => {
        toast.error("Ha ocurrido un error al subir el banner")
      }
    })
  }

  const handleTabChange = (value: string) => {
    const tipo = value as "url" | "local"
    setSelectedTab(tipo)
    setData("tipo_imagen", tipo)
    setData("imagen_principal", "")
    setLocalImagePreview(null)
  }

  const handleDateSelect = (date: Date | undefined, field: keyof Pick<BannerFormData, "fecha_inicio" | "fecha_fin">) => {
    if (field === "fecha_inicio") {
      setSelectedStartDate(date)
    } else {
      setSelectedEndDate(date)
    }
    setData(field, date ? date.toISOString() : null)
  }

  useEffect(() => {
    if (selectedTab === "local" && data.imagen_principal instanceof File) {
      const url = URL.createObjectURL(data.imagen_principal)
      setLocalImagePreview(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setLocalImagePreview(null)
    }
  }, [data.imagen_principal, selectedTab])

  return (
    <Card className="border-slate-200 shadow-md overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-slate-50 pb-8 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UploadIcon className="h-6 w-6 text-indigo-500" />
          Subir Nuevo Banner
        </CardTitle>
        <CardDescription className="text-slate-500">
          Crea un nuevo banner para mostrar en la página principal
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2 h-11 rounded-lg bg-slate-100">
            <TabsTrigger 
              value="url" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-md flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              URL Externa
            </TabsTrigger>
            <TabsTrigger 
              value="local" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-md flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Archivo Local
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-slate-700 font-medium">Título</Label>
                <Input
                  id="titulo"
                  value={data.titulo}
                  onChange={e => setData("titulo", e.target.value)}
                  className="h-11 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-25"
                  placeholder="Título del banner"
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo" className="text-slate-700 font-medium">Subtítulo (Opcional)</Label>
                <Input
                  id="subtitulo"
                  value={data.subtitulo}
                  onChange={e => setData("subtitulo", e.target.value)}
                  className="h-11 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-25"
                  placeholder="Descripción corta del banner"
                />
              </div>
            </div>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-slate-700 font-medium">URL de la Imagen</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={data.imagen_principal as string}
                    onChange={e => setData("imagen_principal", e.target.value)}
                    className="h-11 pl-10 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-25"
                  />
                </div>
                {errors.imagen_principal && (
                  <p className="text-red-500 text-sm mt-1">{errors.imagen_principal}</p>
                )}
              </div>
              {data.imagen_principal && typeof data.imagen_principal === 'string' && data.imagen_principal.startsWith('http') && (
                <div className="mt-4 p-2 border border-slate-200 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500 mb-2">Vista previa:</p>
                  <div className="aspect-video bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                    <img 
                      src={data.imagen_principal} 
                      alt="Vista previa" 
                      className="max-w-full max-h-full object-contain" 
                      onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400?text=Error+al+cargar'}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="local" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file" className="text-slate-700 font-medium">Seleccionar Imagen</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 transition-colors hover:border-indigo-300 bg-slate-50 hover:bg-slate-50/80">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-10 w-10 text-slate-400" />
                    <p className="text-sm text-slate-500 text-center">Arrastra y suelta una imagen o haz clic para seleccionar</p>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setData("imagen_principal", file as unknown as string)
                        } else {
                          setData("imagen_principal", "")
                        }
                      }}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('file')?.click()}
                      className="mt-2"
                    >
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
                {data.imagen_principal instanceof File && (
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {(data.imagen_principal as File).name}
                  </p>
                )}
                {localImagePreview && (
                  <div className="mt-4 p-2 border border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500 mb-2">Vista previa:</p>
                    <div className="aspect-video bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
                      <img 
                        src={localImagePreview} 
                        alt="Vista previa" 
                        className="max-w-full max-h-full object-contain" 
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400?text=Error+al+cargar'}
                      />
                    </div>
                  </div>
                )}
                {errors.imagen_principal && (
                  <p className="text-red-500 text-sm mt-1">{errors.imagen_principal}</p>
                )}
              </div>
              {progress && (
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                </div>
              )}
            </TabsContent>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Fecha de Inicio (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 border-slate-200",
                        !selectedStartDate && "text-slate-400",
                        selectedStartDate && "text-slate-700"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                      {selectedStartDate ? (
                        format(selectedStartDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 shadow-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={(date) => handleDateSelect(date ?? undefined, "fecha_inicio")}
                      initialFocus
                      locale={es}
                      className="rounded-md border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Fecha de Fin (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 border-slate-200",
                        !selectedEndDate && "text-slate-400",
                        selectedEndDate && "text-slate-700"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                      {selectedEndDate ? (
                        format(selectedEndDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200 shadow-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedEndDate}
                      onSelect={(date) => handleDateSelect(date ?? undefined, "fecha_fin")}
                      initialFocus
                      locale={es}
                      className="rounded-md border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 transition-colors" 
                disabled={processing}
              >
                <UploadIcon className="h-5 w-5" />
                {processing ? "Subiendo banner..." : "Subir Banner"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default SubirBanners