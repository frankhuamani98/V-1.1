import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AgregarServicio from '@/Layouts/Partials/Servicio/AgregarServicio';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface CategoriaServicio {
    id: number;
    nombre: string;
}

interface Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    categoria_servicio_id: number;
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
    servicios?: Servicio[];
}

const AgregarServicioPage = ({ auth, servicio, categorias, servicios = [] }: AgregarServicioPageProps) => {
    const [listaServicios, setListaServicios] = useState<Servicio[]>(servicios);

    // Ya no necesitamos este useEffect porque ahora los servicios siempre se pasan desde el servidor
    useEffect(() => {
        setListaServicios(servicios);
    }, [servicios]);

    return (
        <DashboardLayout auth={auth}>
            <Head title={servicio ? "Editar Servicio" : "Agregar Servicio"} />
            <AgregarServicio 
                servicio={servicio}
                isEditing={!!servicio}
                categorias={categorias}
                servicios={listaServicios}
            />
        </DashboardLayout>
    );
};

export default AgregarServicioPage;