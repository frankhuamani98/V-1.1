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
            />
        </DashboardLayout>
    );
};

export default Dashboard;