import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HorarioAtencion from '@/Layouts/Partials/Reserva/HorarioAtencion';
import { Head } from '@inertiajs/react';
import { HorarioRecurrente, HorarioExcepcion } from '@/types/horarios';

interface HorarioAtencionPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    horariosRecurrentes: HorarioRecurrente[];
    excepciones: HorarioExcepcion[];
}

const HorarioAtencionPage = ({ auth, horariosRecurrentes, excepciones }: HorarioAtencionPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title="Horarios de Atención" />
            <HorarioAtencion 
                horariosRecurrentes={horariosRecurrentes}
                excepciones={excepciones}
            />
        </DashboardLayout>
    );
};

export default HorarioAtencionPage;