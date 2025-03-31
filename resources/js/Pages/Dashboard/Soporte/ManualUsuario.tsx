import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ManualUsuario from '@/Layouts/Partials/Soporte/ManualUsuario';

// Definir las props que recibe el componente
interface ManualUsuarioPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const ManualUsuarioPage = ({ auth }: ManualUsuarioPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <ManualUsuario />
        </DashboardLayout>
    );
};

export default ManualUsuarioPage;