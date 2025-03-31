import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import PedidosFinalizados from '@/Layouts/Partials/Pedidos/PedidosFinalizados';

interface PedidosFinalizadosPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const PedidosFinalizadosPage = ({ auth }: PedidosFinalizadosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <PedidosFinalizados />
    </DashboardLayout>
  );
};

export default PedidosFinalizadosPage;