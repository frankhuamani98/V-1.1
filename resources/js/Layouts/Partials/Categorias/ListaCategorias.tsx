import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, Grid, List, ArrowUpDown, Filter } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/Components/ui/command';

// Definición de tipos corregida
interface Categoria {
  id: number;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  created_at: string;
  updated_at: string;
  productos?: number;
  subcategorias_count?: number;
}

interface Subcategoria {
  id: number;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  created_at: string;
  updated_at: string;
  categoria_id: number;
  categoria: {
    id: number;
    nombre: string;
  };
  productos_count?: number;
}

interface CategoriasYSubcategoriasProps {
  categorias: Categoria[];
  subcategorias: Subcategoria[];
}

// Sistema premium de iconos unificado
const DynamicIcon = ({
  type,
  name,
  className = "",
  size = "default"
}: {
  type: 'category' | 'subcategory';
  name: string;
  className?: string;
  size?: 'small' | 'default' | 'large';
}) => {
  const sizeClasses = {
    small: 'h-3 w-3',
    default: 'h-4 w-4',
    large: 'h-5 w-5'
  };

  const iconSize = sizeClasses[size] || sizeClasses.default;

  const categoryIcons: Record<string, JSX.Element> = {
    'Electrónica': (
      <svg className={`${className} ${iconSize} text-blue-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    'Ropa': (
      <svg className={`${className} ${iconSize} text-pink-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    'Hogar': (
      <svg className={`${className} ${iconSize} text-amber-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    'Default': (
      <svg className={`${className} ${iconSize} text-gray-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  };

  const subcategoryIcons: Record<string, JSX.Element> = {
    'Smartphones': (
      <svg className={`${className} ${iconSize} text-blue-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    'Laptops': (
      <svg className={`${className} ${iconSize} text-purple-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'Muebles': (
      <svg className={`${className} ${iconSize} text-amber-800`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'Default': (
      <svg className={`${className} ${iconSize} text-gray-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  };

  if (type === 'category') {
    return categoryIcons[name] || categoryIcons['Default'];
  } else {
    return subcategoryIcons[name] || subcategoryIcons['Default'];
  }
};

type SortOption = 'nombre-asc' | 'nombre-desc' | 'estado-asc' | 'estado-desc' | 'productos-asc' | 'productos-desc' | 'fecha-asc' | 'fecha-desc';

const CategoriasYSubcategorias: React.FC<CategoriasYSubcategoriasProps> = ({
  categorias: initialCategorias,
  subcategorias: initialSubcategorias
}) => {
  const [activeTab, setActiveTab] = useState<'categorias' | 'subcategorias'>('categorias');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchCategorias, setSearchCategorias] = useState('');
  const [searchSubcategorias, setSearchSubcategorias] = useState('');
  const [sortCategorias, setSortCategorias] = useState<SortOption>('nombre-asc');
  const [sortSubcategorias, setSortSubcategorias] = useState<SortOption>('nombre-asc');
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategoria | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, type: 'category' | 'subcategory'} | null>(null);

  // New filter states
  const [filtroEstadoCategorias, setFiltroEstadoCategorias] = useState<string>('Todos');
  const [filtroEstadoSubcategorias, setFiltroEstadoSubcategorias] = useState<string>('Todos');
  const [filtroCategoriaSubcategorias, setFiltroCategoriaSubcategorias] = useState<string>('Todas');

  // Transformar los datos iniciales para mantener compatibilidad
  const [categorias, setCategorias] = useState<Categoria[]>(() => {
    return initialCategorias.map(cat => ({
      ...cat,
      productos: cat.productos || 0,
      subcategorias_count: initialSubcategorias.filter(sub => sub.categoria_id === cat.id).length
    }));
  });

  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>(() => {
    return initialSubcategorias.map(sub => ({
      ...sub,
      productos_count: sub.productos_count || 0
    }));
  });

  // Función para ordenar los datos
  const sortData = <T extends { nombre: string; estado: string; productos_count?: number; created_at: string }>(
    data: T[],
    sortOption: SortOption
  ): T[] => {
    return [...data].sort((a, b) => {
      switch (sortOption) {
        case 'nombre-asc': return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc': return b.nombre.localeCompare(a.nombre);
        case 'estado-asc': return a.estado.localeCompare(b.estado);
        case 'estado-desc': return b.estado.localeCompare(a.estado);
        case 'productos-asc': return (a.productos_count || 0) - (b.productos_count || 0);
        case 'productos-desc': return (b.productos_count || 0) - (a.productos_count || 0);
        case 'fecha-asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'fecha-desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
  };

  // Filtrados y ordenados
  const filteredAndSortedCategorias = sortData(
    categorias.filter(cat => {
      const matchesSearch =
        cat.nombre.toLowerCase().includes(searchCategorias.toLowerCase()) ||
        cat.estado.toLowerCase().includes(searchCategorias.toLowerCase());

      const matchesEstado =
        filtroEstadoCategorias === 'Todos' ||
        cat.estado === filtroEstadoCategorias;

      return matchesSearch && matchesEstado;
    }),
    sortCategorias
  );

  const filteredAndSortedSubcategorias = sortData(
    subcategorias.filter(sub => {
      const matchesSearch =
        sub.nombre.toLowerCase().includes(searchSubcategorias.toLowerCase()) ||
        sub.categoria.nombre.toLowerCase().includes(searchSubcategorias.toLowerCase());

      const matchesEstado =
        filtroEstadoSubcategorias === 'Todos' ||
        sub.estado === filtroEstadoSubcategorias;

      const matchesCategoria =
        filtroCategoriaSubcategorias === 'Todas' ||
        sub.categoria.nombre === filtroCategoriaSubcategorias;

      return matchesSearch && matchesEstado && matchesCategoria;
    }),
    sortSubcategorias
  );

  // Funciones para editar categorías
  const handleEditCategory = (category: Categoria) => {
    setEditingCategory(category);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategorias(categorias.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
    }
  };

  // Funciones para editar subcategorías
  const handleEditSubcategory = (subcategory: Subcategoria) => {
    setEditingSubcategory(subcategory);
  };

  const handleSaveSubcategory = () => {
    if (editingSubcategory) {
      setSubcategorias(subcategorias.map(sub =>
        sub.id === editingSubcategory.id ? editingSubcategory : sub
      ));
      setEditingSubcategory(null);
    }
  };

  // Funciones para eliminar
  const handleDeleteClick = (id: number, type: 'category' | 'subcategory') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'category') {
        setCategorias(categorias.filter(cat => cat.id !== itemToDelete.id));
        // También eliminamos las subcategorías asociadas
        setSubcategorias(subcategorias.filter(sub => sub.categoria_id !== itemToDelete.id));
      } else {
        setSubcategorias(subcategorias.filter(sub => sub.id !== itemToDelete.id));
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Componente de ordenamiento
  const SortDropdown = ({
    sortOption,
    onSortChange,
    type
  }: {
    sortOption: SortOption;
    onSortChange: (value: SortOption) => void;
    type: 'category' | 'subcategory';
  }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 h-8">
            <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
            <span className="sr-only sm:not-sr-only text-xs">Ordenar</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 border border-gray-200">
          <DropdownMenuItem onClick={() => onSortChange('nombre-asc')}>
            Nombre (A-Z)
            {sortOption === 'nombre-asc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('nombre-desc')}>
            Nombre (Z-A)
            {sortOption === 'nombre-desc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('estado-asc')}>
            Estado (A-Z)
            {sortOption === 'estado-asc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('estado-desc')}>
            Estado (Z-A)
            {sortOption === 'estado-desc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('productos-asc')}>
            Productos (↑)
            {sortOption === 'productos-asc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('productos-desc')}>
            Productos (↓)
            {sortOption === 'productos-desc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('fecha-asc')}>
            Fecha (↑)
            {sortOption === 'fecha-asc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('fecha-desc')}>
            Fecha (↓)
            {sortOption === 'fecha-desc' && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Componente de filtro por estado
  const EstadoFilter = ({
    type,
    currentFilter,
    onFilterChange
  }: {
    type: 'category' | 'subcategory',
    currentFilter: string,
    onFilterChange: (value: string) => void
  }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 h-8">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <span className="sr-only sm:not-sr-only text-xs">Estado</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <Command>
            <CommandGroup heading="Estado">
              <CommandItem
                onSelect={() => onFilterChange('Todos')}
                className={`cursor-pointer ${currentFilter === 'Todos' ? 'bg-gray-100' : ''}`}
              >
                Todos
              </CommandItem>
              <CommandItem
                onSelect={() => onFilterChange('Activo')}
                className={`cursor-pointer ${currentFilter === 'Activo' ? 'bg-gray-100' : ''}`}
              >
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                Activo
              </CommandItem>
              <CommandItem
                onSelect={() => onFilterChange('Inactivo')}
                className={`cursor-pointer ${currentFilter === 'Inactivo' ? 'bg-gray-100' : ''}`}
              >
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Inactivo
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  // Componente de filtro por categoría (solo para subcategorías)
  const CategoriaFilter = () => {
    const categoriasUnicas = Array.from(new Set(subcategorias.map(sub => sub.categoria.nombre)));

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 h-8">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <span className="sr-only sm:not-sr-only text-xs">Categoría</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <Command>
            <CommandGroup heading="Categorías">
              <CommandItem
                onSelect={() => setFiltroCategoriaSubcategorias('Todas')}
                className={`cursor-pointer ${filtroCategoriaSubcategorias === 'Todas' ? 'bg-gray-100' : ''}`}
              >
                Todas
              </CommandItem>
              {categoriasUnicas.map(categoria => (
                <CommandItem
                  key={categoria}
                  onSelect={() => setFiltroCategoriaSubcategorias(categoria)}
                  className={`cursor-pointer ${filtroCategoriaSubcategorias === categoria ? 'bg-gray-100' : ''}`}
                >
                  <DynamicIcon type="category" name={categoria} className="h-3 w-3 mr-2" />
                  {categoria}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Organiza tus productos en categorías y subcategorías</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'categorias' | 'subcategorias')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg max-w-md mx-auto border border-gray-200 shadow-xs">
            <TabsTrigger
              value="categorias"
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-indigo-100 text-xs sm:text-sm py-1.5"
            >
              <DynamicIcon type="category" name="Default" className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Categorías</span>
            </TabsTrigger>
            <TabsTrigger
              value="subcategorias"
              className="flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-indigo-100 text-xs sm:text-sm py-1.5"
            >
              <DynamicIcon type="subcategory" name="Default" className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Subcategorías</span>
            </TabsTrigger>
          </TabsList>

          {/* Categorías Tab */}
          <TabsContent value="categorias" className="space-y-4 md:space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-white border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Total Categorías</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{categorias.length}</h3>
                    </div>
                    <div className="bg-indigo-100 p-2 sm:p-3 rounded-full border border-indigo-200">
                      <DynamicIcon type="category" name="Default" className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-green-50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Activas</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">
                        {categorias.filter(c => c.estado === 'Activo').length}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full border border-green-200">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-red-50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Inactivas</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">
                        {categorias.filter(c => c.estado === 'Inactivo').length}
                      </h3>
                    </div>
                    <div className="bg-red-100 p-2 sm:p-3 rounded-full border border-red-200">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* List Card */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="p-3 sm:p-4 md:p-6 pb-0 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">Listado de Categorías</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {filteredAndSortedCategorias.length} de {categorias.length} categorías
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="relative w-full sm:w-48 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Buscar categorías..."
                        value={searchCategorias}
                        onChange={(e) => setSearchCategorias(e.target.value)}
                        className="pl-9 bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm h-8"
                      />
                    </div>
                    <div className="flex gap-2">
                      <EstadoFilter
                        type="category"
                        currentFilter={filtroEstadoCategorias}
                        onFilterChange={setFiltroEstadoCategorias}
                      />
                      <SortDropdown
                        sortOption={sortCategorias}
                        onSortChange={setSortCategorias}
                        type="category"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 hover:bg-gray-50 h-8"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      >
                        {viewMode === 'grid' ? (
                          <List className="h-3.5 w-3.5" />
                        ) : (
                          <Grid className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only sm:not-sr-only ml-1 text-xs">Vista {viewMode === 'grid' ? 'Lista' : 'Grid'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                {filteredAndSortedCategorias.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 md:py-12">
                    <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 md:mb-4">No se encontraron categorías</div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchCategorias('');
                        setFiltroEstadoCategorias('Todos');
                      }}
                      className="text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {filteredAndSortedCategorias.map((categoria) => (
                      <Card key={categoria.id} className="hover:shadow-md transition-shadow h-full border border-gray-100">
                        <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                          <div className="flex items-start justify-between">
                            <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg border border-indigo-200">
                              <DynamicIcon type="category" name={categoria.nombre} className="h-4 w-4 sm:h-5 sm:w-5" size="large" />
                            </div>
                            <Badge
                              variant={categoria.estado === 'Activo' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {categoria.estado}
                            </Badge>
                          </div>
                          <div className="mt-3 sm:mt-4">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{categoria.nombre}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Creada: {new Date(categoria.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-4 pt-3 border-t border-gray-100">
                            <div className="text-center">
                              <p className="text-xs sm:text-sm text-gray-500">Productos</p>
                              <p className="font-medium text-indigo-600 text-sm sm:text-base">{categoria.productos || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs sm:text-sm text-gray-500">Subcategorías</p>
                              <p className="font-medium text-indigo-600 text-sm sm:text-base">
                                {subcategorias.filter(sub => sub.categoria_id === categoria.id).length}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 flex justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-indigo-600 hover:bg-indigo-50 h-7 w-7"
                                    onClick={() => handleEditCategory(categoria)}
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Editar categoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 h-7 w-7"
                                    onClick={() => handleDeleteClick(categoria.id, 'category')}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Eliminar categoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-100 rounded-lg">
                    {filteredAndSortedCategorias.map((categoria) => (
                      <div key={categoria.id} className="p-2 sm:p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0 border border-indigo-200">
                              <DynamicIcon type="category" name={categoria.nombre} className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{categoria.nombre}</h3>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                                <Badge
                                  variant={categoria.estado === 'Activo' ? 'default' : 'destructive'}
                                  className="text-[10px] sm:text-xs"
                                >
                                  {categoria.estado}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 border border-gray-200">
                                  {categoria.productos || 0} prod.
                                </Badge>
                                <Badge variant="outline" className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-600 border border-indigo-200">
                                  {subcategorias.filter(sub => sub.categoria_id === categoria.id).length} subcat.
                                </Badge>
                                <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(categoria.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-indigo-600 hover:bg-indigo-50 h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() => handleEditCategory(categoria)}
                                  >
                                    <Edit2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Editar categoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() => handleDeleteClick(categoria.id, 'category')}
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Eliminar categoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subcategorías Tab */}
          <TabsContent value="subcategorias" className="space-y-4 md:space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-white border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Total Subcategorías</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{subcategorias.length}</h3>
                    </div>
                    <div className="bg-indigo-100 p-2 sm:p-3 rounded-full border border-indigo-200">
                      <DynamicIcon type="subcategory" name="Default" className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-green-50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Activas</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">
                        {subcategorias.filter(s => s.estado === 'Activo').length}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full border border-green-200">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-red-50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-500">Inactivas</p>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">
                        {subcategorias.filter(s => s.estado === 'Inactivo').length}
                      </h3>
                    </div>
                    <div className="bg-red-100 p-2 sm:p-3 rounded-full border border-red-200">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* List Card */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="p-3 sm:p-4 md:p-6 pb-0 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">Listado de Subcategorías</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {filteredAndSortedSubcategorias.length} de {subcategorias.length} subcategorías
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="relative w-full sm:w-48 md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Buscar subcategorías..."
                        value={searchSubcategorias}
                        onChange={(e) => setSearchSubcategorias(e.target.value)}
                        className="pl-9 bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm h-8"
                      />
                    </div>
                    <div className="flex gap-2">
                      <EstadoFilter
                        type="subcategory"
                        currentFilter={filtroEstadoSubcategorias}
                        onFilterChange={setFiltroEstadoSubcategorias}
                      />
                      <CategoriaFilter />
                      <SortDropdown
                        sortOption={sortSubcategorias}
                        onSortChange={setSortSubcategorias}
                        type="subcategory"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 hover:bg-gray-50 h-8"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      >
                        {viewMode === 'grid' ? (
                          <List className="h-3.5 w-3.5" />
                        ) : (
                          <Grid className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only sm:not-sr-only ml-1 text-xs">Vista {viewMode === 'grid' ? 'Lista' : 'Grid'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                {filteredAndSortedSubcategorias.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 md:py-12">
                    <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 md:mb-4">No se encontraron subcategorías</div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchSubcategorias('');
                        setFiltroEstadoSubcategorias('Todos');
                        setFiltroCategoriaSubcategorias('Todas');
                      }}
                      className="text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {filteredAndSortedSubcategorias.map((subcategoria) => (
                      <Card key={subcategoria.id} className="hover:shadow-md transition-shadow h-full border border-gray-100">
                        <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                          <div className="flex items-start justify-between">
                            <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg border border-indigo-200">
                              <DynamicIcon type="subcategory" name={subcategoria.nombre} className="h-4 w-4 sm:h-5 sm:w-5" size="large" />
                            </div>
                            <Badge
                              variant={subcategoria.estado === 'Activo' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {subcategoria.estado}
                            </Badge>
                          </div>
                          <div className="mt-3 sm:mt-4">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{subcategoria.nombre}</h3>
                            <div className="flex items-center gap-2 mt-1 sm:mt-2">
                              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200">
                                <DynamicIcon type="category" name={subcategoria.categoria.nombre} className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                {subcategoria.categoria.nombre}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Creada: {new Date(subcategoria.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
                            <p className="text-xs sm:text-sm text-gray-500">Productos asociados</p>
                            <p className="font-medium text-indigo-600 text-sm sm:text-base">{subcategoria.productos_count || 0} productos</p>
                          </div>
                          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 flex justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-indigo-600 hover:bg-indigo-50 h-7 w-7"
                                    onClick={() => handleEditSubcategory(subcategoria)}
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Editar subcategoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 h-7 w-7"
                                    onClick={() => handleDeleteClick(subcategoria.id, 'subcategory')}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Eliminar subcategoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-100 rounded-lg">
                    {filteredAndSortedSubcategorias.map((subcategoria) => (
                      <div key={subcategoria.id} className="p-2 sm:p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0 border border-indigo-200">
                              <DynamicIcon type="subcategory" name={subcategoria.nombre} className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{subcategoria.nombre}</h3>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                                <Badge variant="outline" className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-600 border border-indigo-200">
                                  <DynamicIcon type="category" name={subcategoria.categoria.nombre} className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                                  {subcategoria.categoria.nombre}
                                </Badge>
                                <Badge
                                  variant={subcategoria.estado === 'Activo' ? 'default' : 'destructive'}
                                  className="text-[10px] sm:text-xs"
                                >
                                  {subcategoria.estado}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 border border-gray-200">
                                  {subcategoria.productos_count || 0} prod.
                                </Badge>
                                <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(subcategoria.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-indigo-600 hover:bg-indigo-50 h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() => handleEditSubcategory(subcategoria)}
                                  >
                                    <Edit2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Editar subcategoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600 hover:bg-red-50 h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() => handleDeleteClick(subcategoria.id, 'subcategory')}
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs border border-gray-200">
                                  <p>Eliminar subcategoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de edición de categoría */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la categoría seleccionada
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Nombre</Label>
                <Input
                  id="category-name"
                  value={editingCategory.nombre}
                  onChange={(e) => setEditingCategory({...editingCategory, nombre: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="category-status"
                  checked={editingCategory.estado === 'Activo'}
                  onCheckedChange={(checked) => setEditingCategory({
                    ...editingCategory,
                    estado: checked ? 'Activo' : 'Inactivo'
                  })}
                />
                <Label htmlFor="category-status">
                  {editingCategory.estado === 'Activo' ? 'Activo' : 'Inactivo'}
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category-products">Productos</Label>
                  <Input
                    id="category-products"
                    type="number"
                    value={editingCategory.productos || 0}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      productos: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="category-subcategories">Subcategorías</Label>
                  <Input
                    id="category-subcategories"
                    type="number"
                    value={subcategorias.filter(sub => sub.categoria_id === editingCategory.id).length}
                    disabled
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSaveCategory}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición de subcategoría */}
      <Dialog open={!!editingSubcategory} onOpenChange={(open) => !open && setEditingSubcategory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Subcategoría</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la subcategoría seleccionada
            </DialogDescription>
          </DialogHeader>
          {editingSubcategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="subcategory-name">Nombre</Label>
                <Input
                  id="subcategory-name"
                  value={editingSubcategory.nombre}
                  onChange={(e) => setEditingSubcategory({...editingSubcategory, nombre: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="subcategory-category">Categoría</Label>
                <Input
                  id="subcategory-category"
                  value={editingSubcategory.categoria.nombre}
                  disabled
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="subcategory-status"
                  checked={editingSubcategory.estado === 'Activo'}
                  onCheckedChange={(checked) => setEditingSubcategory({
                    ...editingSubcategory,
                    estado: checked ? 'Activo' : 'Inactivo'
                  })}
                />
                <Label htmlFor="subcategory-status">
                  {editingSubcategory.estado === 'Activo' ? 'Activo' : 'Inactivo'}
                </Label>
              </div>
              <div>
                <Label htmlFor="subcategory-products">Productos</Label>
                <Input
                  id="subcategory-products"
                  type="number"
                  value={editingSubcategory.productos_count || 0}
                  onChange={(e) => setEditingSubcategory({
                    ...editingSubcategory,
                    productos_count: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSubcategory(null)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSaveSubcategory}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriasYSubcategorias;
