import React from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardContent from "../Layouts/DashboardContent";

interface DashboardProps {
    auth: any;
    totalPedidosCompletados: number;
    progresoPedidosCompletados: number;
    totalReservasCompletadas: number;
    progresoReservasCompletadas: number;
    totalNuevosUsuarios: number;
    progresoNuevosUsuarios: number;
    totalProductos: number;
    ventasMensuales: Array<{
        name: string;
        sales: number;
        target?: number;
    }>;
    reservasMensuales: Array<{
        name: string;
        reservas: number;
    }>;
    topProductosData: Array<{
        name: string;
        value: number;
    }>;
    stockPorCategoriaData: Array<{
        name: string;
        value: number;
    }>;
    usuariosNuevosMensuales: Array<{
        name: string;
        nuevos: number;
    }>;
    ultimasMotos: Array<{
        id: number;
        name: string;
        estado: string;
        date: string;
    }>;
    upcomingAppointments: Array<{
        id: number;
        customer: string;
        type: string;
        vehicle: string;
        time: string;
    }>;
    opiniones: Array<{
        id: number;
        user: { name: string } | null;
        calificacion: number;
        contenido: string;
        created_at: string;
        util: number;
        es_soporte: boolean;
    }>;
}

const Dashboard: React.FC<DashboardProps> = ({
    auth,
    totalPedidosCompletados,
    progresoPedidosCompletados,
    totalReservasCompletadas,
    progresoReservasCompletadas,
    totalNuevosUsuarios,
    progresoNuevosUsuarios,
    totalProductos,
    ventasMensuales,
    reservasMensuales,
    topProductosData,
    stockPorCategoriaData,
    usuariosNuevosMensuales,
    ultimasMotos,
    upcomingAppointments,
    opiniones,
}) => {
    return (
        <DashboardLayout auth={auth}>
            <DashboardContent
                totalPedidosCompletados={totalPedidosCompletados}
                cambioPedidosCompletados={progresoPedidosCompletados} // Usar progreso como porcentaje
                progresoPedidosCompletados={progresoPedidosCompletados}
                textoCambio="del mes actual" // Nueva prop para el texto
                totalReservasCompletadas={totalReservasCompletadas}
                progresoReservasCompletadas={progresoReservasCompletadas}
                totalNuevosUsuarios={totalNuevosUsuarios}
                progresoNuevosUsuarios={progresoNuevosUsuarios}
                totalProductos={totalProductos}
                ventasMensuales={ventasMensuales}
                reservasMensuales={reservasMensuales}
                topProductosData={topProductosData}
                stockPorCategoriaData={stockPorCategoriaData}
                usuariosNuevosMensuales={usuariosNuevosMensuales}
                ultimasMotos={ultimasMotos}
                upcomingAppointments={upcomingAppointments}
                opiniones={opiniones}
            />
        </DashboardLayout>
    );
};

export default Dashboard;