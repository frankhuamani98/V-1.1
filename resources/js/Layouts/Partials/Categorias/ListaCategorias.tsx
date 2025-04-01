import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  FolderIcon, 
  FolderOpenIcon, 
  TagIcon, 
  FilterIcon,
  LayoutGrid,
  Search,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

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

const ListaCategorias: React.FC<ListaCategoriasProps> = ({ 
    categorias, 
    subcategorias,
    onAddCategoria,
    onAddSubcategoria
}) => {
    const [expandedCategorias, setExpandedCategorias] = useState<Record<number, boolean>>({});
    const [filtro, setFiltro] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos');
    const [busqueda, setBusqueda] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Expandir automáticamente la primera categoría al cargar
    useEffect(() => {
        if (categorias.length > 0) {
            setExpandedCategorias({ [categorias[0].id]: true });
        }
    }, []);

    const simularCarga = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    const toggleCategoria = (id: number) => {
        setExpandedCategorias(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getSubcategoriasForCategoria = (categoriaId: number) => {
        return subcategorias.filter(sub => sub.categoria_id === categoriaId);
    };

    const categoriasFiltradas = categorias
        .filter(cat => filtro === 'Todos' || cat.estado === filtro)
        .filter(cat => 
            busqueda === '' || 
            cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            getSubcategoriasForCategoria(cat.id).some(sub => 
                sub.nombre.toLowerCase().includes(busqueda.toLowerCase())
            )
        );

    // Función para formatear fechas
    const formatearFecha = (fechaStr: string) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Calcular estadísticas
    const categoriasActivas = categorias.filter(cat => cat.estado === 'Activo').length;
    const subcategoriasActivas = subcategorias.filter(sub => sub.estado === 'Activo').length;

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
                            <LayoutGrid className="mr-3 h-7 w-7 text-indigo-600" />
                            Gestión de Categorías
                        </h1>
                        <div className="h-1 w-24 bg-indigo-600 rounded-full"></div>
                    </div>
                    
                    {onAddCategoria && (
                        <button 
                            onClick={onAddCategoria}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Nueva Categoría
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Panel lateral izquierdo - Estadísticas */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden">
                            <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                                <CardTitle className="text-lg font-semibold text-gray-800">
                                    Resumen
                                </CardTitle>
                                <CardDescription className="text-indigo-600 text-xs mt-1">
                                    Estadísticas generales
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-5">
                                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <FolderIcon className="h-5 w-5 text-indigo-600" />
                                            <span className="text-sm font-medium text-gray-600">Total Categorías</span>
                                        </div>
                                        <div className="flex items-end justify-between mt-2">
                                            <p className="text-2xl font-bold text-indigo-700">{categorias.length}</p>
                                            <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                                {categoriasActivas} activas
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-r from-emerald-50 to-green-100 p-4 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <TagIcon className="h-5 w-5 text-emerald-600" />
                                            <span className="text-sm font-medium text-gray-600">Total Subcategorías</span>
                                        </div>
                                        <div className="flex items-end justify-between mt-2">
                                            <p className="text-2xl font-bold text-emerald-700">{subcategorias.length}</p>
                                            <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                                {subcategoriasActivas} activas
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-5">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <FilterIcon className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-600">Filtrar por estado</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => { setFiltro('Todos'); simularCarga(); }}
                                                className={`px-4 py-2.5 rounded-lg text-xs font-medium w-full flex items-center justify-center ${
                                                    filtro === 'Todos' 
                                                        ? 'bg-blue-600 text-white shadow-md'  // Azul para "Todos" (neutral)
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                } transition-all`}
                                            >
                                                Todos
                                            </button>
                                            <button
                                                onClick={() => { setFiltro('Activo'); simularCarga(); }}
                                                className={`px-4 py-2.5 rounded-lg text-xs font-medium w-full flex items-center justify-center ${
                                                    filtro === 'Activo' 
                                                        ? 'bg-green-600 text-white shadow-md'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                } transition-all`}
                                            >
                                                Activos
                                            </button>
                                            <button
                                                onClick={() => { setFiltro('Inactivo'); simularCarga(); }}
                                                className={`px-4 py-2.5 rounded-lg text-xs font-medium w-full flex items-center justify-center ${
                                                    filtro === 'Inactivo' 
                                                        ? 'bg-red-600 text-white shadow-md'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                } transition-all`}
                                            >
                                                Inactivos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-none">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between text-gray-600 mb-3">
                                    <span className="text-sm font-medium">Últimas actualizaciones</span>
                                    <RefreshCw className="h-4 w-4" />
                                </div>
                                <div className="space-y-3">
                                    {[...categorias]
                                        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                                        .slice(0, 3)
                                        .map(cat => (
                                            <div key={`recent-${cat.id}`} className="bg-gray-50 p-3 rounded-lg text-xs">
                                                <div className="flex items-center">
                                                    <FolderIcon className="h-4 w-4 text-indigo-500 mr-2" />
                                                    <span className="font-medium text-gray-800">{cat.nombre}</span>
                                                </div>
                                                <p className="text-gray-500 mt-1">{formatearFecha(cat.updated_at)}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel principal - Lista de categorías */}
                    <div className="lg:col-span-9">
                        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                                        <span className="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3">
                                            <FolderOpenIcon className="h-5 w-5" />
                                        </span>
                                        Categorías y Subcategorías
                                    </CardTitle>
                                    
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-gray-100 focus:bg-white border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                                            Cargando...
                                        </span>
                                    ) : (
                                        `Mostrando ${categoriasFiltradas.length} de ${categorias.length} categorías`
                                    )}
                                </span>
                                <span className="text-sm px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                                    {filtro !== 'Todos' ? filtro : 'Todos los estados'}
                                </span>
                            </div>
                            
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="py-20 px-4 text-center">
                                        <RefreshCw className="h-8 w-8 text-indigo-500 mx-auto animate-spin mb-4" />
                                        <p className="text-gray-500 font-medium">Cargando información...</p>
                                    </div>
                                ) : categoriasFiltradas.length === 0 ? (
                                    <div className="py-12 px-4 text-center">
                                        <p className="text-gray-500 font-medium">No hay categorías que coincidan con el filtro seleccionado</p>
                                        <button 
                                            onClick={() => { setFiltro('Todos'); setBusqueda(''); }}
                                            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Mostrar todas las categorías
                                        </button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {categoriasFiltradas.map((categoria) => {
                                            const subcategoriasDeCategoria = getSubcategoriasForCategoria(categoria.id);
                                            const isExpanded = expandedCategorias[categoria.id] || false;
                                            const tieneSubcategorias = subcategoriasDeCategoria.length > 0;

                                            // Calcular si hay match en búsqueda en subcategorías
                                            const subcategoriaEnBusqueda = busqueda !== '' && 
                                                subcategoriasDeCategoria.some(sub => 
                                                    sub.nombre.toLowerCase().includes(busqueda.toLowerCase())
                                                );

                                            return (
                                                <div key={categoria.id} className="divide-y divide-gray-100">
                                                    <div
                                                        className={`p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 
                                                            hover:bg-gray-50 transition-colors cursor-pointer
                                                            ${isExpanded ? 'bg-indigo-50/40' : ''}
                                                            ${subcategoriaEnBusqueda && !isExpanded ? 'bg-yellow-50/30 border-l-4 border-yellow-400' : ''}
                                                        `}
                                                        onClick={() => toggleCategoria(categoria.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`
                                                                w-10 h-10 flex items-center justify-center rounded-full shadow-sm
                                                                ${isExpanded ? 'bg-indigo-100' : 'bg-gray-100'}
                                                                ${categoria.estado === 'Activo' ? 'ring-2 ring-green-200' : ''}
                                                            `}>
                                                                {tieneSubcategorias ? (
                                                                    isExpanded ? (
                                                                        <FolderOpenIcon className="h-5 w-5 text-indigo-600" />
                                                                    ) : (
                                                                        <FolderIcon className="h-5 w-5 text-gray-500" />
                                                                    )
                                                                ) : (
                                                                    <FolderIcon className="h-5 w-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-800">
                                                                        {categoria.nombre}
                                                                    </p>
                                                                    {tieneSubcategorias && (
                                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                                            {subcategoriasDeCategoria.length}
                                                                        </span>
                                                                    )}
                                                                    {subcategoriaEnBusqueda && !isExpanded && (
                                                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full animate-pulse">
                                                                            Contiene resultados
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Actualizado: {formatearFecha(categoria.updated_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                categoria.estado === 'Activo'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {categoria.estado}
                                                            </span>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                {onAddSubcategoria && (
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onAddSubcategoria(categoria.id);
                                                                        }}
                                                                        className="text-indigo-500 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-50"
                                                                    >
                                                                        <PlusCircle className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                                
                                                                {tieneSubcategorias && (
                                                                    <div className="text-gray-400">
                                                                        {isExpanded ? (
                                                                            <ChevronDown className="h-5 w-5" />
                                                                        ) : (
                                                                            <ChevronRight className="h-5 w-5" />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isExpanded && tieneSubcategorias && (
                                                        <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30">
                                                            <div className="pl-4 sm:pl-12 pr-4 py-2 grid gap-2">
                                                                {subcategoriasDeCategoria.map((subcategoria) => {
                                                                    const matchBusqueda = busqueda !== '' && 
                                                                        subcategoria.nombre.toLowerCase().includes(busqueda.toLowerCase());
                                                                    
                                                                    return (
                                                                        <div
                                                                            key={subcategoria.id}
                                                                            className={`p-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 
                                                                                rounded-lg hover:bg-white transition-colors shadow-sm
                                                                                ${matchBusqueda ? 'bg-yellow-50/50 border-l-2 border-yellow-400' : 'bg-white/60'}
                                                                            `}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`
                                                                                    w-8 h-8 flex items-center justify-center rounded-full
                                                                                    ${matchBusqueda ? 'bg-yellow-100' : 'bg-gray-100'}
                                                                                    ${subcategoria.estado === 'Activo' ? 'ring-1 ring-green-200' : ''}
                                                                                `}>
                                                                                    <TagIcon className="h-4 w-4 text-gray-500" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-medium text-gray-800">
                                                                                        {subcategoria.nombre}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                                        Actualizado: {formatearFecha(subcategoria.updated_at)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                                subcategoria.estado === 'Activo'
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : 'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                                {subcategoria.estado}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                                
                                                                {onAddSubcategoria && (
                                                                    <button
                                                                        onClick={() => onAddSubcategoria(categoria.id)}
                                                                        className="p-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                                                                    >
                                                                        <PlusCircle className="h-4 w-4" />
                                                                        <span className="text-sm">Añadir subcategoría</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaCategorias;