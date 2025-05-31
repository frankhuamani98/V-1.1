import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {
  Folder,
  Tag,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Categoria {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

interface Subcategoria {
  id: number;
  nombre: string;
  estado: string;
  created_at: string;
  updated_at: string;
  categoria_id: number;
  categoria: {
    id: number;
    nombre: string;
  };
}

interface ListaCategoriasProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  onAddCategoria?: () => void;
  onAddSubcategoria?: (categoriaId: number) => void;
}

const CATEGORIAS_POR_PAGINA = 12;

const ListaCategorias: React.FC<ListaCategoriasProps> = ({
  categorias,
  subcategorias,
  onAddCategoria,
  onAddSubcategoria,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [popoverId, setPopoverId] = useState<number | null>(null);
  const popoverRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const getSubcategoriasForCategoria = (categoriaId: number) => {
    return subcategorias.filter((sub) => sub.categoria_id === categoriaId);
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    busqueda === '' ||
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    getSubcategoriasForCategoria(cat.id).some((sub) =>
      sub.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(categoriasFiltradas.length / CATEGORIAS_POR_PAGINA);
  const categoriasPaginadas = categoriasFiltradas.slice(
    (pagina - 1) * CATEGORIAS_POR_PAGINA,
    pagina * CATEGORIAS_POR_PAGINA
  );

  const togglePopover = (categoriaId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setPopoverId(prevId => prevId === categoriaId ? null : categoriaId);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverId !== null) {
        const popoverRef = popoverRefs.current[popoverId];
        const cardRef = cardRefs.current[popoverId];
        
        if (
          (popoverRef && !popoverRef.contains(event.target as Node)) &&
          (cardRef && !cardRef.contains(event.target as Node))
        ) {
          setPopoverId(null);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popoverId]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center shadow-sm">
            <Layers className="h-6 w-6 text-slate-800" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lista de Categorías</h1>
            <p className="text-slate-500 text-sm mt-1">Gestiona tus categorías y subcategorías</p>
          </div>
        </div>
        {onAddCategoria && (
          <Button
            onClick={onAddCategoria}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-600/20 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nueva Categoría
          </Button>
        )}
      </div>

      <div className="relative max-w-lg mx-auto mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400">
          <Search className="h-full w-full" />
        </div>
        <Input
          placeholder="Buscar categorías o subcategorías..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1);
            setPopoverId(null);
          }}
          className="w-full pl-12 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus:shadow-md focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2 mb-4 text-slate-500">
        <Grid className="h-5 w-5" />
        <span className="font-medium">Mostrando {categoriasPaginadas.length} de {categoriasFiltradas.length} categorías</span>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative p-6">
          {categoriasPaginadas.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col items-center justify-center gap-3">
                <Folder className="h-12 w-12 text-slate-300" />
                <p className="text-slate-400 text-lg font-medium">No se encontraron categorías</p>
              </div>
            </div>
          ) : (
            categoriasPaginadas.map((categoria) => {
              const subcategoriasDeCategoria = getSubcategoriasForCategoria(categoria.id);
              const isPopoverOpen = popoverId === categoria.id;
              return (
                <div key={categoria.id} className="relative">
                  <Card
                    ref={el => (cardRefs.current[categoria.id] = el)}
                    className={`group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 ${isPopoverOpen ? 'ring-2 ring-indigo-300' : ''}`}
                  >
                  <CardContent className="p-0">
                    <div 
                      className="flex items-start justify-between cursor-pointer p-5 bg-gradient-to-br from-white to-slate-50"
                      onClick={(e) => togglePopover(categoria.id, e)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Folder className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate text-lg">
                            {categoria.nombre}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-500">
                              {new Date(categoria.created_at).toLocaleDateString()}
                            </p>
                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                            <p className="text-xs text-slate-500">
                              {subcategoriasDeCategoria.length} subcategorías
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                          categoria.estado === 'Activo'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {categoria.estado}
                        </span>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-indigo-100 transition-all duration-300 ${isPopoverOpen ? 'bg-indigo-100' : ''}`}>
                          <ChevronDown className={`h-5 w-5 text-slate-500 group-hover:text-indigo-600 transition-transform duration-300 ${isPopoverOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                        </div>
                      </div>
                    </div>
                    
                  </CardContent>
                  </Card>
                  
                  <AnimatePresence>
                    {isPopoverOpen && (
                      <motion.div
                        ref={el => (popoverRefs.current[categoria.id] = el)}
                        className="absolute left-0 top-full z-50 mt-2 w-full min-w-[260px] bg-white border border-indigo-100 rounded-xl shadow-xl p-4"
                        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 500, 
                          damping: 30,
                          mass: 1
                        }}
                      >
                        <div>
                          {subcategoriasDeCategoria.length === 0 ? (
                            <div className="text-slate-400 text-sm py-4 text-center">
                              <div className="flex flex-col items-center justify-center gap-2 py-2">
                                <Tag className="h-8 w-8 text-slate-300" />
                                <p>Sin subcategorías</p>
                              </div>
                            </div>
                          ) : (
                            <div className="max-h-56 overflow-y-auto flex flex-col gap-2 pr-2">
                              {subcategoriasDeCategoria.map((subcategoria) => (
                                <motion.div
                                  key={subcategoria.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-sm border hover:shadow-md transition-all duration-200 ${
                                    subcategoria.estado === 'Activo'
                                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-100 hover:from-emerald-100 hover:to-teal-100'
                                      : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Tag className="h-3.5 w-3.5" />
                                  </div>
                                  <span className="flex-1">{subcategoria.nombre}</span>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          {onAddSubcategoria && (
                            <Button
                              onClick={() => onAddSubcategoria(categoria.id)}
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2 border-indigo-200 hover:bg-indigo-50 text-indigo-700 py-2.5 mt-4 transition-all duration-300 hover:scale-[1.02]"
                            >
                              <PlusCircle className="h-4 w-4" />
                              Añadir subcategoría
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
        {totalPaginas > 1 && (
          <div className="flex justify-between items-center gap-2 mt-8 border-t border-slate-100 pt-6 px-6 pb-4">
            <p className="text-sm text-slate-500">
              Mostrando {((pagina - 1) * CATEGORIAS_POR_PAGINA) + 1} a {Math.min(pagina * CATEGORIAS_POR_PAGINA, categoriasFiltradas.length)} de {categoriasFiltradas.length} categorías
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="h-10 w-10 p-0 rounded-lg border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg">
                {pagina} de {totalPaginas}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="h-10 w-10 p-0 rounded-lg border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaCategorias;