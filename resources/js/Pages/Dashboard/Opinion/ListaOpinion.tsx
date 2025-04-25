import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import OpinionesLista from "@/Layouts/Partials/Opinion/ListaOpinion";

interface Opinion {
  id: number;
  contenido: string;
  calificacion: number;
  util: number;
  created_at: string;
  es_soporte: boolean;
  usuario: {
    id: number;
    first_name: string;
    last_name: string;
  };
  respuestas: Array<{
    id: number;
    contenido: string;
    created_at: string;
    es_soporte: boolean;
    usuario: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }>;
}

interface Props {
  opiniones: Opinion[];
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const ListaOpinion = ({ opiniones, auth }: Props) => {
  return (
    <DashboardLayout auth={auth}>
      <Head title="Opiniones - Dashboard" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Opiniones</h1>
          
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Listado de Opiniones de Clientes</h2>
              
              <div className="mt-4">
                {opiniones.length > 0 ? (
                  <OpinionesLista 
                    opiniones={opiniones} 
                    showActions={true} 
                    isDashboard={true}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay opiniones disponibles para mostrar.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListaOpinion;