import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Boleta from '@/Layouts/Partials/Facturacion/Boleta';

interface BoletaPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const BoletaPage = ({ auth }: BoletaPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Boleta />
        </DashboardLayout>
    );
};

export default BoletaPage;
