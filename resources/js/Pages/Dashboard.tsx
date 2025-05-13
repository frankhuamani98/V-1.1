import React from "react";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardContent from "../Layouts/DashboardContent";

interface DashboardProps {
    auth: any;
}

const Dashboard: React.FC<DashboardProps> = ({ auth }) => {
    return (
        <DashboardLayout auth={auth}>
            <DashboardContent />
        </DashboardLayout>
    );
};

export default Dashboard;