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
    imagen_principal: "",
    imagen_archivo: null as File | null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('imagen_archivo', e.target.files[0])
      // Mostrar vista previa de la imagen local
      const reader = new FileReader()
      reader.onload = (event) => {
        setData('imagen_principal', event.target?.result as string)
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    if (useUrl) {
      formData.append('imagen_principal', data.imagen_principal)
    } else {
      if (data.imagen_archivo) {
        formData.append('imagen_archivo', data.imagen_archivo)
      }
    }
    formData.append('activo', 'true')

    router.post(route("banners.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Banner creado exitosamente")
        reset()
      },
      onError: (errors) => {
        if (errors.imagen_principal) {
          toast.error(errors.imagen_principal)
        } else if (errors.imagen_archivo) {
          toast.error(errors.imagen_archivo)
        } else {
          toast.error("Error al crear el banner")
        }
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

          <div className="space-y-4">
            {useUrl ? (
              <div className="space-y-2">
                <Label htmlFor="imagen_principal" className="text-sm font-medium">
                  URL de la Imagen
                </Label>
                <Input
                  id="imagen_principal"
                  name="imagen_principal"
                  value={data.imagen_principal}
                  onChange={(e) => setData("imagen_principal", e.target.value)}
                  placeholder="https://ejemplo.com/imagen-banner.jpg"
                  type="url"
                  className="h-10"
                  required={useUrl}
                />
                {errors.imagen_principal && <p className="text-red-500 text-xs mt-1">{errors.imagen_principal}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="imagen_archivo" className="text-sm font-medium">
                  Seleccionar archivo
                </Label>
                <Input
                  id="imagen_archivo"
                  name="imagen_archivo"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="h-10"
                  required={!useUrl}
                />
                {errors.imagen_archivo && <p className="text-red-500 text-xs mt-1">{errors.imagen_archivo}</p>}
              </div>
            )}

            {(data.imagen_principal) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">Vista previa:</p>
                <div className="relative aspect-video w-full bg-white rounded-md overflow-hidden border shadow-sm">
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