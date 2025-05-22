import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp, Calendar, CalendarCheck, CheckCircle, Clock, XCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/Components/ui/dialog";

interface Reserva {
    id: number;
    usuario: string;
    moto: {
        marca: string;
        modelo: string;
        año: number;
    };
    placa: string;
    servicio: string;
    horario_id: number;
    horario: {
        id: number;
        tipo: string;
        hora_inicio: string;
        hora_fin: string;
    } | null;
    fecha: string;
    hora: string;
    detalles: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface TodasReservasProps {
    reservas: Reserva[];
}

const TodasReservas = ({ reservas: initialReservas }: TodasReservasProps) => {
    const [reservas, setReservas] = useState<Reserva[]>(initialReservas);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [detalleReserva, setDetalleReserva] = useState<Reserva | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const toggleRow = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleEstadoChange = (id: number, estado: string) => {
        router.patch(`/dashboard/reservas/${id}/estado`, {
            estado: estado
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReservas(reservas.map(reserva => 
                    reserva.id === id ? { ...reserva, estado } : reserva
                ));
                toast.success("Estado de la reserva actualizado correctamente");
            },
            onError: () => {
                toast.error("Error al actualizar el estado de la reserva");
            }
        });
    };

    const formatFecha = (fecha: string) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const getEstadoBadgeClass = (estado: string) => {
        switch (estado.toLowerCase()) {
            case "confirmada":
                return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100";
            case "pendiente":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100";
            case "completada":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100";
            case "cancelada":
                return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-100";
            default:
                return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        }
    };

    const openDetalleModal = (reserva: Reserva) => {
        setDetalleReserva(reserva);
        setModalOpen(true);
    };

    const closeDetalleModal = () => {
        setModalOpen(false);
        setDetalleReserva(null);
    };

    return (
        <div className="p-2 sm:p-8 min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-200 animate-fade-in">
            {/* Modal de detalle */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalle de la Reserva</DialogTitle>
                        <DialogDescription>
                            Información completa de la reserva seleccionada.
                        </DialogDescription>
                    </DialogHeader>
                    {detalleReserva && (
                        <div className="space-y-2 text-sm">
                            <div><span className="font-semibold">Cliente:</span> {detalleReserva.usuario}</div>
                            <div><span className="font-semibold">Moto:</span> {`${detalleReserva.moto.marca} ${detalleReserva.moto.modelo} ${detalleReserva.moto.año}`} - {detalleReserva.placa}</div>
                            <div><span className="font-semibold">Servicio:</span> {detalleReserva.servicio}</div>
                            <div><span className="font-semibold">Fecha:</span> {formatFecha(detalleReserva.fecha)}</div>
                            <div><span className="font-semibold">Hora:</span> {detalleReserva.hora}</div>
                            <div><span className="font-semibold">Estado:</span> 
                                <Badge className={`ml-1 ${getEstadoBadgeClass(detalleReserva.estado)}`}>
                                    {detalleReserva.estado.charAt(0).toUpperCase() + detalleReserva.estado.slice(1)}
                                </Badge>
                            </div>
                            {detalleReserva.detalles && (
                                <div><span className="font-semibold">Detalles:</span> {detalleReserva.detalles}</div>
                            )}
                            <div className="flex justify-end pt-2">
                                <DialogClose asChild>
                                    <Button variant="outline">Cerrar</Button>
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <Card className="border-0 sm:border shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md ring-1 ring-primary/10">
                <CardHeader className="px-4 sm:px-10 bg-gradient-to-r from-primary/10 via-white to-primary/5 border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-full shadow-lg border border-primary/20">
                                <Calendar className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow">Todas las Reservas</CardTitle>
                                <CardDescription className="text-base text-gray-500 mt-1">
                                    Administra todas las reservas del sistema
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0 pb-2">
                    <div className="overflow-x-auto">
                        {reservas.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5 shadow-lg border border-gray-200">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-700 font-bold text-lg">No hay reservas registradas</p>
                                <p className="text-gray-500 text-base mt-2">Las reservas aparecerán aquí cuando los usuarios las realicen</p>
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader className="hidden sm:table-header-group bg-gradient-to-r from-gray-50 via-white to-gray-100">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Cliente</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Moto</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Servicio</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Fecha</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Hora</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Estado</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-700 font-bold tracking-wide uppercase">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservas.map((reserva) => (
                                        <React.Fragment key={reserva.id}>
                                            {/* Vista de escritorio */}
                                            <TableRow className="hidden sm:table-row hover:bg-primary/20 transition-all duration-200 border-b last:border-0 group">
                                                <TableCell className="px-4 py-4 font-semibold text-gray-800">{reserva.usuario}</TableCell>
                                                <TableCell className="px-4 py-4 text-gray-700">{`${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}`} - {reserva.placa}</TableCell>
                                                <TableCell className="px-4 py-4 text-gray-700">{reserva.servicio}</TableCell>
                                                <TableCell className="px-4 py-4 text-gray-700">{formatFecha(reserva.fecha)}</TableCell>
                                                <TableCell className="px-4 py-4 text-gray-700">{reserva.hora}</TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <Badge
                                                        className={`text-xs font-bold px-2 py-1 rounded-full shadow border border-gray-200 ${getEstadoBadgeClass(reserva.estado)}`}
                                                    >
                                                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDetalleModal(reserva)}
                                                            className="text-xs font-semibold border-gray-300 hover:bg-primary/10 hover:shadow transition-all duration-150"
                                                        >
                                                            <CalendarCheck className="h-4 w-4 mr-1" />
                                                            Ver detalle
                                                        </Button>
                                                        <div className="flex gap-1">
                                                            {reserva.estado !== "confirmada" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEstadoChange(reserva.id, "confirmada")}
                                                                    className="text-xs font-semibold text-green-700 border-green-200 hover:bg-green-100 hover:shadow transition-all duration-150"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Confirmar
                                                                </Button>
                                                            )}
                                                            {reserva.estado !== "cancelada" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEstadoChange(reserva.id, "cancelada")}
                                                                    className="text-xs font-semibold text-red-700 border-red-200 hover:bg-red-100 hover:shadow transition-all duration-150"
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Cancelar
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            {/* Vista móvil mejorada */}
                                            <div className="sm:hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-lg p-5 mb-5 border border-gray-100 ring-1 ring-primary/10">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 truncate">
                                                            {reserva.usuario}
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate mt-0.5">
                                                            {reserva.servicio}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge
                                                                className={`text-xs font-bold px-2 py-0.5 rounded-full shadow border border-gray-200 ${getEstadoBadgeClass(reserva.estado)}`}
                                                            >
                                                                {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                {formatFecha(reserva.fecha)} - {reserva.hora}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-full hover:bg-primary/10 transition-all duration-150"
                                                        onClick={() => toggleRow(reserva.id)}
                                                        aria-label="Ver detalles"
                                                    >
                                                        {expandedRows.includes(reserva.id) ? (
                                                            <ChevronUp className="h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {expandedRows.includes(reserva.id) && (
                                                    <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Moto:</span>
                                                            <span className="font-semibold text-gray-800">{`${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}`} - {reserva.placa}</span>
                                                        </div>
                                                        {reserva.detalles && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Detalles:</span>
                                                                <span className="font-semibold text-gray-800">{reserva.detalles}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2 mt-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openDetalleModal(reserva)}
                                                                className="text-xs font-semibold flex-1 border-gray-300 hover:bg-primary/10 hover:shadow transition-all duration-150"
                                                            >
                                                                <CalendarCheck className="h-4 w-4 mr-1" />
                                                                Ver detalle
                                                            </Button>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            {reserva.estado !== "confirmada" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEstadoChange(reserva.id, "confirmada")}
                                                                    className="text-xs font-semibold text-green-700 border-green-200 hover:bg-green-100 hover:shadow flex-1 transition-all duration-150"
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Confirmar
                                                                </Button>
                                                            )}
                                                            {reserva.estado !== "cancelada" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEstadoChange(reserva.id, "cancelada")}
                                                                    className="text-xs font-semibold text-red-700 border-red-200 hover:bg-red-100 hover:shadow flex-1 transition-all duration-150"
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Cancelar
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Toaster position="top-right" closeButton />
        </div>
    );
};

export default TodasReservas;