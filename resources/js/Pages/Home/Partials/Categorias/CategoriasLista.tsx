import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
import WhatsAppButton from "@/Components/WhatsAppButton"
import { 
  Card, 
  CardContent 
} from "@/Components/ui/card";
import { 
  HomeIcon,  
  ChevronRightIcon,
  LayoutGridIcon
} from "lucide-react";
import { Link } from '@inertiajs/react';

interface Categoria {
  id: number;
  nombre: string;
  estado: string;
}

interface Props extends PageProps {
  categorias: Categoria[];
}

export default function CategoriasLista({ categorias }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="Categorías - Rudolf Motors" />
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <nav className="mb-4">
          <ol className="flex items-center flex-wrap gap-2 py-2">
            <li>
              <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center text-sm">
                <HomeIcon className="w-3.5 h-3.5 mr-1" />
                Inicio
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm" title="Vista de categorías">
                Categorías
              </span>
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Categorías
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora nuestra selección de productos en nuestras <span className="font-semibold">categorías</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categorias.map((categoria) => (
            <Link key={categoria.id} href={`/categorias/${categoria.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <LayoutGridIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">{categoria.nombre}</h3>
                  <div className="mt-2 flex items-center text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm">Ver productos</span>
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}