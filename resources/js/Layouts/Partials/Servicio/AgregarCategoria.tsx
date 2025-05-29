import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";
import { PlusCircle, Save } from "lucide-react";

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
}

const AgregarCategoria = ({ categoria, isEditing = false }: AgregarCategoriaProps) => {
    const [formData, setFormData] = useState<CategoriaServicio>({
        nombre: "",
        descripcion: "",
        estado: true,
        orden: 0
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing && categoria) {
            setFormData(categoria);
        }
    }, [isEditing, categoria]);

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

        router[method](url, { ...formData }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditing 
                        ? "Categoría actualizada exitosamente" 
                        : "Categoría creada exitosamente"
                );
                if (!isEditing) {
                    setFormData({
                        nombre: "",
                        descripcion: "",
                        estado: true,
                        orden: 0
                    });
                }
                setIsSubmitting(false);
            },
            onError: (errors) => {
                toast.error(
                    isEditing 
                        ? "Error al actualizar la categoría" 
                        : "Error al crear la categoría"
                );
                setIsSubmitting(false);
                console.error(errors);
            }
        });
    };

    const title = isEditing ? "Editar Categoría" : "Agregar Categoría";
    const buttonText = isEditing ? "Actualizar" : "Guardar";
    const buttonIcon = isEditing ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />;

    return (
        <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-100 via-white to-indigo-200 min-h-[90vh]">
            <Card className="border-0 sm:border shadow-lg rounded-xl overflow-hidden bg-white/95">
                <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-indigo-200 to-blue-50 border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-200 p-2 rounded-full shadow">
                                {isEditing ? (
                                    <Save className="h-5 w-5 text-indigo-600" />
                                ) : (
                                    <PlusCircle className="h-5 w-5 text-blue-600" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-indigo-800">
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
                                    <Label htmlFor="nombre" className="font-semibold text-indigo-700">Nombre *</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre de la categoría"
                                        required
                                        className="rounded-lg border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="orden" className="font-semibold text-indigo-700">Orden</Label>
                                    <Input
                                        id="orden"
                                        name="orden"
                                        type="number"
                                        value={formData.orden === 0 ? "" : formData.orden}
                                        onChange={handleNumberChange}
                                        placeholder="Orden de visualización"
                                        className="rounded-lg border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion" className="font-semibold text-indigo-700">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la categoría"
                                    rows={4}
                                    className="rounded-lg border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <Switch
                                    id="estado"
                                    checked={formData.estado}
                                    onCheckedChange={handleSwitchChange}
                                />
                                <Label htmlFor="estado" className="font-medium text-indigo-700 select-none">
                                    Estado activo
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-blue-600 transition"
                            >
                                {buttonIcon}
                                {isSubmitting ? "Procesando..." : buttonText}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Toaster position="top-right" closeButton />
        </div>
    );
};

export default AgregarCategoria;