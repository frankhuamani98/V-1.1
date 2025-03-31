import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
}

const ListaCategorias: React.FC<ListaCategoriasProps> = ({ 
    categorias, 
    subcategorias 
}) => {
    const [expandedCategorias, setExpandedCategorias] = useState<Record<number, boolean>>({});

    const toggleCategoria = (id: number) => {
        setExpandedCategorias(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getSubcategoriasForCategoria = (categoriaId: number) => {
        return subcategorias.filter(sub => sub.categoria_id === categoriaId);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Categorías y Subcategorías</h1>
                <div className="h-px w-20 bg-blue-500 mx-auto mb-6"></div>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-medium text-gray-800">
                            Categorías y Subcategorías Registradas
                        </CardTitle>
                        <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                            {categorias.length} categorías • {subcategorias.length} subcategorías
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                        {categorias.map((categoria) => {
                            const subcategoriasDeCategoria = getSubcategoriasForCategoria(categoria.id);
                            const isExpanded = expandedCategorias[categoria.id] || false;

                            return (
                                <div key={categoria.id} className="divide-y divide-gray-100">
                                    <div
                                        className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => toggleCategoria(categoria.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {subcategoriasDeCategoria.length > 0 ? (
                                                isExpanded ? (
                                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" /> // Espacio para alinear
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800">{categoria.nombre}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Creado: {new Date(categoria.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            categoria.estado === 'Activo'
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-gray-50 text-gray-700'
                                        }`}>
                                            {categoria.estado}
                                        </span>
                                    </div>

                                    {isExpanded && subcategoriasDeCategoria.length > 0 && (
                                        <div className="bg-gray-50 pl-12">
                                            {subcategoriasDeCategoria.map((subcategoria) => (
                                                <div
                                                    key={subcategoria.id}
                                                    className="p-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {subcategoria.nombre}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Creado: {new Date(subcategoria.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        subcategoria.estado === 'Activo'
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-gray-50 text-gray-700'
                                                    }`}>
                                                        {subcategoria.estado}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ListaCategorias;