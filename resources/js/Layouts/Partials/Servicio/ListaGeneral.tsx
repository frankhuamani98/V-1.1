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
    <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-100 via-white to-indigo-200 min-h-[90vh]">
      <Toaster position="top-center" />
      
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

      <Card className="border-0 sm:border shadow-lg rounded-xl overflow-hidden bg-white/95">
        <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-indigo-200 to-blue-100 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-300 p-3 rounded-xl shadow">
                <ListChecks className="h-7 w-7 text-indigo-700" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Servicios</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1">
                  Gestione las categorías y servicios de su negocio
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href={route('servicios.categorias.crear')} className="w-1/2 sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 px-5 py-2 rounded-xl border-indigo-300 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
                >
                  <Plus className="h-5 w-5" />
                  Nueva Categoría
                </Button>
              </Link>
              <Link href={route('servicios.crear')} className="w-1/2 sm:w-auto">
                <Button 
                  className="w-full flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-blue-600 transition"
                >
                  <Plus className="h-5 w-5" />
                  Nuevo Servicio
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          {categorias.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6 shadow">
                <ListChecks className="h-8 w-8 text-indigo-400" />
              </div>
              <p className="text-indigo-700 font-bold text-lg">No hay categorías de servicios registradas</p>
              <p className="text-gray-500 text-base mt-2">Agregue categorías para comenzar a organizar sus servicios</p>
              <Button 
                className="mt-6 flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-blue-600 transition"
                onClick={() => router.visit(route('servicios.categorias.crear'))}
              >
                <Plus className="h-5 w-5" />
                Agregar Categoría
              </Button>
            </div>
          ) : (
            <div className="space-y-8 p-6">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-indigo-100">
                  <div 
                    className="flex justify-between items-center p-5 bg-gradient-to-r from-indigo-50 to-blue-50 cursor-pointer"
                    onClick={() => toggleCategory(categoria.id)}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-indigo-800 text-lg">{categoria.nombre}</h3>
                      <Badge className={categoria.estado ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}>
                        {categoria.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 md:hidden">
                        {expandedCategories.includes(categoria.id) ? (
                          <ChevronUp className="h-5 w-5 text-indigo-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-indigo-400" />
                        )}
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <Link href={route('servicios.categorias.editar', { categoriaServicio: categoria.id })}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 rounded-lg border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-9 px-4 rounded-lg font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteCategoriaDialog(categoria);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 p-3 md:hidden bg-indigo-50 border-t border-indigo-100">
                    <Link 
                      href={route('servicios.categorias.editar', { categoriaServicio: categoria.id })}
                      className="w-1/2"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full rounded-lg border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-1/2 rounded-lg font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteCategoriaDialog(categoria);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>

                  <div className={`${expandedCategories.includes(categoria.id) ? 'block' : 'hidden md:block'}`}>
                    {categoria.servicios && categoria.servicios.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table className="min-w-full">
                          <TableHeader className="bg-white">
                            <TableRow>
                              <TableHead className="text-indigo-700 font-bold text-base">Nombre</TableHead>
                              <TableHead className="hidden sm:table-cell text-indigo-700 font-bold text-base">Estado</TableHead>
                              <TableHead className="text-indigo-700 font-bold text-base">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoria.servicios.map((servicio) => (
                              <TableRow key={servicio.id} className="bg-white hover:bg-indigo-50 transition">
                                <TableCell className="font-medium text-gray-800">{servicio.nombre}</TableCell>
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
                                        className="h-9 px-4 rounded-lg border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
                                      >
                                        <Pencil className="h-4 w-4 sm:mr-1" />
                                        <span className="hidden sm:inline">Editar</span>
                                      </Button>
                                    </Link>
                                    <Button 
                                      variant="destructive" 
                                      size="sm" 
                                      className="h-9 px-4 rounded-lg font-semibold"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteServicioDialog(servicio, categoria.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 sm:mr-1" />
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
                      <div className="py-8 text-center bg-white">
                        <p className="text-gray-500 text-base">No hay servicios registrados en esta categoría</p>
                        <Link href={route('servicios.crear')}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3 rounded-lg border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
                          >
                            <Plus className="h-4 w-4 mr-1" />
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