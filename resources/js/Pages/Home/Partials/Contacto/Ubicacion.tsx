import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { MapPin, Building2, Wrench, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/Components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import Header from "@/Pages/Home/Header"
import Footer from "@/Pages/Home/Footer"
import ContactoNavigation from "@/Components/ContactoNavigation"
import WhatsAppButton from "@/Components/WhatsAppButton"

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
    tienda: ["/images/tienda1.jpg", "/images/tienda2.jpg", "/images/tienda3.jpg"],
    taller: ["/images/taller1.jpg", "/images/taller2.jpg", "/images/taller3.jpg"],
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
      <Header />
      <ContactoNavigation currentPage="ubicacion" />
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <Tabs defaultValue="tienda" value={activeTab} onValueChange={setActiveTab}>
            <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-900 rounded-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 md:px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900 p-2.5 md:p-3.5 rounded-full flex-shrink-0">
                      <MapPin className="h-5 w-5 md:h-6 md:w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">Nuestras Ubicaciones</CardTitle>
                      <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Visítanos en cualquiera de nuestros locales especializados
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="self-center w-full flex justify-center md:justify-end md:w-auto md:self-center">
                    <div className="flex space-x-3">
                      <button 
                        type="button"
                        onClick={() => setActiveTab("tienda")}
                        className="group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all overflow-hidden focus:outline-none"
                      >
                        <div className={`absolute inset-0 ${activeTab === "tienda" ? "bg-indigo-50 dark:bg-indigo-950/20" : "bg-transparent"} rounded-lg transition-colors duration-200`}></div>
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 ${activeTab === "tienda" ? "bg-indigo-500" : "bg-slate-200 group-hover:bg-slate-300"} rounded-full transition-colors duration-200`}>
                          <Building2 className={`h-4 w-4 ${activeTab === "tienda" ? "text-white" : "text-slate-600 group-hover:text-slate-700"} transition-colors duration-200`} />
                        </div>
                        <span className={`relative z-10 ${activeTab === "tienda" ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 group-hover:text-slate-700"} transition-colors duration-200`}>Tienda</span>
                        {activeTab === "tienda" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveTab("taller")}
                        className="group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all overflow-hidden focus:outline-none"
                      >
                        <div className={`absolute inset-0 ${activeTab === "taller" ? "bg-indigo-50 dark:bg-indigo-950/20" : "bg-transparent"} rounded-lg transition-colors duration-200`}></div>
                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 ${activeTab === "taller" ? "bg-indigo-500" : "bg-slate-200 group-hover:bg-slate-300"} rounded-full transition-colors duration-200`}>
                          <Wrench className={`h-4 w-4 ${activeTab === "taller" ? "text-white" : "text-slate-600 group-hover:text-slate-700"} transition-colors duration-200`} />
                        </div>
                        <span className={`relative z-10 ${activeTab === "taller" ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 group-hover:text-slate-700"} transition-colors duration-200`}>Taller</span>
                        {activeTab === "taller" && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <TabsContent value="tienda">
                  <LocationContent
                    establecimiento={ubicacionData.establecimientos.tienda}
                    mapSrc={getMapSrc("tienda")}
                    images={imagenes.tienda}
                    currentImageIndex={currentImageIndex}
                    nextImage={nextImage}
                    prevImage={prevImage}
                    activeTab={activeTab}
                  />
                </TabsContent>

                <TabsContent value="taller">
                  <LocationContent
                    establecimiento={ubicacionData.establecimientos.taller}
                    mapSrc={getMapSrc("taller")}
                    images={imagenes.taller}
                    currentImageIndex={currentImageIndex}
                    nextImage={nextImage}
                    prevImage={prevImage}
                    activeTab={activeTab}
                  />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
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
  activeTab: string
}

function LocationContent({
  establecimiento,
  mapSrc,
  images,
  currentImageIndex,
  nextImage,
  prevImage,
  activeTab,
}: LocationContentProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
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
                className="rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white/90 dark:hover:bg-slate-900/90 border border-slate-200/30 dark:border-slate-700/30 text-slate-700 dark:text-slate-200 shadow-sm h-8 w-8"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Imagen anterior</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white/90 dark:hover:bg-slate-900/90 border border-slate-200/30 dark:border-slate-700/30 text-slate-700 dark:text-slate-200 shadow-sm h-8 w-8"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Siguiente imagen</span>
              </Button>
            </div>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentImageIndex ? "w-5 bg-indigo-500" : "w-1 bg-white/60 dark:bg-slate-700/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-md">
              <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            Información del Local
          </h2>
          
          <div className="space-y-4">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-medium text-base mb-3 text-slate-800 dark:text-slate-100">{establecimiento.nombre}</h3>
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-300">{establecimiento.direccion}</p>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <Info className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-300">
                  {activeTab === "tienda" ? "A unos pasos del Colegio GALILEO" : "En un callejón"}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${establecimiento.coordenadas.lat},${establecimiento.coordenadas.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-md transition-colors text-sm font-medium"
              >
                <MapPin className="h-4 w-4" />
                <span>Abrir en Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm h-full">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '500px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}