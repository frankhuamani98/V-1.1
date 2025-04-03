import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InventarioProductos from '@/Layouts/Partials/Productos/InventarioProductos';

interface InventarioProductosPageProps {
    productos: any[]; // O define una interfaz más específica
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const InventarioProductosPage = ({ productos, auth }: InventarioProductosPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <InventarioProductos productos={productos} />
        </DashboardLayout>
    );
};

export default InventarioProductosPage;