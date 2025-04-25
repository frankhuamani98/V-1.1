import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AgregarServicio from '@/Layouts/Partials/Servicio/AgregarServicio';
import { Head } from '@inertiajs/react';

interface CategoriaServicio {
    id: number;
    nombre: string;
}

interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: string;
    duracion_estimada: string;
    categoria_servicio_id: string;
    estado: boolean;
}

interface AgregarServicioPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    servicio?: Servicio;
    categorias: CategoriaServicio[];
}

const AgregarServicioPage = ({ auth, servicio, categorias }: AgregarServicioPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title={servicio ? "Editar Servicio" : "Agregar Servicio"} />
            <AgregarServicio 
                servicio={servicio}
                isEditing={!!servicio}
                categorias={categorias}
            />
        </DashboardLayout>
    );
};

export default AgregarServicioPage;