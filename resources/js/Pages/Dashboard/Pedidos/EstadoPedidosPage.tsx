import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import EstadoPedidos from '@/Layouts/Partials/Pedidos/EstadoPedidos';

interface EstadoPedidosPageProps {
  auth: {
    user: {
      username: string;
      email: string;
    };
  };
}

const EstadoPedidosPage = ({ auth }: EstadoPedidosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <EstadoPedidos />
    </DashboardLayout>
  );
};

export default EstadoPedidosPage;