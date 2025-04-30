import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import InventarioProductos from '@/Layouts/Partials/Productos/InventarioProductos';

interface InventarioProductosPageProps {
    productos: {
        id: number;
        codigo: string;
        nombre: string;
        precio: number;
        stock: number;
        estado: string;
        imagen_principal: string | null;
        imagenes_adicionales: Array<{
            url: string;
            estilo?: string;
        }> | null;
        categoria: {
            nombre: string;
        };
        subcategoria: {
            nombre: string;
        };
        motos: Array<{
            marca: string;
            modelo: string;
            año: number;
        }>;
    }[];
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const InventarioProductosPage = ({ productos, auth }: InventarioProductosPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <InventarioProductos productos={productos} />
        </DashboardLayout>
    );
};

export default InventarioProductosPage;