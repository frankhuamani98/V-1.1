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
                return 'bg-green-200 text-green-900 border border-green-400';
            case 'pendiente':
                return 'bg-yellow-200 text-yellow-900 border border-yellow-400';
            case 'completada':
                return 'bg-blue-200 text-blue-900 border border-blue-400';
            case 'cancelada':
                return 'bg-red-200 text-red-900 border border-red-400';
            default:
                return 'bg-gray-200 text-gray-900 border border-gray-400';
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
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center py-0 px-0">
                <div className="w-[90%] mx-auto mt-4 mb-8">
                    <div className="bg-white shadow-2xl rounded-2xl border border-blue-200 p-8">
                        <Card className="shadow-none border-none">
                            <CardHeader className="border-b bg-white mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <Calendar className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-gray-800">Mis Citas</CardTitle>
                                        <CardDescription className="text-base text-gray-500">
                                            Gestiona tus citas programadas
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {reservas.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                            <Calendar className="h-8 w-8 text-blue-400" />
                                        </div>
                                        <p className="text-blue-700 font-semibold text-lg">No tienes citas programadas</p>
                                        <p className="text-blue-500 text-base mt-1">Agenda tu primera cita desde la sección de servicios</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {reservas.map((reserva) => (
                                            <div key={reserva.id} className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border border-blue-100 shadow-lg hover:shadow-2xl transition-shadow duration-200">
                                                <div className="p-6 flex flex-col h-full">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <Badge className={getEstadoBadgeClass(reserva.estado) + " px-3 py-1 text-base font-semibold rounded-full"}>
                                                            {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2 space-y-3 flex-1">
                                                        <div className="flex items-start gap-3">
                                                            <Bike className="h-5 w-5 text-blue-400 mt-0.5" />
                                                            <div>
                                                                <p className="font-semibold text-blue-900">
                                                                    {reserva.moto ? 
                                                                        `${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}` : 
                                                                        'Moto no disponible'
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-blue-700">{reserva.placa}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Tag className="h-5 w-5 text-indigo-400 mt-0.5" />
                                                            <p className="text-blue-900">{reserva.servicio}</p>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-5 w-5 text-green-400 mt-0.5" />
                                                            <p className="text-blue-900">{formatFecha(reserva.fecha)}</p>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                                                            <p className="text-blue-900">{reserva.hora}</p>
                                                        </div>
                                                        {reserva.detalles && (
                                                            <p className="text-sm text-blue-700 mt-2">
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
                                                                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                                                                >
                                                                    <Edit2 className="h-4 w-4 mr-2" />
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleCancelar(reserva.id)}
                                                                    className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
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
            </div>
            <Toaster position="top-right" closeButton />
        </>
    );
}