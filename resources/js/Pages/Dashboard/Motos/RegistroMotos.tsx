import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import RegistroMotos from '@/Layouts/Partials/Motos/RegistroMotos';

interface RegistroMotosPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    motos: Array<{
        id: number;
        año: number;
        modelo: string;
        marca: string;
        estado: string;
    }>;
}

const RegistroMotosPage = ({ auth, motos }: RegistroMotosPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <RegistroMotos motos={motos} />
        </DashboardLayout>
    );
};

export default RegistroMotosPage;