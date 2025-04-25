import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, ChevronRightIcon } from "lucide-react";

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

export default function ServiciosList() {
  // Use any type to avoid complicated Inertia typing issues
  const { categoriasServicio = [], servicios = [] } = usePage<any>().props;

  if (!Array.isArray(categoriasServicio) || categoriasServicio.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Nuestros Servicios</h2>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <WrenchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No hay categorías de servicios disponibles</h3>
          <p className="text-muted-foreground mb-6">
            Actualmente no hay categorías de servicios configuradas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Nuestros Servicios</h2>
      
      <div className="space-y-10">
        {categoriasServicio.map((categoria: Category) => {
          // Filter services for this category
          const categoryServices = servicios.filter(
            (service: any) => service.categoria_servicio_id === categoria.id || service.categoria_id === categoria.id
          );
          
          return (
            <div key={categoria.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{categoria.nombre}</h3>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/servicios/categoria/${categoria.id}`}>
                    Ver todos
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              {categoria.descripcion && (
                <p className="text-muted-foreground mb-2">{categoria.descripcion}</p>
              )}
              <Separator className="my-2" />
              
              {categoryServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.slice(0, 3).map((service: Service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{service.nombre}</CardTitle>
                        <CardDescription>
                          {service.descripcion || "Próximamente más información sobre este servicio"}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="bg-muted/10 pt-2">
                        <Button variant="ghost" size="sm" className="ml-auto" asChild>
                          <a href={`/servicios/${service.id}`}>
                            Ver detalles
                            <ChevronRightIcon className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">
                    No hay servicios disponibles en esta categoría.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 