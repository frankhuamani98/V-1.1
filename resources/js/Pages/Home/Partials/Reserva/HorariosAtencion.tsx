import React, { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import NavigationMenu from '@/Components/NavigationMenu';
import { CalendarDays, Clock, AlertCircle, CheckCircle } from "lucide-react";

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
  useEffect(() => {
    console.log("Horarios recibidos:", horarios);
    console.log("Excepciones:", horarios.excepciones);
  }, [horarios]);

  const tieneExcepciones = Array.isArray(horarios.excepciones) && horarios.excepciones.length > 0;
  
  return (
    <>
      <Head title="Horarios de Atención" />
      <NavigationMenu />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center py-0 px-0">
        <div className="w-[90%] mx-auto mt-4 mb-8">
          <div className="bg-white shadow-2xl rounded-2xl border border-blue-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <CalendarDays className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-800">
                Horarios de Atención
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Horarios regulares */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-blue-400" />
                  Días y Horarios Regulares
                </h2>
                {horarios.dias.length > 0 ? (
                  <ul className="space-y-3">
                    {horarios.dias.map((dia) => (
                      <li key={dia} className="flex items-center gap-2">
                        <span className="font-medium text-blue-700 w-32">{dia}:</span>
                        <span className="text-blue-900">{horarios.horarios[dia]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-blue-500 italic">No hay horarios regulares configurados.</p>
                )}
              </div>
              {/* Excepciones */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  Excepciones y Días Especiales
                </h2>
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
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {excepcion.activo ? (
                                <>
                                  <Clock className="inline h-4 w-4 text-green-400 mr-1" />
                                  {excepcion.hora_inicio} - {excepcion.hora_fin}
                                </>
                              ) : (
                                <span className="text-red-500 flex items-center gap-1">
                                  <AlertCircle className="inline h-4 w-4" /> Cerrado
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {excepcion.activo ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1">
                                  <CheckCircle className="h-4 w-4" /> Abierto
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1">
                                  <AlertCircle className="h-4 w-4" /> {excepcion.motivo || "Cerrado"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-red-500 italic">No hay excepciones programadas para los próximos meses.</p>
                )}
              </div>
            </div>
            <div className="mt-10 bg-blue-100 border-l-4 border-blue-400 p-4 rounded-xl flex items-center gap-3 shadow-sm">
              <CalendarDays className="h-6 w-6 text-blue-400" />
              <p className="text-base text-blue-800">
                Esta información está sujeta a cambios. Para agendar un servicio, use la opción <span className="font-semibold">"Agendar Servicio"</span> del menú.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}