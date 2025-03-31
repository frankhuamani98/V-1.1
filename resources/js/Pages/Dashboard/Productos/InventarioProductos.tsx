import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InventarioProductos from '@/Layouts/Partials/Productos/InventarioProductos';

// Definir las props que recibe el componente
interface InventarioProductosPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const InventarioProductosPage = ({ auth }: InventarioProductosPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <InventarioProductos />
        </DashboardLayout>
    );
};

export default InventarioProductosPage;