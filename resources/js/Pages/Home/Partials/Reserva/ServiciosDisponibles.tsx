import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Wrench, ClipboardList } from "lucide-react";
import ReservaNavigation from "@/Components/ReservaNavigation";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";

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
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center py-0 px-0">
        <div className="w-[80%] mx-auto mt-4 mb-8">
          <div className="bg-white shadow-2xl rounded-2xl border border-blue-200 p-4">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="h-7 w-7 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                Servicios Disponibles
              </h1>
            </div>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg shadow-sm flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {Object.entries(serviciosPorCategoria).map(([categoriaId, { categoria, servicios }]) => (
              <div key={categoriaId} className="mb-4">
                <h2 className="text-2xl font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Wrench className="h-6 w-6 text-blue-400" />
                  {categoria.nombre}
                </h2>
                {categoria.descripcion && (
                  <p className="text-blue-700 mb-4">{categoria.descripcion}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {servicios.map((servicio) => (
                    <div key={servicio.id} className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg border border-blue-100 hover:shadow-2xl transition-shadow duration-200">
                      <div className="p-6 flex flex-col h-full">
                        <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-blue-400" />
                          {servicio.nombre}
                        </h3>
                        <p className="text-blue-800 mb-6 flex-1">{servicio.descripcion}</p>
                        <div className="flex justify-end">
                          <Link
                            href={route('reservas.create', { servicio_id: servicio.id })}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2 transition-colors duration-200"
                          >
                            <Wrench className="h-4 w-4" />
                            Agendar
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(serviciosPorCategoria).length === 0 && (
              <div className="text-center py-8">
                <p className="text-blue-500">No hay servicios disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}