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
        <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-blue-200 via-blue-50 to-blue-100 min-h-[90vh]">
            <Card className="border-0 sm:border shadow-xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md ring-2 ring-blue-200">
                <CardHeader className="px-4 sm:px-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 border-b-2 border-blue-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-3 rounded-full shadow-lg border border-blue-200">
                                {isEditing ? (
                                    <Save className="h-6 w-6 text-blue-800" />
                                ) : (
                                    <PlusCircle className="h-6 w-6 text-blue-700" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight drop-shadow">
                                    {title}
                                </CardTitle>
                                <CardDescription className="text-sm text-blue-700 font-medium">
                                    {isEditing 
                                        ? "Modifique los campos necesarios" 
                                        : "Complete el formulario para agregar una nueva categoría"}
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-8">
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
                                        placeholder="Nombre de la categoría"
                                        required
                                        className="rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="orden" className="font-semibold text-blue-900">Orden</Label>
                                    <Input
                                        id="orden"
                                        name="orden"
                                        type="number"
                                        value={formData.orden === 0 ? "" : formData.orden}
                                        onChange={handleNumberChange}
                                        placeholder="Orden de visualización"
                                        className="rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion" className="font-semibold text-blue-900">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la categoría"
                                    rows={4}
                                    className="rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition shadow-sm bg-blue-50 text-blue-900"
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <Switch
                                    id="estado"
                                    checked={formData.estado}
                                    onCheckedChange={handleSwitchChange}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                                <Label htmlFor="estado" className="font-medium text-blue-900 select-none">
                                    Estado activo
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-400 text-white font-bold shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all duration-200 active:scale-95"
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