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
  pedidos: any; // Define the type of pedidos based on your data structure
}

const HistorialPedidosPage = ({ auth, pedidos }: HistorialPedidosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <HistorialPedidos pedidos={pedidos} />
    </DashboardLayout>
  );
};

export default HistorialPedidosPage;