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
        })
        sessionStorage.setItem("hasSeenWelcome", "true")
      }, 1500)
      return () => clearTimeout(timeout)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Actualizar marcas disponibles cuando cambia el año
  const handleYearChange = (selectedYear: string) => {
    setYear(selectedYear)
    setBrand("")
    setModel("")
    
    const brandsForYear = motoData.brandsByYear[selectedYear] || []
    setAvailableBrands(brandsForYear)
    setAvailableModels([])
  }

  // Actualizar modelos disponibles cuando cambia la marca
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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-slate-800 to-slate-900"></div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated decorative shapes */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl max-h-96 bg-gradient-to-tr from-cyan-400 to-slate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center justify-center space-x-2 mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-[1px] w-12 bg-cyan-300/70"></div>
              <span className="text-cyan-300 text-sm font-medium uppercase tracking-widest">
                Precisión en Repuestos
              </span>
              <div className="h-[1px] w-12 bg-cyan-300/70"></div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-8 tracking-tight leading-tight max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Servicio{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 relative">
                premium
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,5 Q50,15 100,5" stroke="rgb(6, 182, 212)" strokeWidth="2" fill="none" />
                </svg>
              </span>{" "}
              para tu motocicleta{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500 relative">
                favorita
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path d="M0,5 Q50,15 100,5" stroke="rgb(6, 182, 212)" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Atención personalizada y mantenimiento especializado para cada modelo. Nuestros expertos están listos para
              brindarte la mejor experiencia.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 group"
                onClick={() => {
                  window.location.href = "/reservas/agendar"
                }}
              >
                <span>Agendar servicio</span>
                <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 flex items-center gap-2 group"
                onClick={() => {
                  window.location.href = "/contacto"
                }}
              >
                <span>Contactar ahora</span>
                <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <span className="text-cyan-300/70 text-sm mb-2">Descubre más</span>
              <div className="w-6 h-10 border-2 border-cyan-300/50 rounded-full flex justify-center p-1">
                <motion.div
                  className="w-1.5 h-1.5 bg-cyan-300 rounded-full"
                  animate={{
                    y: [0, 12, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search component */}
      <div className="container mx-auto px-4 py-12" id="motorcycle-finder">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-none rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-card/95 -mt-16 z-10 transform transition-all duration-500 hover:shadow-cyan-500/10">
            <CardContent className="p-0">
              <div className="p-8">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-105 group">
                    <BikeIcon className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">Personaliza tu experiencia</h2>
                  <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                    Selecciona tu modelo para recibir atención especializada y servicios a medida para tu motocicleta
                  </p>
                </div>

                <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3 group">
                      <Label
                        htmlFor="year"
                        className="font-medium text-sm flex items-center text-foreground/80 ml-1 group-hover:text-cyan-600 transition-colors"
                      >
                        <ClockIcon className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                        Año del modelo
                      </Label>
                      <Select value={year} onValueChange={handleYearChange}>
                        <SelectTrigger
                          id="year"
                          className="w-full bg-background border-border rounded-xl h-12 transition-all hover:border-cyan-400 focus:border-cyan-500 group-hover:shadow-sm"
                        >
                          <SelectValue placeholder="Selecciona año" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 rounded-xl">
                          {motoData.years.map((y, index) => (
                            <SelectItem
                              key={index}
                              value={y.toString()}
                              className="focus:bg-cyan-50 dark:focus:bg-cyan-900/20"
                            >
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 group">
                      <Label
                        htmlFor="brand"
                        className="font-medium text-sm flex items-center text-foreground/80 ml-1 group-hover:text-cyan-600 transition-colors"
                      >
                        <SettingsIcon className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                        Marca
                      </Label>
                      <Select value={brand} onValueChange={handleBrandChange} disabled={!year}>
                        <SelectTrigger
                          id="brand"
                          className="w-full bg-background border-border rounded-xl h-12 transition-all hover:border-cyan-400 focus:border-cyan-500 group-hover:shadow-sm"
                        >
                          <SelectValue placeholder={year ? "Selecciona marca" : "Primero selecciona un año"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 rounded-xl">
                          {availableBrands.map((b, index) => (
                            <SelectItem key={index} value={b} className="focus:bg-cyan-50 dark:focus:bg-cyan-900/20">
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 group">
                      <Label
                        htmlFor="model"
                        className="font-medium text-sm flex items-center text-foreground/80 ml-1 group-hover:text-cyan-600 transition-colors"
                      >
                        <BikeIcon className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                        Modelo específico
                      </Label>
                      <Select value={model} onValueChange={setModel} disabled={!brand}>
                        <SelectTrigger
                          id="model"
                          className="w-full bg-background border-border rounded-xl h-12 transition-all hover:border-cyan-400 focus:border-cyan-500 group-hover:shadow-sm"
                        >
                          <SelectValue placeholder={brand ? "Selecciona modelo" : "Primero selecciona una marca"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 rounded-xl">
                          {availableModels.map((m, index) => (
                            <SelectItem key={index} value={m} className="focus:bg-cyan-50 dark:focus:bg-cyan-900/20">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-center mt-10">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 min-w-[220px] transform hover:translate-y-[-2px]"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        <>
                          <SearchIcon className="h-5 w-5 mr-2" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {recentSearches.length > 0 && (
                  <div className="mt-16">
                    <div className="flex items-center justify-center mb-6">
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-grow"></div>
                      <span className="px-4 text-muted-foreground text-sm font-medium mx-3">Servicios recientes</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleQuickSearch(search)}
                          className="flex justify-between items-center border border-border hover:border-cyan-300 hover:bg-accent rounded-xl h-12 transition-all duration-200 group"
                        >
                          <span className="truncate mr-2 flex items-center text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            <ClockIcon className="h-3.5 w-3.5 mr-2 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                            {search.brand} {search.model} {search.year}
                          </span>
                          <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-cyan-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}