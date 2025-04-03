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

            {/* Botón flotante de WhatsApp - ENLACE CORREGIDO */}
            <div className="fixed bottom-6 right-6 z-50">
                <a
                    href="https://wa.me/51925705938?text=Hola,%20quisiera%20más%20información"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] shadow-lg hover:bg-[#128C7E] transition-all duration-300 group"
                    aria-label="Chat de WhatsApp"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-10 h-10"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29-12.21c-5.297 0-9.588 4.312-9.588 9.622 0 1.964.57 3.848 1.647 5.453l-1.075 3.925 4.015-1.074c1.522.918 3.32 1.41 5.185 1.41 5.298 0 9.59-4.312 9.59-9.622 0-5.31-4.291-9.623-9.59-9.623m0 17.54c-1.75 0-3.48-.48-4.987-1.392l-3.59.975.963-3.52c-1.012-1.73-1.55-3.72-1.55-5.76 0-4.46 3.598-8.083 8.027-8.083 4.43 0 8.027 3.623 8.027 8.083 0 4.46-3.597 8.083-8.027 8.083"/>
                    </svg>
                    <span className="absolute right-20 w-auto p-2 min-w-max rounded-md bg-gray-800 text-white text-sm font-bold transition-all duration-200 scale-0 origin-right group-hover:scale-100">
                        ¿Necesitas ayuda?
                    </span>
                </a>
            </div>
        </>
    );
}
