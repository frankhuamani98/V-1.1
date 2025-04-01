import type React from "react"
import { useState } from "react"
import { useForm, router } from "@inertiajs/react"
import { toast } from "sonner"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Calendar } from "@/Components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { CalendarIcon, X, Check, ImagePlus, Link } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

interface SubirBannersProps {
  banners?: Array<{
    id: number
    titulo: string
    subtitulo: string
    imagen_principal: string
    activo: boolean
    fecha_inicio: string | null
    fecha_fin: string | null
  }>
}

const SubirBanners: React.FC<SubirBannersProps> = ({ banners = [] }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    titulo: "",
    subtitulo: "",
    imagen_principal: null as File | null,
    imagen_url: "",
    activo: true as boolean,
    fecha_inicio: null as Date | null,
    fecha_fin: null as Date | null,
  })

  const [previewImage, setPreviewImage] = useState("")
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación manual para asegurar que hay una imagen
    if (!data.imagen_principal && !data.imagen_url) {
      toast.error("Debes subir una imagen o proporcionar una URL")
      return
    }

    const formData = new FormData()
    formData.append('titulo', data.titulo)
    formData.append('subtitulo', data.subtitulo || '')
    formData.append('activo', data.activo ? '1' : '0')
    if (data.fecha_inicio) formData.append('fecha_inicio', format(data.fecha_inicio, "yyyy-MM-dd HH:mm:ss"))
    if (data.fecha_fin) formData.append('fecha_fin', format(data.fecha_fin, "yyyy-MM-dd HH:mm:ss"))
    
    // Solo adjuntar el método de imagen seleccionado
    if (uploadMethod === 'file' && data.imagen_principal) {
      formData.append('imagen_principal', data.imagen_principal)
    } else if (uploadMethod === 'url' && data.imagen_url) {
      formData.append('imagen_url', data.imagen_url)
    }

    router.post(route("banners.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Banner creado exitosamente")
        reset()
        setPreviewImage("")
      },
      onError: (errors) => {
        toast.error("Error al crear el banner")
        console.error("Errores del formulario:", errors)
      },
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData("imagen_principal", file)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setData("imagen_url", url)
    setPreviewImage(url)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Subir Nuevo Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Banner</Label>
                <Input
                  id="titulo"
                  value={data.titulo}
                  onChange={(e) => setData("titulo", e.target.value)}
                  placeholder="Ej: Promoción de Verano"
                />
                {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={data.subtitulo}
                  onChange={(e) => setData("subtitulo", e.target.value)}
                  placeholder="Ej: Descuentos hasta 50%"
                />
                {errors.subtitulo && <p className="text-red-500 text-xs mt-1">{errors.subtitulo}</p>}
              </div>

              <div className="flex items-center justify-between space-y-2">
                <Label htmlFor="activo">Banner Activo</Label>
                <Switch
                  id="activo"
                  checked={data.activo}
                  onCheckedChange={(checked) => setData("activo", checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as 'file' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Subir archivo</TabsTrigger>
                  <TabsTrigger value="url">Usar URL</TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-2">
                  <Label>Imagen del Banner</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imagen_principal"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label
                      htmlFor="imagen_principal"
                      className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Seleccionar Imagen
                    </Label>
                    {previewImage && uploadMethod === 'file' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewImage("")
                          setData("imagen_principal", null)
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                  {errors.imagen_principal && (
                    <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>
                  )}
                </TabsContent>
                <TabsContent value="url" className="space-y-2">
                  <Label htmlFor="imagen_url">URL de la Imagen</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imagen_url"
                      type="url"
                      value={data.imagen_url}
                      onChange={handleUrlChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {previewImage && uploadMethod === 'url' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewImage("")
                          setData("imagen_url", "")
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Limpiar
                      </Button>
                    )}
                  </div>
                  {errors.imagen_url && (
                    <p className="text-red-500 text-xs mt-1">{errors.imagen_url}</p>
                  )}
                </TabsContent>
              </Tabs>

              {previewImage && (
                <div className="border rounded-md overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Vista previa del banner"
                    className="w-full h-auto max-h-64 object-contain"
                    onError={() => {
                      setPreviewImage("")
                      toast.error("No se pudo cargar la imagen. Verifica la URL o selecciona otra imagen.")
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.fecha_inicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.fecha_inicio ? (
                      format(data.fecha_inicio, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data.fecha_inicio || undefined}
                    onSelect={(date) => setData("fecha_inicio", date || null)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>}
            </div>

            <div className="space-y-2">
              <Label>Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.fecha_fin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.fecha_fin ? (
                      format(data.fecha_fin, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data.fecha_fin || undefined}
                    onSelect={(date) => setData("fecha_fin", date || null)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              reset()
              setPreviewImage("")
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? (
              "Guardando..."
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Guardar Banner
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default SubirBanners