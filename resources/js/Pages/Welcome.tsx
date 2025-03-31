import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Header from "./Home/Header";
import MotorcycleSearch from "./Home/MotorcycleSearch";
import CompleteCarousel from "./Home/CompleteCarousel";
import Products from "./Home/Productos";
import Message from "./Home/Message";
import Footer from "./Home/Footer";

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
}

export default function Welcome({
    featuredProducts,
    bestSellingProducts,
    allProducts,
    motoData
}: WelcomeProps) {
    return (
        <>
            <Head title="Inicio" />
            
            <Header />
            <MotorcycleSearch motoData={motoData} />
            <CompleteCarousel />
            
            <Products 
                featuredProducts={featuredProducts}
                bestSellingProducts={bestSellingProducts}
                allProducts={allProducts}
            />
            
            <Message />
            <Footer />
        </>
    );
}