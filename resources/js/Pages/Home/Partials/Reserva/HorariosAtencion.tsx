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
      <div className="w-full min-h-screen bg-white flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="border border-slate-200 shadow-md overflow-hidden bg-white rounded-lg">
            <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3.5 rounded-full">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-slate-800">Horarios de Atención</CardTitle>
                  <CardDescription className="text-sm text-slate-500 mt-1">
                    Consulta nuestros días y horarios de servicio
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Horarios regulares */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-medium text-slate-800 mb-5 flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  Días y Horarios Regulares
                </h2>
                {horarios.dias.length > 0 ? (
                  <ul className="space-y-3">
                    {horarios.dias.map((dia) => (
                      <li key={dia} className="flex items-center justify-between py-2.5 px-4 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors duration-200">
                        <span className="font-medium text-slate-700 text-base">{dia}</span>
                        <span className="text-slate-600 text-base bg-slate-100 px-3 py-1 rounded-md">{horarios.horarios[dia]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-base p-4 bg-slate-50 rounded-lg">No hay horarios regulares configurados.</p>
                )}
              </div>
              {/* Excepciones */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-medium text-slate-800 mb-5 flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-md">
                    <AlertCircle className="h-5 w-5 text-indigo-600" />
                  </div>
                  Excepciones y Días Especiales
                </h2>
                {tieneExcepciones ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-base text-left text-slate-700">
                      <thead className="text-sm text-slate-600 bg-slate-50 border-b border-slate-200">
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
                          <tr key={excepcion.fecha} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                            <td className="px-4 py-3 font-medium text-slate-700">
                              {excepcion.fecha_formateada}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {excepcion.activo ? (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-emerald-500" />
                                  <span>{excepcion.hora_inicio} - {excepcion.hora_fin}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-rose-400" /> Cerrado
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {excepcion.activo ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle className="h-4 w-4 mr-1.5" /> Abierto
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-50 text-rose-700 border border-rose-200">
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
                  <p className="text-slate-500 text-base p-4 bg-slate-50 rounded-lg">No hay excepciones programadas para los próximos meses.</p>
                )}
              </div>
            </div>
            <div className="mt-8 bg-slate-50 border border-slate-200 p-5 rounded-lg flex items-start gap-3 shadow-sm">
              <div className="bg-slate-100 p-2 rounded-md mt-0.5">
                <Info className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-base text-slate-600">
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