import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

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
  const [servicioToDelete, setServicioToDelete] = useState<{ id: number; categoriaId: number } | null>(null);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState("");
  const [deleteDialogDescription, setDeleteDialogDescription] = useState("");
  const [deleteAction, setDeleteAction] = useState<"categoria" | "servicio">("categoria");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<CategoriaServicio | null>(null);
  const [isEditServicioModalOpen, setIsEditServicioModalOpen] = useState(false);
  const [servicioToEdit, setServicioToEdit] = useState<{ servicio: Servicio; categoriaId: number } | null>(null);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => (prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]));
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
    setServicioToDelete({ id: servicio.id, categoriaId });
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
        setCategorias(categorias.filter((categoria) => categoria.id !== categoriaToDelete));
        toast.success("Categoría eliminada correctamente");
        setCategoriaToDelete(null);
      },
      onError: (errors: any) => {
        const errorMessage = errors.message || "No se pudo eliminar la categoría porque tiene servicios asociados. Elimine primero todos los servicios de esta categoría.";
        toast.error(errorMessage);
      },
    });
  };

  const handleDeleteServicio = () => {
    if (!servicioToDelete) return;

    router.delete(`/servicios/${servicioToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setCategorias(
          categorias.map((categoria) => {
            if (categoria.id === servicioToDelete.categoriaId) {
              return {
                ...categoria,
                servicios: categoria.servicios.filter((servicio) => servicio.id !== servicioToDelete.id),
              };
            }
            return categoria;
          })
        );
        toast.success("Servicio eliminado correctamente");
        setServicioToDelete(null);
      },
      onError: (errors) => {
        if (errors.message) {
          toast.error(errors.message);
        } else {
          toast.error("Error al eliminar el servicio");
        }
      },
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

  const openEditModal = (categoria: CategoriaServicio, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCategoriaToEdit(categoria);
    setIsEditModalOpen(true);
  };

  const handleEditCategoria = () => {
    if (!categoriaToEdit) return;

    router.put(
      `/servicios/categorias/${categoriaToEdit.id}`,
      {
        nombre: categoriaToEdit.nombre,
        descripcion: categoriaToEdit.descripcion,
        estado: categoriaToEdit.estado,
        orden: categoriaToEdit.orden,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setCategorias(
            categorias.map((categoria) => (categoria.id === categoriaToEdit.id ? { ...categoria, ...categoriaToEdit } : categoria))
          );
          toast.success("Categoría actualizada correctamente");
          setIsEditModalOpen(false);
        },
        onError: (errors) => {
          toast.error(errors.message || "Error al actualizar la categoría");
        },
      }
    );
  };

  const openEditServicioModal = (servicio: Servicio, categoriaId: number) => {
    setServicioToEdit({ servicio: { ...servicio }, categoriaId });
    setIsEditServicioModalOpen(true);
  };

  const handleEditServicio = () => {
    if (!servicioToEdit) return;
    const { servicio, categoriaId } = servicioToEdit;
    router.put(
      `/servicios/${servicio.id}`,
      {
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio_base: servicio.precio_base,
        duracion_estimada: servicio.duracion_estimada,
        estado: servicio.estado,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setCategorias(
            categorias.map((categoria) => {
              if (categoria.id === categoriaId) {
                return {
                  ...categoria,
                  servicios: categoria.servicios.map((s) => (s.id === servicio.id ? { ...s, ...servicio } : s)),
                };
              }
              return categoria;
            })
          );
          toast.success("Servicio actualizado correctamente");
          setIsEditServicioModalOpen(false);
        },
        onError: (errors) => {
          toast.error(errors.message || "Error al actualizar el servicio");
        },
      }
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <Toaster position="top-center" />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDialogDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Edita los detalles de la categoría.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={categoriaToEdit?.nombre || ""}
                onChange={(e) => categoriaToEdit && setCategoriaToEdit({ ...categoriaToEdit, nombre: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                value={categoriaToEdit?.descripcion || ""}
                onChange={(e) => categoriaToEdit && setCategoriaToEdit({ ...categoriaToEdit, descripcion: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orden" className="text-right">
                Orden
              </Label>
              <Input
                id="orden"
                type="number"
                value={categoriaToEdit?.orden || 0}
                onChange={(e) => categoriaToEdit && setCategoriaToEdit({ ...categoriaToEdit, orden: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <select
                id="estado"
                value={categoriaToEdit?.estado ? "true" : "false"}
                onChange={(e) => categoriaToEdit && setCategoriaToEdit({ ...categoriaToEdit, estado: e.target.value === "true" })}
                className="col-span-3 p-2 border rounded"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCategoria}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditServicioModalOpen} onOpenChange={setIsEditServicioModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Servicio</DialogTitle>
            <DialogDescription>Edita los detalles del servicio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicio-nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="servicio-nombre"
                value={servicioToEdit?.servicio.nombre || ""}
                onChange={(e) =>
                  servicioToEdit &&
                  setServicioToEdit({
                    ...servicioToEdit,
                    servicio: { ...servicioToEdit.servicio, nombre: e.target.value },
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicio-descripcion" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="servicio-descripcion"
                value={servicioToEdit?.servicio.descripcion || ""}
                onChange={(e) =>
                  servicioToEdit &&
                  setServicioToEdit({
                    ...servicioToEdit,
                    servicio: { ...servicioToEdit.servicio, descripcion: e.target.value },
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicio-precio" className="text-right">
                Precio base
              </Label>
              <Input
                id="servicio-precio"
                type="text"
                value={servicioToEdit?.servicio.precio_base || ""}
                onChange={(e) =>
                  servicioToEdit &&
                  setServicioToEdit({
                    ...servicioToEdit,
                    servicio: { ...servicioToEdit.servicio, precio_base: e.target.value },
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicio-duracion" className="text-right">
                Duración estimada (min)
              </Label>
              <Input
                id="servicio-duracion"
                type="number"
                value={servicioToEdit?.servicio.duracion_estimada || 0}
                onChange={(e) =>
                  servicioToEdit &&
                  setServicioToEdit({
                    ...servicioToEdit,
                    servicio: { ...servicioToEdit.servicio, duracion_estimada: parseInt(e.target.value) },
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="servicio-estado" className="text-right">
                Estado
              </Label>
              <select
                id="servicio-estado"
                value={servicioToEdit?.servicio.estado ? "true" : "false"}
                onChange={(e) =>
                  servicioToEdit &&
                  setServicioToEdit({
                    ...servicioToEdit,
                    servicio: { ...servicioToEdit.servicio, estado: e.target.value === "true" },
                  })
                }
                className="col-span-3 p-2 border rounded"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditServicioModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditServicio}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
        <CardHeader className="px-4 sm:px-6 bg-white border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Servicios</CardTitle>
                <CardDescription className="text-sm text-gray-500">Gestione las categorías y servicios de su negocio</CardDescription>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href={route("servicios.categorias.crear")} className="w-1/2 sm:w-auto">
                <Button variant="outline" className="w-full flex items-center gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nueva Categoría
                </Button>
              </Link>
              <Link href={route("servicios.crear")} className="w-1/2 sm:w-auto">
                <Button className="w-full flex items-center gap-1.5">
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
              <Button className="mt-4 flex items-center gap-1.5" onClick={() => router.visit(route("servicios.categorias.crear"))}>
                <Plus className="h-4 w-4" />
                Agregar Categoría
              </Button>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer" onClick={() => toggleCategory(categoria.id)}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{categoria.nombre}</h3>
                      <Badge className={categoria.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {categoria.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 md:hidden">
                        {expandedCategories.includes(categoria.id) ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8" onClick={(e) => openEditModal(categoria, e)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" className="h-8" onClick={(e) => openDeleteCategoriaDialog(categoria, e)}>
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 p-2 md:hidden bg-gray-50 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="w-1/2" onClick={(e) => openEditModal(categoria, e)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" className="w-1/2" onClick={(e) => openDeleteCategoriaDialog(categoria, e)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Eliminar
                    </Button>
                  </div>

                  <div className={expandedCategories.includes(categoria.id) ? "block" : "hidden md:block"}>
                    {categoria.servicios && categoria.servicios.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table className="min-w-full">
                          <TableHeader className="bg-white">
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead className="hidden sm:table-cell">Estado</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoria.servicios.map((servicio) => (
                              <TableRow key={servicio.id} className="bg-white hover:bg-gray-50">
                                <TableCell className="font-medium">{servicio.nombre}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <Badge className={servicio.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {servicio.estado ? "Activo" : "Inactivo"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8"
                                      onClick={() => openEditServicioModal(servicio, categoria.id)}
                                    >
                                      <Pencil className="h-3.5 w-3.5 sm:mr-1" />
                                      <span className="hidden sm:inline">Editar</span>
                                    </Button>
                                    <Button variant="destructive" size="sm" className="h-8" onClick={(e) => openDeleteServicioDialog(servicio, categoria.id)}>
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
                        <Link href={route("servicios.crear")}>
                          <Button variant="outline" size="sm" className="mt-2">
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
