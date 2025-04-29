import React from "react";
import { Head, Link } from "@inertiajs/react";
import NavigationMenu from '@/Components/NavigationMenu';

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
      <NavigationMenu />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Servicios Disponibles</h1>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {Object.entries(serviciosPorCategoria).map(([categoriaId, { categoria, servicios }]) => (
              <div key={categoriaId} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{categoria.nombre}</h2>
                {categoria.descripcion && (
                  <p className="text-gray-600 mb-4">{categoria.descripcion}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios.map((servicio) => (
                    <div key={servicio.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{servicio.nombre}</h3>
                        <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
                        <div className="flex justify-end">
                          <Link
                            href={route('reservas.create', { servicio_id: servicio.id })}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
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
                <p className="text-gray-500">No hay servicios disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}