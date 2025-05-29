import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import DetalleReserva from '@/Layouts/Partials/Reserva/DetalleReserva';
import { Head } from '@inertiajs/react';

interface Usuario {
    id: number;
    name: string;
    email: string;
    telefono: string;
}

interface Servicio {
    id: number;
    nombre: string;
    precio_base: number;
    duracion_estimada: number;
}

interface Horario {
    id: number;
    tipo: string;
    dia_semana?: string;
    fecha?: string;
    hora_inicio: string;
    hora_fin: string;
}

interface Moto {
    id: number;
    año: number;
    marca: string;
    modelo: string;
}

interface Reserva {
    id: number;
    usuario: Usuario | null;
    moto: Moto;
    placa: string;
    servicios: Servicio[];
    horario_id: number;
    horario: Horario | null;
    fecha: string;
    hora: string;
    detalles: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface DetalleReservaPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    reserva: Reserva;
}

const DetalleReservaPage = ({ auth, reserva }: DetalleReservaPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title={`Reserva #${reserva.id}`} />
            <DetalleReserva reserva={reserva} />
        </DashboardLayout>
    );
};

export default DetalleReservaPage;