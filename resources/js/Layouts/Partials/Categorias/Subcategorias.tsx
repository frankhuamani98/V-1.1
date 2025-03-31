import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import {
  PlusCircle,
  Edit,
  Trash,
  Check,
  Search as SearchIcon,
  Loader2,
  AlertCircle,
  X,
  Filter as FilterIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/Components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/Components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/Components/ui/tooltip';

interface Subcategoria {
    id: number;
    nombre: string;
    categoria_id: number;
    categoria: {
        nombre: string;
    };
    estado: string;
    created_at: string;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface SubcategoriasProps {
    subcategorias: Subcategoria[];
    categorias: Categoria[];
}

const Subcategorias = ({ subcategorias: initialSubcategorias, categorias }: SubcategoriasProps) => {
    const [nombre, setNombre] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [estado, setEstado] = useState('Activo');
    const [error, setError] = useState('');
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>(initialSubcategorias);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        setSubcategorias(initialSubcategorias);
    }, [initialSubcategorias]);

    const showSuccessNotification = (message: string) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!categoriaId) {
            setError('Seleccione una categoría');
            return;
        }

        setIsSubmitting(true);

        if (editandoId) {
            router.put(`/categorias/subcategorias/${editandoId}`, {
                nombre,
                categoria_id: categoriaId,
                estado
            }, {
                onSuccess: () => {
                    resetForm();
                    showSuccessNotification('Subcategoría actualizada con éxito');
                    router.reload({ only: ['subcategorias'] });
                },
                onError: (errors) => {
                    setError(errors.message || 'Error al actualizar');
                    setIsSubmitting(false);
                }
            });
        } else {
            router.post('/categorias/subcategorias', {
                nombre,
                categoria_id: categoriaId,
                estado
            }, {
                onSuccess: () => {
                    resetForm();
                    showSuccessNotification('Subcategoría creada con éxito');
                    router.reload({ only: ['subcategorias'] });
                },
                onError: (errors) => {
                    setError(errors.message || 'Error al crear');
                    setIsSubmitting(false);
                }
            });
        }
    };

    const resetForm = () => {
        setNombre('');
        setCategoriaId('');
        setEstado('Activo');
        setError('');
        setEditandoId(null);
        setIsSubmitting(false);
    };

    const handleEditar = (subcategoria: Subcategoria) => {
        setNombre(subcategoria.nombre);
        setCategoriaId(subcategoria.categoria_id.toString());
        setEstado(subcategoria.estado);
        setEditandoId(subcategoria.id);
        document.getElementById('form-card')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Está seguro que desea eliminar esta subcategoría?')) {
            router.delete(`/categorias/subcategorias/${id}`, {
                onSuccess: () => {
                    showSuccessNotification('Subcategoría eliminada con éxito');
                    router.reload({ only: ['subcategorias'] });
                }
            });
        }
    };

    const filteredSubcategorias = subcategorias.filter(sub => {
        const matchesSearch = sub.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sub.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || sub.estado === statusFilter;
        const matchesCategory = categoryFilter === 'all' || sub.categoria_id.toString() === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <TooltipProvider>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
                {/* Notificación de éxito */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 border border-emerald-700/30"
                        >
                            <div className="bg-emerald-700/20 p-1.5 rounded-lg">
                                <Check className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{successMessage}</p>
                            </div>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="p-1 hover:bg-emerald-700/20 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 sm:pb-6 border-b border-gray-200/60">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Gestión de Subcategorías</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                            Organiza y administra las subcategorías de tu plataforma
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm();
                            document.getElementById('form-card')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all"
                        size="sm"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Añadir Nueva Subcategoría</span>
                        <span className="sm:hidden">Nueva</span>
                    </Button>
                </div>

                {/* Formulario */}
                <motion.div
                    id="form-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-gray-100/20">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                                {editandoId ? (
                                    <>
                                        <div className="bg-blue-100 p-1 sm:p-2 rounded-lg mr-2 sm:mr-3">
                                            <Edit className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                                        </div>
                                        <span className="hidden sm:inline">Editar Subcategoría</span>
                                        <span className="sm:hidden">Editar</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-blue-100 p-1 sm:p-2 rounded-lg mr-2 sm:mr-3">
                                            <PlusCircle className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                                        </div>
                                        <span className="hidden sm:inline">Crear Nueva Subcategoría</span>
                                        <span className="sm:hidden">Nueva</span>
                                    </>
                                )}
                            </h2>
                            {editandoId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetForm}
                                    className="text-gray-500 hover:text-gray-700 group"
                                >
                                    <X className="mr-1 h-4 w-4 group-hover:rotate-90 transition-transform" />
                                    <span className="hidden sm:inline">Cancelar Edición</span>
                                    <span className="sm:hidden">Cancelar</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* Campo Nombre */}
                                <div className="space-y-1 sm:space-y-2">
                                    <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                        Nombre
                                        <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Input
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ejm: Frenos de Disco"
                                        className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-500/50 border-gray-300 rounded-lg sm:rounded-xl"
                                    />
                                </div>

                                {/* Selector Categoría */}
                                <div className="space-y-1 sm:space-y-2">
                                    <Label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                        Categoría
                                        <span className="text-red-500 ml-1">*</span>
                                    </Label>
                                    <Select value={categoriaId} onValueChange={setCategoriaId}>
                                        <SelectTrigger className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-500/50 border-gray-300 rounded-lg sm:rounded-xl">
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg sm:rounded-xl">
                                            {categorias.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id.toString()}
                                                    className="rounded-md sm:rounded-lg hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center">
                                                        {cat.nombre}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Selector Estado */}
                                <div className="space-y-1 sm:space-y-2">
                                    <Label className="text-xs sm:text-sm font-medium text-gray-700">
                                        Estado
                                    </Label>
                                    <Select value={estado} onValueChange={setEstado}>
                                        <SelectTrigger className="h-10 sm:h-11 focus:ring-2 focus:ring-blue-500/50 border-gray-300 rounded-lg sm:rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg sm:rounded-xl">
                                            <SelectItem
                                                value="Activo"
                                                className="rounded-md sm:rounded-lg hover:bg-green-50 group"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 sm:mr-3 group-hover:bg-green-600" />
                                                    <span className="text-green-700">Activo</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem
                                                value="Inactivo"
                                                className="rounded-md sm:rounded-lg hover:bg-red-50 group"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2 sm:mr-3 group-hover:bg-red-600" />
                                                    <span className="text-red-700">Inactivo</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Mensaje de Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-red-50/80 border border-red-200 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-start"
                                >
                                    <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-700 font-medium text-sm sm:text-base">Error de validación</p>
                                        <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Botón de Envío */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 sm:h-11 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                                    size="sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Procesando...</span>
                                            <span className="sm:hidden">Procesando</span>
                                        </>
                                    ) : editandoId ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Actualizar Subcategoría</span>
                                            <span className="sm:hidden">Actualizar</span>
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Crear Subcategoría</span>
                                            <span className="sm:hidden">Crear</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Listado de Subcategorías */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-gray-100/20">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Subcategorías Existentes</h2>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                                        {filteredSubcategorias.length} {filteredSubcategorias.length === 1 ? 'resultado' : 'resultados'} encontrados
                                    </p>
                                </div>

                                {/* Barra de Búsqueda */}
                                <div className="relative w-full sm:w-64">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar subcategorías..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-10 sm:h-11 rounded-lg sm:rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="h-10 sm:h-11 min-w-[140px] sm:min-w-[160px] rounded-lg sm:rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/50">
                                        <div className="flex items-center">
                                            <FilterIcon className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="truncate text-xs sm:text-sm">
                                                {categoryFilter === 'all'
                                                    ? 'Todas las categorías'
                                                    : categorias.find(c => c.id.toString() === categoryFilter)?.nombre}
                                            </span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg sm:rounded-xl">
                                        <SelectItem value="all" className="rounded-md sm:rounded-lg">Todas las categorías</SelectItem>
                                        {categorias.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={cat.id.toString()}
                                                className="rounded-md sm:rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center">
                                                    {cat.nombre}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="h-10 sm:h-11 min-w-[120px] sm:min-w-[140px] rounded-lg sm:rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500/50">
                                        <div className="flex items-center">
                                            <FilterIcon className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="truncate text-xs sm:text-sm">
                                                {statusFilter === 'all' ? 'Todos los estados' : statusFilter}
                                            </span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg sm:rounded-xl">
                                        <SelectItem value="all" className="rounded-md sm:rounded-lg">Todos los estados</SelectItem>
                                        <SelectItem value="Activo" className="rounded-md sm:rounded-lg hover:bg-green-50">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 sm:mr-3" />
                                                <span className="text-xs sm:text-sm">Activo</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Inactivo" className="rounded-md sm:rounded-lg hover:bg-red-50">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 sm:mr-3" />
                                                <span className="text-xs sm:text-sm">Inactivo</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table className="border-collapse min-w-[600px] sm:min-w-full">
                            <TableHeader className="bg-gray-50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="px-4 sm:px-6 py-3 text-gray-500 font-medium text-xs sm:text-sm border-b border-gray-200/60">Nombre</TableHead>
                                    <TableHead className="px-4 sm:px-6 py-3 text-gray-500 font-medium text-xs sm:text-sm border-b border-gray-200/60">Categoría</TableHead>
                                    <TableHead className="px-4 sm:px-6 py-3 text-gray-500 font-medium text-xs sm:text-sm border-b border-gray-200/60">Estado</TableHead>
                                    <TableHead className="px-4 sm:px-6 py-3 text-gray-500 font-medium text-xs sm:text-sm border-b border-gray-200/60 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <AnimatePresence>
                                    {filteredSubcategorias.length > 0 ? (
                                        filteredSubcategorias.map((subcategoria) => (
                                            <motion.tr
                                                key={subcategoria.id}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="border-b border-gray-200/60 hover:bg-gray-50/50 transition-colors group"
                                            >
                                                <TableCell className="px-4 sm:px-6 py-3 font-medium text-gray-900 text-sm">
                                                    {subcategoria.nombre}
                                                </TableCell>
                                                <TableCell className="px-4 sm:px-6 py-3 text-gray-600 text-sm">
                                                    <div className="flex items-center">
                                                        {subcategoria.categoria.nombre}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 sm:px-6 py-3">
                                                    <Badge
                                                        variant={subcategoria.estado === 'Activo' ? 'default' : 'destructive'}
                                                        className="rounded-md sm:rounded-lg py-1 px-2 sm:py-1.5 sm:px-3 text-xs sm:text-sm font-medium shadow-sm"
                                                    >
                                                        {subcategoria.estado === 'Activo' ? (
                                                            <span className="flex items-center">
                                                                <span className="w-2 h-2 rounded-full bg-white/80 mr-1 sm:mr-2" />
                                                                {subcategoria.estado}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center">
                                                                <span className="w-2 h-2 rounded-full bg-white/80 mr-1 sm:mr-2" />
                                                                {subcategoria.estado}
                                                            </span>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 sm:px-6 py-3 text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditar(subcategoria)}
                                                                    className="text-blue-600 hover:bg-blue-50/50 rounded-lg p-1 sm:p-2 h-8 w-8"
                                                                >
                                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-white border shadow-lg rounded-lg sm:rounded-xl">
                                                                <p className="text-xs sm:text-sm">Editar subcategoría</p>
                                                            </TooltipContent>
                                                        </Tooltip>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEliminar(subcategoria.id)}
                                                                    className="text-red-600 hover:bg-red-50/50 rounded-lg p-1 sm:p-2 h-8 w-8"
                                                                >
                                                                    <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-white border shadow-lg rounded-lg sm:rounded-xl">
                                                                <p className="text-xs sm:text-sm">Eliminar subcategoría</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-gray-200/60"
                                        >
                                            <TableCell colSpan={4} className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                                                <div className="text-gray-400 flex flex-col items-center justify-center">
                                                    <SearchIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2 sm:mb-4" />
                                                    <p className="text-sm sm:text-lg font-medium">No se encontraron resultados</p>
                                                    <p className="text-xs sm:text-sm mt-0.5 sm:mt-1">Intenta ajustar los filtros de búsqueda</p>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default Subcategorias;