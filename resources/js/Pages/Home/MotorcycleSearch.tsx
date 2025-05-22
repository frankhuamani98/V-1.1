import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { toast } from "sonner"
import {
  SearchIcon,
  BikeIcon,
  SettingsIcon,
  ArrowRightIcon,
  ClockIcon,
  ChevronRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TruckIcon,
  BadgeCheckIcon,
  ChevronDownIcon,
} from "lucide-react"
import { motion } from "framer-motion"

// Types for motorcycle data
interface MotoData {
  years: number[]
  brandsByYear: { [key: string]: string[] }
  modelsByYearAndBrand: { [key: string]: { [key: string]: string[] } }
}

interface Props {
  motoData: MotoData
}

export default function MotorcycleSearch({ motoData }: Props) {
  const [year, setYear] = useState<string>("")
  const [brand, setBrand] = useState<string>("")
  const [model, setModel] = useState<string>("")
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<Array<{ year: string; brand: string; model: string }>>([])
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showFeatures, setShowFeatures] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Motorcycle images array
  const motorcycleImages = [
    "https://mail.nitro.pe/images/2015/noviembre/kawasaki_ninja_h2r.jpg",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1920&h=1080&fit=crop"
  ]

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentMotorcycleSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 3))
    }

    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
      const timeout = setTimeout(() => {
        toast.success("¡Bienvenido a Rudolf Motos!", {
          description: "Piezas originales y compatibles con garantía asegurada.",
          duration: 5000,
          style: {
            marginTop: '40px',
            zIndex: 100
          },
          position: "top-right",
        })
        sessionStorage.setItem("hasSeenWelcome", "true")
      }, 1500)
      return () => clearTimeout(timeout)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Image carousel interval
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % motorcycleImages.length
      )
    }, 4000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(imageInterval)
    }
  }, [])

  const handleYearChange = (selectedYear: string) => {
    setYear(selectedYear)
    setBrand("")
    setModel("")
    
    const brandsForYear = motoData.brandsByYear[selectedYear] || []
    setAvailableBrands(brandsForYear)
    setAvailableModels([])
  }

  const handleBrandChange = (selectedBrand: string) => {
    setBrand(selectedBrand)
    setModel("")
    
    if (year && selectedBrand) {
      const modelsForYearAndBrand = motoData.modelsByYearAndBrand[year]?.[selectedBrand] || []
      setAvailableModels(modelsForYearAndBrand)
    } else {
      setAvailableModels([])
    }
  }

  const saveSearch = () => {
    if (year && brand && model) {
      const newSearch = { year, brand, model }
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter((s) => !(s.year === year && s.brand === brand && s.model === model)),
      ].slice(0, 3)

      setRecentSearches(updatedSearches)
      localStorage.setItem("recentMotorcycleSearches", JSON.stringify(updatedSearches))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!year || !brand || !model) {
      toast.error("Información incompleta", {
        description: "Por favor selecciona año, marca y modelo para continuar.",
      })
      return
    }

    setLoading(true)
    saveSearch()

    toast.success("Buscando piezas", {
      description: `Localizando componentes para tu ${brand} ${model} ${year}`,
      style: {
        position: 'fixed',
        top: '65px',  
        right: '10px', 
        zIndex: 9999,
      }
    })

    setTimeout(() => {
      const params = new URLSearchParams()
      params.append("year", year)
      params.append("brand", brand)
      params.append("model", model)
      window.location.href = `/resultados?${params.toString()}`
    }, 800)
  }

  const handleQuickSearch = (search: { year: string; brand: string; model: string }) => {
    setLoading(true)
    toast.success("Búsqueda rápida", {
      description: `Localizando componentes para tu ${search.brand} ${search.model} ${search.year}`,
      style: {
        position: 'fixed',
        top: '65px',  
        right: '10px', 
        zIndex: 9999,
      }
    })

    setTimeout(() => {
      const params = new URLSearchParams()
      params.append("year", search.year)
      params.append("brand", search.brand)
      params.append("model", search.model)
      window.location.href = `/resultados?${params.toString()}`
    }, 800)
  }

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="relative overflow-hidden h-[85vh]">
        {/* Dynamic Background Carousel - Sin overlay azul */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <div className="relative w-full h-full overflow-hidden">
            {motorcycleImages.map((src, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${src})` }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1 : 1.1
                }}
                transition={{ duration: 1.5 }}
              />
            ))}
          </div>
        </div>

        {/* Elementos geométricos más sutiles */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500/20 blur-sm rounded-lg animate-pulse"></div>
          <div className="absolute top-40 right-16 w-16 h-16 bg-red-500/20 blur-sm rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-orange-400/15 blur-sm rounded-xl"></div>
          <div className="absolute bottom-20 right-1/4 w-18 h-18 bg-red-400/20 blur-sm rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-30 container mx-auto px-4 pt-8 pb-16 flex items-center justify-center min-h-screen">
          <motion.div
            className="flex flex-col items-center w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge pequeño */}
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="px-4 py-2 bg-blue-600/90 rounded-full backdrop-blur-sm">
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  Repuestos de Calidad
                </span>
              </div>
            </motion.div>

            {/* Título principal más compacto */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 text-white" 
                  style={{ fontFamily: '"Roboto", "Helvetica", sans-serif', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                RUDOLF
                <span className="text-blue-500"> MOTOS</span>
              </h1>

              <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                 style={{ fontFamily: '"Playfair Display", Bahnschrift', letterSpacing: '0.5px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                Atención personalizada y mantenimiento especializado para cada modelo. 
                Encuentra las piezas exactas que necesitas.
              </p>
            </motion.div>

            {/* Botones más elegantes */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
                style={{ fontFamily: '"Roboto", sans-serif' }}
                onClick={() => {
                  window.location.href = "/reservas/agendar"
                }}
              >
                <span>Agendar Cita</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/80 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                style={{ fontFamily: '"Roboto", sans-serif' }}
                onClick={() => {
                  window.location.href = "/contacto/contactanos"
                }}
              >
                <span>Contactar</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Indicador de scroll */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="text-white/80 text-sm mb-2 font-medium" style={{ fontFamily: '"Lato", sans-serif' }}>
                Buscar piezas
              </span>
              <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center p-1 bg-white/5 backdrop-blur-sm">
                <motion.div
                  className="w-1 h-1 bg-white/80 rounded-full"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Formulario de búsqueda más compacto */}
      <div className="container mx-auto px-4 py-8" id="motorcycle-finder">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-none rounded-xl shadow-xl overflow-hidden bg-background/95 backdrop-blur-sm -mt-12 z-10">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <BikeIcon className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                  Encuentra tu Motocicleta
                </h2>
                <p className="text-muted-foreground text-sm" style={{ fontFamily: '"Lato", sans-serif' }}>
                  Selecciona tu modelo para servicios personalizados
                </p>
              </div>

              <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="font-medium text-sm text-foreground flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Año
                    </Label>
                    <Select value={year} onValueChange={handleYearChange}>
                      <SelectTrigger className="w-full rounded-lg h-11">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-lg">
                        {motoData.years.map((y, index) => (
                          <SelectItem key={index} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand" className="font-medium text-sm text-foreground flex items-center">
                      <SettingsIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Marca
                    </Label>
                    <Select value={brand} onValueChange={handleBrandChange} disabled={!year}>
                      <SelectTrigger className="w-full rounded-lg h-11">
                        <SelectValue placeholder={year ? "Marca" : "Selecciona año"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-lg">
                        {availableBrands.map((b, index) => (
                          <SelectItem key={index} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="font-medium text-sm text-foreground flex items-center">
                      <BikeIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Modelo
                    </Label>
                    <Select value={model} onValueChange={setModel} disabled={!brand}>
                      <SelectTrigger className="w-full rounded-lg h-11">
                        <SelectValue placeholder={brand ? "Modelo" : "Selecciona marca"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-lg">
                        {availableModels.map((m, index) => (
                          <SelectItem key={index} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 min-w-40"
                    style={{ fontFamily: '"Roboto", sans-serif' }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Buscando...</span>
                      </div>
                    ) : (
                      <>
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Buscar Piezas
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {recentSearches.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-muted-foreground text-sm font-medium" style={{ fontFamily: '"Lato", sans-serif' }}>
                      Búsquedas recientes
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleQuickSearch(search)}
                        className="flex justify-between items-center border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg h-10 transition-all duration-200 text-sm"
                        style={{ fontFamily: '"Lato", sans-serif' }}
                      >
                        <span className="truncate mr-2 flex items-center text-gray-600">
                          <ClockIcon className="h-3 w-3 mr-2 text-gray-400" />
                          {search.brand} {search.model} {search.year}
                        </span>
                        <ArrowRightIcon className="h-3 w-3 flex-shrink-0 text-blue-600" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}