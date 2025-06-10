import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Search, Eye, Ban, Calendar, User, Receipt, BanknoteIcon } from "lucide-react";
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";

interface Comprobante {
    id: number;
    numero_comprobante: string;
    tipo_comprobante: string;
    cliente: string;
    documento: string;
    fecha: string;
    estado: string;
    total: number;
    items: Array<{
        nombre_producto: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
}

interface BoletaProps {
    comprobantes: Comprobante[];
}

const Boleta = ({ comprobantes = [] }: BoletaProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const filteredComprobantes = comprobantes.filter(
        comp => comp.tipo_comprobante.toLowerCase() === 'boleta' &&
        (comp.numero_comprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
         comp.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
         comp.documento.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatPrice = (price: number | string | undefined): string => {
        if (price === undefined || price === null) return "S/ 0.00";
        const num = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(num)) return "S/ 0.00";
        return `S/ ${num.toFixed(2)}`;
    };

    const handleView = (id: number) => {
        router.visit(route('facturacion.show', id));
    };

    const handleAnular = (id: number) => {
        setSelectedId(id);
        setIsConfirmOpen(true);
    };

    const confirmAnular = () => {
        if (selectedId) {
            router.post(route('facturacion.anular', selectedId), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    window.location.reload();
                },
                onError: (error) => {
                    console.error('Error al anular comprobante:', error);
                    alert('Error al anular el comprobante. Por favor, intente nuevamente.');
                }
            });
        }
        setIsConfirmOpen(false);
    };

    const DesktopView = () => (
        <div className="hidden sm:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>N° Comprobante</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredComprobantes.map((comprobante) => (
                        <TableRow key={comprobante.id}>
                            <TableCell className="font-medium">{comprobante.numero_comprobante}</TableCell>
                            <TableCell>{comprobante.cliente}</TableCell>
                            <TableCell>{comprobante.documento.split(': ')[1]}</TableCell>
                            <TableCell>{comprobante.fecha}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        comprobante.estado === 'Emitido'
                                            ? 'bg-green-100 text-green-800 border-green-200'
                                            : 'bg-red-100 text-red-800 border-red-200'
                                    }
                                >
                                    {comprobante.estado}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatPrice(comprobante.total)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleView(comprobante.id)}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAnular(comprobante.id)}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        disabled={comprobante.estado === 'Anulado'}
                                    >
                                        Anular
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    const MobileView = () => (
        <div className="sm:hidden space-y-4">
            {filteredComprobantes.map((comprobante) => (
                <Card key={comprobante.id} className="bg-white">
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium">{comprobante.numero_comprobante}</p>
                                    <p className="text-sm text-gray-500">{comprobante.cliente}</p>
                                    <p className="text-xs text-gray-500">DNI: {comprobante.documento.split(': ')[1]}</p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        comprobante.estado === 'Emitido'
                                            ? 'bg-green-100 text-green-800 border-green-200'
                                            : 'bg-red-100 text-red-800 border-red-200'
                                    }
                                >
                                    {comprobante.estado}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div className="text-sm text-gray-500">{comprobante.fecha}</div>
                                <div className="text-sm font-medium">{formatPrice(comprobante.total)}</div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleView(comprobante.id)}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    Ver
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAnular(comprobante.id)}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    disabled={comprobante.estado === 'Anulado'}
                                >
                                    Anular
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg md:text-xl">Boletas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <div className="relative flex-1 max-w-sm md:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar boleta..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {filteredComprobantes.length === 0 && (
                        <div className="text-center py-8">
                            <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 text-sm">
                                {searchTerm ? 'No se encontraron boletas que coincidan con tu búsqueda.' : 'No hay boletas disponibles.'}
                            </p>
                        </div>
                    )}

                    {filteredComprobantes.length > 0 && (
                        <>
                            <DesktopView />
                            <MobileView />
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Confirmar Anulación</DialogTitle>
                        <DialogDescription className="text-sm">
                            ¿Está seguro que desea anular esta boleta? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmAnular}
                            className="w-full sm:w-auto"
                        >
                            Anular Boleta
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Boleta;