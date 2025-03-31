import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NuevasReservas from '@/Layouts/Partials/Reservas/NuevasReservas';

// Definir las props que recibe el componente
interface NuevasReservasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const NuevasReservasPage = ({ auth }: NuevasReservasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <NuevasReservas />
        </DashboardLayout>
    );
};

export default NuevasReservasPage;