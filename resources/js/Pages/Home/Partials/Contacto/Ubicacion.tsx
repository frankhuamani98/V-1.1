import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { MapPin, Building2, Wrench, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SocialNav from "@/Components/SocialNav"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

interface Props {
  ubicacionData: {
    establecimientos: {
      tienda: Establecimiento
      taller: Establecimiento
    }
  }
}

interface Establecimiento {
  nombre: string
  tipo: string
  direccion: string
  referencias: string
  coordenadas: {
    lat: number
    lng: number
  }
}

export default function Ubicacion({ ubicacionData }: Props) {
  const [activeTab, setActiveTab] = useState("tienda")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const imagenes = {
    tienda: ["/images/tienda.jpeg", "/images/tienda.jpeg", "/images/tienda.jpeg"],
    taller: ["/images/taller.jpg", "/images/taller.jpg", "/images/taller.jpg"],
  }

  const getMapSrc = (establecimiento: string) => {
    if (establecimiento === "tienda") {
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.217933614063!2d-71.97225122540556!3d-13.522213071123636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd609ffbe055f%3A0x8525e584e0f48f36!2sAv%20Huayna%20Capac%20168%2C%20Cusco%2008002!5e0!3m2!1ses-419!2spe!4v1746713608854!5m2!1ses-419!2spe"
    } else {
      return "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3879.2235244252015!2d-71.9690986!3d-13.5218697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDMxJzE4LjciUyA3McKwNTgnMDguOCJX!5e0!3m2!1ses-419!2spe!4v1746715939654!5m2!1ses-419!2spe"
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagenes[activeTab as keyof typeof imagenes].length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagenes[activeTab as keyof typeof imagenes].length - 1 : prev - 1))
  }

  const establecimientoActivo = ubicacionData.establecimientos[activeTab as keyof typeof ubicacionData.establecimientos]
  const currentImages = imagenes[activeTab as keyof typeof imagenes]

  return (
    <>
      <SocialNav />
      <div className="container mx-auto py-12 px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Nuestras Ubicaciones</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visítanos en cualquiera de nuestros locales especializados para brindarte la mejor atención
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="tienda" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="tienda" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Tienda</span>
              </TabsTrigger>
              <TabsTrigger value="taller" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span>Taller</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tienda" className="mt-0">
              <LocationContent
                establecimiento={ubicacionData.establecimientos.tienda}
                mapSrc={getMapSrc("tienda")}
                images={imagenes.tienda}
                currentImageIndex={currentImageIndex}
                nextImage={nextImage}
                prevImage={prevImage}
              />
            </TabsContent>

            <TabsContent value="taller" className="mt-0">
              <LocationContent
                establecimiento={ubicacionData.establecimientos.taller}
                mapSrc={getMapSrc("taller")}
                images={imagenes.taller}
                currentImageIndex={currentImageIndex}
                nextImage={nextImage}
                prevImage={prevImage}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

interface LocationContentProps {
  establecimiento: Establecimiento
  mapSrc: string
  images: string[]
  currentImageIndex: number
  nextImage: () => void
  prevImage: () => void
}

function LocationContent({
  establecimiento,
  mapSrc,
  images,
  currentImageIndex,
  nextImage,
  prevImage,
}: LocationContentProps) {
  return (
    <motion.div
      className="grid lg:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Imagen de ${establecimiento.nombre} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-between p-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Imagen anterior</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Siguiente imagen</span>
              </Button>
            </div>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Información del Local
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="pb-4 border-b">
                <h3 className="font-semibold text-lg mb-2">{establecimiento.nombre}</h3>
                <p className="text-muted-foreground">{establecimiento.direccion}</p>
                <p className="text-sm text-muted-foreground mt-2">{establecimiento.referencias}</p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${establecimiento.coordenadas.lat},${establecimiento.coordenadas.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Abrir en Google Maps</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden h-full">
        <div className="h-[400px] lg:h-full bg-muted relative">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>
      </Card>
    </motion.div>
  )
}
