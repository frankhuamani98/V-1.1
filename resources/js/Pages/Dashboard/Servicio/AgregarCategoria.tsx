import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AgregarCategoria from '@/Layouts/Partials/Servicio/AgregarCategoria';
import { Head } from '@inertiajs/react';

interface CategoriaServicio {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    orden: number;
}

interface AgregarCategoriaPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    categoria?: CategoriaServicio;
}

const AgregarCategoriaPage = ({ auth, categoria }: AgregarCategoriaPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Head title={categoria ? "Editar Categoría" : "Agregar Categoría"} />
            <AgregarCategoria 
                categoria={categoria}
                isEditing={!!categoria}
            />
        </DashboardLayout>
    );
};

export default AgregarCategoriaPage;