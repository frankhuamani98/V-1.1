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
  pedidos: any[];
}

const PedidosFinalizadosPage = ({ auth, pedidos }: PedidosFinalizadosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <PedidosFinalizados pedidos={pedidos} />
    </DashboardLayout>
  );
};

export default PedidosFinalizadosPage;