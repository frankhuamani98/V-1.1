import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Wrench, ClipboardList, AlertCircle, Settings } from "lucide-react";
import ReservaNavigation from "@/Components/ReservaNavigation";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';

interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_servicio_id: number;
  categoriaServicio?: CategoriaServicio;
}

interface Props {
  servicios: Servicio[];
  error?: string;
}

export default function ServiciosDisponibles({ servicios, error }: Props) {
  const serviciosPorCategoria = servicios.reduce((acc, servicio) => {
    if (!servicio.categoriaServicio) {
      const sinCategoriaId = 0;
      if (!acc[sinCategoriaId]) {
        acc[sinCategoriaId] = {
          categoria: {
            id: sinCategoriaId,
            nombre: "Sin categoría",
            descripcion: "Servicios sin categoría asignada"
          },
          servicios: []
        };
      }
      acc[sinCategoriaId].servicios.push(servicio);
    } else {
      const categoriaId = servicio.categoria_servicio_id;
      if (!acc[categoriaId]) {
        acc[categoriaId] = {
          categoria: servicio.categoriaServicio,
          servicios: []
        };
      }
      acc[categoriaId].servicios.push(servicio);
    }
    return acc;
  }, {} as Record<number, { categoria: CategoriaServicio, servicios: Servicio[] }>);

  return (
    <>
      <Head title="Servicios Disponibles" />
      <Header />
      <ReservaNavigation currentPage="Servicios Disponibles" />
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-900 rounded-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3.5 rounded-full">
                  <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Servicios Disponibles</CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Explora y agenda nuestros servicios para tu moto
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 p-4 mb-6 rounded-lg shadow-sm flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-300" />
                <p className="text-base text-rose-700 dark:text-rose-200">{error}</p>
              </div>
            )}
            {Object.entries(serviciosPorCategoria).map(([categoriaId, { categoria, servicios }]) => (
              <div key={categoriaId} className="mb-10">
                <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <Wrench className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {categoria.nombre}
                </h2>
                {categoria.descripcion && (
                  <p className="text-slate-500 dark:text-slate-400 text-base mb-5 ml-10">{categoria.descripcion}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios.map((servicio) => (
                    <div key={servicio.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="p-6 flex flex-col h-full">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-3">
                          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md">
                            <ClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          {servicio.nombre}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-base mb-5 flex-1">{servicio.descripcion}</p>
                        <div className="flex justify-end">
                          <Button
                            asChild
                            className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2"
                          >
                            <Link href={route('reservas.create', { servicio_id: servicio.id })}>
                              <Wrench className="h-4 w-4" />
                              Agendar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(serviciosPorCategoria).length === 0 && (
              <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                  <Settings className="h-8 w-8 text-slate-300 dark:text-slate-500" />
                </div>
                <h3 className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2">No hay servicios disponibles</h3>
                <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
                  En este momento no hay servicios disponibles para reservar. Por favor, intenta más tarde.
                </p>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}