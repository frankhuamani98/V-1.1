import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

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
    incluye_igv?: boolean;
}

interface InventarioProductosProps {
    productos: Producto[];
}

const PLACEHOLDER_PRODUCT = "/images/placeholder.png"; // Cambia a la ruta real de tu placeholder
const PLACEHOLDER_ADDITIONAL = "/images/placeholder-additional.png"; // Cambia a la ruta real de tu placeholder adicional
const PLACEHOLDER_CDN = "https://via.placeholder.com/300x300?text=Sin+Imagen";

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
    const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);

    // Nuevo: Estado para el índice de imagen de cada producto
    const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({});

    const isUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getImageUrl = (path: string | null) => {
        if (!path) return PLACEHOLDER_PRODUCT;
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

    const toggleExpand = (productId: number) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    // Eliminar producto
    const handleEliminar = (id: number) => {
        setProductoAEliminar(id);
        setModalOpen(true);
    };

    const confirmarEliminar = () => {
        if (productoAEliminar !== null) {
            router.delete(`/productos/${productoAEliminar}`, {
                preserveScroll: true,
            });
        }
        setModalOpen(false);
        setProductoAEliminar(null);
    };

    const cancelarEliminar = () => {
        setModalOpen(false);
        setProductoAEliminar(null);
    };

    // Mejor filtro: busca por nombre, código y categoría
    const filteredProductos = productos.filter((producto) => {
        const term = searchTerm.trim().toLowerCase();
        return (
            producto.nombre.toLowerCase().includes(term) ||
            producto.codigo.toLowerCase().includes(term) ||
            (producto.categoria?.nombre?.toLowerCase().includes(term) ?? false) ||
            (producto.subcategoria?.nombre?.toLowerCase().includes(term) ?? false)
        );
    });

    return (
        <div className="container mx-auto py-8 px-4 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Inventario de Productos</h1>

            {/* Buscador */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Buscar productos por nombre, código o categoría..."
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-6">
                {filteredProductos.map((producto) => {
                    const mainImageUrl = getImageUrl(producto.imagen_principal);
                    const additionalImages = safeAdditionalImages(producto.imagenes_adicionales);
                    const allImages = [mainImageUrl, ...additionalImages.map(img => getImageUrl(img.url))];

                    // Usar el índice de imagen global para cada producto
                    const currentImageIndex = imageIndexes[producto.id] ?? 0;
                    const setCurrentImageIndex = (idx: number) => {
                        setImageIndexes(prev => ({ ...prev, [producto.id]: idx }));
                    };
                    const isExpanded = expandedProduct === producto.id;

                    const nextImage = () => {
                        setCurrentImageIndex((currentImageIndex + 1) % allImages.length);
                    };

                    const prevImage = () => {
                        setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length);
                    };

                    return (
                        <Card
                            key={producto.id}
                            className="flex flex-col md:flex-row items-center p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Imagen Principal y Adicionales */}
                            <div className="w-full md:w-1/3 flex-shrink-0 relative">
                                <div className="relative group">
                                    <img
                                        src={allImages[currentImageIndex]}
                                        alt={producto.nombre}
                                        className="h-48 w-full object-contain rounded-lg bg-white transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            if (img.src !== window.location.origin + PLACEHOLDER_PRODUCT && img.src !== PLACEHOLDER_CDN) {
                                                img.src = PLACEHOLDER_PRODUCT;
                                            } else if (img.src !== PLACEHOLDER_CDN) {
                                                img.src = PLACEHOLDER_CDN;
                                            }
                                            img.classList.add("bg-gray-100");
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Controles del Carrusel */}
                                {allImages.length > 1 && (
                                    <div className="flex justify-between mt-2">
                                        <Button
                                            onClick={prevImage}
                                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={nextImage}
                                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                {/* Miniaturas de Imágenes Adicionales */}
                                {additionalImages.length > 0 && (
                                    <div className="mt-4 flex space-x-3 overflow-x-auto">
                                        {additionalImages.map((img, index) => {
                                            const imageUrl = getImageUrl(img.url);
                                            return (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={`Imagen adicional ${index + 1}`}
                                                    className={`h-16 w-16 object-cover rounded-lg cursor-pointer border-2 ${currentImageIndex === index + 1 ? 'border-blue-500' : 'border-transparent'} shadow-sm transition-transform duration-300 hover:scale-110`}
                                                    loading="lazy"
                                                    onClick={() => setCurrentImageIndex(index + 1)}
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        if (img.src !== window.location.origin + PLACEHOLDER_ADDITIONAL && img.src !== PLACEHOLDER_CDN) {
                                                            img.src = PLACEHOLDER_ADDITIONAL;
                                                        } else if (img.src !== PLACEHOLDER_CDN) {
                                                            img.src = PLACEHOLDER_CDN;
                                                        }
                                                        img.classList.add("bg-gray-100");
                                                    }}
                                                />
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

                                {/* Información básica */}
                                <div className="text-sm mt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Código:</span>
                                        <span className="font-medium">{producto.codigo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Precio Final:</span>
                                        <span className="font-medium text-green-600">
                                            {formatPrice(
                                                producto.incluye_igv
                                                    ? producto.precio * 1.18 - (producto.precio * 1.18 * producto.descuento / 100)
                                                    : producto.precio - (producto.precio * producto.descuento / 100)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Stock:</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{producto.stock} unidades</span>
                                            <Badge className={`${getStockColor(producto.stock)} text-white px-3 py-1 rounded-full`}>
                                                {producto.stock === 0 ? "Agotado" : producto.stock < 5 ? "Poco stock" : "Disponible"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Información adicional (oculta inicialmente) */}
                                {isExpanded && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Precio Base:</span>
                                            <span className="font-medium text-gray-700">{formatPrice(producto.precio)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Descuento:</span>
                                            <span className="font-medium text-red-500">-{producto.descuento}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Incluye IGV:</span>
                                            <span className="font-medium text-gray-700">
                                                {producto.incluye_igv ? "Sí" : "No"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Operación:</span>
                                            <span className="font-medium text-gray-700">
                                                {producto.incluye_igv
                                                    ? `${formatPrice(producto.precio)} x 1.18 - (${formatPrice(producto.precio * 1.18)} x ${producto.descuento}%)`
                                                    : `${formatPrice(producto.precio)} - (${formatPrice(producto.precio)} x ${producto.descuento}%)`}
                                            </span>
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
                                )}

                                {/* Motos Compatibles */}
                                {isExpanded && producto.motos.length > 0 && (
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

                                {/* Botón Ver más/Ver menos */}
                                <Button
                                    onClick={() => toggleExpand(producto.id)}
                                    className="mt-4 w-full flex justify-center items-center"
                                    variant="outline"
                                >
                                    {isExpanded ? (
                                        <>
                                            <ChevronUp className="mr-2 h-4 w-4" /> Ver menos
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="mr-2 h-4 w-4" /> Ver más
                                        </>
                                    )}
                                </Button>
                                {/* Botón Eliminar */}
                                <Button
                                    className="mt-2 w-full flex justify-center items-center bg-red-600 hover:bg-red-700 text-white"
                                    variant="destructive"
                                    onClick={() => handleEliminar(producto.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Modal de confirmación */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">¿Eliminar producto?</h2>
                        <p className="mb-6 text-gray-600">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={cancelarEliminar}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmarEliminar}>
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventarioProductos;
