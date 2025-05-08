import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from "./Home/Header";
import MotorcycleSearch from "./Home/MotorcycleSearch";
import CompleteCarousel from "./Home/CompleteCarousel";
import Products from "./Home/Productos";
import Opiniones from "./Home/Opiniones";
import Footer from "./Home/Footer";
import WhatsAppButton from "@/Components/WhatsAppButton"; // Update the path to the correct location

interface WelcomeProps extends PageProps {
    featuredProducts: any[];
    bestSellingProducts: any[];
    allProducts: any[];
    motoData: {
        years: number[];
        brands: string[];
        models: Array<{
            modelo: string;
            marca: string;
        }>;
    };
    opiniones: {
        lista: Array<{
            id: number;
            calificacion: number;
            contenido: string;
            util: number;
            created_at: string;
            es_soporte: boolean;
            usuario: {
                id: number;
                nombre: string;
                iniciales: string;
            };
            respuestas: Array<{
                id: number;
                contenido: string;
                es_soporte: boolean;
                created_at: string;
                usuario: {
                    id: number;
                    nombre: string;
                    iniciales: string;
                };
            }>;
        }>;
        promedio: number;
        total: number;
        conteo: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    };
}

export default function Welcome({
    featuredProducts,
    bestSellingProducts,
    allProducts,
    motoData,
    opiniones,
    auth
}: WelcomeProps) {
    return (
        <>
            <Head title="Inicio" />

            <Header />
            <MotorcycleSearch motoData={motoData} />
            <CompleteCarousel />

            <Products />

            <Opiniones opiniones={opiniones} auth={auth} />

            <Footer />

            <WhatsAppButton />
        </>
    );
}
