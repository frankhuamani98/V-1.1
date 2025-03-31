import React from "react"
import { useForm, router } from "@inertiajs/react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Switch } from "@/Components/ui/switch"

const SubirBanners: React.FC = () => {
  const [useUrl, setUseUrl] = React.useState(true)
  const { data, setData, post, processing, errors, reset } = useForm({
    titulo: "",
    subtitulo: "",
    imagen_principal: "",
    imagen_archivo: null as File | null,
    fecha_inicio: "",
    fecha_fin: ""
  })

  // Función para normalizar la URL de la imagen
  const normalizeImageUrl = (url: string) => {
    if (!url) return "";
    // Si ya es una URL completa o una data URL (preview), devolverla tal cual
    if (url.startsWith('http') || url.startsWith('blob') || url.startsWith('data')) {
      return url;
    }
    // Si es una ruta relativa, convertirla a URL completa
    return `${window.location.origin}${url}`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo no debe exceder los 5MB");
        return;
      }

      setData('imagen_archivo', file);
      
      // Mostrar vista previa de la imagen local
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setData('imagen_principal', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación adicional del lado del cliente
    if (useUrl && !data.imagen_principal) {
      toast.error("Por favor ingresa una URL de imagen");
      return;
    }

    if (!useUrl && !data.imagen_archivo) {
      toast.error("Por favor selecciona un archivo de imagen");
      return;
    }

    const formData = new FormData()
    formData.append('titulo', data.titulo)
    formData.append('subtitulo', data.subtitulo)
    
    if (useUrl) {
      formData.append('imagen_principal', data.imagen_principal)
    } else {
      if (data.imagen_archivo) {
        formData.append('imagen_archivo', data.imagen_archivo)
      }
    }
    
    formData.append('fecha_inicio', data.fecha_inicio)
    formData.append('fecha_fin', data.fecha_fin)
    formData.append('activo', 'true')

    router.post(route("banners.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Banner creado exitosamente")
        reset()
      },
      onError: (errors) => {
        Object.entries(errors).forEach(([key, message]) => {
          toast.error(message)
        })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-lg p-6">
          <CardTitle className="text-2xl font-bold">Subir Banner</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Campos del formulario (se mantienen igual) */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input
                id="titulo"
                value={data.titulo}
                onChange={(e) => setData("titulo", e.target.value)}
                placeholder="Título del banner"
                maxLength={100}
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitulo">Subtítulo (opcional)</Label>
              <Input
                id="subtitulo"
                value={data.subtitulo}
                onChange={(e) => setData("subtitulo", e.target.value)}
                placeholder="Subtítulo del banner"
                maxLength={200}
              />
              {errors.subtitulo && <p className="text-red-500 text-xs mt-1">{errors.subtitulo}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="upload-mode" 
                checked={useUrl}
                onCheckedChange={setUseUrl}
              />
              <Label htmlFor="upload-mode">
                {useUrl ? "Usar URL" : "Subir archivo"}
              </Label>
            </div>

            {useUrl ? (
              <div className="space-y-2">
                <Label htmlFor="imagen_principal">URL de la Imagen</Label>
                <Input
                  id="imagen_principal"
                  value={data.imagen_principal}
                  onChange={(e) => setData("imagen_principal", e.target.value)}
                  placeholder="https://ejemplo.com/imagen-banner.jpg"
                  type="url"
                  required={useUrl}
                />
                {errors.imagen_principal && <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="imagen_archivo">Seleccionar archivo</Label>
                <Input
                  id="imagen_archivo"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required={!useUrl}
                />
                {errors.imagen_archivo && <p className="text-red-500 text-xs mt-1">{errors.imagen_archivo}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio">Fecha de inicio (opcional)</Label>
                <Input
                  id="fecha_inicio"
                  type="datetime-local"
                  value={data.fecha_inicio}
                  onChange={(e) => setData("fecha_inicio", e.target.value)}
                />
                {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_fin">Fecha de fin (opcional)</Label>
                <Input
                  id="fecha_fin"
                  type="datetime-local"
                  value={data.fecha_fin}
                  onChange={(e) => setData("fecha_fin", e.target.value)}
                  min={data.fecha_inicio}
                />
                {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>}
              </div>
            </div>

            {(data.imagen_principal) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">Vista previa:</p>
                <div className="relative aspect-video w-full bg-white rounded-md overflow-hidden border shadow-sm">
                  <img
                    src={normalizeImageUrl(data.imagen_principal)}
                    alt="Vista previa del banner"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/800x400/f3f4f6/a3a3a3?text=Imagen+no+disponible"
                    }}
                  />
                </div>
                {data.titulo && (
                  <div className="mt-2 text-center">
                    <h3 className="text-lg font-semibold">{data.titulo}</h3>
                    {data.subtitulo && <p className="text-sm text-gray-600">{data.subtitulo}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-8 rounded-md"
            >
              {processing ? "Guardando..." : "Guardar Banner"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default SubirBanners