import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from "./Home/Header";
import MotorcycleSearch from "./Home/MotorcycleSearch";
import CompleteCarousel from "./Home/CompleteCarousel";
import Products from "./Home/Productos";
import Opiniones from "./Home/Opiniones";
import Footer from "./Home/Footer";
import WhatsAppButton from "@/Components/WhatsAppButton";

interface WelcomeProps extends PageProps {
    motoData: {
        years: number[];
        brandsByYear: Record<number, string[]>;
        modelsByYearAndBrand: Record<number, Record<string, string[]>>;
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
    productosDestacados: Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>;
    productosMasVendidos: Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>;
    todosProductos: Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>;
}

export default function Welcome({
    motoData,
    opiniones,
    auth,
    productosDestacados,
    productosMasVendidos,
    todosProductos
}: WelcomeProps) {
    return (
        <>
            <Head title="Inicio" />

            <Header />
            <MotorcycleSearch motoData={motoData} />
            <CompleteCarousel />
            
            <Products 
                productosDestacados={productosDestacados}
                productosMasVendidos={productosMasVendidos}
                todosProductos={todosProductos}
            />

            <Opiniones opiniones={opiniones} auth={auth} />

            <Footer />

            <WhatsAppButton />
        </>
    );
}