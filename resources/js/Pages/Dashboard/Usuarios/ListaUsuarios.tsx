import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ListaUsuarios from '@/Layouts/Partials/Usuarios/ListaUsuarios';

interface ListaUsuariosPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
    users: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        dni: string;
        sexo: string;
        email: string;
        phone: string;
        address: string;
        role: string;
        status: string;
        created_at: string;
    }[];
}

const ListaUsuariosPage = ({ auth, users }: ListaUsuariosPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <ListaUsuarios users={users} />
        </DashboardLayout>
    );
};

export default ListaUsuariosPage;