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
            />
        </DashboardLayout>
    );
};

export default Dashboard;