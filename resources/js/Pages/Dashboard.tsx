import React from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardContent from "../Layouts/DashboardContent";

interface DashboardProps {
    auth: any;
    totalPedidosCompletados: number;
}

const Dashboard: React.FC<DashboardProps> = ({ auth, totalPedidosCompletados }) => {
    return (
        <DashboardLayout auth={auth}>
            <DashboardContent
                totalPedidosCompletados={totalPedidosCompletados}
                cambioPedidosCompletados={0} // Reemplaza 0 con el valor adecuado
                progresoPedidosCompletados={0} // Reemplaza 0 con el valor adecuado
            />
        </DashboardLayout>
    );
};

export default Dashboard;