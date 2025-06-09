import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Manual from '@/Layouts/Partials/Facturacion/Manual';

interface ManualPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const ManualPage = ({ auth }: ManualPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <Manual />
        </DashboardLayout>
    );
};

export default ManualPage;
