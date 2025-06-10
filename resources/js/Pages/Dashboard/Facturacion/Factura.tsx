import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Factura from '@/Layouts/Partials/Facturacion/Factura';

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

interface FacturaPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    comprobantes: Comprobante[];
}

const FacturaPage = ({ auth, comprobantes }: FacturaPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Factura comprobantes={comprobantes} />
        </DashboardLayout>
    );
};

export default FacturaPage;
