import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import EquipoLista from "@/Layouts/Partials/Equipo/Equipo";

interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
}

interface Props {
  equipo: MiembroEquipo[];
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const Equipo = ({ equipo, auth }: Props) => {
  return (
    <DashboardLayout auth={auth}>
      <EquipoLista equipo={equipo} isDashboard={true} />
    </DashboardLayout>
  );
};

export default Equipo;