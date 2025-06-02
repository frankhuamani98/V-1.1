import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AgregarCategoria from '@/Layouts/Partials/Servicio/AgregarCategoria';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

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
    categorias?: CategoriaServicio[];
}

const AgregarCategoriaPage = ({ auth, categoria, categorias = [] }: AgregarCategoriaPageProps) => {
    const [listaCategorias, setListaCategorias] = useState<CategoriaServicio[]>(categorias);

    // Ya no necesitamos este useEffect porque ahora las categorías siempre se pasan desde el servidor
    useEffect(() => {
        setListaCategorias(categorias);
    }, [categorias]);

    return (
        <DashboardLayout auth={auth}>
            <Head title={categoria ? "Editar Categoría" : "Agregar Categoría"} />
            <AgregarCategoria 
                categoria={categoria}
                isEditing={!!categoria}
                categorias={listaCategorias}
            />
        </DashboardLayout>
    );
};

export default AgregarCategoriaPage;