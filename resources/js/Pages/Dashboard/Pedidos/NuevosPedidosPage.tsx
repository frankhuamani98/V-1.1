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
  pedidos: any[]; // Agregado para recibir los pedidos
}

const NuevosPedidosPage = ({ auth, pedidos }: NuevosPedidosPageProps) => {
  return (
    <DashboardLayout auth={auth}>
      <NuevosPedidos pedidos={pedidos} /> {/* Pasando los pedidos a NuevosPedidos */}
    </DashboardLayout>
  );
};

export default NuevosPedidosPage;