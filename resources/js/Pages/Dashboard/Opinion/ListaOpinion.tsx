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
      <OpinionesLista 
        opiniones={opiniones} 
        showActions={true} 
        isDashboard={true}
      />
    </DashboardLayout>
  );
};

export default ListaOpinion;