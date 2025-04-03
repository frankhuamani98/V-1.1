import type React from "react"
import { useState, useEffect } from "react"
import { useForm, router } from "@inertiajs/react"
import { toast } from "sonner"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Switch } from "@/Components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Calendar } from "@/Components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { 
  CalendarIcon, 
  X, 
  Check, 
  ImagePlus, 
  Link,
  Info,
  AlertCircle,
  UploadCloud,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Separator } from "@/Components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip" 
import { Badge } from "@/Components/ui/badge"
import { Progress } from "@/Components/ui/progress"
import { motion } from "framer-motion"

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formComplete, setFormComplete] = useState(0)
  const [showFullImage, setShowFullImage] = useState(false)
  const [isFormActive, setIsFormActive] = useState(false)

  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + 5
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isUploading])

  useEffect(() => {
    let points = 0
    if (data.titulo) points += 20
    if (data.subtitulo) points += 10
    if (data.imagen_principal || data.imagen_url) points += 40
    if (data.fecha_inicio) points += 15
    if (data.fecha_fin) points += 15
    setFormComplete(points)
  }, [data])

  useEffect(() => {
    setIsFormActive(
      !!data.titulo || !!data.subtitulo || !!data.imagen_principal || !!data.imagen_url || isUploading
    )
  }, [data, isUploading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data.imagen_principal && !data.imagen_url) {
      toast.error("Debes subir una imagen o proporcionar una URL", {
        icon: <AlertCircle className="h-5 w-5 text-rose-500" />
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('titulo', data.titulo)
    formData.append('subtitulo', data.subtitulo || '')
    formData.append('activo', data.activo ? '1' : '0')
    if (data.fecha_inicio) formData.append('fecha_inicio', format(data.fecha_inicio, "yyyy-MM-dd HH:mm:ss"))
    if (data.fecha_fin) formData.append('fecha_fin', format(data.fecha_fin, "yyyy-MM-dd HH:mm:ss"))
    
    if (uploadMethod === 'file' && data.imagen_principal) {
      formData.append('imagen_principal', data.imagen_principal)
    } else if (uploadMethod === 'url' && data.imagen_url) {
      formData.append('imagen_url', data.imagen_url)
    }

    setTimeout(() => {
      router.post(route("banners.store"), formData, {
        forceFormData: true,
        onSuccess: () => {
          toast.success("Banner creado exitosamente", {
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          })
          reset()
          setPreviewImage("")
          setUploadProgress(0)
          setIsUploading(false)
        },
        onError: (errors) => {
          toast.error("Error al crear el banner", {
            icon: <XCircle className="h-5 w-5 text-rose-500" />
          })
          console.error("Errores del formulario:", errors)
          setUploadProgress(0)
          setIsUploading(false)
        },
      })
    }, 1500)
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
    if (url.trim() !== '') {
      setPreviewImage(url)
    } else {
      setPreviewImage("")
    }
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
  }
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
  }
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
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

  return (
    <div className="min-h-screen bg-gradient-to-b py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <form onSubmit={handleSubmit} className="w-full">
            <Card className="shadow-2xl border-none rounded-2xl overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-gradient-to-r from-blue-950 via-indigo-600 to-blue-300 text-white p-6 sm:p-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold">Subir Nuevo Banner</CardTitle>
                    <CardDescription className="text-blue-100 mt-2 text-sm sm:text-lg">
                      Crea un nuevo banner promocional para mostrar en tu sitio web
                    </CardDescription>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 pt-4 border-t border-white/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <Badge className="bg-white/30 hover:bg-white/40 text-white px-3 py-1">
                        {isUploading ? "Subiendo..." : "Nuevo Banner"}
                      </Badge>
                      {data.activo ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1">
                          <Check className="w-4 h-4 mr-1" /> Activo
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1">
                          <Clock className="w-4 h-4 mr-1" /> Borrador
                        </Badge>
                      )}
                    </div>
                    
                    <div className="w-full sm:w-64">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Completado</span>
                        <span>{formComplete}%</span>
                      </div>
                      <Progress value={formComplete} className="h-2 bg-white/20 [&>div]:bg-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 space-y-4">
                    <motion.div 
                      className="space-y-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="titulo" className="text-sm sm:text-base font-medium text-gray-700">
                          Título del Banner
                        </Label>
                        <span className="text-xs text-gray-400">{data.titulo.length}/100</span>
                      </div>
                      <Input
                        id="titulo"
                        value={data.titulo}
                        onChange={(e) => setData("titulo", e.target.value)}
                        placeholder="Ej: Promoción de Verano"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        maxLength={100}
                      />
                      {errors.titulo && (
                        <motion.p 
                          className="text-rose-500 text-sm mt-1 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" /> {errors.titulo}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div 
                      className="space-y-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="subtitulo" className="text-sm sm:text-base font-medium text-gray-700">
                          Subtítulo
                        </Label>
                        <span className="text-xs text-gray-400">{data.subtitulo?.length || 0}/150</span>
                      </div>
                      <Input
                        id="subtitulo"
                        value={data.subtitulo || ""}
                        onChange={(e) => setData("subtitulo", e.target.value)}
                        placeholder="Ej: Descuentos hasta 50%"
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        maxLength={150}
                      />
                      {errors.subtitulo && (
                        <motion.p 
                          className="text-rose-500 text-sm mt-1 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" /> {errors.subtitulo}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div 
                      className="pt-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm sm:text-base font-medium text-gray-700">
                          Período de Visualización
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-white p-3 rounded-lg shadow-xl max-w-xs">
                              <p>Define el período en el que el banner estará visible en tu sitio web.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-xs sm:text-sm text-gray-500 flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" /> Fecha de Inicio
                          </span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal rounded-lg border-gray-300 hover:bg-gray-50 transition-all text-xs sm:text-sm",
                                  !data.fecha_inicio && "text-gray-400",
                                  data.fecha_inicio && "border-blue-200 bg-blue-50 text-blue-700"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {data.fecha_inicio ? (
                                  format(data.fecha_inicio, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccionar fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-lg shadow-xl border-none">
                              <Calendar
                                mode="single"
                                selected={data.fecha_inicio || undefined}
                                onSelect={(date) => setData("fecha_inicio", date || null)}
                                initialFocus
                                locale={es}
                                className="border-none"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs sm:text-sm text-gray-500 flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" /> Fecha de Fin
                          </span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal rounded-lg border-gray-300 hover:bg-gray-50 transition-all text-xs sm:text-sm",
                                  !data.fecha_fin && "text-gray-400",
                                  data.fecha_fin && "border-blue-200 bg-blue-50 text-blue-700"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {data.fecha_fin ? (
                                  format(data.fecha_fin, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccionar fecha</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-lg shadow-xl border-none">
                              <Calendar
                                mode="single"
                                selected={data.fecha_fin || undefined}
                                onSelect={(date) => setData("fecha_fin", date || null)}
                                initialFocus
                                locale={es}
                                className="border-none"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100 shadow-sm mt-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="activo" className="text-sm sm:text-base font-medium text-gray-700 flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${data.activo ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            Estado del Banner
                          </Label>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {data.activo ? "Publicado y visible en el sitio" : "Guardado como borrador"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs sm:text-sm font-medium text-gray-500">{data.activo ? "Activo" : "Inactivo"}</span>
                          <Switch
                            id="activo"
                            checked={data.activo}
                            onCheckedChange={(checked) => setData("activo", checked)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="lg:col-span-2 space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-medium text-gray-700 mb-3 flex items-center text-sm sm:text-base">
                        <ImagePlus className="h-4 w-4 mr-2 text-blue-500" />
                        Imagen del Banner
                      </h3>
                      
                      <Tabs 
                        defaultValue="file" 
                        onValueChange={(value) => setUploadMethod(value as 'file' | 'url')}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 mb-3 rounded-lg h-10">
                          <TabsTrigger value="file" className="rounded-l-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm">
                            <ImagePlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Archivo
                          </TabsTrigger>
                          <TabsTrigger value="url" className="rounded-r-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm">
                            <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            URL
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="file" className="mt-0">
                          <div className="space-y-2">
                            <Input
                              id="imagen_principal"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <Label
                              htmlFor="imagen_principal"
                              className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-gray-600 relative overflow-hidden"
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              <UploadCloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                              <div className="text-center">
                                <span className="font-medium text-blue-600 text-sm sm:text-base">Haz clic para subir</span>
                                <p className="text-xs text-gray-500 mt-1">o arrastra y suelta</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF hasta 5MB</p>
                            </Label>
                            {errors.imagen_principal && (
                              <motion.p 
                                className="text-rose-500 text-sm mt-1 flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <AlertCircle className="h-4 w-4 mr-1" /> {errors.imagen_principal}
                              </motion.p>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="url" className="mt-0">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                id="imagen_url"
                                type="url"
                                value={data.imagen_url}
                                onChange={handleUrlChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
                              />
                            </div>
                            {errors.imagen_url && (
                              <motion.p 
                                className="text-rose-500 text-sm mt-1 flex items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <AlertCircle className="h-4 w-4 mr-1" /> {errors.imagen_url}
                              </motion.p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      {previewImage ? (
                        <motion.div 
                          className="mt-3"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 border rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={previewImage}
                              alt="Vista previa del banner"
                              className="w-full h-auto max-h-48 sm:max-h-64 object-contain"
                              onError={() => {
                                setPreviewImage("")
                                toast.error("No se pudo cargar la imagen", {
                                  icon: <AlertCircle className="h-5 w-5 text-rose-500" />
                                })
                              }}
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-white bg-opacity-90 rounded-full p-1 h-7 w-7 sm:h-8 sm:w-8 shadow-sm border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                                      onClick={() => {
                                        setPreviewImage("")
                                        if (uploadMethod === 'file') {
                                          setData("imagen_principal", null)
                                        } else {
                                          setData("imagen_url", "")
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-slate-800 text-white rounded-lg shadow-xl">
                                    <p>Eliminar imagen</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-white bg-opacity-90 rounded-full p-1 h-7 w-7 sm:h-8 sm:w-8 shadow-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                      onClick={() => setShowFullImage(true)}
                                    >
                                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-slate-800 text-white rounded-lg shadow-xl">
                                    <p>Ver imagen completa</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              Vista previa de la imagen
                            </p>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                              {uploadMethod === 'file' ? 'Archivo local' : 'URL remota'}
                            </Badge>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="mt-3 flex flex-col items-center justify-center h-32 sm:h-40 bg-slate-50 rounded-lg border border-slate-200">
                          <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300 mb-1 sm:mb-2" />
                          <p className="text-slate-400 text-xs sm:text-sm">No hay imagen seleccionada</p>
                        </div>
                      )}
                    </div>
                    
                    {banners && banners.length > 0 && (
                      <motion.div 
                        className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="font-medium text-gray-700 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                          <Info className="h-4 w-4 mr-2 text-blue-500" />
                          Banners Recientes
                        </h3>
                        <div className="max-h-40 sm:max-h-52 overflow-y-auto pr-2 -mr-2">
                          <div className="space-y-2">
                            {banners.slice(0, 5).map((banner) => (
                              <div key={banner.id} className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                                  {banner.imagen_principal && (
                                    <img 
                                      src={banner.imagen_principal} 
                                      alt={banner.titulo}
                                      className="w-full h-full object-cover" 
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs sm:text-sm font-medium text-gray-800 truncate">{banner.titulo}</h4>
                                  <p className="text-xs text-gray-500 truncate">{banner.subtitulo}</p>
                                </div>
                                <div className="flex-shrink-0">
                                  <Badge variant={banner.activo ? "default" : "secondary"} className="text-xs">
                                    {banner.activo ? (
                                      <span className="flex items-center">
                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Activo
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <XCircle className="h-3 w-3 mr-1" /> Inactivo
                                      </span>
                                    )}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </CardContent>
              
              <Separator className="bg-gray-200" />
              
              <CardFooter className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-blue-50">
                {isFormActive && (
                  <div className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        reset()
                        setPreviewImage("")
                      }}
                      className="rounded-lg border-gray-300 hover:bg-gray-100 transition-colors w-full h-10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
                <div className="w-full sm:w-auto flex flex-col space-y-2">
                  {isUploading && (
                    <div className="flex items-center space-x-2">
                      <Progress value={uploadProgress} className="h-2 w-full" />
                      <span className="text-xs text-gray-500 whitespace-nowrap">{uploadProgress}%</span>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={processing || isUploading}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md w-full h-10"
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subiendo...
                      </span>
                    ) : processing ? (
                      "Guardando..."
                    ) : (
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Guardar Banner
                      </span>
                    )}
                  </Button>
                  
                  {formComplete < 60 && (
                    <motion.div 
                      className="text-xs text-amber-600 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Completa al menos el 60% del formulario para guardar
                    </motion.div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </form>
        </motion.div>

        {showFullImage && previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh]">
              <button 
                onClick={() => setShowFullImage(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={previewImage}
                alt="Imagen completa del banner"
                className="w-full h-full max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFullImage(false)}
                  className="bg-white/90 hover:bg-white text-gray-800"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubirBanners