import React from "react";
import { Head, Link } from "@inertiajs/react"; 
import { router } from "@inertiajs/react";
import NavigationMenu from '@/Components/NavigationMenu';

interface Reserva {
  id: number;
  vehiculo: string;
  placa: string;
  servicio: string;
  horario_id?: number;
  fecha: string;
  hora: string;
  detalles: string | null;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  created_at: string;
  updated_at: string;
}

interface Props {
  reservas: Reserva[];
}

export default function MisCitas({ reservas }: Props) {
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmada":
        return "bg-blue-100 text-blue-800";
      case "completada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const cancelarReserva = (id: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      router.delete(route("reservas.destroy", id));
    }
  };

  return (
    <>
      <Head title="Mis Citas" />
        <NavigationMenu />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Mis Citas Agendadas</h1>
              <Link
                href={route("reservas.create")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Nueva Cita
              </Link>
            </div>
            
            {reservas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No tienes citas agendadas</p>
                <Link
                  href={route("reservas.create")}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Agendar mi primera cita
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehículo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservas.map((reserva) => (
                      <tr key={reserva.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reserva.servicio}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reserva.vehiculo}</div>
                          <div className="text-sm text-gray-500">Placa: {reserva.placa}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatFecha(reserva.fecha)}</div>
                          <div className="text-sm text-gray-500">{reserva.hora}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(reserva.estado)}`}>
                            {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {(reserva.estado === "pendiente" || reserva.estado === "confirmada") && (
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={route("reservas.edit", reserva.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Editar
                              </Link>
                              <button
                                onClick={() => cancelarReserva(reserva.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}