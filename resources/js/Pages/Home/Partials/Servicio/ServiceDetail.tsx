import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, ClockIcon, ChevronRightIcon, CalendarIcon, DollarSignIcon, TagIcon } from "lucide-react";

interface Service {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base?: number;
  duracion_estimada?: number;
  categoria_servicio_id: number;
  categoriaServicio?: {
    id: number;
    nombre: string;
  };
}

export default function ServiceDetail() {
  // Use any type to avoid complicated Inertia typing issues
  const { servicio, serviciosRelacionados = [] } = usePage<any>().props;

  if (!servicio) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <WrenchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Servicio no encontrado</h3>
          <p className="text-muted-foreground mb-6">
            El servicio que estás buscando no existe o ha sido desactivado.
          </p>
          <Button asChild>
            <a href="/servicios">Ver todos los servicios</a>
          </Button>
        </div>
      </div>
    );
  }

  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    if (!minutes) return "N/A";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} minutos`;
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? "hora" : "horas"}`;
    } else {
      return `${hours} ${hours === 1 ? "hora" : "horas"} y ${mins} minutos`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{servicio.nombre}</h1>
            <div className="flex items-center text-muted-foreground">
              <TagIcon className="h-4 w-4 mr-1" />
              <span>Categoría: {servicio.categoriaServicio?.nombre || "General"}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="prose max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold mb-4">Descripción del Servicio</h2>
            <p>{servicio.descripcion || "Próximamente más información sobre este servicio."}</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">¿Qué incluye?</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Diagnóstico completo del sistema</li>
              <li>Mano de obra especializada</li>
              <li>Certificado de servicio</li>
              <li>Garantía de trabajo realizado</li>
            </ul>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-muted-foreground">
                  <DollarSignIcon className="h-5 w-5 mr-2" />
                  <span>Precio base:</span>
                </div>
                <span className="text-xl font-bold">
                  ${servicio.precio_base?.toFixed(2) || "Consultar"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-muted-foreground">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Duración estimada:</span>
                </div>
                <span>{formatDuration(servicio.duracion_estimada || 0)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" asChild>
                <a href="/reservas/crear">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Agendar Servicio
                </a>
              </Button>
              <Button variant="outline" className="w-full">
                Contactar para más información
              </Button>
            </CardFooter>
          </Card>
          
          {/* Related services */}
          {serviciosRelacionados.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Servicios relacionados</h3>
              <div className="space-y-3">
                {serviciosRelacionados.map((servRel: Service) => (
                  <Card key={servRel.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{servRel.nombre}</CardTitle>
                    </CardHeader>
                    <CardFooter className="bg-muted/10 p-3">
                      <Button variant="ghost" size="sm" className="ml-auto" asChild>
                        <a href={`/servicios/${servRel.id}`}>
                          Ver detalles
                          <ChevronRightIcon className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 