import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NuevosPedidos from '@/Layouts/Partials/Pedidos/NuevosPedidos';

interface NuevosPedidosPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const NuevosPedidosPage = ({ auth }: NuevosPedidosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <NuevosPedidos />
    </DashboardLayout>
  );
};

export default NuevosPedidosPage;