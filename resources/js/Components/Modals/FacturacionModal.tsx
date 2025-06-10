import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { FileText, Receipt, Book } from "lucide-react";
import { toast } from 'sonner';

interface PedidoItem {
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number | string;
    subtotal: number | string;
    imagen?: string;
}

interface FacturacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedido: {
        id: number;
        numeroOrden: string;
        fecha: string;
        cliente: string;
        dni?: string;
        user?: {
            dni?: string;
        };
        items?: PedidoItem[];
        subtotal?: number;
        total?: number;
    };
    tipoComprobante: 'factura' | 'boleta' | 'nota_venta';
}

const FacturacionModal: React.FC<FacturacionModalProps> = ({
    isOpen,
    onClose,
    pedido,
    tipoComprobante
}) => {
    const [loading, setLoading] = useState(false);
    const [numeroComprobante, setNumeroComprobante] = useState('');

    const total = pedido?.items?.reduce((acc, item) => {
        const subtotalItem = typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal;
        return acc + (subtotalItem || 0);
    }, 0) || 0;

    const subtotal = total / 1.18;
    const igv = total - subtotal;

    const { data, setData, post, processing, reset, errors } = useForm({
        pedido_id: pedido?.id || '',
        tipo_comprobante: tipoComprobante,
        numero_comprobante: '',
        dni: pedido?.dni || pedido?.user?.dni || '',
        nombre_cliente: pedido?.cliente || '',
        subtotal: subtotal,
        igv: igv,
        total: total,
        observaciones: ''
    });

    const formatPrice = (price: number | string | undefined): string => {
        if (price === undefined || price === null) return "S/ 0.00";
        const num = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(num)) return "S/ 0.00";
        return `S/ ${num.toFixed(2)}`;
    };

    useEffect(() => {
        if (isOpen) {
            axios.get(route('facturacion.generar.numero', tipoComprobante))
                .then(response => {
                    setNumeroComprobante(response.data);
                    setData('numero_comprobante', response.data);
                })
                .catch(error => {
                    console.error('Error al generar número de comprobante:', error);
                });
        }
    }, [isOpen, tipoComprobante]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        post(route('facturacion.store'), {
            onSuccess: () => {
                setLoading(false);
                onClose();
                reset();
                
                const mensajes = {
                    'factura': '¡Factura generada exitosamente!',
                    'boleta': '¡Boleta generada exitosamente!',
                    'nota_venta': '¡Nota de venta generada exitosamente!'
                };
                
                toast.success(mensajes[tipoComprobante], {
                    description: `El comprobante ${numeroComprobante} ha sido guardado correctamente.`,
                    duration: 4000,
                });
            },
            onError: () => {
                setLoading(false);
                toast.error('Error al generar el comprobante', {
                    description: 'Ocurrió un error al intentar generar el comprobante. Por favor, intente nuevamente.',
                });
            }
        });
    };

    const getIcon = () => {
        switch (tipoComprobante) {
            case 'factura':
                return <FileText className="h-5 w-5 text-blue-600" />;
            case 'boleta':
                return <Receipt className="h-5 w-5 text-green-600" />;
            case 'nota_venta':
                return <Book className="h-5 w-5 text-purple-600" />;
        }
    };

    const getTitle = () => {
        switch (tipoComprobante) {
            case 'factura':
                return 'Generar Factura';
            case 'boleta':
                return 'Generar Boleta';
            case 'nota_venta':
                return 'Generar Nota de Venta';
        }
    };

    const getModalStyle = () => {
        switch (tipoComprobante) {
            case 'factura':
                return 'border-t-4 border-t-blue-500';
            case 'boleta':
                return 'border-t-4 border-t-green-500';
            case 'nota_venta':
                return 'border-t-4 border-t-purple-500';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className={`
                    sm:max-w-[95vw] 
                    md:max-w-[800px] 
                    max-h-[90vh] 
                    overflow-y-auto 
                    pt-8 
                    ${getModalStyle()}
                `}
            >
                <DialogHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <DialogTitle className="text-xl font-bold">
                            {getTitle()}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Complete los campos requeridos para generar el comprobante
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-3">Información del Pedido</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="font-medium">N° Orden:</span>
                                <span className="ml-1 text-gray-600">{pedido?.numeroOrden}</span>
                            </div>
                            <div>
                                <span className="font-medium">Fecha:</span>
                                <span className="ml-1 text-gray-600">{pedido?.fecha}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Número de Comprobante
                        </label>
                        <input
                            type="text"
                            value={numeroComprobante}
                            disabled
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">DNI</label>
                            <input
                                type="text"
                                value={data.dni}
                                onChange={e => setData('dni', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                maxLength={8}
                                placeholder="Ingrese el DNI"
                                required={tipoComprobante !== 'nota_venta'}
                            />
                            {errors.dni && (
                                <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                            <input
                                type="text"
                                value={data.nombre_cliente}
                                onChange={e => setData('nombre_cliente', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                placeholder="Ingrese el nombre del cliente"
                                required
                            />
                            {errors.nombre_cliente && (
                                <p className="mt-1 text-sm text-red-600">{errors.nombre_cliente}</p>
                            )}
                        </div>
                    </div>

                    {/* Tabla de Productos */}
                    <div className="mt-6">
                        <div className="text-sm font-medium text-gray-700 mb-2">Detalle de Productos</div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pedido?.items?.map((item, index) => (
                                        <tr key={index} className="text-sm">
                                            <td className="px-3 py-2 whitespace-nowrap">{item.nombre_producto}</td>
                                            <td className="px-3 py-2 text-right">{item.cantidad}</td>
                                            <td className="px-3 py-2 text-right">{formatPrice(item.precio_unitario)}</td>
                                            <td className="px-3 py-2 text-right">{formatPrice(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td className="px-3 py-2 text-right text-sm font-medium">Valor Venta:</td>
                                        <td className="px-3 py-2 text-right text-sm">{formatPrice(data.subtotal)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td className="px-3 py-2 text-right text-sm font-medium">IGV (18%):</td>
                                        <td className="px-3 py-2 text-right text-sm">{formatPrice(data.igv)}</td>
                                    </tr>
                                    <tr className="font-bold">
                                        <td colSpan={2}></td>
                                        <td className="px-3 py-2 text-right text-sm">Precio Total:</td>
                                        <td className="px-3 py-2 text-right text-sm">{formatPrice(data.total)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                        <textarea
                            value={data.observaciones}
                            onChange={e => setData('observaciones', e.target.value)}
                            rows={2}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                            placeholder="Ingrese alguna observación si es necesario"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="text-sm"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || processing}
                            className={`text-sm ${
                                tipoComprobante === 'factura' ? 'bg-blue-600 hover:bg-blue-700' :
                                tipoComprobante === 'boleta' ? 'bg-green-600 hover:bg-green-700' :
                                'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {loading ? 'Generando...' : 'Generar Comprobante'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FacturacionModal;
