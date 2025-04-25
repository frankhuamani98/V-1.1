import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HorarioAtencion from '@/Layouts/Partials/Reserva/HorarioAtencion';
import { Head } from '@inertiajs/react';

interface Horario {
    dia: string;
    inicio: string;
    fin: string;
    disponible: boolean;
}

interface HorarioAtencionPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    horarios: Horario[];
}

const HorarioAtencionPage = ({ auth, horarios }: HorarioAtencionPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title="Horarios de Atención" />
            <HorarioAtencion horarios={horarios} />
        </DashboardLayout>
    );
};

export default HorarioAtencionPage;