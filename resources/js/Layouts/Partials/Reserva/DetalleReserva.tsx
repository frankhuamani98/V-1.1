import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Clock, Bike, User, Tag, FileText, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import axios from "axios";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";

interface Usuario {
    id: number;
    name: string;
    telefono: string;
}

interface Servicio {
    id: number;
    nombre: string;
}

interface Horario {
    id: number;
    tipo: string;
    dia_semana?: string;
    fecha?: string;
    hora_inicio: string;
    hora_fin: string;
}

interface Moto {
    id: number;
    año: number;
    marca: string;
    modelo: string;
}

interface Reserva {
    id: number;
    usuario: Usuario | null;
    moto: Moto;
    placa: string;
    servicios: Servicio[];
    horario_id: number;
    horario: Horario | null;
    fecha: string;
    hora: string;
    detalles: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface DetalleReservaProps {
    reserva: Reserva;
}

const DetalleReserva = ({ reserva: initialReserva }: DetalleReservaProps) => {
    const [reserva, setReserva] = useState<Reserva>(initialReserva);
    const [showReprogramar, setShowReprogramar] = useState(false);
    const [nuevaFecha, setNuevaFecha] = useState(reserva.fecha);
    const [nuevaHora, setNuevaHora] = useState(reserva.hora);
    const [loading, setLoading] = useState(false);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [dateErrorMessage, setDateErrorMessage] = useState("");
    const [loadingHours, setLoadingHours] = useState(false);

    const formatFecha = (fecha: string) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleEstadoChange = (estado: string) => {
        router.patch(`/dashboard/reservas/${reserva.id}/estado`, {
            estado: estado
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReserva({ ...reserva, estado });
                toast.success("Estado de la reserva actualizado correctamente");
            },
            onError: () => {
                toast.error("Error al actualizar el estado de la reserva");
            }
        });
    };

    const handleReprogramar = () => {
        setLoading(true);
        router.patch(`/dashboard/reservas/${reserva.id}/reprogramar`, {
            fecha: nuevaFecha,
            hora: nuevaHora
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReserva({ ...reserva, fecha: nuevaFecha, hora: nuevaHora });
                setShowReprogramar(false);
                toast.success("Reserva reprogramada correctamente");
            },
            onError: () => {
                toast.error("Error al reprogramar la reserva");
            },
            onFinish: () => setLoading(false)
        });
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

    useEffect(() => {
        const today = new Date();
        const dates: string[] = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        setAvailableDates(dates);
    }, []);

    useEffect(() => {
        if (!nuevaFecha) return;
        setLoadingHours(true);
        setDateErrorMessage("");
        setAvailableHours([]);
        axios.get('/api/reservas/horas-disponibles', { params: { fecha: nuevaFecha } })
            .then(res => {
                if (res.data.disponible) {
                    setAvailableHours(res.data.horas);
                } else {
                    setAvailableHours([]);
                    setDateErrorMessage(res.data.motivo || "No hay horarios disponibles para esta fecha");
                }
            })
            .catch(() => {
                setAvailableHours([]);
                setDateErrorMessage("Error al cargar horarios disponibles");
            })
            .finally(() => setLoadingHours(false));
    }, [nuevaFecha]);

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className="mb-4">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.visit('/dashboard/reservas')}
                    className="flex items-center gap-1 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a reservas
                </Button>
            </div>
            
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={`px-2 py-1 ${getEstadoBadgeClass(reserva.estado)}`}>
                                    {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    Reserva #{reserva.id}
                                </span>
                            </div>
                            <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                Detalle de Reserva
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                Información completa de la reserva
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Detalles del Cliente</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">
                                            {reserva.usuario ? reserva.usuario.name : 'Usuario eliminado'}
                                        </h4>
                                        {reserva.usuario && (
                                            <p className="text-sm text-gray-500 mt-1">{reserva.usuario.telefono}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Detalles de la Moto</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Bike className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">{`${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}`}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Tag className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{reserva.placa}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Detalles del Servicio</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {reserva.servicios.length > 0 ? (
                                    <div>
                                        <h4 className="font-medium text-gray-800">{reserva.servicios.map(s => s.nombre).join(', ')}</h4>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Servicio no disponible</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">{formatFecha(reserva.fecha)}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{reserva.hora}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {reserva.detalles && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Detalles Adicionales</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <p className="text-gray-700">{reserva.detalles}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Información de creación</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Creado:</span>
                                        <span className="text-sm font-medium text-gray-700">{reserva.created_at}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Última actualización:</span>
                                        <span className="text-sm font-medium text-gray-700">{reserva.updated_at}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="p-4 sm:p-6 border-t bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <h3 className="text-sm font-medium text-gray-700 sm:w-40">Cambiar estado:</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowReprogramar(true)}
                                className="text-xs font-medium text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                                Reprogramar
                            </Button>
                            {reserva.estado !== "pendiente" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEstadoChange("pendiente")}
                                    className="text-xs font-medium text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                >
                                    Pendiente
                                </Button>
                            )}
                            {reserva.estado !== "confirmada" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEstadoChange("confirmada")}
                                    className="text-xs font-medium text-green-600 border-green-200 hover:bg-green-50"
                                >
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                    Confirmar
                                </Button>
                            )}
                            {reserva.estado !== "completada" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEstadoChange("completada")}
                                    className="text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    Completada
                                </Button>
                            )}
                            {reserva.estado !== "cancelada" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEstadoChange("cancelada")}
                                    className="text-xs font-medium text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={showReprogramar} onOpenChange={setShowReprogramar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reprogramar Reserva</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fecha">Nueva Fecha</Label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="fecha"
                                    className="mt-1 block w-full border border-slate-200 rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-base bg-white"
                                    value={nuevaFecha}
                                    onChange={e => setNuevaFecha(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    max={(function() { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]; })()}
                                    required
                                />
                                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-slate-300 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="hora">Nueva Hora</Label>
                            <select
                                id="hora"
                                value={nuevaHora}
                                onChange={e => setNuevaHora(e.target.value)}
                                className="block w-full border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-base bg-white"
                                disabled={!nuevaFecha || loadingHours || availableHours.length === 0}
                            >
                                <option value="">
                                    {loadingHours
                                        ? "Cargando horarios..."
                                        : availableHours.length === 0 && nuevaFecha
                                        ? "No hay horarios disponibles"
                                        : "Seleccione una hora"}
                                </option>
                                {availableHours.map(hora => (
                                    <option key={hora} value={hora}>{hora}</option>
                                ))}
                            </select>
                            {dateErrorMessage && (
                                <p className="mt-1.5 text-sm text-rose-600">{dateErrorMessage}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleReprogramar} disabled={loading || !nuevaFecha || !nuevaHora || availableHours.length === 0} className="bg-indigo-600 text-white hover:bg-indigo-700">
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowReprogramar(false)} disabled={loading}>
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DetalleReserva;