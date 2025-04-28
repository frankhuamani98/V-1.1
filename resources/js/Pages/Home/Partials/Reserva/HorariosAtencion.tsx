import React, { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import NavigationMenu from '@/Components/NavigationMenu';

interface Excepcion {
  fecha: string;
  fecha_formateada: string;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
  motivo?: string;
}

interface Props {
  horarios: {
    dias: string[];
    horarios: Record<string, string>;
    excepciones: Excepcion[];
  };
}

export default function HorariosAtencion({ horarios }: Props) {
  // Depuración - verificar si las excepciones están llegando correctamente
  useEffect(() => {
    console.log("Horarios recibidos:", horarios);
    console.log("Excepciones:", horarios.excepciones);
  }, [horarios]);

  // Verificar si tenemos excepciones
  const tieneExcepciones = Array.isArray(horarios.excepciones) && horarios.excepciones.length > 0;
  
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
                <h2 className="text-lg font-medium text-gray-900 mb-4">Días y Horarios Regulares</h2>
                
                {horarios.dias.length > 0 ? (
                  <ul className="space-y-3">
                    {horarios.dias.map((dia) => (
                      <li key={dia} className="flex items-center">
                        <span className="font-medium text-gray-700 w-32">{dia}:</span>
                        <span className="text-gray-600">{horarios.horarios[dia]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No hay horarios regulares configurados.</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Excepciones y Días Especiales</h2>
                
                {tieneExcepciones ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Horario
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {horarios.excepciones.map((excepcion) => (
                          <tr key={excepcion.fecha}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {excepcion.fecha_formateada}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {excepcion.activo ? (
                                `${excepcion.hora_inicio} - ${excepcion.hora_fin}`
                              ) : (
                                <span className="text-red-500">Cerrado</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {excepcion.activo ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Abierto
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {excepcion.motivo || "Cerrado"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No hay excepciones programadas para los próximos meses.</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Esta información está sujeta a cambios. Para agendar un servicio, use la opción "Agendar Servicio" del menú.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}