import React from "react";
import { Head, Link } from "@inertiajs/react";
import NavigationMenu from '@/Components/NavigationMenu';

interface Props {
  horarios: {
    dias: string[];
    horarios: Record<string, string>;
    franjas: string[];
  };
}

export default function HorariosAtencion({ horarios }: Props) {
  return (
    <>
      <Head title="Horarios de Atención" />
        <NavigationMenu />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Horarios de Atención</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Días y Horarios de Servicio</h2>
                <ul className="space-y-3">
                  {horarios.dias.map((dia) => (
                    <li key={dia} className="flex items-center">
                      <span className="font-medium text-gray-700 w-32">{dia}:</span>
                      <span className="text-gray-600">{horarios.horarios[dia]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Franjas Horarias Disponibles</h2>
                <div className="grid grid-cols-3 gap-2">
                  {horarios.franjas.map((franja) => (
                    <div key={franja} className="bg-white rounded border border-gray-200 py-2 px-3 text-center">
                      {franja}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    ¿Listo para agendar tu cita? Haz clic en el botón a continuación para seleccionar el día y la hora que más te convenga.
                  </p>
                  <Link
                    href={route('reservas.create')}
                    className="w-full block text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Agendar Cita
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-blue-800 mb-2">Información Importante</h2>
              <ul className="list-disc pl-5 space-y-2 text-blue-700">
                <li>Para una mejor atención, te recomendamos agendar tu cita con al menos 24 horas de anticipación.</li>
                <li>En caso de no poder asistir, te pedimos cancelar tu cita con un mínimo de 2 horas de anticipación.</li>
                <li>Llega 10 minutos antes de tu cita para realizar el registro.</li>
                <li>El tiempo de servicio puede variar según el estado de tu moto.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}