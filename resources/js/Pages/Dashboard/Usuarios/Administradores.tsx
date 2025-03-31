import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Administradores from '@/Layouts/Partials/Usuarios/Administradores';

interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
}

interface AdministradoresPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    admins: Admin[];
}

const AdministradoresPage = ({ auth, admins }: AdministradoresPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Administradores admins={admins} />
        </DashboardLayout>
    );
};

export default AdministradoresPage;