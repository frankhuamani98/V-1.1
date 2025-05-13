import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, ClockIcon, ChevronRightIcon, ArrowLeftIcon, TagIcon } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Regresar
        </Button>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{nombreCategoria || "Categoría"}</h2>
          {descripcionCategoria && (
            <p className="text-gray-600">{descripcionCategoria}</p>
          )}
        </div>

        {serviciosLista.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
            <WrenchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-gray-800">No hay servicios disponibles</h3>
            <p className="text-gray-600 mb-6">
              Actualmente no hay servicios disponibles en esta categoría.
            </p>
            <Button asChild variant="outline" className="hover:bg-gray-50">
              <a href="/servicios">Ver todas las categorías</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosLista.map((servicio) => (
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
                  <div className="space-y-3">
                    {servicio.duracion && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span>Duración estimada: {servicio.duracion}</span>
                      </div>
                    )}
                    {servicio.precio && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Precio base:</span>
                        <span className="text-xl font-bold text-gray-900">${servicio.precio.toFixed(2)}</span>
                      </div>
                    )}
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
        )}
      </div>
    </div>
  );
}