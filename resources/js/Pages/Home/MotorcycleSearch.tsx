import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import {
  SearchIcon,
  BikeIcon,
  FilterIcon,
  StarIcon,
  ChevronRightIcon,
  SparklesIcon,
  ZapIcon,
  ShieldCheckIcon,
  ClockIcon,
  ThumbsUpIcon,
  ShoppingCartIcon,
  WrenchIcon,
  PhoneIcon
} from "lucide-react";

// Tipos para los datos de motos
interface MotoData {
    years: number[];
    brands: string[];
    models: Array<{
        modelo: string;
        marca: string;
    }>;
}

interface Props {
    motoData: MotoData;
}

const categories = [
  { name: "Frenos", icon: <ZapIcon className="h-4 w-4" />, count: 428 },
  { name: "Neumáticos", icon: <ShieldCheckIcon className="h-4 w-4" />, count: 356 },
  { name: "Aceite", icon: <SparklesIcon className="h-4 w-4" />, count: 231 },
  { name: "....", icon: <ThumbsUpIcon className="h-4 w-4" />, count: 198 }
];

export default function MotorcycleSearch({ motoData }: Props) {
  const [year, setYear] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [filteredModels, setFilteredModels] = useState<Array<{modelo: string, marca: string}>>([]);
  const [searchMode, setSearchMode] = useState<"standard" | "advanced">("standard");
  const [recentSearches, setRecentSearches] = useState<Array<{year: string, brand: string, model: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [promoTime, setPromoTime] = useState({ hours: 12, minutes: 43, seconds: 21 });

  // Recuperar búsquedas recientes del localStorage al cargar el componente
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentMotorcycleSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 3));
    }

    // Mostrar toast de bienvenida después de 1.5 segundos
    const timeout = setTimeout(() => {
      toast.success("¡Bienvenido motociclista!", {
        description: "Tu taller de confianza para reparaciones y repuestos de motos. ¡Más de 10 años de experiencia! 🏍️",
        duration: 5000
      });
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // Contador en tiempo real para la promoción
  useEffect(() => {
    const savedTime = localStorage.getItem("promoTime");
    if (savedTime) {
      const { hours, minutes, seconds } = JSON.parse(savedTime);
      setPromoTime({ hours, minutes, seconds });
    }

    const interval = setInterval(() => {
      setPromoTime((prevTime) => {
        const totalSeconds = prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(interval);
          localStorage.removeItem("promoTime");
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;
        localStorage.setItem("promoTime", JSON.stringify({ hours: newHours, minutes: newMinutes, seconds: newSeconds }));
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBrandChange = (value: string) => {
    setBrand(value);
    setModel("");
    setFilteredModels(motoData.models.filter(m => m.marca === value));
  };

  const saveSearch = () => {
    // Solo guardar búsquedas completas
    if (year && brand && model) {
      const modelName = motoData.models.find(m => m.modelo === model)?.modelo || "";

      const newSearch = { year, brand, model: modelName };
      const updatedSearches = [newSearch, ...recentSearches.filter(
        s => !(s.year === year && s.brand === brand && s.model === modelName)
      )].slice(0, 3);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentMotorcycleSearches", JSON.stringify(updatedSearches));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!year || !brand || !model) {
      toast.error("¡Espera un momento!", {
        description: "Necesitamos saber qué moto tienes para mostrarte las partes perfectas."
      });
      return;
    }

    setLoading(true);
    saveSearch();

    toast.success("¡En camino a toda velocidad!", {
      description: `Buscando las mejores partes para tu ${brand} ${model} ${year}`
    });

    // Redirección mejorada con parámetros codificados
    setTimeout(() => {
      const params = new URLSearchParams();
      params.append('year', year);
      params.append('brand', brand);
      params.append('model', model);
      window.location.href = `/resultados?${params.toString()}`;
    }, 800);
  };

  const handleQuickSearch = (search: {year: string, brand: string, model: string}) => {
    setLoading(true);
    toast.success("¡Búsqueda instantánea!", {
      description: `Localizando piezas premium para tu ${search.brand} ${search.model} ${search.year}`
    });

    setTimeout(() => {
      const params = new URLSearchParams();
      params.append('year', search.year);
      params.append('brand', search.brand);
      params.append('model', search.model);
      window.location.href = `/resultados?${params.toString()}`;
    }, 800);
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-indigo-900 opacity-90"></div>
        
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>

        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-15">
          <div className="flex flex-col items-center">
            <div className="mb-6 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 text-white/90 text-sm font-medium tracking-wider animate-pulse">
              ESPECIALISTAS EN MOTOS
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center mb-4 tracking-tight">
              <span className="inline-block animate-fade-in-up">¡TU TALLER DE</span> 
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 animate-fade-in-up animation-delay-300"> CONFIANZA!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium text-center mb-3 animate-fade-in-up animation-delay-500">
              Reparaciones y repuestos de calidad para tu moto.
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto font-normal text-center mb-8 animate-fade-in-up animation-delay-700">
              Más de 10 años brindando servicios de reparación y mantenimiento profesional.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up animation-delay-900">
              <Badge className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 text-sm border border-white/20 transition-all duration-300 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2 text-yellow-300" />
                <span>+5,000 Productos</span>
              </Badge>
              <Badge className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 text-sm border border-white/20 transition-all duration-300 flex items-center">
                <ThumbsUpIcon className="h-4 w-4 mr-2 text-yellow-300" />
                <span>98% Satisfacción</span>
              </Badge>
              <Badge className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 text-sm border border-white/20 transition-all duration-300 flex items-center">
                <WrenchIcon className="h-4 w-4 mr-2 text-yellow-300" />
                <span>Garantía Asegurada</span>
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-1000">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                AGENDAR SERVICIO
              </Button>
              <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 font-medium px-6 py-6 rounded-lg flex items-center transition-all duration-300">
                <PhoneIcon className="h-5 w-5 mr-2" />
                CONTACTAR AHORA
              </Button>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md max-w-md w-full mx-auto rounded-xl p-4 border border-white/10 shadow-xl animate-fade-in-up animation-delay-1200">
              <p className="text-yellow-300 font-bold text-base mb-2 flex justify-center items-center">
                <SparklesIcon className="h-4 w-4 mr-2" />
                ¡OFERTA FLASH HOY!
                <SparklesIcon className="h-4 w-4 ml-2" />
              </p>
              <div className="flex justify-center gap-4">
                <div className="bg-white/10 rounded-lg px-4 py-2 w-20 text-center">
                  <span className="font-mono text-2xl font-bold text-white">{String(promoTime.hours).padStart(2, '0')}</span>
                  <span className="text-xs text-white/70 block">HORAS</span>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2 w-20 text-center">
                  <span className="font-mono text-2xl font-bold text-white">{String(promoTime.minutes).padStart(2, '0')}</span>
                  <span className="text-xs text-white/70 block">MINUTOS</span>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2 w-20 text-center">
                  <span className="font-mono text-2xl font-bold text-white">{String(promoTime.seconds).padStart(2, '0')}</span>
                  <span className="text-xs text-white/70 block">SEGUNDOS</span>
                </div>
              </div>
              <p className="text-center text-white/80 text-sm mt-3 font-medium">
                Hasta <span className="text-yellow-300 font-bold">30% DESCUENTO</span> en partes seleccionadas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showPromo && (
          <Card className="border-2 border-yellow-400 mb-6 overflow-hidden bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-yellow-400 rounded-full p-2 mr-3">
                  <ZapIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">¡CÓDIGO DE DESCUENTO: MOTO25!</h3>
                  <p className="text-sm">25% de descuento en tu primera compra. ¡Solo por tiempo limitado!</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                onClick={() => setShowPromo(false)}
              >
                Cerrar
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-none rounded-xl shadow-xl overflow-hidden relative -mt-10 z-10 bg-white dark:bg-gray-900">
          <CardContent className="p-0">
            <Tabs defaultValue="standard" className="w-full">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                  <TabsTrigger value="standard" onClick={() => setSearchMode("standard")}>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Búsqueda Rápida
                  </TabsTrigger>
                  <TabsTrigger value="advanced" onClick={() => setSearchMode("advanced")}>
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Búsqueda Avanzada
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="standard" className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <BikeIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-800">
                    ¡ENCUENTRA TUS PARTES EN SEGUNDOS!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-lg mx-auto">
                    Dinos qué moto tienes y te mostraremos <span className="font-semibold">exactamente</span> lo que necesitas
                  </p>
                </div>

                <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="year" className="font-medium text-sm flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-blue-500" />
                        Año de tu Moto
                      </Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger id="year" className="w-full">
                          <SelectValue placeholder="Selecciona Año" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {motoData.years.map((y, index) => (
                            <SelectItem key={index} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand" className="font-medium text-sm flex items-center">
                        <StarIcon className="h-4 w-4 mr-1 text-blue-500" />
                        Marca Preferida
                      </Label>
                      <Select value={brand} onValueChange={handleBrandChange}>
                        <SelectTrigger id="brand" className="w-full">
                          <SelectValue placeholder="Selecciona Marca" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {motoData.brands.map((b, index) => (
                            <SelectItem key={index} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model" className="font-medium text-sm flex items-center">
                        <BikeIcon className="h-4 w-4 mr-1 text-blue-500" />
                        Modelo Exacto
                      </Label>
                      <Select value={model} onValueChange={setModel} disabled={!brand}>
                        <SelectTrigger id="model" className="w-full">
                          <SelectValue placeholder={brand ? "Selecciona Modelo" : "Primero selecciona una marca"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {filteredModels.map((m, index) => (
                            <SelectItem key={index} value={m.modelo}>{m.modelo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-red-800 hover:from-blue-700 hover:to-red-900 text-white px-10 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Buscando...</span>
                        </div>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-5 w-5 mr-2" />
                          ¡ENCONTRAR MIS PARTES AHORA!
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {recentSearches.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow max-w-xs"></div>
                      <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mx-3 dark:bg-blue-900 dark:text-blue-100">Tus búsquedas recientes</span>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow max-w-xs"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleQuickSearch(search)}
                          className="flex justify-between items-center hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <span className="truncate mr-2 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-2 text-gray-400" />
                            {search.brand} {search.model} {search.year}
                          </span>
                          <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <FilterIcon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-800">
                    PERSONALIZA TU BÚSQUEDA AL DETALLE
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-lg mx-auto">
                    Refina tu búsqueda para encontrar exactamente lo que necesitas
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Categorías populares</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto py-3 justify-between hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3 dark:bg-blue-900/30">
                            {category.icon}
                          </div>
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="ml-2">{category.count}</Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    ¡Próximamente más filtros avanzados!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}