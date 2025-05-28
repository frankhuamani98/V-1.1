import React from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardContent from "../Layouts/DashboardContent";

interface DashboardProps {
    auth: any;
    totalPedidosCompletados: number;
    progresoPedidosCompletados: number;
}

const Dashboard: React.FC<DashboardProps> = ({
    auth,
    totalPedidosCompletados,
    progresoPedidosCompletados,
}) => {
    return (
        <DashboardLayout auth={auth}>
            <DashboardContent
                totalPedidosCompletados={totalPedidosCompletados}
                cambioPedidosCompletados={progresoPedidosCompletados} // Usar progreso como porcentaje
                progresoPedidosCompletados={progresoPedidosCompletados}
                textoCambio="del mes actual" // Nueva prop para el texto
            />
        </DashboardLayout>
    );
};

export default Dashboard;