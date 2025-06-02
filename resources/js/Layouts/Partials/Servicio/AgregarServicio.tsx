import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { PlusCircle, Save, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
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

    useEffect(() => {
        if (isEditing && servicio) {
            setFormData(servicio);
        }
    }, [isEditing, servicio]);

    useEffect(() => {
        setServiciosList(servicios);
    }, [servicios]);

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
                        categoria_servicio_id: formData.categoria_servicio_id,
                        estado: true
                    });
                } else {
                    router.get('/servicios/crear');
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
        router.get(`/servicios/${servicio.id}/editar`);
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

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-6">
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                {isEditing ? (
                                    <Save className="h-5 w-5 text-primary" />
                                ) : (
                                    <PlusCircle className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                    {title}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    {isEditing 
                                        ? "Modifique los campos necesarios" 
                                        : "Complete el formulario para agregar un nuevo servicio"}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre *</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre del servicio"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoria_servicio_id">Categoría *</Label>
                                    <Select
                                        value={formData.categoria_servicio_id.toString()}
                                        onValueChange={handleCategoriaChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias.map((categoria) => (
                                                <SelectItem 
                                                    key={categoria.id} 
                                                    value={categoria.id.toString()}
                                                    disabled={!categoria.estado}
                                                >
                                                    {categoria.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción del servicio"
                                    rows={4}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="estado"
                                    checked={formData.estado}
                                    onCheckedChange={handleSwitchChange}
                                />
                                <Label htmlFor="estado">Estado activo</Label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting || formData.categoria_servicio_id === 0}
                                className="flex items-center gap-2"
                            >
                                {buttonIcon}
                                {isSubmitting ? "Procesando..." : buttonText}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de Servicios */}
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                Servicios
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Listado de servicios disponibles
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {serviciosList.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <p className="text-gray-600 font-medium">No hay servicios registrados</p>
                            <p className="text-gray-500 text-sm mt-1">Los servicios que agregue aparecerán aquí</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="hidden md:table-cell">Descripción</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {serviciosList.map((serv) => (
                                        <TableRow key={serv.id}>
                                            <TableCell className="font-medium">{serv.nombre}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {serv.descripcion || <span className="text-gray-400">Sin descripción</span>}
                                            </TableCell>
                                            <TableCell>{getCategoriaName(serv.categoria_servicio_id)}</TableCell>
                                            <TableCell>
                                                <Badge className={serv.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                    {serv.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => handleEdit(serv)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => openDeleteDialog(serv.id!)}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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
        </div>
    );
};

export default AgregarServicio;