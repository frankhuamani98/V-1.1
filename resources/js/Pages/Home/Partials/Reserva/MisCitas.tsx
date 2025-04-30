import React from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import NavigationMenu from '@/Components/NavigationMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Calendar, Clock, Bike, Tag, Edit2, XCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface Moto {
    año: number;
    marca: string;
    modelo: string;
}

interface Reserva {
    id: number;
    placa: string;
    servicio: string;
    moto: Moto | null;
    fecha: string;
    hora: string;
    detalles: string | null;
    estado: string;
}

interface Props {
    reservas: Reserva[];
}

export default function MisCitas({ reservas }: Props) {
    const formatFecha = (fecha: string) => {
        try {
            const [year, month, day] = fecha.split('-');
            if (year && month && day) {
                return `${day}/${month}/${year}`;
            }
            return fecha;
        } catch (error) {
            console.error('Error formatting date:', error);
            return fecha;
        }
    };

    const getEstadoBadgeClass = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'confirmada':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'completada':
                return 'bg-blue-100 text-blue-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCancelar = (id: number) => {
        if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
            router.delete(route('reservas.destroy', id), {
                onSuccess: () => {
                    toast.success('Cita cancelada exitosamente');
                },
                onError: () => {
                    toast.error('Error al cancelar la cita');
                }
            });
        }
    };

    return (
        <>
            <Head title="Mis Citas" />
            <NavigationMenu />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <Card>
                        <CardHeader className="border-b bg-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-800">Mis Citas</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        Gestiona tus citas programadas
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {reservas.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <Calendar className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 font-medium">No tienes citas programadas</p>
                                    <p className="text-gray-500 text-sm mt-1">Agenda tu primera cita desde la sección de servicios</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reservas.map((reserva) => (
                                        <div key={reserva.id} className="bg-white rounded-lg border shadow-sm">
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <Badge className={getEstadoBadgeClass(reserva.estado)}>
                                                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="mt-4 space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <Bike className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {reserva.moto ? 
                                                                    `${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}` : 
                                                                    'Moto no disponible'
                                                                }
                                                            </p>
                                                            <p className="text-sm text-gray-600">{reserva.placa}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <p className="text-gray-800">{reserva.servicio}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <p className="text-gray-800">{formatFecha(reserva.fecha)}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <p className="text-gray-800">{reserva.hora}</p>
                                                    </div>
                                                    
                                                    {reserva.detalles && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {reserva.detalles}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-4 flex gap-2">
                                                    {reserva.estado === 'pendiente' && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.visit(route('reservas.edit', reserva.id))}
                                                                className="flex-1"
                                                            >
                                                                <Edit2 className="h-4 w-4 mr-2" />
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleCancelar(reserva.id)}
                                                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                                            >
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Cancelar
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster position="top-right" closeButton />
        </>
    );
}