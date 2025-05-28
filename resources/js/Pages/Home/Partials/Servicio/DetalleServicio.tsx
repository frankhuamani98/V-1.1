import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, TagIcon, ArrowLeftIcon, PhoneIcon, CalendarIcon, InfoIcon, ClockIcon, HomeIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";

interface Service {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria_servicio_id: number;
  categoriaServicio?: {
    id: number;
    nombre: string;
  };
}

export default function DetalleServicio() {
  const { servicio, serviciosRelacionados = [] } = usePage<any>().props;
  
  console.log('Servicio data:', servicio);

  if (!servicio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted/50 dark:bg-slate-800 rounded-lg p-8 text-center">
          <WrenchIcon className="mx-auto h-12 w-12 text-muted-foreground dark:text-slate-400 mb-4" />
          <h3 className="text-xl font-medium mb-2 dark:text-white">Servicio no encontrado</h3>
          <p className="text-muted-foreground dark:text-slate-400 mb-6">
            El servicio que estás buscando no existe o ha sido desactivado.
          </p>
          <Button asChild>
            <a href="/catalogo-servicios">Ver todos los servicios</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col">
      <Head title={`${servicio?.nombre || 'Detalle de Servicio'} - Rudolf Motors`} />
      <Header />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="mb-6">
              <ol className="flex items-center flex-wrap gap-2 py-2">
                <li>
                  <Link href="/" className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white flex items-center text-sm">
                    <HomeIcon className="w-3.5 h-3.5 mr-1" />
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-slate-600">/</span>
                  <Link href="/catalogo-servicios" className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white flex items-center text-sm">
                    Servicios
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-slate-600">/</span>
                  <Link 
                    href={`/catalogo-servicios/categoria/${servicio?.categoria_servicio_id || servicio?.categoriaServicio?.id}`} 
                    className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white flex items-center text-sm"
                  >
                    {servicio?.categoriaServicio?.nombre || "Categoría"}
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-slate-600">/</span>
                  <span className="text-gray-800 dark:text-white font-medium text-sm">
                    {servicio?.nombre}
                  </span>
                </li>
              </ol>
            </nav>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 bg-gradient-to-br from-blue-100/70 to-indigo-100/70 dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
                    {servicio.nombre}
                  </span>
                </h1>
                <div className="flex items-center gap-3 text-muted-foreground dark:text-slate-400">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-1 transition-colors duration-200 border border-blue-200 dark:border-blue-700">
                          <TagIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          {servicio.categoriaServicio?.nombre}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Categoría del servicio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden dark:bg-slate-800">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl text-gray-800 dark:text-white">Descripción</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                    {servicio.descripcion || "No hay descripción disponible para este servicio."}
                  </p>
                </CardContent>
              </Card>

              {serviciosRelacionados.length > 0 && (
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden dark:bg-slate-800">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl text-gray-800 dark:text-white">Servicios relacionados</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Otros servicios que podrían interesarte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {serviciosRelacionados.map((related: Service, index: number) => (
                        <motion.div
                          key={related.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="border border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 h-full group dark:bg-slate-900">
                            <CardHeader>
                              <CardTitle className="text-lg dark:text-white">{related.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                                {related.descripcion || "Sin descripción"}
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button asChild variant="ghost" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900 transition-colors duration-200">
                                <a href={`/catalogo-servicios/${related.id}`}>Ver detalles</a>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 transform hover:-translate-y-1">
                <CardHeader className="pb-3 border-b border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl text-gray-800 dark:text-white">Agendar Servicio</CardTitle>
                  </div>
                  <CardDescription className="dark:text-slate-400">
                    Programa una cita para este servicio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg rounded-md overflow-hidden relative group">
                    <a href={`/reservas/agendar?servicio_id=${servicio.id}`} className="relative z-10 py-2 flex items-center justify-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Agendar Ahora
                      <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100/70 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl text-gray-800 dark:text-white">¿Necesitas ayuda?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Si tienes dudas sobre este servicio, no dudes en contactarnos.
                  </p>
                  <Button asChild variant="outline" className="w-full group hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/50 transition-colors duration-200">
                    <a href="/contacto/contactanos">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                      <span className="group-hover:text-blue-500 dark:group-hover:text-blue-400">Contactar</span>
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}