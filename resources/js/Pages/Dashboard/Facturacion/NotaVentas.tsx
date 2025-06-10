import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import NotaVentas from '@/Layouts/Partials/Facturacion/NotaVentas';

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

interface NotaVentasPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    comprobantes: Comprobante[];
}

const NotaVentasPage = ({ auth, comprobantes }: NotaVentasPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <NotaVentas comprobantes={comprobantes} />
        </DashboardLayout>
    );
};

export default NotaVentasPage;
