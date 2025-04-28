import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Calendar, Clock, Bike, User, Tag, FileText, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";

interface Usuario {
    id: number;
    name: string;
    email: string;
}

interface Servicio {
    id: number;
    nombre: string;
    precio_base: number;
    duracion_estimada: number;
}

interface Reserva {
    id: number;
    usuario: Usuario | null;
    vehiculo: string;
    placa: string;
    servicio: Servicio | null;
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

    const formatFecha = (fecha: string) => {
        // Convierte YYYY-MM-DD a DD/MM/YYYY
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
                                            <p className="text-sm text-gray-500 mt-1">{reserva.usuario.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Detalles del Vehículo</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Bike className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">{reserva.vehiculo}</h4>
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
                                {reserva.servicio ? (
                                    <div>
                                        <h4 className="font-medium text-gray-800">{reserva.servicio.nombre}</h4>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">Precio Base:</span>
                                                <span className="text-sm font-medium text-gray-700">${reserva.servicio.precio_base.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">Duración Estimada:</span>
                                                <span className="text-sm font-medium text-gray-700">{reserva.servicio.duracion_estimada} minutos</span>
                                            </div>
                                        </div>
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
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
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
            <Toaster position="top-right" closeButton />
        </div>
    );
};

export default DetalleReserva;