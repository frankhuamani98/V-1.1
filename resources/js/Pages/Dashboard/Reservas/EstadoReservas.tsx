import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import EstadoReservas from '@/Layouts/Partials/Reservas/EstadoReservas';

// Definir las props que recibe el componente
interface EstadoReservasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const EstadoReservasPage = ({ auth }: EstadoReservasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <EstadoReservas />
        </DashboardLayout>
    );
};

export default EstadoReservasPage;