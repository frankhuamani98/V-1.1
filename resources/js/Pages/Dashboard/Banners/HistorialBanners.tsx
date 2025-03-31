import React from 'react';
 import DashboardLayout from '@/Layouts/DashboardLayout';
 import HistorialBanners from '@/Layouts/Partials/Banners/HistorialBanners';
 
 // Definir las props que recibe el componente
 interface HistorialBannersPageProps {
     auth: {
         user: {
             username: string;
             email: string;
         };
     };
 }
 
 const HistorialBannersPage = ({ auth }: HistorialBannersPageProps) => {
     return (
         <DashboardLayout auth={auth}>
             <HistorialBanners />
         </DashboardLayout>
     );
 };
 
 export default HistorialBannersPage;