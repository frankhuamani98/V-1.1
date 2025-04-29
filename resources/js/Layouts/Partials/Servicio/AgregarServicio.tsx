import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";
import { Wrench, Save, Loader2 } from "lucide-react";

interface CategoriaServicio {
    id: number;
    nombre: string;
}

interface Servicio {
    id?: number;
    nombre: string;
    descripcion: string;
    categoria_servicio_id: string;
    estado: boolean;
}

interface AgregarServicioProps {
    servicio?: Servicio;
    isEditing?: boolean;
    categorias: CategoriaServicio[];
}

const AgregarServicio = ({ servicio, isEditing = false, categorias }: AgregarServicioProps) => {
    const [formData, setFormData] = useState<Servicio>({
        nombre: "",
        descripcion: "",
        categoria_servicio_id: "",
        estado: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCategorias, setIsLoadingCategorias] = useState(false);

    useEffect(() => {
        if (isEditing && servicio) {
            setFormData({
                ...servicio,
                categoria_servicio_id: servicio.categoria_servicio_id.toString()
            });
        }
    }, [isEditing, servicio]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({ ...formData, estado: checked });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, categoria_servicio_id: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const url = isEditing 
            ? `/servicios/${formData.id}` 
            : "/servicios";
        const method = isEditing ? "put" : "post";

        const payload = Object.fromEntries(Object.entries(formData));
        router[method](url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditing 
                        ? "Servicio actualizado exitosamente" 
                        : "Servicio creado exitosamente"
                );
                if (!isEditing) {
                    setFormData({
                        nombre: "",
                        descripcion: "",
                        categoria_servicio_id: "",
                        estado: true
                    });
                }
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error(
                    isEditing 
                        ? "Error al actualizar el servicio" 
                        : "Error al crear el servicio"
                );
                setIsSubmitting(false);
                console.error(errors);
            }
        });
    };

    const title = isEditing ? "Editar Servicio" : "Agregar Servicio";
    const buttonText = isEditing ? "Actualizar" : "Guardar";
    const buttonIcon = isEditing ? <Save className="h-4 w-4" /> : <Wrench className="h-4 w-4" />;

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                {isEditing ? (
                                    <Save className="h-5 w-5 text-primary" />
                                ) : (
                                    <Wrench className="h-5 w-5 text-primary" />
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
                    {isLoadingCategorias ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <span className="ml-2 text-gray-600">Cargando categorías...</span>
                        </div>
                    ) : (
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
                                            value={formData.categoria_servicio_id} 
                                            onValueChange={handleSelectChange}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categorias.length === 0 ? (
                                                    <SelectItem value="no-categories" disabled>
                                                        No hay categorías disponibles
                                                    </SelectItem>
                                                ) : (
                                                    categorias.map((categoria) => (
                                                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                            {categoria.nombre}
                                                        </SelectItem>
                                                    ))
                                                )}
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
                                    disabled={isSubmitting || categorias.length === 0}
                                    className="flex items-center gap-2"
                                >
                                    {buttonIcon}
                                    {isSubmitting ? "Procesando..." : buttonText}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
            <Toaster position="top-right" closeButton />
        </div>
    );
};

export default AgregarServicio;