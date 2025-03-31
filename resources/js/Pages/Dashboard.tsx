import React from "react";
import DashboardLayout from "../Layouts/DashboardLayout"; // Asegúrate de que la ruta sea correcta
import DashboardContent from "../Layouts/DashboardContent"; // Asegúrate de que la ruta sea correcta

interface DashboardProps {
    auth: any; // Replace 'any' with the appropriate type if known
}

const Dashboard: React.FC<DashboardProps> = ({ auth }) => {
    return (
        <DashboardLayout auth={auth}>
            <DashboardContent />
        </DashboardLayout>
    );
};

export default Dashboard;