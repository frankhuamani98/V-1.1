import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Subcategorias from '@/Layouts/Partials/Categorias/Subcategorias';

interface SubcategoriasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    subcategorias: Array<{
        id: number;
        nombre: string;
        categoria_id: number;
        estado: string;
        created_at: string;
        updated_at: string;
        categoria: {
            id: number;
            nombre: string;
        };
    }>;
    categorias: Array<{
        id: number;
        nombre: string;
    }>;
}

const SubcategoriasPage = ({ auth, subcategorias, categorias }: SubcategoriasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Subcategorias subcategorias={subcategorias} categorias={categorias} />
        </DashboardLayout>
    );
};

export default SubcategoriasPage;