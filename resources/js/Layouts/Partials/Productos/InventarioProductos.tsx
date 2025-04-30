import React from "react";
import { Link } from "@inertiajs/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";

interface ImagenAdicional {
    url: string;
    estilo?: string;
}

interface Producto {
    id: number;
    imagen_principal: string | null;
    imagenes_adicionales: string | ImagenAdicional[] | null;
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
        if (!path) return '/images/placeholder-product.png';
        if (isUrl(path)) return path;
        const cleanPath = path.replace(/^\/?storage\/?/, '');
        return `/storage/${cleanPath}`;
    };

    const safeAdditionalImages = (images: any): ImagenAdicional[] => {
        if (!images) return [];
        try {
            const parsed = typeof images === 'string' ? JSON.parse(images) : images;
            if (!Array.isArray(parsed)) return [];
            return parsed
                .map((img: any) => ({
                    ...img,
                    url: img.url || '',
                }))
                .filter((img: any) => img.url);
        } catch (error) {
            console.error('Error al procesar imágenes adicionales:', error);
            return [];
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productos.map((producto) => {
                    const mainImageUrl = getImageUrl(producto.imagen_principal);
                    const additionalImages = safeAdditionalImages(producto.imagenes_adicionales);

                    return (
                        <div key={producto.id} className="border rounded-lg p-4">
                            <div className="flex flex-col items-center space-y-4">
                                {mainImageUrl ? (
                                    <Popover>
                                        <PopoverTrigger>
                                            <img
                                                src={mainImageUrl}
                                                alt="Imagen principal"
                                                className="h-40 w-40 rounded-md object-cover cursor-pointer"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                                                    (e.target as HTMLImageElement).classList.add('bg-gray-100');
                                                }}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <img
                                                src={mainImageUrl}
                                                alt="Imagen principal"
                                                className="max-h-60 max-w-full rounded-md"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <div className="h-40 w-40 rounded-md bg-gray-200 flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Sin imagen principal</span>
                                    </div>
                                )}

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
                                                                (e.target as HTMLImageElement).src = '/images/placeholder-additional.png';
                                                                (e.target as HTMLImageElement).classList.add('bg-gray-100');
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
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InventarioProductos;