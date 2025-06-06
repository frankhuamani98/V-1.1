import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { WrenchIcon, SettingsIcon, ActivityIcon, ZapIcon, ShieldIcon, SparklesIcon, RotateCwIcon, BoltIcon, PlugIcon, HomeIcon, Sparkles, Tag, BadgeCheck, Package } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";
import WhatsAppButton from '@/Components/WhatsAppButton';

interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export default function CategoriaServicios() {
  const { categoriasServicio = [] } = usePage<any>().props;

  const categoryIcons = [
    <WrenchIcon className="h-4 w-4" />,
    <SettingsIcon className="h-4 w-4" />,
    <ActivityIcon className="h-4 w-4" />,
    <ZapIcon className="h-4 w-4" />,
    <ShieldIcon className="h-4 w-4" />,
    <SparklesIcon className="h-4 w-4" />,
    <RotateCwIcon className="h-4 w-4" />,
    <BoltIcon className="h-4 w-4" />,
    <PlugIcon className="h-4 w-4" />
  ];

  if (!Array.isArray(categoriasServicio) || categoriasServicio.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
        <Head title="Servicios - Rudolf Motors" />
        <Header />
        
        <div className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="mb-6">
              <ol className="flex items-center flex-wrap gap-2 py-2">
                <li>
                  <Link href="/" className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white flex items-center text-sm">
                    <HomeIcon className="w-3.5 h-3.5 mr-1" />
                    Inicio
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400 dark:text-slate-600">/</span>
                  <span className="text-gray-800 dark:text-white font-medium text-sm" title="Servicios">
                    Servicios
                  </span>
                </li>
              </ol>
            </nav>
          
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Nuestros Servicios</h2>
              <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-sm">
                Explora nuestra amplia gama de servicios especializados para el mantenimiento y cuidado de tu moto
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-gray-200 dark:border-slate-700 shadow-sm max-w-md mx-auto">
              <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">No hay categorías disponibles</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                Actualmente no hay categorías de servicios configuradas.
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col">
      <Head title="Servicios - Rudolf Motors" />
      <Header />
      
      <div className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <ol className="flex items-center flex-wrap gap-2 py-2">
              <li>
                <Link href="/" className="text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white flex items-center text-sm">
                  <HomeIcon className="w-3.5 h-3.5 mr-1" />
                  Inicio
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400 dark:text-slate-600">/</span>
                <span className="text-gray-800 dark:text-white font-medium text-sm" title="Servicios">
                  Servicios
                </span>
              </li>
            </ol>
          </nav>
          
          <div className="flex items-center justify-between mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4 mb-3">
                <span className="text-indigo-600 dark:text-indigo-400">Nuestros Servicios</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-3xl">
                Explora nuestra amplia gama de servicios especializados para el mantenimiento y cuidado de tu moto. 
                Selecciona una categoría para ver los servicios disponibles.
              </p>
            </motion.div>
            
            <Badge className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              {categoriasServicio.length} categorías
            </Badge>
          </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriasServicio.map((categoria: Category, index: number) => {
              const icons = [
                <WrenchIcon className="h-6 w-6" />,
                <SettingsIcon className="h-6 w-6" />,
                <SparklesIcon className="h-6 w-6" />,
                <Tag className="h-6 w-6" />,
                <BadgeCheck className="h-6 w-6" />,
                <Package className="h-6 w-6" />
              ];
              
              return (
                <motion.div 
                  key={categoria.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/catalogo-servicios/categoria/${categoria.id}`}
                    className="block h-full"
                  >
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm h-full rounded-2xl p-6 hover:shadow-xl dark:shadow-slate-900/10 transition-all duration-300 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent dark:from-indigo-900/20 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <div className="text-indigo-600 dark:text-indigo-400">
                              {icons[index % icons.length]}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-1">
                              {categoria.nombre}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {categoria.descripcion || "Servicios especializados para tu moto"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium inline-flex items-center group-hover:underline">
                            Ver servicios
                            <svg className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}