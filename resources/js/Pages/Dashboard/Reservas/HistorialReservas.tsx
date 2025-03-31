import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HistorialReservas from '@/Layouts/Partials/Reservas/HistorialReservas';

// Definir las props que recibe el componente
interface HistorialReservasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const HistorialReservasPage = ({ auth }: HistorialReservasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <HistorialReservas />
        </DashboardLayout>
    );
};

export default HistorialReservasPage;