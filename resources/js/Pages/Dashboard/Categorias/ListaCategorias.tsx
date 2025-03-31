import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ListaCategorias from '@/Layouts/Partials/Categorias/ListaCategorias';

interface ListaCategoriasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    categorias: Array<{
        id: number;
        nombre: string;
        estado: string;
        created_at: string;
        updated_at: string;
    }>;
    subcategorias: Array<{
        id: number;
        nombre: string;
        estado: string;
        created_at: string;
        updated_at: string;
        categoria_id: number;
        categoria: {
            id: number;
            nombre: string;
        };
    }>;
}

const ListaCategoriasPage = ({ auth, categorias, subcategorias }: ListaCategoriasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <ListaCategorias categorias={categorias} subcategorias={subcategorias} />
        </DashboardLayout>
    );
};

export default ListaCategoriasPage;