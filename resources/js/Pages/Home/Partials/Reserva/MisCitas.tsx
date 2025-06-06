import React from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import ReservaNavigation from '@/Components/ReservaNavigation';
import Header from '@/Pages/Home/Header';
import Footer from '@/Pages/Home/Footer';
import WhatsAppButton from '@/Components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Calendar, Clock, Bike, Tag, Edit2, XCircle, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface Servicio {
    id: number;
    nombre: string;
}

interface Moto {
    año: number;
    marca: string;
    modelo: string;
}

interface Reserva {
    id: number;
    placa: string;
    servicios: Servicio[];
    moto: Moto | null;
    fecha: string;
    hora: string;
    detalles: string | null;
    estado: string;
    reprogramada_en?: string | null;
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
                return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
            case 'pendiente':
                return 'bg-amber-50 text-amber-600 border border-amber-200';
            case 'completada':
                return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
            case 'cancelada':
                return 'bg-rose-50 text-rose-600 border border-rose-200';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-200';
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
            <Header />
            <ReservaNavigation currentPage="Mis Citas" />
            <div className="w-full min-h-screen bg-white dark:bg-slate-900 flex items-start justify-center py-10 px-4">
                <div className="w-full max-w-7xl mx-auto">
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-900 rounded-lg">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900 p-3.5 rounded-full">
                                    <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Mis Citas</CardTitle>
                                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Gestiona tus citas programadas
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {reservas.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                                        <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2">No tienes citas programadas</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                                        Agenda tu primera cita desde la sección de servicios disponibles
                                    </p>
                                    <Button
                                        onClick={() => router.visit('/reservas/servicios-disponibles')}
                                        className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                                    >
                                        Ver servicios disponibles
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                                    {reservas.map((reserva) => (
                                        <div key={reserva.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                                            <div className="p-6 flex flex-col h-full">
                                                <div className="flex justify-between items-center mb-5">
                                                    <Badge className={getEstadoBadgeClass(reserva.estado) + " px-3.5 py-1.5 text-sm font-medium rounded-full dark:bg-opacity-60"}>
                                                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                                                    </Badge>
                                                    {reserva.reprogramada_en && (
                                                        <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                                                            Reprogramado
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                                            <Bike className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800 dark:text-slate-100 text-base">
                                                                {reserva.moto ? 
                                                                    `${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}` : 
                                                                    'Moto no disponible'
                                                                }
                                                            </p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{reserva.placa}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                                            <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            {reserva.servicios && reserva.servicios.length > 0 ? (
                                                                reserva.servicios.map((servicio, idx) => (
                                                                    <span key={servicio.id} className="text-base text-slate-700 dark:text-slate-200">
                                                                        {servicio.nombre}{idx < reserva.servicios.length - 1 ? ', ' : ''}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-base text-slate-500 dark:text-slate-400">Sin servicios</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                                            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <p className="text-base text-slate-700 dark:text-slate-200">{formatFecha(reserva.fecha)}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                                            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <p className="text-base text-slate-700 dark:text-slate-200">{reserva.hora}</p>
                                                    </div>
                                                    
                                                    {reserva.detalles && (
                                                        <div className="flex items-start gap-3 mt-1">
                                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                                                <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {reserva.detalles}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {reserva.estado === 'pendiente' && (
                                                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex gap-4">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => router.visit(route('reservas.edit', reserva.id))}
                                                            className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm h-10"
                                                        >
                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleCancelar(reserva.id)}
                                                            className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm h-10"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                )}
                                                {reserva.estado === 'confirmada' && (
                                                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                                                        <span className="inline-block bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 text-sm font-semibold px-4 py-2 rounded-lg">
                                                            ¡Tu reserva ha sido confirmada! Te esperamos en el taller.
                                                        </span>
                                                    </div>
                                                )}
                                                {reserva.estado === 'completada' && (
                                                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                                                        <span className="inline-block bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-sm font-semibold px-4 py-2 rounded-lg">
                                                            ¡Servicio completado! Puedes recoger tu moto.
                                                        </span>
                                                    </div>
                                                )}
                                                {reserva.estado === 'cancelada' && (
                                                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                                                        <span className="inline-block bg-rose-50 dark:bg-rose-900 text-rose-700 dark:text-rose-200 text-sm font-semibold px-4 py-2 rounded-lg">
                                                            Esta reserva ha sido cancelada.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <WhatsAppButton />
            <Footer />
        </>
    );
}