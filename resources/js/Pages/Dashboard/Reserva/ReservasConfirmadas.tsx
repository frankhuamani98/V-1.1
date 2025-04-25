
import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ReservasConfirmadas from '@/Layouts/Partials/Reserva/ReservasConfirmadas';
import { Head } from '@inertiajs/react';

interface Reserva {
    id: number;
    usuario: string;
    vehiculo: string;
    placa: string;
    servicio: string;
    fecha: string;
    hora: string;
    detalles: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface ReservasConfirmadasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    reservas: Reserva[];
}

const ReservasConfirmadasPage = ({ auth, reservas }: ReservasConfirmadasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title="Reservas Confirmadas" />
            <ReservasConfirmadas reservas={reservas} />
        </DashboardLayout>
    );
};

export default ReservasConfirmadasPage;