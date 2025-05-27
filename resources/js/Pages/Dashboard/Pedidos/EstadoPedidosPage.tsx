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
  pedidos: any[]; // Puedes tipar mejor si lo deseas
}

const EstadoPedidosPage = ({ auth, pedidos }: EstadoPedidosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <EstadoPedidos pedidos={pedidos} />
    </DashboardLayout>
  );
};

export default EstadoPedidosPage;