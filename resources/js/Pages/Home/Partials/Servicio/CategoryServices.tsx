import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, ClockIcon, ChevronRightIcon } from "lucide-react";

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

export default function CategoryServices({ categoryId }: Props) {
  // Use any type to avoid complicated Inertia typing issues for this component
  const { servicios = [], categoriasServicio = [], serviciosCategoria = [], nombreCategoria = "", descripcionCategoria = "" } = usePage<any>().props;

  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);

  useEffect(() => {
    // Set the category name from direct prop or find it
    if (nombreCategoria) {
      setCategoryName(nombreCategoria);
      setCategoryDescription(descripcionCategoria || "");
    } else {
      const category = categoriasServicio.find((cat: {id: number; nombre: string; descripcion?: string}) => cat.id === categoryId);
      if (category) {
        setCategoryName(category.nombre);
        setCategoryDescription(category.descripcion || "");
      }
    }

    // If serviciosCategoria is provided, use it directly
    if (Array.isArray(serviciosCategoria) && serviciosCategoria.length > 0) {
      setCategoryServices(serviciosCategoria);
    } else {
      // Otherwise filter from all services
      const filteredServices = servicios.filter((service: any) => 
        service.categoria_servicio_id === categoryId || service.categoria_id === categoryId
      );
      setCategoryServices(filteredServices);
    }
  }, [categoryId, servicios, categoriasServicio, serviciosCategoria, nombreCategoria, descripcionCategoria]);

  if (categoryServices.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">{categoryName || "Categoría"}</h2>
        {categoryDescription && (
          <p className="text-muted-foreground mb-6">{categoryDescription}</p>
        )}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <WrenchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No hay servicios disponibles</h3>
          <p className="text-muted-foreground mb-6">
            Actualmente no hay servicios disponibles en esta categoría.
          </p>
          <Button asChild>
            <a href="/servicios">Ver todas las categorías</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">{categoryName || "Categoría"}</h2>
      {categoryDescription && (
        <p className="text-muted-foreground mb-6">{categoryDescription}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryServices.map((service) => (
          <Card key={service.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>{service.nombre}</CardTitle>
              <CardDescription>
                {service.descripcion || "Próximamente más información sobre este servicio"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {service.duracion && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    <span>Duración estimada: {service.duracion}</span>
                  </div>
                )}
                {service.precio && (
                  <div className="mt-4">
                    <span className="text-xl font-bold">${service.precio.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="bg-muted/10 p-4">
              <Button variant="outline" className="w-full" asChild>
                <a href={`/servicios/${service.id}`}>
                  Ver detalles
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 