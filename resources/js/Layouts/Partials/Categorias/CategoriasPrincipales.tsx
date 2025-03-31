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
  X, 
  Search, 
  Filter, 
  Loader2, 
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Folder,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { router } from '@inertiajs/react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator 
} from '@/Components/ui/dropdown-menu';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { motion } from 'framer-motion';

interface Categoria {
    id: number;
    nombre: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface CategoriasPrincipalesProps {
    categorias: Categoria[];
}

const CategoriasPrincipales = ({ categorias }: CategoriasPrincipalesProps) => {
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('Activo');
    const [error, setError] = useState('');
    const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sortField, setSortField] = useState('nombre');
    const [sortDirection, setSortDirection] = useState('asc');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Gestión de notificaciones de éxito
    const showSuccessNotification = (message: string) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            setError('El nombre de la categoría es requerido');
            return;
        }

        setIsSubmitting(true);

        if (editandoCategoria) {
            // Si estamos editando, actualizamos la categoría
            router.put(`/categorias/principales/${editandoCategoria.id}`, {
                nombre,
                estado,
            }, {
                onSuccess: () => {
                    setNombre('');
                    setEstado('Activo');
                    setEditandoCategoria(null);
                    setError('');
                    setIsSubmitting(false);
                    showSuccessNotification('¡Categoría actualizada con éxito!');
                },
                onError: (errors) => {
                    setError(errors.nombre || 'Error al actualizar la categoría');
                    setIsSubmitting(false);
                },
            });
        } else {
            // Si no, creamos una nueva categoría
            router.post('/categorias/principales', {
                nombre,
                estado,
            }, {
                onSuccess: () => {
                    setNombre('');
                    setEstado('Activo');
                    setError('');
                    setIsSubmitting(false);
                    showSuccessNotification('¡Categoría creada con éxito!');
                },
                onError: (errors) => {
                    setError(errors.nombre || 'Error al guardar la categoría');
                    setIsSubmitting(false);
                },
            });
        }
    };

    const handleEditar = (categoria: Categoria) => {
        setNombre(categoria.nombre);
        setEstado(categoria.estado);
        setEditandoCategoria(categoria);
        setIsFormVisible(true);
        // Scroll al formulario si es necesario
        document.getElementById('categoria-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            router.delete(`/categorias/principales/${id}`, {
                onSuccess: () => {
                    showSuccessNotification('¡Categoría eliminada con éxito!');
                },
            });
        }
    };

    const cancelarEdicion = () => {
        setNombre('');
        setEstado('Activo');
        setEditandoCategoria(null);
        setError('');
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'Activo':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Inactivo':
                return <X className="h-4 w-4 text-red-500" />;
            case 'Pendiente':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Activo':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Inactivo':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'Pendiente':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Función para formatear fechas
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
    };

    // Ordenar y filtrar categorías
    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };

    // Filtrado y ordenación de categorías
    const filteredAndSortedCategorias = categorias
        .filter(categoria => {
            // Filtro por término de búsqueda
            const matchesSearch = categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                categoria.estado.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filtro por estado
            if (filter === 'all') return matchesSearch;
            return matchesSearch && categoria.estado.toLowerCase() === filter.toLowerCase();
        })
        .sort((a, b) => {
            if (sortField === 'nombre') {
                return sortDirection === 'asc' 
                    ? a.nombre.localeCompare(b.nombre)
                    : b.nombre.localeCompare(a.nombre);
            } else if (sortField === 'estado') {
                return sortDirection === 'asc'
                    ? a.estado.localeCompare(b.estado)
                    : b.estado.localeCompare(a.estado);
            } else if (sortField === 'fecha') {
                return sortDirection === 'asc'
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
        });

    // Estadísticas
    const stats = {
        total: categorias.length,
        activas: categorias.filter(cat => cat.estado === 'Activo').length,
        inactivas: categorias.filter(cat => cat.estado === 'Inactivo').length,
        pendientes: categorias.filter(cat => cat.estado === 'Pendiente').length
    };

    return (
        <div className="p-6 space-y-8">
            {/* Notificación de éxito */}
            {showSuccess && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-md flex items-center"
                >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    {successMessage}
                </motion.div>
            )}

            {/* Cabecera */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Folder className="mr-2 h-8 w-8 text-blue-600" />
                            Categorías Principales
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Gestiona las categorías principales para organizar tus productos y servicios
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsFormVisible(!isFormVisible)}
                            className="border-gray-300"
                        >
                            {isFormVisible ? 'Ocultar Formulario' : 'Mostrar Formulario'}
                        </Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                cancelarEdicion();
                                setIsFormVisible(true);
                            }}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Card className="bg-gray-50 border-none">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm text-gray-500">Total categorías</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-none">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-700">{stats.activas}</div>
                            <div className="text-sm text-green-600">Categorías activas</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-none">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-red-700">{stats.inactivas}</div>
                            <div className="text-sm text-red-600">Categorías inactivas</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-none">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-yellow-700">{stats.pendientes}</div>
                            <div className="text-sm text-yellow-600">Categorías pendientes</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Formulario */}
            {isFormVisible && (
                <Card id="categoria-form" className="shadow-md border-t-4 border-t-blue-500 overflow-hidden">
                    <CardHeader className="pb-2 bg-blue-50">
                        <CardTitle className="text-xl flex items-center text-blue-700">
                            {editandoCategoria ? (
                                <Edit className="mr-2 h-5 w-5" />
                            ) : (
                                <PlusCircle className="mr-2 h-5 w-5" />
                            )}
                            {editandoCategoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
                        </CardTitle>
                        {editandoCategoria && (
                            <CardDescription>
                                Editando: <span className="font-medium">{editandoCategoria.nombre}</span>
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="font-medium text-gray-700">Nombre de la Categoría</Label>
                                    <Input
                                        id="nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ingrese el nombre de la categoría"
                                        className="w-full"
                                    />
                                    {error && (
                                        <div className="flex items-center text-sm text-red-500 font-medium mt-1">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {error}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado" className="font-medium text-gray-700">Estado de la Categoría</Label>
                                    <Select value={estado} onValueChange={setEstado}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Activo" className="flex items-center">
                                                <div className="flex items-center">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                                    Activo
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Inactivo">
                                                <div className="flex items-center">
                                                    <X className="h-4 w-4 text-red-500 mr-2" />
                                                    Inactivo
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Pendiente">
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                                    Pendiente
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                {editandoCategoria && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={cancelarEdicion}
                                        className="border-gray-300"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Button>
                                )}
                                <Button 
                                    type="submit" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : editandoCategoria ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Actualizar Categoría
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Agregar Categoría
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Listado de categorías existentes */}
            <Tabs defaultValue="table" className="w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <TabsList className="mb-4 md:mb-0">
                        <TabsTrigger value="table">Vista Tabla</TabsTrigger>
                        <TabsTrigger value="grid">Vista Tarjetas</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full md:w-64"
                            />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full md:w-40">
                                <div className="flex items-center">
                                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                    <SelectValue placeholder="Filtrar por" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card className="shadow-md border-none overflow-hidden">
                    <CardContent className="p-0">
                        <TabsContent value="table" className="m-0">
                            <div className="overflow-x-auto">
                                {filteredAndSortedCategorias.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        {searchTerm || filter !== 'all' ? 
                                            'No se encontraron categorías con ese filtro' : 
                                            'No hay categorías disponibles'}
                                        <Button 
                                            variant="outline" 
                                            className="mt-2 mx-auto block"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilter('all');
                                            }}
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Limpiar filtros
                                        </Button>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => toggleSort('nombre')}
                                                >
                                                    <div className="flex items-center">
                                                        Nombre {getSortIcon('nombre')}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => toggleSort('estado')}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        Estado {getSortIcon('estado')}
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                                                    onClick={() => toggleSort('fecha')}
                                                >
                                                    <div className="flex items-center">
                                                        Fecha Creación {getSortIcon('fecha')}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredAndSortedCategorias.map((categoria) => (
                                                <tr 
                                                    key={categoria.id} 
                                                    className="hover:bg-blue-50 transition-colors"
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Folder className="h-5 w-5 text-blue-500 mr-2" />
                                                            <div className="font-medium text-gray-900">{categoria.nombre}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <div className="flex justify-center">
                                                            <Badge className={`${getEstadoColor(categoria.estado)} flex items-center justify-center gap-1 px-2 py-1`}>
                                                                {getEstadoIcon(categoria.estado)}
                                                                {categoria.estado}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                                        {formatDate(categoria.created_at)}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                onClick={() => handleEditar(categoria)}
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                onClick={() => handleEliminar(categoria.id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="grid" className="m-0 p-4">
                            {filteredAndSortedCategorias.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {searchTerm || filter !== 'all' ? 
                                        'No se encontraron categorías con ese filtro' : 
                                        'No hay categorías disponibles'}
                                    <Button 
                                        variant="outline" 
                                        className="mt-2 mx-auto block"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilter('all');
                                        }}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Limpiar filtros
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredAndSortedCategorias.map((categoria) => (
                                        <Card key={categoria.id} className="overflow-hidden transition-all hover:shadow-md">
                                            <CardContent className="p-0">
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="bg-blue-100 rounded-full p-2">
                                                                <Folder className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">{categoria.nombre}</h3>
                                                                <Badge className={`${getEstadoColor(categoria.estado)} flex items-center justify-center gap-1 mt-1 px-2 py-0.5`}>
                                                                    {getEstadoIcon(categoria.estado)}
                                                                    {categoria.estado}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="text-gray-500">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEditar(categoria)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleEliminar(categoria.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash className="mr-2 h-4 w-4" />
                                                                    Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                                                    Creado: {formatDate(categoria.created_at)}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
};

export default CategoriasPrincipales;