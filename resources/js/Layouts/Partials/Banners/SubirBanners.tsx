import React from "react"
import { useForm, router } from "@inertiajs/react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Button } from "@/Components/ui/button"
import { Switch } from "@/Components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { CalendarIcon, ImageIcon, UploadIcon, LinkIcon } from "lucide-react"

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
<<<<<<< HEAD
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

=======
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="border shadow-md rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-8 px-6">
>>>>>>> 188ecc3f209dc0525ee9d7ced8df0bd7454fcd2f
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">Subir Nuevo Banner</CardTitle>
            </div>
            <CardDescription className="text-indigo-100 mt-2">
              Complete el formulario para crear un nuevo banner promocional
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Sección de Información Básica */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Información del Banner</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo" className="text-gray-700">
                      Título <span className="text-gray-400 text-sm">(opcional)</span>
                    </Label>
                    <Input
                      id="titulo"
                      value={data.titulo}
                      onChange={(e) => setData("titulo", e.target.value)}
                      placeholder="Ej: Oferta Especial de Verano"
                      maxLength={100}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
                  </div>

<<<<<<< HEAD
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
=======
                  <div className="space-y-2">
                    <Label htmlFor="subtitulo" className="text-gray-700">
                      Subtítulo <span className="text-gray-400 text-sm">(opcional)</span>
                    </Label>
                    <Input
                      id="subtitulo"
                      value={data.subtitulo}
                      onChange={(e) => setData("subtitulo", e.target.value)}
                      placeholder="Ej: Descuentos hasta el 50% en todos los productos"
                      maxLength={200}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.subtitulo && <p className="text-red-500 text-xs mt-1">{errors.subtitulo}</p>}
                  </div>
>>>>>>> 188ecc3f209dc0525ee9d7ced8df0bd7454fcd2f
                </div>
              </div>

              {/* Sección de Imagen */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Imagen del Banner</h3>
                
                <Tabs defaultValue={useUrl ? "url" : "file"} onValueChange={(v) => setUseUrl(v === "url")}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Usar URL
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center gap-2">
                      <UploadIcon className="h-4 w-4" />
                      Subir archivo
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imagen_principal" className="text-gray-700">URL de la Imagen</Label>
                      <Input
                        id="imagen_principal"
                        value={data.imagen_principal}
                        onChange={(e) => setData("imagen_principal", e.target.value)}
                        placeholder="https://ejemplo.com/imagen-banner.jpg"
                        type="url"
                        required={useUrl}
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {errors.imagen_principal && <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="file" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imagen_archivo" className="text-gray-700">Seleccionar archivo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          id="imagen_archivo"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          required={!useUrl}
                          className="hidden"
                        />
                        <label htmlFor="imagen_archivo" className="cursor-pointer">
                          <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <span className="block text-sm font-medium text-gray-700 mb-1">
                            Haga clic para seleccionar un archivo
                          </span>
                          <span className="block text-xs text-gray-500">
                            PNG, JPG, GIF hasta 10MB
                          </span>
                        </label>
                      </div>
                      {errors.imagen_archivo && <p className="text-red-500 text-xs mt-1">{errors.imagen_archivo}</p>}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Vista previa */}
                {data.imagen_principal && (
                  <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Vista previa
                    </h4>
                    <div className="relative aspect-[21/9] w-full bg-white rounded-md overflow-hidden border shadow-sm">
                      <img
                        src={data.imagen_principal}
                        alt="Vista previa del banner"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/800x400/f3f4f6/a3a3a3?text=Imagen+no+disponible"
                        }}
                      />
                    </div>
                    {(data.titulo || data.subtitulo) && (
                      <div className="mt-3 p-3 bg-white rounded border border-gray-100">
                        {data.titulo && (
                          <h3 className="font-semibold text-gray-800">{data.titulo}</h3>
                        )}
                        {data.subtitulo && (
                          <p className="text-sm text-gray-600 mt-1">{data.subtitulo}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sección de Fechas */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-600" />
                  Configuración de Fechas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_inicio" className="text-gray-700">
                      Fecha de inicio <span className="text-gray-400 text-sm">(opcional)</span>
                    </Label>
                    <Input
                      id="fecha_inicio"
                      type="datetime-local"
                      value={data.fecha_inicio}
                      onChange={(e) => setData("fecha_inicio", e.target.value)}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_fin" className="text-gray-700">
                      Fecha de fin <span className="text-gray-400 text-sm">(opcional)</span>
                    </Label>
                    <Input
                      id="fecha_fin"
                      type="datetime-local"
                      value={data.fecha_fin}
                      onChange={(e) => setData("fecha_fin", e.target.value)}
                      min={data.fecha_inicio}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.fecha_fin && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin}</p>}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => reset()}
                  disabled={processing}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-8 rounded-md shadow-sm"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    "Guardar Banner"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default SubirBanners