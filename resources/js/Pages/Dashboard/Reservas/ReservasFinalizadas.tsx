import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ReservasFinalizadas from '@/Layouts/Partials/Reservas/ReservasFinalizadas';

// Definir las props que recibe el componente
interface ReservasFinalizadasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const ReservasFinalizadasPage = ({ auth }: ReservasFinalizadasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <ReservasFinalizadas />
        </DashboardLayout>
    );
};

export default ReservasFinalizadasPage;