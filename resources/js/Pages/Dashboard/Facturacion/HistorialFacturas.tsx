import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HistorialFacturas from '@/Layouts/Partials/Facturacion/HistorialFacturas';

interface HistorialFacturasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const HistorialFacturasPage = ({ auth }: HistorialFacturasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <HistorialFacturas />
        </DashboardLayout>
    );
};

export default HistorialFacturasPage;