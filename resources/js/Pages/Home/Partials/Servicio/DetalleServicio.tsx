import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Separator } from "@/Components/ui/separator";
import { WrenchIcon, TagIcon, ArrowLeftIcon, PhoneIcon } from "lucide-react";

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold mb-3 text-gray-900">{servicio.nombre}</h1>
              <div className="flex items-center text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="flex items-center gap-1 hover:bg-gray-100">
                        <TagIcon className="h-3 w-3" />
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

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {servicio.descripcion || "No hay descripción disponible para este servicio."}
                </p>
              </CardContent>
            </Card>

            {serviciosRelacionados.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Servicios Relacionados</CardTitle>
                  <CardDescription>
                    Otros servicios que podrían interesarte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {serviciosRelacionados.map((related: Service) => (
                      <Card key={related.id} className="border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                        <CardHeader>
                          <CardTitle className="text-lg">{related.nombre}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {related.descripcion || "Sin descripción"}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild variant="ghost" className="w-full hover:bg-gray-50">
                            <Link href={`/servicios/${related.id}`}>Ver detalles</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Agendar Servicio</CardTitle>
                <CardDescription>
                  Programa una cita para este servicio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <Link href={route('reservas.create', { servicio_id: servicio.id })}>
                    Agendar Ahora
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">¿Necesitas ayuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Si tienes dudas sobre este servicio, no dudes en contactarnos.
                </p>
                <Button variant="outline" className="w-full group hover:border-blue-500">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-500" />
                  <span className="group-hover:text-blue-500">Contactar</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}