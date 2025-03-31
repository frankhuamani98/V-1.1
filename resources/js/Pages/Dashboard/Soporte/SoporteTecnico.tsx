import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import SoporteTecnico from '@/Layouts/Partials/Soporte/SoporteTecnico';

// Definir las props que recibe el componente
interface SoporteTecnicoPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const SoporteTecnicoPage = ({ auth }: SoporteTecnicoPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <SoporteTecnico />
        </DashboardLayout>
    );
};

export default SoporteTecnicoPage;