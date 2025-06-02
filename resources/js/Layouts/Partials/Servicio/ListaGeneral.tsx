import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { ChevronDown, ChevronUp, ListChecks } from "lucide-react";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
}

interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  orden: number;
  servicios: Servicio[];
}

interface ListaGeneralProps {
  categorias: CategoriaServicio[];
}

const ListaGeneral = ({ categorias: initialCategorias }: ListaGeneralProps) => {
  const [categorias] = useState<CategoriaServicio[]>(initialCategorias);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
        <CardHeader className="px-4 sm:px-6 bg-white border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Servicios</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Listado detallado de categorías y servicios disponibles
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          {categorias.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ListChecks className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No hay categorías de servicios registradas</p>
              <p className="text-gray-500 text-sm mt-1">No hay categorías disponibles para mostrar</p>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                    onClick={() => toggleCategory(categoria.id)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{categoria.nombre}</h3>
                        <Badge className={categoria.estado ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}>
                          {categoria.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      {categoria.descripcion && (
                        <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Orden de visualización: {categoria.orden}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 md:hidden">
                        {expandedCategories.includes(categoria.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`${expandedCategories.includes(categoria.id) ? 'block' : 'hidden md:block'}`}>
                    {categoria.servicios && categoria.servicios.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table className="min-w-full">
                          <TableHeader className="bg-white">
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead className="hidden md:table-cell">Descripción</TableHead>
                              <TableHead className="hidden sm:table-cell">Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoria.servicios.map((servicio) => (
                              <TableRow key={servicio.id} className="bg-white hover:bg-gray-50">
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span>{servicio.nombre}</span>
                                    <div className="md:hidden flex flex-col gap-1 mt-1">
                                      {servicio.descripcion && (
                                        <span className="text-xs text-gray-600">{servicio.descripcion}</span>
                                      )}
                                      <Badge className={`w-fit ${servicio.estado ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}`}>
                                        {servicio.estado ? "Activo" : "Inactivo"}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {servicio.descripcion ? (
                                    <span className="text-sm">{servicio.descripcion}</span>
                                  ) : (
                                    <span className="text-sm text-gray-400">Sin descripción</span>
                                  )}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <Badge className={servicio.estado ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}>
                                    {servicio.estado ? "Activo" : "Inactivo"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="py-6 text-center bg-white">
                        <p className="text-gray-500">No hay servicios registrados en esta categoría</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaGeneral;