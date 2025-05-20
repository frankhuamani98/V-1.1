import React, { useEffect, useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, ClockIcon, ChevronRightIcon, TagIcon, ArrowRightIcon, CreditCardIcon, HomeIcon, Sparkles, Package, Tag, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";

interface Service {
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  duracion?: string;
  categoria_id: number;
}

interface Props {
  categoryId: number;
}

export default function ListaServicios({ categoryId }: Props) {
  const { servicios = [], categoriasServicio = [], serviciosCategoria = [] } = usePage<any>().props;

  const [nombreCategoria, setNombreCategoria] = useState<string>("");
  const [descripcionCategoria, setDescripcionCategoria] = useState<string>("");
  const [serviciosLista, setServiciosLista] = useState<Service[]>([]);

  useEffect(() => {
    const categoria = categoriasServicio.find((cat: {id: number; nombre: string; descripcion?: string}) => cat.id === categoryId);
    if (categoria) {
      setNombreCategoria(categoria.nombre);
      setDescripcionCategoria(categoria.descripcion || "");
    }

    if (Array.isArray(serviciosCategoria) && serviciosCategoria.length > 0) {
      setServiciosLista(serviciosCategoria);
    } else {
      const serviciosFiltrados = servicios.filter((servicio: any) => 
        servicio.categoria_servicio_id === categoryId || servicio.categoria_id === categoryId
      );
      setServiciosLista(serviciosFiltrados);
    }
  }, [categoryId, servicios, categoriasServicio, serviciosCategoria]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Head title={`${nombreCategoria || 'Servicios'} - Rudolf Motors`} />
      <Header />
      
      <div className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="mb-6">
              <ol className="flex items-center flex-wrap gap-2 bg-white shadow-sm rounded-full px-4 py-2 border border-slate-100">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-indigo-700 flex items-center text-sm transition-colors duration-200">
                    <HomeIcon className="w-3.5 h-3.5 mr-1" />
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-slate-300">/</span>
                  <Link href="/catalogo-servicios" className="text-slate-600 hover:text-indigo-700 flex items-center text-sm transition-colors duration-200">
                    Servicios
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-slate-300">/</span>
                  <span className="text-indigo-700 font-medium text-sm">
                    {nombreCategoria}
                  </span>
                </li>
              </ol>
            </nav>
          </motion.div>

          <div className="flex items-center justify-between mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2.5 rounded-lg shadow-md">
                  <WrenchIcon className="h-5 w-5" />
                </div>
                {nombreCategoria || "Categoría"}
              </h1>
              {descripcionCategoria && (
                <p className="text-slate-600 mt-2 ml-11 leading-relaxed">{descripcionCategoria}</p>
              )}
            </motion.div>
            
            <Badge className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200 rounded-full text-xs font-medium shadow-sm">
              {serviciosLista.length} servicios disponibles
            </Badge>
          </div>

          {serviciosLista.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-8 text-center border border-slate-100 shadow-sm max-w-md mx-auto bg-gradient-to-br from-slate-50 to-white"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                <WrenchIcon className="h-7 w-7 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-slate-800">No hay servicios disponibles</h3>
              <p className="text-slate-600 mb-6">
                Actualmente no hay servicios disponibles en esta categoría.
              </p>
              <Button asChild variant="outline" className="rounded-full px-5 py-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all duration-200">
                <a href="/catalogo-servicios">Ver todas las categorías</a>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {serviciosLista.map((servicio, index: number) => (
              <motion.div
                key={servicio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="group border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden bg-gradient-to-br from-white to-slate-50/50"
                >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-slate-900 group-hover:text-indigo-700 transition-colors duration-200">
                        {servicio.nombre}
                      </CardTitle>
                      <CardDescription className="mt-2 text-slate-600">
                        {servicio.descripcion || "Próximamente más información sobre este servicio"}
                      </CardDescription>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-all duration-300">
                        {index % 4 === 0 ? (
                          <WrenchIcon className="h-6 w-6 text-white" />
                        ) : index % 4 === 1 ? (
                          <Package className="h-6 w-6 text-white" />
                        ) : index % 4 === 2 ? (
                          <Tag className="h-6 w-6 text-white" />
                        ) : (
                          <BadgeCheck className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {servicio.duracion && (
                      <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100">
                        <ClockIcon className="mr-2 h-4 w-4 text-indigo-500" />
                        <span>Duración estimada: {servicio.duracion}</span>
                      </div>
                    )}
                    {servicio.precio && (
                      <div className="flex items-center justify-between mt-3 bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-3 rounded-md border border-indigo-100">
                        <div className="flex items-center">
                          <CreditCardIcon className="mr-2 h-4 w-4 text-indigo-600" />
                          <span className="text-sm text-indigo-700">Precio base:</span>
                        </div>
                        <span className="text-lg font-bold text-indigo-900">${servicio.precio.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <Separator className="bg-slate-100" />
                <CardFooter className="p-4 bg-gradient-to-r from-slate-50 to-white">
                  <Button asChild variant="outline" className="w-full rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all duration-200 group-hover:shadow-sm">
                    <a href={`/catalogo-servicios/${servicio.id}`} className="flex items-center justify-center">
                      Ver detalles
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardFooter>
                </Card>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}