import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, ChevronRightIcon, TagIcon, ClockIcon } from "lucide-react";

interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface Service {
  id: number;
  nombre: string;
  categoria_id: number;
  descripcion?: string;
}

export default function CategoriaServicios() {
  const { categoriasServicio = [], servicios = [] } = usePage<any>().props;

  if (!Array.isArray(categoriasServicio) || categoriasServicio.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Nuestros Servicios</h2>
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
            <WrenchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-gray-800">No hay categorías de servicios disponibles</h3>
            <p className="text-gray-600 mb-6">
              Actualmente no hay categorías de servicios configuradas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestra amplia gama de servicios especializados para el mantenimiento y cuidado de tu moto
          </p>
        </div>
        
        <div className="space-y-16">
          {categoriasServicio.map((categoria: Category) => {
            const serviciosCategoria = servicios.filter(
              (servicio: any) => servicio.categoria_servicio_id === categoria.id || servicio.categoria_id === categoria.id
            );
            
            return (
              <div key={categoria.id} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      {categoria.nombre}
                      <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {serviciosCategoria.length} servicios
                      </span>
                    </h3>
                    {categoria.descripcion && (
                      <p className="text-gray-600 mt-2">{categoria.descripcion}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-500 transition-colors">
                    <a href={`/servicios/categoria/${categoria.id}`}>
                      Ver todos
                      <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                <Separator className="bg-gray-200" />
                
                {serviciosCategoria.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviciosCategoria.slice(0, 3).map((servicio: Service) => (
                      <Card 
                        key={servicio.id} 
                        className="group border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                                {servicio.nombre}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {servicio.descripcion || "Próximamente más información sobre este servicio"}
                              </CardDescription>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <WrenchIcon className="h-5 w-5 text-blue-500" />
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <TagIcon className="h-4 w-4 text-gray-400" />
                            <span>{categoria.nombre}</span>
                          </div>
                        </CardContent>
                        <Separator />
                        <CardFooter className="p-4 bg-gradient-to-r from-gray-50 to-white">
                          <Button asChild variant="outline" className="w-full group-hover:border-blue-500 group-hover:text-blue-600">
                            <a href={`/servicios/${servicio.id}`}>
                              Ver detalles
                              <ChevronRightIcon className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
                    <p className="text-gray-600">
                      No hay servicios disponibles en esta categoría.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}