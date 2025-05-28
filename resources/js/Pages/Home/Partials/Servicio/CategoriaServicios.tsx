import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { WrenchIcon, SettingsIcon, ActivityIcon, ZapIcon, ShieldIcon, SparklesIcon, RotateCwIcon, BoltIcon, PlugIcon, HomeIcon, Sparkles, Tag, BadgeCheck, Package } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";

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
          
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2.5 rounded-lg shadow-md">
                  <WrenchIcon className="h-5 w-5" />
                </div>
                Nuestros Servicios
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 ml-11 leading-relaxed max-w-3xl">
                Explora nuestra amplia gama de servicios especializados para el mantenimiento y cuidado de tu moto. 
                Selecciona una categoría para ver los servicios disponibles.
              </p>
            </motion.div>
            
            <Badge className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-slate-700 rounded-full text-xs font-medium shadow-sm">
              {categoriasServicio.length} categorías disponibles
            </Badge>
          </div>
        
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
            {categoriasServicio.map((categoria: Category, index: number) => {
              const iconIndex = index % categoryIcons.length;
              
              const colorClasses = [
                'from-indigo-500 to-indigo-600',
                'from-blue-500 to-blue-600',
                'from-cyan-500 to-cyan-600',
                'from-violet-500 to-violet-600',
                'from-purple-500 to-purple-600'
              ];
              const colorClass = colorClasses[index % colorClasses.length];
              const bgColorClass = colorClass.includes('indigo') ? 'bg-indigo-50 dark:bg-indigo-900' : 
                                  colorClass.includes('blue') ? 'bg-blue-50 dark:bg-blue-900' : 
                                  colorClass.includes('cyan') ? 'bg-cyan-50 dark:bg-cyan-900' : 
                                  colorClass.includes('violet') ? 'bg-violet-50 dark:bg-violet-900' : 'bg-purple-50 dark:bg-purple-900';
              const textColorClass = colorClass.includes('indigo') ? 'text-indigo-700 dark:text-indigo-300' : 
                                    colorClass.includes('blue') ? 'text-blue-700 dark:text-blue-300' : 
                                    colorClass.includes('cyan') ? 'text-cyan-700 dark:text-cyan-300' : 
                                    colorClass.includes('violet') ? 'text-violet-700 dark:text-violet-300' : 'text-purple-700 dark:text-purple-300';
              const borderColorClass = colorClass.includes('indigo') ? 'border-indigo-200 dark:border-indigo-700' : 
                                      colorClass.includes('blue') ? 'border-blue-200 dark:border-blue-700' : 
                                      colorClass.includes('cyan') ? 'border-cyan-200 dark:border-cyan-700' : 
                                      colorClass.includes('violet') ? 'border-violet-200 dark:border-violet-700' : 'border-purple-200 dark:border-purple-700';
              
              const icons = [
                <WrenchIcon className="h-5 w-5" />,
                <SettingsIcon className="h-5 w-5" />,
                <SparklesIcon className="h-5 w-5" />,
                <Tag className="h-5 w-5" />,
                <BadgeCheck className="h-5 w-5" />,
                <Package className="h-5 w-5" />
              ];
              
              return (
                <motion.div 
                  key={categoria.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a 
                    href={`/catalogo-servicios/categoria/${categoria.id}`}
                    className="block h-full"
                  >
                    <div className="bg-white dark:bg-slate-800 h-full rounded-lg border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
                      <div className={`h-1 w-full bg-gradient-to-r ${colorClass}`}></div>
                      
                      <div className="p-5">
                        <div className="flex items-start mb-3">
                          <div className={`w-10 h-10 rounded-lg ${bgColorClass} ${borderColorClass} border flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            {icons[index % icons.length]}
                          </div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-200 pt-1.5">
                            {categoria.nombre}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                          {categoria.descripcion ? (
                            <span className="line-clamp-2">{categoria.descripcion}</span>
                          ) : (
                            "Servicios especializados para tu moto"
                          )}
                        </p>
                        
                        <div className="mt-auto pt-2">
                          <div className={`text-sm ${textColorClass} font-medium flex items-center justify-end group-hover:underline transition-all duration-200`}>
                            Ver servicios
                            <svg className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}