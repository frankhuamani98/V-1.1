import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ListaGeneral from '@/Layouts/Partials/Servicio/ListaGeneral';
import { Head } from '@inertiajs/react';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: string;
  duracion_estimada: number;
  estado: boolean;
}

interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  orden: number;
  servicios: Servicio[];
}

interface ListaGeneralPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
  categorias: CategoriaServicio[];
}

const ListaGeneralPage = ({ auth, categorias }: ListaGeneralPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <Head title="Lista General de Servicios" />
      <ListaGeneral categorias={categorias} />
    </DashboardLayout> 
  );
};

export default ListaGeneralPage;