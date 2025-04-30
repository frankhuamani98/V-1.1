import React from "react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";

interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    precio: number;
    stock: number;
    estado: string;
    imagen_principal: string | null;
    imagenes_adicionales: Array<{
        url: string;
        estilo?: string;
    }> | null;
    categoria: {
        nombre: string;
    };
    subcategoria: {
        nombre: string;
    };
    motos: Array<{
        marca: string;
        modelo: string;
        año: number;
    }>;
}

interface InventarioProductosProps {
    productos: Producto[];
}

const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
};

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
        if (!path) return null;
        if (isUrl(path)) return path;
        return `/storage/${path}`;
    };

    const safeAdditionalImages = (images: any): Array<{url: string, estilo?: string}> => {
        if (!images) return [];
        if (Array.isArray(images)) return images;
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Inventario de Productos</CardTitle>
                        <CardDescription>Lista completa de productos registrados</CardDescription>
                    </div>
                    <Link href={route('productos.agregar')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Lista de productos registrados en el sistema</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Imágenes</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Motos</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productos.map((producto) => {
                                const mainImageUrl = getImageUrl(producto.imagen_principal);
                                const additionalImages = safeAdditionalImages(producto.imagenes_adicionales);
                                
                                return (
                                    <TableRow key={producto.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {mainImageUrl ? (
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <img 
                                                                src={mainImageUrl} 
                                                                alt={producto.nombre}
                                                                className="h-10 w-10 rounded-md object-cover cursor-pointer"
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <img 
                                                                src={mainImageUrl} 
                                                                alt={producto.nombre}
                                                                className="max-h-60 max-w-full rounded-md"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">Sin imagen</span>
                                                    </div>
                                                )}
                                                
                                                {additionalImages.length > 0 && (
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <div className="relative">
                                                                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 cursor-pointer">
                                                                    <span className="text-xs">+{additionalImages.length}</span>
                                                                </div>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-2 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                                            {additionalImages.map((img, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={isUrl(img.url) ? img.url : `/storage/${img.url}`}
                                                                    alt={`${producto.nombre} adicional ${index + 1}`}
                                                                    className="h-20 w-20 object-cover rounded-md"
                                                                />
                                                            ))}
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{producto.codigo}</TableCell>
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{producto.categoria.nombre}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {producto.subcategoria.nombre}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>S/. {formatPrice(producto.precio)}</TableCell>
                                        <TableCell>
                                            <Badge variant={producto.stock > 0 ? "default" : "destructive"}>
                                                {producto.stock} unidades
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {producto.motos.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {producto.motos.slice(0, 2).map((moto, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {moto.marca} {moto.modelo}
                                                        </Badge>
                                                    ))}
                                                    {producto.motos.length > 2 && (
                                                        <Badge variant="outline">+{producto.motos.length - 2}</Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    producto.estado === "Activo"
                                                        ? "default"
                                                        : producto.estado === "Inactivo"
                                                        ? "secondary"
                                                        : "destructive"
                                                }
                                            >
                                                {producto.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={`/productos/${producto.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={`/productos/${producto.id}/editar`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="icon">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default InventarioProductos;