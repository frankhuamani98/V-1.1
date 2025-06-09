import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NotaVentas from '@/Layouts/Partials/Facturacion/NotaVentas';

interface NotaVentasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const NotaVentasPage = ({ auth }: NotaVentasPageProps) => {    return (
        <DashboardLayout auth={auth}>
            <NotaVentas />
        </DashboardLayout>
    );
};

export default NotaVentasPage;
