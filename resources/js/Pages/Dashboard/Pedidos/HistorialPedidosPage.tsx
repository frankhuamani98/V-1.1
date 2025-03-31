import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HistorialPedidos from '@/Layouts/Partials/Pedidos/HistorialPedidos';

interface HistorialPedidosPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const HistorialPedidosPage = ({ auth }: HistorialPedidosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <HistorialPedidos />
    </DashboardLayout>
  );
};

export default HistorialPedidosPage;