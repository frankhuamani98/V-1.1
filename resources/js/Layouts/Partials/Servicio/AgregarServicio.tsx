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
        <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-200 via-blue-50 to-blue-100 min-h-[90vh]">
            <Card className="border-0 sm:border shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md ring-2 ring-blue-300">
                <CardHeader className="px-4 sm:px-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 border-b-2 border-blue-400">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-300 to-blue-500 p-3 rounded-full shadow-lg border border-blue-300">
                                {isEditing ? (
                                    <Save className="h-6 w-6 text-blue-800" />
                                ) : (
                                    <Wrench className="h-6 w-6 text-blue-700" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight drop-shadow">
                                    {title}
                                </CardTitle>
                                <CardDescription className="text-sm text-blue-700 font-medium">
                                    {isEditing 
                                        ? "Modifique los campos necesarios" 
                                        : "Complete el formulario para agregar un nuevo servicio"}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-8">
                    {isLoadingCategorias ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            <span className="ml-2 text-blue-800 font-semibold">Cargando categorías...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre" className="font-semibold text-blue-900">Nombre *</Label>
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Nombre del servicio"
                                            required
                                            className="rounded-xl border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="categoria_servicio_id" className="font-semibold text-blue-900">Categoría *</Label>
                                        <Select 
                                            value={formData.categoria_servicio_id} 
                                            onValueChange={handleSelectChange}
                                            required
                                        >
                                            <SelectTrigger className="rounded-xl border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition shadow-sm">
                                                <SelectValue placeholder="Seleccionar categoría" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl shadow-lg border-blue-200 bg-blue-50">
                                                {categorias.length === 0 ? (
                                                    <SelectItem value="no-categories" disabled>
                                                        No hay categorías disponibles
                                                    </SelectItem>
                                                ) : (
                                                    categorias.map((categoria) => (
                                                        <SelectItem key={categoria.id} value={categoria.id.toString()} className="text-blue-900">
                                                            {categoria.nombre}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descripcion" className="font-semibold text-blue-900">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Descripción del servicio"
                                        rows={4}
                                        className="rounded-xl border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition shadow-sm bg-blue-50 text-blue-900"
                                    />
                                </div>

                                <div className="flex items-center gap-3 mt-2">
                                    <Switch
                                        id="estado"
                                        checked={formData.estado}
                                        onCheckedChange={handleSwitchChange}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                    <Label htmlFor="estado" className="font-medium text-blue-900 select-none">Estado activo</Label>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting || categorias.length === 0}
                                    className="flex items-center gap-2 px-8 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all duration-200 active:scale-95"
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