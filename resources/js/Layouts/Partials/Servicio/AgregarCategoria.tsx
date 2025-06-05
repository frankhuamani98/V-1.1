import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { PlusCircle, Save, Pencil, Trash2, AlertCircle, Tag, Search, Filter, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

interface CategoriaServicio {
    id?: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    orden: number;
}

interface AgregarCategoriaProps {
    categoria?: CategoriaServicio;
    isEditing: boolean;
    categorias?: CategoriaServicio[];
}

const AgregarCategoria = ({ categoria, isEditing, categorias = [] }: AgregarCategoriaProps) => {
    const [formData, setFormData] = useState<CategoriaServicio>({
        nombre: "",
        descripcion: "",
        estado: true,
        orden: 0
    });

    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoriasList, setCategoriasList] = useState<CategoriaServicio[]>(categorias);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState("todos");
    const [descripcionDialogOpen, setDescripcionDialogOpen] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaServicio | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [editingCategoriaId, setEditingCategoriaId] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && categoria) {
            setFormData(categoria);
            setEditingCategoriaId(categoria.id!);
            setShowForm(true);
        } else {
            setFormData({
                nombre: "",
                descripcion: "",
                estado: true,
                orden: 0
            });
            setEditingCategoriaId(null);
            setShowForm(false);
        }
    }, [categoria, isEditing]);

    const handleVerDescripcion = (categoria: CategoriaServicio) => {
        setCategoriaSeleccionada(categoria);
        setDescripcionDialogOpen(true);
    };

    useEffect(() => {
        setCategoriasList(categorias);
    }, [categorias]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({ ...formData, estado: checked });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: parseInt(value) || 0 });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});

        const url = editingCategoriaId
            ? `/servicios/categorias/${editingCategoriaId}`
            : "/servicios/categorias";
        const method = editingCategoriaId ? "put" : "post";

        router[method](url, {
            ...formData,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            estado: formData.estado,
            orden: formData.orden,
            id: editingCategoriaId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(editingCategoriaId ? "Categoría actualizada" : "Categoría agregada");
                setFormData({
                    nombre: "",
                    descripcion: "",
                    estado: true,
                    orden: 0
                });
                setShowForm(false);
                setEditingCategoriaId(null);
                setIsSubmitting(false);
                setFormErrors({});
                router.reload({ only: ['categorias'] });
            },
            onError: (errors) => {
                if (errors.nombre) {
                    let mensaje = errors.nombre;
                    if (
                        mensaje.toLowerCase().includes('already exists') ||
                        mensaje.toLowerCase().includes('ya existe') ||
                        mensaje.toLowerCase().includes('has already been taken')
                    ) {
                        mensaje = 'Ya existe una categoría con ese nombre.';
                    }
                    setFormErrors({ nombre: mensaje });
                } else if (errors.warning) {
                    toast.warning(errors.warning);
                } else {
                    toast.error("Error al procesar la categoría");
                }
                setIsSubmitting(false);
            }
        });
    };

    const handleEdit = (catToEdit: CategoriaServicio) => {
        setFormData(catToEdit);
        setEditingCategoriaId(catToEdit.id!);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({
            nombre: "",
            descripcion: "",
            estado: true,
            orden: 0
        });
        setEditingCategoriaId(null);
        setFormErrors({});
    };

    const openDeleteDialog = (id: number) => {
        setCategoriaToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (categoriaToDelete) {
            router.delete(`/servicios/categorias/${categoriaToDelete}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Categoría eliminada");
                    setCategoriasList(categoriasList.filter(cat => cat.id !== categoriaToDelete));
                    setDeleteDialogOpen(false);
                    setCategoriaToDelete(null);
                },
                onError: (errors) => {
                    toast.error(errors.message || "Error al eliminar la categoría");
                    setDeleteDialogOpen(false);
                }
            });
        }
    };

    const filteredCategorias = categoriasList.filter(cat => {
        const matchesSearch = cat.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterEstado === "todos" || 
            (filterEstado === "activo" && cat.estado) || 
            (filterEstado === "inactivo" && !cat.estado);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);
    const paginatedCategorias = filteredCategorias.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const categoriasActivas = categoriasList.filter(cat => cat.estado).length;
    const categoriasInactivas = categoriasList.filter(cat => !cat.estado).length;

    return (
        <div className="space-y-6 p-6">
            <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
            <p className="text-gray-500 mt-1">Administra las categorías de servicios disponibles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Categorías</p>
                            <p className="text-lg font-bold text-gray-900">{categoriasList.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Tag className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Activas</p>
                            <p className="text-lg font-bold text-emerald-600">{categoriasActivas}</p>
                        </div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <div className="h-6 w-6 bg-emerald-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Inactivas</p>
                            <p className="text-lg font-bold text-red-600">{categoriasInactivas}</p>
                        </div>
                        <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center">
                            <div className="h-6 w-6 bg-red-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-3 mb-6">
                    <div className="w-full lg:w-auto lg:min-w-[180px] order-last lg:order-first">
                        <Button
                            onClick={() => {
                                if (showForm) {
                                    handleCancel();
                                } else {
                                    setFormData({
                                        nombre: "",
                                        descripcion: "",
                                        estado: true,
                                        orden: 0
                                    });
                                    setEditingCategoriaId(null);
                                    setShowForm(true);
                                }
                            }}
                            className={`
                                w-full h-12 px-6 rounded-xl font-medium transition-all duration-200
                                ${showForm 
                                    ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/25"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                                }
                            `}
                        >
                            {showForm ? (
                                <>
                                    <X className="h-5 w-5 mr-2" />
                                    Cancelar
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-5 w-5 mr-2" />
                                    Nueva Categoría
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full lg:flex-1 gap-3 order-first lg:order-last">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200"
                            />
                        </div>
                        
                        <div className="w-full sm:w-[220px]">
                            <Select value={filterEstado} onValueChange={setFilterEstado}>
                                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200">
                                    <div className="flex items-center gap-3">
                                        <Filter className="h-5 w-5 text-gray-400" />
                                        <SelectValue placeholder="Filtrar por estado" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                                    <SelectItem value="todos" className="rounded-lg">
                                        <span className="font-medium">Todos los estados</span>
                                    </SelectItem>
                                    <SelectItem value="activo" className="rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span>Activos</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inactivo" className="rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span>Inactivos</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Dialog open={showForm} onOpenChange={setShowForm}>
                    <DialogContent className="max-w-xl p-0 rounded-3xl shadow-2xl bg-white/95 border-0 transition-all duration-300">
                        {/* Añadido para accesibilidad */}
                        <DialogHeader>
                            <DialogTitle className="sr-only">
                                {editingCategoriaId ? "Editar Categoría" : "Nueva Categoría"}
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                {editingCategoriaId
                                    ? "Modifique los campos necesarios"
                                    : "Complete el formulario para agregar una nueva categoría"}
                            </DialogDescription>
                        </DialogHeader>
                        {/* Fin añadido */}
                        <Card className="border-0 shadow-none rounded-3xl" ref={formRef}>
                            <CardHeader className="px-4 sm:px-6 bg-white/95 border-b border-blue-50 rounded-t-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        {editingCategoriaId ? (
                                            <Save className="h-5 w-5 text-primary" />
                                        ) : (
                                            <PlusCircle className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                            {editingCategoriaId ? "Editar Categoría" : "Nueva Categoría"}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-500">
                                            {editingCategoriaId ? "Modifique los campos necesarios" : "Complete el formulario para agregar una nueva categoría"}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre" className="text-gray-700">Nombre *</Label>
                                            <Input
                                                id="nombre"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Nombre de la categoría"
                                                className="h-11 rounded-lg border-gray-200"
                                                required
                                            />
                                            {formErrors.nombre && (
                                                <p className="text-red-600 text-xs mt-1">{formErrors.nombre}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="orden" className="text-gray-700">Orden</Label>
                                            <Input
                                                id="orden"
                                                name="orden"
                                                type="number"
                                                value={formData.orden}
                                                onChange={handleNumberChange}
                                                placeholder="Orden de visualización"
                                                className="h-11 rounded-lg border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="descripcion" className="text-gray-700">Descripción</Label>
                                        <Textarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            placeholder="Descripción de la categoría"
                                            className="rounded-lg border-gray-200 resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="estado"
                                            checked={formData.estado}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                        <Label htmlFor="estado" className="text-gray-700">Estado activo</Label>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 disabled:opacity-50 order-last sm:order-first"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            ) : editingCategoriaId ? (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Actualizar Categoría
                                                </>
                                            ) : (
                                                <>
                                                    <PlusCircle className="h-4 w-4 mr-2" />
                                                    Crear Categoría
                                                </>
                                            )}
                                        </Button>
                                        
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium border-gray-200 hover:bg-gray-50 transition-all duration-200 order-first sm:order-last"
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                {paginatedCategorias.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Lista de Categorías</h3>
                            <p className="text-sm text-gray-500">Mostrando {paginatedCategorias.length} categorías</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedCategorias.map((cat) => (
                                <div 
                                    key={cat.id}
                                    className="group bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-5 hover:shadow-lg border border-gray-100 hover:border-blue-200/50 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <Tag className="h-6 w-6 text-blue-600" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                        {cat.nombre}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <ChevronRight className="h-3.5 w-3.5" />
                                                            Orden: {cat.orden}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge 
                                                    className={`
                                                        px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 
                                                        ${cat.estado
                                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                            : "bg-red-100 text-red-700 border border-red-200"
                                                        }
                                                    `}
                                                >
                                                    {cat.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </div>

                                            <div className="mb-8">
                                                <div className="relative">
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {cat.descripcion || "Sin descripción"}
                                                    </p>
                                                    {cat.descripcion && cat.descripcion.length > 100 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute -bottom-6 left-0 h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleVerDescripcion(cat)}
                                                        >
                                                            Ver más...
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2 border-t border-gray-100">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(cat)}
                                                    className="flex-1 h-9 rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(cat.id!)}
                                                    className="flex-1 h-9 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="border-t border-gray-100 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredCategorias.length)} de {filteredCategorias.length} categorías
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-9 w-9 p-0 rounded-lg border-gray-200"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                            {currentPage} de {totalPages}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="h-9 w-9 p-0 rounded-lg border-gray-200"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm || filterEstado !== "todos"
                                ? "No se encontraron categorías con los filtros aplicados"
                                : "Comienza creando tu primera categoría"
                            }
                        </p>
                        {!showForm && (!searchTerm && filterEstado === "todos") && (
                            <Button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Crear Primera Categoría
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="rounded-2xl p-6 shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-red-500" />
                            ¿Eliminar categoría?
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            Esta acción no se puede deshacer. Se eliminará permanentemente la categoría
                            y todos sus datos asociados.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="rounded-xl px-6 py-2.5 border-gray-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="rounded-xl px-6 py-2.5 bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={descripcionDialogOpen} onOpenChange={setDescripcionDialogOpen}>
                <DialogContent className="rounded-2xl p-6 shadow-lg max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Tag className="h-6 w-6 text-blue-600" />
                            {categoriaSeleccionada?.nombre}
                        </DialogTitle>
                        <DialogDescription className="mt-4">
                            <div className="prose prose-gray prose-sm max-w-none">
                                <p className="whitespace-pre-wrap text-gray-600">
                                    {categoriaSeleccionada?.descripcion || "Sin descripción"}
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDescripcionDialogOpen(false)}
                            className="rounded-xl px-6 py-2.5 border-gray-200"
                        >
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgregarCategoria;