import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ClipboardList, CalendarDays, Wrench, Clock } from 'lucide-react';

export default function NavigationMenu() {
    const currentRoute = route().current();
    
    const isActive = (routeName: string) => {
        return currentRoute === routeName || 
               currentRoute?.startsWith(routeName + '.');
    };

    return (
        <div className="bg-white border-b border-blue-100 shadow-md mb-4">
            <div className="w-full max-w-[98%] mx-auto px-2 sm:px-8 lg:px-12">
                <div className="flex flex-col sm:flex-row items-center justify-between py-3">
                    {/* Botón de regreso - Parte izquierda */}
                    <Link
                        href={route('home')}
                        className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-300 mb-2 sm:mb-0"
                        title="Volver al inicio"
                    >
                        <div className="bg-blue-50 rounded-full p-2 mr-2 shadow-sm">
                            <ArrowLeftIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="font-medium">Inicio</span>
                    </Link>

                    {/* Menú principal - Diseño de pestañas con iconos */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-0 w-full sm:w-auto">
                        <Link
                            href={route('reservas.create')}
                            className={`px-5 py-3 font-medium text-base flex items-center gap-2 transition-all duration-200 relative border-b-2 rounded-t-lg ${
                                isActive('reservas.create')
                                    ? 'text-blue-600 border-blue-500 bg-blue-50'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50'
                            }`}
                            preserveScroll
                        >
                            <ClipboardList className="h-5 w-5" />
                            Agendar Servicio
                        </Link>
                        <Link
                            href={route('reservas.index')}
                            className={`px-5 py-3 font-medium text-base flex items-center gap-2 transition-all duration-200 relative border-b-2 rounded-t-lg ${
                                isActive('reservas.index')
                                    ? 'text-blue-600 border-blue-500 bg-blue-50'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50'
                            }`}
                            preserveScroll
                        >
                            <CalendarDays className="h-5 w-5" />
                            Mis Citas
                        </Link>
                        <Link
                            href={route('reservas.servicios-disponibles')}
                            className={`px-5 py-3 font-medium text-base flex items-center gap-2 transition-all duration-200 relative border-b-2 rounded-t-lg ${
                                isActive('reservas.servicios-disponibles')
                                    ? 'text-blue-600 border-blue-500 bg-blue-50'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50'
                            }`}
                            preserveScroll
                        >
                            <Wrench className="h-5 w-5" />
                            Servicios
                        </Link>
                        <Link
                            href={route('reservas.horarios-atencion')}
                            className={`px-5 py-3 font-medium text-base flex items-center gap-2 transition-all duration-200 relative border-b-2 rounded-t-lg ${
                                isActive('reservas.horarios-atencion')
                                    ? 'text-blue-600 border-blue-500 bg-blue-50'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50' 
                            }`}
                            preserveScroll
                        >
                            <Clock className="h-5 w-5" />
                            Horarios
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}