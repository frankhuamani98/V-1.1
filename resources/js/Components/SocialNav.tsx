import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SocialNav() {
    const currentRoute = route().current();
    
    const isActive = (routeName: string) => {
        return currentRoute === routeName || 
               currentRoute?.startsWith(routeName + '.');
    };

    return (
        <div className="bg-white border-b border-blue-100 shadow-sm mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between py-3">
                    {/* Botón de regreso - Parte izquierda */}
                    <Link
                        href={route('home')}
                        className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-300 mb-3 sm:mb-0"
                        title="Volver al inicio"
                    >
                        <div className="bg-blue-50 rounded-full p-2 mr-2 shadow-sm">
                            <ArrowLeftIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="font-medium">Inicio</span>
                    </Link>

                    {/* Menú de contacto - Diseño de pestañas */}
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-0 w-full sm:w-auto">
                        <Link
                            href={route('contacto.ubicacion')}
                            className={`px-4 py-3 font-medium text-sm transition-all duration-200 relative border-b-2 ${
                                isActive('contacto.ubicacion')
                                    ? 'text-blue-600 border-blue-500'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200'
                            }`}
                            preserveScroll
                        >
                            Ubicación
                        </Link>
                        <Link
                            href={route('contacto.contactanos')}
                            className={`px-4 py-3 font-medium text-sm transition-all duration-200 relative border-b-2 ${
                                isActive('contacto.contactanos')
                                    ? 'text-blue-600 border-blue-500'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200'
                            }`}
                            preserveScroll
                        >
                            Contáctanos
                        </Link>
                        <Link
                            href={route('contacto.redes-sociales')}
                            className={`px-4 py-3 font-medium text-sm transition-all duration-200 relative border-b-2 ${
                                isActive('contacto.redes-sociales')
                                    ? 'text-blue-600 border-blue-500'
                                    : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-200'
                            }`}
                            preserveScroll
                        >
                            Redes Sociales
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}