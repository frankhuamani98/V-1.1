import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { PlusCircle, Save, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';

interface CategoriaServicio {
    id?: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    orden: number;
}

interface AgregarCategoriaProps {
    categoria?: CategoriaServicio;
    isEditing?: boolean;
    categorias?: CategoriaServicio[];
}

const AgregarCategoria = ({ categoria, isEditing = false, categorias = [] }: AgregarCategoriaProps) => {
    const [formData, setFormData] = useState<CategoriaServicio>({
        nombre: "",
        descripcion: "",
        estado: true,
        orden: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoriasList, setCategoriasList] = useState<CategoriaServicio[]>(categorias);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (isEditing && categoria) {
            setFormData(categoria);
        }
    }, [isEditing, categoria]);

    useEffect(() => {
        setCategoriasList(categorias);
    }, [categorias]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

        const url = isEditing 
            ? `/servicios/categorias/${formData.id}` 
            : "/servicios/categorias";
        const method = isEditing ? "put" : "post";

        router[method](url, { 
            ...formData,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            estado: formData.estado,
            orden: formData.orden,
            id: formData.id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(isEditing ? "Categoría actualizada" : "Categoría agregada");
                if (!isEditing) {
                    setFormData({
                        nombre: "",
                        descripcion: "",
                        estado: true,
                        orden: 0
                    });
                } else {
                    router.get('/servicios/categorias/crear');
                }
                setIsSubmitting(false);
            },
            onError: (errors) => {
                if (errors.warning) {
                    toast.warning(errors.warning);
                } else {
                    toast.error("Error al procesar la categoría");
                }
                setIsSubmitting(false);
            }
        });
    };

    const handleEdit = (categoria: CategoriaServicio) => {
        router.get(`/servicios/categorias/${categoria.id}/editar`);
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

    const title = isEditing ? "Editar Categoría" : "Agregar Categoría";
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
                                        : "Complete el formulario para agregar una nueva categoría"}
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
                                        placeholder="Nombre de la categoría"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="orden">Orden</Label>
                                    <Input
                                        id="orden"
                                        name="orden"
                                        type="number"
                                        value={formData.orden}
                                        onChange={handleNumberChange}
                                        placeholder="Orden de visualización"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la categoría"
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
                                disabled={isSubmitting}
                                className="flex items-center gap-2"
                            >
                                {buttonIcon}
                                {isSubmitting ? "Procesando..." : buttonText}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                Categorías de Servicios
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Listado de categorías disponibles
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {categoriasList.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <p className="text-gray-600 font-medium">No hay categorías registradas</p>
                            <p className="text-gray-500 text-sm mt-1">Las categorías que agregue aparecerán aquí</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="hidden md:table-cell">Descripción</TableHead>
                                        <TableHead className="hidden sm:table-cell">Orden</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categoriasList.map((cat) => (
                                        <TableRow key={cat.id}>
                                            <TableCell className="font-medium">{cat.nombre}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {cat.descripcion || <span className="text-gray-400">Sin descripción</span>}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">{cat.orden}</TableCell>
                                            <TableCell>
                                                <Badge className={cat.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                    {cat.estado ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => handleEdit(cat)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => openDeleteDialog(cat.id!)}
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
                            ¿Está seguro que desea eliminar esta categoría? Esta acción no se puede deshacer.
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

export default AgregarCategoria;