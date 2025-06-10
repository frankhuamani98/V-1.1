import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Boleta from '@/Layouts/Partials/Facturacion/Boleta';

interface Comprobante {
    id: number;
    numero_comprobante: string;
    tipo_comprobante: string;
    cliente: string;
    documento: string;
    fecha: string;
    estado: string;
    total: number;
    items: Array<{
        nombre_producto: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
}

interface BoletaPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    comprobantes: Comprobante[];
}

const BoletaPage = ({ auth, comprobantes }: BoletaPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Boleta comprobantes={comprobantes} />
        </DashboardLayout>
    );
};

export default BoletaPage;
