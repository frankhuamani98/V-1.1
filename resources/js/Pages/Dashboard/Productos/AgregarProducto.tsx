import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import AgregarProducto from '@/Layouts/Partials/Productos/AgregarProducto';

interface AgregarProductoPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    categorias: Array<{
        id: number;
        nombre: string;
        subcategorias: Array<{
            id: number;
            nombre: string;
        }>;
    }>;
    motos: Array<{
        id: number;
        año: number;
        modelo: string;
        marca: string;
        estado: string;
    }>;
}

const AgregarProductoPage = ({ auth, categorias, motos }: AgregarProductoPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <AgregarProducto 
                categorias={categorias} 
                motos={motos}
            />
        </DashboardLayout>
    );
};

export default AgregarProductoPage;