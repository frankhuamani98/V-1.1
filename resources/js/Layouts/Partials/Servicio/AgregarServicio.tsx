import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { 
    PlusCircle, 
    Save, 
    Pencil, 
    Trash2, 
    AlertCircle, 
    Search, 
    Filter, 
    X, 
    ChevronRight, 
    Tag
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface CategoriaServicio {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
}

interface Servicio {
    id?: number;
    nombre: string;
    descripcion: string;
    categoria_servicio_id: number;
    estado: boolean;
}

interface AgregarServicioProps {
    servicio?: Servicio;
    isEditing?: boolean;
    categorias: CategoriaServicio[];
    servicios?: Servicio[];
}

const AgregarServicio = ({ servicio, isEditing = false, categorias, servicios = [] }: AgregarServicioProps) => {
    const [formData, setFormData] = useState<Servicio>({
        nombre: "",
        descripcion: "",
        categoria_servicio_id: 0,
        estado: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serviciosList, setServiciosList] = useState<Servicio[]>(servicios);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [servicioToDelete, setServicioToDelete] = useState<number | null>(null);
    const [categoriaError, setCategoriaError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState("todos");
    const [filterCategoria, setFilterCategoria] = useState("todos");
    const [descripcionDialogOpen, setDescripcionDialogOpen] = useState(false);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
    const [serviciosActivos, setServiciosActivos] = useState(0);
    const [serviciosInactivos, setServiciosInactivos] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [isEditingLocal, setIsEditingLocal] = useState(false);

    useEffect(() => {
        if (isEditing && servicio) {
            setFormData(servicio);
            setShowForm(true);
            setIsEditingLocal(true);
        }
    }, [isEditing, servicio]);

    useEffect(() => {
        setServiciosList(servicios);
    }, [servicios]);

    useEffect(() => {
        if (serviciosList) {
            setServiciosActivos(serviciosList.filter(s => s.estado).length);
            setServiciosInactivos(serviciosList.filter(s => !s.estado).length);
        }
    }, [serviciosList]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({ ...formData, estado: checked });
    };

    const handleCategoriaChange = (value: string) => {
        setFormData({ ...formData, categoria_servicio_id: parseInt(value) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCategoriaError("");

        const existe = serviciosList.some(s =>
            s.nombre.trim().toLowerCase() === formData.nombre.trim().toLowerCase() &&
            s.categoria_servicio_id === formData.categoria_servicio_id &&
            (!isEditing || s.id !== formData.id)
        );

        if (existe) {
            setCategoriaError("Ya existe un servicio con ese nombre en esta categoría.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        const url = isEditing 
            ? `/servicios/${formData.id}` 
            : "/servicios";
        const method = isEditing ? "put" : "post";

        router[method](url, { ...formData }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(isEditing ? "Servicio actualizado" : "Servicio agregado");
                if (!isEditing) {
                    setFormData({
                        nombre: "",
                        descripcion: "",
                        categoria_servicio_id: 0,
                        estado: true
                    });
                    setShowForm(false);
                }
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error("Error al procesar el servicio");
                setIsSubmitting(false);
            }
        });
    };

    const handleEdit = (servicio: Servicio) => {
        setFormData(servicio);
        setShowForm(true);
        setIsEditingLocal(true);
    };

    const openDeleteDialog = (id: number) => {
        setServicioToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (servicioToDelete) {
            router.delete(`/servicios/${servicioToDelete}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Servicio eliminado");
                    setServiciosList(serviciosList.filter(serv => serv.id !== servicioToDelete));
                    setDeleteDialogOpen(false);
                    setServicioToDelete(null);
                },
                onError: () => {
                    toast.error("Error al eliminar el servicio");
                    setDeleteDialogOpen(false);
                }
            });
        }
    };

    const getCategoriaName = (id: number) => {
        const categoria = categorias.find(cat => cat.id === id);
        return categoria ? categoria.nombre : "Categoría no encontrada";
    };

    const title = isEditing ? "Editar Servicio" : "Agregar Servicio";
    const buttonText = isEditing ? "Actualizar" : "Guardar";
    const buttonIcon = isEditing ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />;

    const filteredServicios = serviciosList.filter(serv => {
        const matchesSearch = serv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            serv.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = filterEstado === "todos" || 
            (filterEstado === "activo" && serv.estado) || 
            (filterEstado === "inactivo" && !serv.estado);
        const matchesCategoria = filterCategoria === "todos" || 
            serv.categoria_servicio_id.toString() === filterCategoria;
        
        return matchesSearch && matchesEstado && matchesCategoria;
    });

    const totalPages = Math.ceil(filteredServicios.length / itemsPerPage);
    const paginatedServicios = filteredServicios.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
                <p className="text-gray-500 text-base mt-1">
                    Aquí puedes agregar, editar, buscar y eliminar los servicios de tu negocio.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Servicios</p>
                            <p className="text-lg font-bold text-gray-900">{serviciosList.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Tag className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Servicios Activos</p>
                            <p className="text-lg font-bold text-emerald-600">{serviciosActivos}</p>
                        </div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <div className="h-6 w-6 bg-emerald-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Servicios Inactivos</p>
                            <p className="text-lg font-bold text-red-600">{serviciosInactivos}</p>
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
                                    setFormData({
                                        nombre: "",
                                        descripcion: "",
                                        categoria_servicio_id: 0,
                                        estado: true
                                    });
                                    setShowForm(false);
                                    setIsEditingLocal(false);
                                } else {
                                    setFormData({
                                        nombre: "",
                                        descripcion: "",
                                        categoria_servicio_id: 0,
                                        estado: true
                                    });
                                    setShowForm(true);
                                    setIsEditingLocal(false);
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
                                    Nuevo Servicio
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full lg:flex-1 gap-3 order-first lg:order-last">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar servicios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200"
                            />
                        </div>
                        
                        <div className="w-full sm:w-[180px]">
                            <Select value={filterEstado} onValueChange={setFilterEstado}>
                                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200">
                                    <div className="flex items-center gap-3">
                                        <Filter className="h-5 w-5 text-gray-400" />
                                        <SelectValue placeholder="Estado" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    <SelectItem value="activo">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span>Activos</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inactivo">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span>Inactivos</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-[220px]">
                            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200">
                                    <SelectValue placeholder="Filtrar por categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todas las categorías</SelectItem>
                                    {categorias.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showForm} onOpenChange={(open) => {
                setShowForm(open);
                if (!open) setCategoriaError("");
            }}>
                <DialogContent className="max-w-xl p-0 rounded-3xl shadow-2xl bg-white/95 border-0 transition-all duration-300">
                    <Card className="border-0 shadow-none rounded-3xl">
                        <CardHeader className="px-4 sm:px-6 bg-white/95 border-b border-blue-50 rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {isEditingLocal ? (
                                        <Save className="h-5 w-5 text-primary" />
                                    ) : (
                                        <PlusCircle className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                        {isEditingLocal ? "Editar Servicio" : "Nuevo Servicio"}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        {isEditingLocal 
                                            ? "Modifique los campos necesarios" 
                                            : "Complete el formulario para agregar un nuevo servicio"}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 bg-white/50">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                                            Nombre del servicio *
                                        </Label>
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ej: Cambio de aceite"
                                            className="h-11 rounded-lg border-gray-200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="categoria_servicio_id" className="text-sm font-medium text-gray-700">
                                            Categoría *
                                        </Label>
                                        <Select
                                            value={formData.categoria_servicio_id.toString()}
                                            onValueChange={handleCategoriaChange}
                                        >
                                            <SelectTrigger className="h-11 rounded-lg border-gray-200">
                                                <SelectValue placeholder="Seleccione una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categorias.map((categoria) => (
                                                    <SelectItem 
                                                        key={categoria.id} 
                                                        value={categoria.id.toString()}
                                                        disabled={!categoria.estado}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className={`h-2 w-2 rounded-full ${categoria.estado ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                                        {categoria.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {categoriaError && (
                                            <p className="text-sm text-red-600 mt-1">{categoriaError}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                                        Descripción
                                    </Label>
                                    <Textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Describa los detalles del servicio..."
                                        className="min-h-[120px] rounded-lg border-gray-200 resize-none"
                                        rows={4}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="estado"
                                            checked={formData.estado}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                        <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                                            Servicio activo
                                        </Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowForm(false);
                                                setCategoriaError("");
                                                setIsEditingLocal(false);
                                            }}
                                            className="rounded-xl"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting || formData.categoria_servicio_id === 0}
                                            className="flex items-center gap-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                                    Procesando...
                                                </>
                                            ) : isEditingLocal ? (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Guardar cambios
                                                </>
                                            ) : (
                                                <>
                                                    <PlusCircle className="h-4 w-4" />
                                                    Crear servicio
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>

            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                Servicios
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                {filteredServicios.length} servicios encontrados
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    {paginatedServicios.length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios</h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm || filterEstado !== "todos" || filterCategoria !== "todos"
                                    ? "No se encontraron servicios con los filtros aplicados"
                                    : "Comienza agregando tu primer servicio"
                                }
                            </p>
                            {!showForm && (!searchTerm && filterEstado === "todos" && filterCategoria === "todos") && (
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    Agregar Servicio
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {paginatedServicios.map((serv) => (
                                <div 
                                    key={serv.id} 
                                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200/50 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <Tag className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                                                    serv.estado 
                                                    ? 'bg-emerald-500' 
                                                    : 'bg-red-500'
                                                }`}>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col gap-1 mb-3">
                                                    <Badge 
                                                        variant="outline"
                                                        className="w-fit px-3 py-1 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 transition-colors"
                                                    >
                                                        Categoría: {getCategoriaName(serv.categoria_servicio_id)}
                                                    </Badge>
                                                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                                                        {serv.nombre}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`text-xs font-medium ${
                                                        serv.estado 
                                                        ? 'text-emerald-700' 
                                                        : 'text-red-700'
                                                    }`}>
                                                        {serv.estado ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                                {serv.descripcion && (
                                                    <p className="text-sm text-gray-500 line-clamp-2">
                                                        {serv.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(serv)}
                                                className="flex-1 h-9"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDeleteDialog(serv.id!)}
                                                className="flex-1 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar
                                            </Button>
                                        </div>

                                        {serv.descripcion && serv.descripcion.length > 100 && (
                                            <Button
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => {
                                                    setServicioSeleccionado(serv);
                                                    setDescripcionDialogOpen(true);
                                                }}
                                                className="w-full mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50"
                                            >
                                                Ver descripción completa
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="border-t border-gray-100 px-6 py-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredServicios.length)} de {filteredServicios.length} servicios
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-9 w-9 p-0 rounded-lg border-gray-200"
                                        >
                                            <ChevronRight className="h-4 w-4 rotate-180" />
                                        </Button>
                                        <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                            {currentPage} de {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage + 1)}
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
                    )}
                </CardContent>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Confirmar eliminación
                        </DialogTitle>
                        <DialogDescription>
                            ¿Está seguro que desea eliminar este servicio? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={descripcionDialogOpen} onOpenChange={setDescripcionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{servicioSeleccionado?.nombre}</DialogTitle>
                        <DialogDescription>
                            <span className="text-blue-600 font-medium">
                                {servicioSeleccionado && getCategoriaName(servicioSeleccionado.categoria_servicio_id)}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 text-gray-600 whitespace-pre-wrap">
                        {servicioSeleccionado?.descripcion}
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="secondary" 
                            onClick={() => setDescripcionDialogOpen(false)}
                        >
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AgregarServicio;