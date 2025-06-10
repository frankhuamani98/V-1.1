import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Item {
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface Comprobante {
    id: number;
    numero_comprobante: string;
    tipo_comprobante: string;
    fecha_emision: string;
    estado: string;
    cliente: {
        nombre: string;
        documento: {
            tipo: string;
            numero: string;
        };
    };
    items: Item[];
    totales: {
        subtotal: number;
        igv: number;
        total: number;
    };
    observaciones: string | null;
}

interface ShowProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    comprobante: Comprobante;
}

const Show = ({ auth, comprobante }: ShowProps) => {
    const formatPrice = (price: number | string | undefined): string => {
        if (price === undefined || price === null) return "S/ 0.00";
        const num = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(num)) return "S/ 0.00";
        return `S/ ${num.toFixed(2)}`;
    };

    const getHeaderColor = () => {
        switch (comprobante.tipo_comprobante.toLowerCase()) {
            case 'factura':
                return 'bg-blue-50 border-blue-500';
            case 'boleta':
                return 'bg-green-50 border-green-500';
            case 'nota_venta':
                return 'bg-purple-50 border-purple-500';
            default:
                return 'bg-gray-50 border-gray-500';
        }
    };

    const handleBack = () => {
        let routeName = '';
        const tipoComprobante = comprobante.tipo_comprobante.toLowerCase();
        
        switch (tipoComprobante) {
            case 'nota_venta':
                routeName = 'facturacion.notas-venta';
                break;
            case 'factura':
                routeName = 'facturacion.facturas';
                break;
            case 'boleta':
                routeName = 'facturacion.boletas';
                break;
            default:
                routeName = 'facturacion.index';
        }
        
        router.visit(route(routeName));
    };

    return (
        <DashboardLayout auth={auth}>
            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    <CardHeader className={`border-t-4 ${getHeaderColor()}`}>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">
                                Detalle del Comprobante
                            </CardTitle>
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Información del Comprobante */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Número de Comprobante</p>
                                <p className="text-sm">{comprobante.numero_comprobante}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fecha de Emisión</p>
                                <p className="text-sm">{comprobante.fecha_emision}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Estado</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    comprobante.estado === 'Emitido' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {comprobante.estado}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Tipo de Comprobante</p>
                                <p className="text-sm">{comprobante.tipo_comprobante}</p>
                            </div>
                        </div>

                        {/* Información del Cliente */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Información del Cliente</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                                    <p className="text-sm">{comprobante.cliente.nombre}</p>
                                </div>
                                {comprobante.cliente.documento.numero && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{comprobante.cliente.documento.tipo}</p>
                                        <p className="text-sm">{comprobante.cliente.documento.numero}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabla de Items */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-500">Detalle de Productos</h3>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-right">Cantidad</TableHead>
                                            <TableHead className="text-right">Precio Unit.</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {comprobante.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.nombre_producto}</TableCell>
                                                <TableCell className="text-right">{item.cantidad}</TableCell>
                                                <TableCell className="text-right">{formatPrice(item.precio_unitario)}</TableCell>
                                                <TableCell className="text-right">{formatPrice(item.subtotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="flex justify-end p-4">
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Valor Venta:</span>
                                    <span>{formatPrice(comprobante.totales.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">IGV (18%):</span>
                                    <span>{formatPrice(comprobante.totales.igv)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                                    <span>Total:</span>
                                    <span>{formatPrice(comprobante.totales.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Observaciones */}
                        {comprobante.observaciones && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Observaciones</h3>
                                <p className="text-sm whitespace-pre-line">{comprobante.observaciones}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Show; 