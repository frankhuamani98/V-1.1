import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import TodasReservas from '@/Layouts/Partials/Reserva/TodasReservas';
import { Head } from '@inertiajs/react';

interface Moto {
    id: number;
    año: number;
    marca: string;
    modelo: string;
}

interface Reserva {
    id: number;
    usuario: string;
    moto: Moto;
    placa: string;
    servicio: string;
    horario_id: number;
    horario: {
        id: number;
        tipo: string;
        hora_inicio: string;
        hora_fin: string;
    } | null;
    fecha: string;
    hora: string;
    detalles: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface TodasReservasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    reservas: Reserva[];
}

const TodasReservasPage = ({ auth, reservas }: TodasReservasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title="Todas las Reservas" />
            <TodasReservas reservas={reservas} />
        </DashboardLayout>
    );
};

export default TodasReservasPage;