import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import CategoriasPrincipales from '@/Layouts/Partials/Categorias/CategoriasPrincipales';

// Definir las props que recibe el componente
interface CategoriasPrincipalesPageProps {
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
}

const CategoriasPrincipalesPage = ({ auth, categorias }: CategoriasPrincipalesPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <CategoriasPrincipales categorias={categorias} />
        </DashboardLayout>
    );
};

export default CategoriasPrincipalesPage;