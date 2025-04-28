import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp, ListChecks, Plus, Pencil, Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: string;
  duracion_estimada: number;
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
  const [categorias, setCategorias] = useState<CategoriaServicio[]>(initialCategorias);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null);
  const [servicioToDelete, setServicioToDelete] = useState<{id: number, categoriaId: number} | null>(null);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState("");
  const [deleteDialogDescription, setDeleteDialogDescription] = useState("");
  const [deleteAction, setDeleteAction] = useState<"categoria" | "servicio">("categoria");

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  const openDeleteCategoriaDialog = (categoria: CategoriaServicio, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCategoriaToDelete(categoria.id);
    setDeleteDialogTitle("Eliminar Categoría");
    setDeleteDialogDescription(`¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`);
    setDeleteAction("categoria");
    setIsDeleteDialogOpen(true);
  };

  const openDeleteServicioDialog = (servicio: Servicio, categoriaId: number) => {
    setServicioToDelete({id: servicio.id, categoriaId});
    setDeleteDialogTitle("Eliminar Servicio");
    setDeleteDialogDescription(`¿Estás seguro de que deseas eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`);
    setDeleteAction("servicio");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategoria = () => {
    if (!categoriaToDelete) return;

    router.delete(`/servicios/categorias/${categoriaToDelete}`, {
      preserveScroll: true,
      onSuccess: () => {
        setCategorias(categorias.filter(categoria => categoria.id !== categoriaToDelete));
        toast.success("Categoría eliminada correctamente");
        setCategoriaToDelete(null);
      },
      onError: (errors: any) => {
        const errorMessage = errors.message || "No se pudo eliminar la categoría porque tiene servicios asociados. Elimine primero todos los servicios de esta categoría.";
        toast.error(errorMessage);
      }
    });
  };

  const handleDeleteServicio = () => {
    if (!servicioToDelete) return;

    router.delete(`/servicios/${servicioToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setCategorias(categorias.map(categoria => {
          if (categoria.id === servicioToDelete.categoriaId) {
            return {
              ...categoria,
              servicios: categoria.servicios.filter(servicio => servicio.id !== servicioToDelete.id)
            };
          }
          return categoria;
        }));
        toast.success("Servicio eliminado correctamente");
        setServicioToDelete(null);
      },
      onError: (errors) => {
        if (errors.message) {
          toast.error(errors.message);
        } else {
          toast.error("Error al eliminar el servicio");
        }
      }
    });
  };

  const handleConfirmDelete = () => {
    if (deleteAction === "categoria") {
      handleDeleteCategoria();
    } else {
      handleDeleteServicio();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <Toaster position="top-center" />
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  Gestione las categorías y servicios de su negocio
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href={route('servicios.categorias.crear')} className="w-1/2 sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Categoría
                </Button>
              </Link>
              <Link href={route('servicios.crear')} className="w-1/2 sm:w-auto">
                <Button 
                  className="w-full flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Servicio
                </Button>
              </Link>
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
              <p className="text-gray-500 text-sm mt-1">Agregue categorías para comenzar a organizar sus servicios</p>
              <Button 
                className="mt-4 flex items-center gap-1.5"
                onClick={() => router.visit(route('servicios.categorias.crear'))}
              >
                <Plus className="h-4 w-4" />
                Agregar Categoría
              </Button>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
                    onClick={() => toggleCategory(categoria.id)}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{categoria.nombre}</h3>
                      <Badge className={categoria.estado ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}>
                        {categoria.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 md:hidden">
                        {expandedCategories.includes(categoria.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <Link href={route('servicios.categorias.editar', { categoriaServicio: categoria.id })}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteCategoriaDialog(categoria);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile actions */}
                  <div className="flex items-center justify-end gap-2 p-2 md:hidden bg-gray-50 border-t border-gray-200">
                    <Link 
                      href={route('servicios.categorias.editar', { categoriaServicio: categoria.id })}
                      className="w-1/2"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteCategoriaDialog(categoria);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Eliminar
                    </Button>
                  </div>

                  {/* Show services when expanded on mobile or always on desktop */}
                  <div className={`${expandedCategories.includes(categoria.id) ? 'block' : 'hidden md:block'}`}>
                    {categoria.servicios && categoria.servicios.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table className="min-w-full">
                          <TableHeader className="bg-white">
                            <TableRow>
                              <TableHead className="w-1/3">Nombre</TableHead>
                              <TableHead className="hidden sm:table-cell">Duración</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead className="hidden sm:table-cell">Estado</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoria.servicios.map((servicio) => (
                              <TableRow key={servicio.id} className="bg-white hover:bg-gray-50">
                                <TableCell className="font-medium">{servicio.nombre}</TableCell>
                                <TableCell className="hidden sm:table-cell">{servicio.duracion_estimada} min</TableCell>
                                <TableCell>S/ {servicio.precio_base}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <Badge className={servicio.estado ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}>
                                    {servicio.estado ? "Activo" : "Inactivo"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Link href={route('servicios.editar', { servicio: servicio.id })}>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8"
                                      >
                                        <Pencil className="h-3.5 w-3.5 sm:mr-1" />
                                        <span className="hidden sm:inline">Editar</span>
                                      </Button>
                                    </Link>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      className="h-8"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteServicioDialog(servicio, categoria.id);
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                                      <span className="hidden sm:inline">Eliminar</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="py-6 text-center bg-white">
                        <p className="text-gray-500">No hay servicios registrados en esta categoría</p>
                        <Link href={route('servicios.crear')}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Agregar Servicio
                          </Button>
                        </Link>
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