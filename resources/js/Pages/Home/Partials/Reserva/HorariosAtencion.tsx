import React, { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import ReservaNavigation from '@/Components/ReservaNavigation';
import { CalendarDays, Clock, AlertCircle, CheckCircle, Info } from "lucide-react";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

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
      <Header />
      <ReservaNavigation currentPage="Horarios de Atención" />
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-900 rounded-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-3.5 rounded-full">
                  <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Horarios de Atención</CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Consulta nuestros días y horarios de servicio
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Horarios regulares */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Días y Horarios Regulares
                </h2>
                {horarios.dias.length > 0 ? (
                  <ul className="space-y-3">
                    {horarios.dias.map((dia) => (
                      <li key={dia} className="flex items-center justify-between py-2.5 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors duration-200">
                        <span className="font-medium text-slate-700 dark:text-slate-200 text-base">{dia}</span>
                        <span className="text-slate-600 dark:text-slate-300 text-base bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">{horarios.horarios[dia]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-base p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">No hay horarios regulares configurados.</p>
                )}
              </div>
              {/* Excepciones */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                    <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  Excepciones y Días Especiales
                </h2>
                {tieneExcepciones ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-base text-left text-slate-700 dark:text-slate-200">
                      <thead className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Fecha
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Horario
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {horarios.excepciones.map((excepcion) => (
                          <tr key={excepcion.fecha} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                              {excepcion.fecha_formateada}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                              {excepcion.activo ? (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                  <span>{excepcion.hora_inicio} - {excepcion.hora_fin}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-rose-400 dark:text-rose-300" /> Cerrado
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {excepcion.activo ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700">
                                  <CheckCircle className="h-4 w-4 mr-1.5" /> Abierto
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-50 dark:bg-rose-900 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-700">
                                  <AlertCircle className="h-4 w-4 mr-1.5" /> {excepcion.motivo || "Cerrado"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-base p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">No hay excepciones programadas para los próximos meses.</p>
                )}
              </div>
            </div>
            <div className="mt-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-lg flex items-start gap-3 shadow-sm">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md mt-0.5">
                <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Esta información está sujeta a cambios. Para agendar un servicio, use la opción <span className="font-medium">"Agendar Servicio"</span> del menú.
              </p>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}