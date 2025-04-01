import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HistorialBanners from '@/Layouts/Partials/Banners/HistorialBanners';

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen_principal: string;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
  deleted_at: string | null;
  status: "active" | "deleted";
  tipo_imagen: "local" | "url";
}

interface HistorialBannersPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
  banners: Banner[];
}

const HistorialBannersPage = ({ auth, banners }: HistorialBannersPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <HistorialBanners banners={banners} />
    </DashboardLayout>
  );
};

export default HistorialBannersPage;