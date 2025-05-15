import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Star, Tag, DollarSign, Package, Box } from "lucide-react";

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
    precio_final: number;
    descuento: number;
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

const calculateFinalPrice = (price: number, descuento: number): number => {
    const priceWithIgv = price * 1.18;
    return descuento > 0 ? priceWithIgv - (priceWithIgv * descuento / 100) : priceWithIgv;
};

const formatPrice = (price: number): string => {
    return price.toLocaleString("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).replace("PEN", "S/");
};

const InventarioProductos = ({ productos }: InventarioProductosProps) => {
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-8 px-4 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Inventario de Productos</h1>

            {/* Buscador */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-6">
                {filteredProductos.map((producto) => {
                    const mainImageUrl = getImageUrl(producto.imagen_principal);
                    const additionalImages = safeAdditionalImages(producto.imagenes_adicionales);

                    return (
                        <Card
                            key={producto.id}
                            className="flex flex-col md:flex-row items-center p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Imagen Principal y Adicionales */}
                            <div className="w-full md:w-1/3 flex-shrink-0 relative">
                                <div className="relative group">
                                    <img
                                        src={mainImageUrl}
                                        alt={producto.nombre}
                                        className="h-48 w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
                                            (e.target as HTMLImageElement).classList.add("bg-gray-100");
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Carrusel de Imágenes Adicionales */}
                                {additionalImages.length > 0 && (
                                    <div className="mt-4 flex space-x-3 overflow-x-auto">
                                        {additionalImages.map((img, index) => {
                                            const imageUrl = getImageUrl(img.url);
                                            return (
                                                <Popover key={index}>
                                                    <PopoverTrigger asChild>
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Imagen adicional ${index + 1}`}
                                                            className="h-16 w-16 object-cover rounded-lg cursor-pointer border border-gray-300 shadow-sm transition-transform duration-300 hover:scale-110"
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
                                                            className="max-h-96 max-w-full rounded-lg"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Información del Producto */}
                            <div className="w-full md:w-2/3 md:pl-6 mt-6 md:mt-0">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-bold text-gray-800 truncate">{producto.nombre}</h2>
                                    <Badge className={`${getEstadoColor(producto.estado)} text-white px-3 py-1 rounded-full`}>
                                        {producto.estado}
                                    </Badge>
                                </div>
                                {renderStars(producto.calificacion)}
                                <div className="text-sm mt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Código:</span>
                                        <span className="font-medium">{producto.codigo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Precio:</span>
                                        <div className="text-right">
                                            <span className="font-medium text-green-600">{formatPrice(producto.precio_final)}</span>
                                            {producto.precio_final < producto.precio && (
                                                <span className="text-xs text-red-500 line-through ml-2">
                                                    {formatPrice(producto.precio)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {producto.precio_final < producto.precio && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Descuento:</span>
                                            <span className="font-medium text-red-500">-{producto.descuento}%</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Stock:</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{producto.stock} unidades</span>
                                            <Badge className={`${getStockColor(producto.stock)} text-white px-3 py-1 rounded-full`}>
                                                {producto.stock === 0 ? "Agotado" : producto.stock < 5 ? "Poco stock" : "Disponible"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Categoría:</span>
                                        <span className="font-medium">{producto.categoria?.nombre || "Sin categoría"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subcategoría:</span>
                                        <span className="font-medium">{producto.subcategoria?.nombre || "Sin subcategoría"}</span>
                                    </div>
                                </div>

                                {/* Motos Compatibles */}
                                {producto.motos.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-medium text-gray-700 mb-2">Motos Compatibles:</h4>
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
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default InventarioProductos;
