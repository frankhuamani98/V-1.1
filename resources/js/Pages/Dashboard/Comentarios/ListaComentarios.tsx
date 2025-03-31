import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ListaComentarios from '@/Layouts/Partials/Comentarios/ListaComentarios';

// Definir las props que recibe el componente
interface ListaComentariosPageProps {
    auth: {
        user: {
            username: string;
            email: string;
        };
    };
}

const ListaComentariosPage = ({ auth }: ListaComentariosPageProps) => {
    return (
        <DashboardLayout auth={auth}>
            <ListaComentarios />
        </DashboardLayout>
    );
};

export default ListaComentariosPage;