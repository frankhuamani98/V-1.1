import React from "react";
import { Link } from "@inertiajs/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Star, ShoppingCart, Heart, Eye, Tag, Box, DollarSign, Package } from "lucide-react";

interface ImagenAdicional {
    url: string;
    estilo?: string;
}

interface Categoria {
    nombre: string;
}

interface Subcategoria {
    nombre: string;
}

interface Moto {
    marca: string;
    modelo: string;
    año: number;
}

interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    precio: number;
    stock: number;
    estado: string;
    imagen_principal: string | null;
    imagenes_adicionales: ImagenAdicional[] | null;
    categoria: Categoria;
    subcategoria: Subcategoria;
    motos: Moto[];
    calificacion?: number;
}

interface InventarioProductosProps {
    productos: Producto[];
}

const InventarioProductos = ({ productos }: InventarioProductosProps) => {
    const isUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getImageUrl = (path: string | null) => {
        if (!path) return "/images/placeholder-product.png";
        if (isUrl(path)) return path;
        const cleanPath = path.replace(/^\/?storage\/?/, "");
        return `/storage/${cleanPath}`;
    };

    const safeAdditionalImages = (images: any): ImagenAdicional[] => {
        if (!images) return [];
        try {
            const parsed = typeof images === "string" ? JSON.parse(images) : images;
            if (!Array.isArray(parsed)) return [];
            return parsed
                .map((img: any) => ({
                    ...img,
                    url: img.url || "",
                }))
                .filter((img: any) => img.url);
        } catch (error) {
            console.error("Error al procesar imágenes adicionales:", error);
            return [];
        }
    };

    const getStockColor = (stock: number) => {
        if (stock === 0) return "bg-red-500";
        if (stock < 5) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case "activo":
                return "bg-green-500";
            case "inactivo":
                return "bg-red-500";
            case "en oferta":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const renderStars = (calificacion: number | undefined) => {
        if (calificacion === undefined) return null;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-4 w-4 ${i <= calificacion ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
            );
        }
        return <div className="flex">{stars}</div>;
    };

    return (
        <div className="container mx-auto py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productos.map((producto) => {
                    const mainImageUrl = getImageUrl(producto.imagen_principal);
                    const additionalImages = safeAdditionalImages(producto.imagenes_adicionales);

                    return (
                        <Card key={producto.id} className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-semibold truncate">{producto.nombre}</CardTitle>
                                    <Badge variant="secondary" className={`${getEstadoColor(producto.estado)} text-white`}>
                                        {producto.estado}
                                    </Badge>
                                </div>
                                {renderStars(producto.calificacion)}
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex flex-col space-y-4">
                                    {/* Imagen Principal */}
                                    {mainImageUrl ? (
                                        <Popover>
                                            <PopoverTrigger>
                                                <div className="relative">
                                                    <img
                                                        src={mainImageUrl}
                                                        alt="Imagen principal"
                                                        className="h-48 w-full rounded-md object-cover cursor-pointer"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
                                                            (e.target as HTMLImageElement).classList.add("bg-gray-100");
                                                        }}
                                                    />
                                                    <div className="absolute top-2 right-2 flex space-x-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Heart className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <img
                                                    src={mainImageUrl}
                                                    alt="Imagen principal"
                                                    className="max-h-96 max-w-full rounded-md"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <div className="h-48 w-full rounded-md bg-gray-200 flex items-center justify-center">
                                            <span className="text-sm text-gray-500">Sin imagen principal</span>
                                        </div>
                                    )}

                                    {/* Imágenes Adicionales */}
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {additionalImages.length > 0 ? (
                                            additionalImages.map((img, index) => {
                                                const imageUrl = getImageUrl(img.url);
                                                return imageUrl ? (
                                                    <Popover key={index}>
                                                        <PopoverTrigger>
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Imagen adicional ${index + 1}`}
                                                                className="h-16 w-16 object-cover rounded-md cursor-pointer"
                                                                loading="lazy"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "/images/placeholder-additional.png";
                                                                    (e.target as HTMLImageElement).classList.add("bg-gray-100");
                                                                }}
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Imagen adicional ${index + 1}`}
                                                                className="max-h-60 max-w-full rounded-md"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : null;
                                            })
                                        ) : (
                                            <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                                                <span className="text-xs text-gray-500">Sin adicionales</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del Producto */}
                                    <div className="text-sm space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center">
                                                <Tag className="h-4 w-4 mr-1" /> Código:
                                            </span>
                                            <span className="font-medium">{producto.codigo}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center">
                                                <DollarSign className="h-4 w-4 mr-1" /> Precio:
                                            </span>
                                            <span className="font-medium text-green-600">S/ {producto.precio.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center">
                                                <Package className="h-4 w-4 mr-1" /> Stock:
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{producto.stock} unidades</span>
                                                <Badge className={`${getStockColor(producto.stock)} text-white`}>
                                                    {producto.stock === 0 ? "Agotado" : producto.stock < 5 ? "Poco stock" : "Disponible"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center">
                                                <Box className="h-4 w-4 mr-1" /> Categoría:
                                            </span>
                                            <span className="font-medium">{producto.categoria?.nombre || "Sin categoría"}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center">
                                                <Box className="h-4 w-4 mr-1" /> Subcategoría:
                                            </span>
                                            <span className="font-medium">{producto.subcategoria?.nombre || "Sin subcategoría"}</span>
                                        </div>
                                    </div>

                                    {/* Motos Compatibles */}
                                    {producto.motos.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                                <Box className="h-4 w-4 mr-1" /> Motos Compatibles:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {producto.motos.map((moto, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {moto.marca} {moto.modelo} ({moto.año})
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                                <Button asChild variant="outline" className="w-full sm:w-auto">
                                    <Link href={`/dashboard/productos/detalle/${producto.id}`} className="flex items-center justify-center">
                                        Ver Detalle
                                    </Link>
                                </Button>
                                <Button asChild className="w-full sm:w-auto">
                                    <Link href={`/dashboard/productos/editar/${producto.id}`}>
                                        Editar Producto
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default InventarioProductos;
