import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Factura from '@/Layouts/Partials/Facturacion/Factura';

interface FacturaPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const FacturaPage = ({ auth }: FacturaPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Factura />
        </DashboardLayout>
    );
};

export default FacturaPage;
