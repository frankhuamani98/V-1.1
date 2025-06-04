import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/Components/ui/dialog';
import { 
  Bike as Motorcycle, 
  BadgeCheck, 
  AlertCircle, 
  Calendar, 
  Tag, 
  Package as BoxIcon, 
  Plus, 
  Search,
  Edit,
  Trash,
  CalendarClock,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Moto {
    id: number;
    año: number;
    modelo: string;
    marca: string;
    estado: string;
}

interface RegistroMotosProps {
    motos: Moto[];
}

const RegistroMotos = ({ motos }: RegistroMotosProps) => {
    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        año: '',
        modelo: '',
        marca: '',
        estado: 'Activo',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [motoToDelete, setMotoToDelete] = useState<number | null>(null);
    
    const [formDialogOpen, setFormDialogOpen] = useState(false);

    const estadoColors: Record<string, string> = {
        'Activo': 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 shadow-sm',
        'Inactivo': 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200 shadow-sm',
        'Mantenimiento': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200 shadow-sm',
        'Vendido': 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200 shadow-sm',
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/motos/registro/${data.id}`, {
                onSuccess: () => {
                    toast.success('Motocicleta actualizada correctamente');
                    resetForm();
                    setFormDialogOpen(false);
                },
            });
        } else {
            post('/motos/registro', {
                onSuccess: () => {
                    toast.success('Motocicleta registrada correctamente');
                    resetForm();
                    setFormDialogOpen(false);
                },
            });
        }
    };

    const handleEdit = (moto: Moto) => {
        setData({
            id: moto.id,
            año: moto.año.toString(),
            modelo: moto.modelo,
            marca: moto.marca,
            estado: moto.estado,
        });
        clearErrors();
        setIsEditing(true);
        setFormDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        setMotoToDelete(id);
        setDeleteDialogOpen(true);
    };
    
    const confirmDelete = () => {
        if (motoToDelete) {
            destroy(`/motos/registro/${motoToDelete}`, {
                onSuccess: () => {
                    toast.success('Motocicleta eliminada correctamente');
                    resetForm();
                    setDeleteDialogOpen(false);
                    setMotoToDelete(null);
                },
            });
        }
    };

    const resetForm = () => {
        setData({
            id: null,
            año: '',
            modelo: '',
            marca: '',
            estado: 'Activo',
        });
        setIsEditing(false);
        clearErrors();
    };

    const filteredMotos = motos.filter(moto => {
        const matchesSearch = 
            moto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            moto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            moto.año.toString().includes(searchTerm);
            
        const matchesEstado = filterEstado ? moto.estado === filterEstado : true;
        
        return matchesSearch && matchesEstado;
    });

    const totalPages = Math.ceil(filteredMotos.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedMotos = filteredMotos.slice(startIndex, startIndex + itemsPerPage);

    const changePage = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6">
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-lg border-0 shadow-lg max-w-[95vw] sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-medium">Confirmar eliminación</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            ¿Estás seguro de que deseas eliminar esta motocicleta? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 flex-col sm:flex-row">
                        <AlertDialogCancel 
                            onClick={() => setMotoToDelete(null)}
                            className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg mr-3 shadow-md">
                            <Motorcycle className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        Gestión de Motocicletas
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 mt-2 pl-12 sm:pl-14 flex items-center">
                        <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
                        Sistema de administración de inventario
                    </p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <Button 
                                onClick={() => {
                                    resetForm();
                                    setFormDialogOpen(true);
                                    setIsEditing(false);
                                }}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md px-4 sm:px-5 py-2 h-auto text-xs sm:text-sm rounded-full transition-all duration-200 font-medium"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                Nueva motocicleta
                            </Button>
                            
                            <div className="flex items-center text-xs sm:text-sm bg-slate-100 py-1.5 px-2 sm:px-3 rounded-lg">
                                <span className="text-slate-500 mr-1 sm:mr-1.5">Total:</span>
                                <span className="font-medium text-slate-800">{motos.length}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
                            <div className="relative flex-1 sm:w-64 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <Input
                                    placeholder="Buscar motocicletas..."
                                    className="pl-9 w-full bg-white text-xs sm:text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                            
                            <Select
                                value={filterEstado || "todos"}
                                onValueChange={(value) => {
                                    setFilterEstado(value === "todos" ? null : value);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="min-w-[120px] w-auto sm:w-40 text-xs sm:text-sm bg-white rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <div className="flex items-center">
                                        <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-slate-400" />
                                        {filterEstado || "Todos"}
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    <SelectItem value="Activo">Activo</SelectItem>
                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                
                <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                    <DialogContent className="rounded-xl p-0 max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden">
                        <DialogHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-slate-100 p-4 sm:p-5">
                            <DialogTitle className="text-base sm:text-lg font-medium text-slate-800 flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                        Editar Motocicleta
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                                        Nueva Motocicleta
                                    </>
                                )}
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500">
                                {isEditing ? 'Actualiza los detalles de la motocicleta existente.' : 'Registra una nueva motocicleta en el sistema.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 sm:p-6 bg-white">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <Label htmlFor="año" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                                        Año
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <CalendarClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </span>
                                        <Input
                                            id="año"
                                            type="number"
                                            value={data.año}
                                            onChange={(e) => setData('año', e.target.value)}
                                            placeholder="Año"
                                            className="text-xs sm:text-sm pl-9 sm:pl-10 rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                    {errors.año && <p className="text-xs text-red-500 mt-1 sm:mt-1.5">{errors.año}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="marca" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                                        Marca
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <BoxIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </span>
                                        <Input
                                            id="marca"
                                            value={data.marca}
                                            onChange={(e) => setData('marca', e.target.value)}
                                            placeholder="Marca"
                                            className="text-xs sm:text-sm pl-9 sm:pl-10 rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                    {errors.marca && <p className="text-xs text-red-500 mt-1 sm:mt-1.5">{errors.marca}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="modelo" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                                        Modelo
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </span>
                                        <Input
                                            id="modelo"
                                            value={data.modelo}
                                            onChange={(e) => setData('modelo', e.target.value)}
                                            placeholder="Modelo"
                                            className="text-xs sm:text-sm pl-9 sm:pl-10 rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            required
                                        />
                                    </div>
                                    {errors.modelo && <p className="text-xs text-red-500 mt-1 sm:mt-1.5">{errors.modelo}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="estado" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                                        Estado
                                    </Label>
                                    <Select
                                        value={data.estado}
                                        onValueChange={(value) => setData('estado', value)}
                                    >
                                        <SelectTrigger className="text-xs sm:text-sm w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                                            <SelectItem value="Activo">Activo</SelectItem>
                                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.estado && <p className="text-xs text-red-500 mt-1 sm:mt-1.5">{errors.estado}</p>}
                                </div>
                                
                                <div className="sm:col-span-2 lg:col-span-2 flex flex-col xs:flex-row gap-3 mt-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className={`${isEditing 
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' 
                                            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
                                        } w-full xs:w-auto rounded-full px-5 sm:px-7 py-2 h-auto text-xs sm:text-sm font-medium shadow-md transition-all duration-200`}
                                    >
                                        {processing ? (
                                            isEditing ? 'Actualizando...' : 'Registrando...'
                                        ) : (
                                            <>
                                                {isEditing ? (
                                                    <>
                                                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                                                        Actualizar
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                                                        Registrar
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            setFormDialogOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full xs:w-auto rounded-full border-slate-200 hover:bg-slate-100 text-slate-700 px-5 sm:px-7 py-2 h-auto text-xs sm:text-sm font-medium"
                                    >
                                        <X className="w-3.5 h-3.5 mr-1.5" />
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>

                {filteredMotos.length === 0 ? (
                    <Card className="border-0 border-dashed border-slate-200 bg-white p-6 sm:p-10 rounded-xl shadow-sm">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Motorcycle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                            </div>
                            <h3 className="text-base sm:text-lg font-medium text-slate-700">No se encontraron motocicletas</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 max-w-md mx-auto">
                                {searchTerm || filterEstado ? 'No hay resultados para los filtros aplicados' : 'Agrega una motocicleta para comenzar'}
                            </p>
                            
                            {(searchTerm || filterEstado) && (
                                <Button 
                                    variant="outline" 
                                    className="mt-4 sm:mt-6 text-xs sm:text-sm rounded-lg border-slate-200 hover:bg-slate-100"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterEstado(null);
                                    }}
                                >
                                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {paginatedMotos.map((moto) => (
                                <Card
                                    key={moto.id}
                                    className="bg-white border-0 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className={`h-2 w-full ${estadoColors[moto.estado]?.split(' ')[0] || 'bg-slate-300'}`}></div>
                                    <CardContent className="p-4 sm:p-5">
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-medium text-slate-800">{moto.marca}</h3>
                                                <div className="flex items-center mt-1">
                                                    <p className="text-xs sm:text-sm text-slate-600 font-medium">{moto.modelo}</p>
                                                    <span className="mx-1.5 text-slate-300">•</span>
                                                    <div className="flex items-center">
                                                        <Calendar className="w-3 h-3 text-indigo-400 mr-1" />
                                                        <p className="text-xs text-indigo-500 font-medium">{moto.año}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className={`${estadoColors[moto.estado]} px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border`}>
                                                {moto.estado === 'Activo' ? (
                                                    <BadgeCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                                                ) : moto.estado === 'Mantenimiento' ? (
                                                    <CalendarClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                                                ) : moto.estado === 'Vendido' ? (
                                                    <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                                                ) : (
                                                    <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                                                )}
                                                {moto.estado}
                                            </Badge>
                                        </div>
                                        
                                        <div className="mt-3 sm:mt-4 flex space-x-2">
                                            <Button
                                                onClick={() => handleEdit(moto)}
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-[10px] sm:text-xs rounded-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 py-1.5 sm:py-2 h-auto transition-all duration-200"
                                            >
                                                <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                                                Editar
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(moto.id)}
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-[10px] sm:text-xs rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 py-1.5 sm:py-2 h-auto transition-all duration-200"
                                            >
                                                <Trash className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                                                Eliminar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 sm:mt-10">
                                <div className="flex flex-wrap items-center justify-center gap-2 bg-white shadow-sm rounded-full px-2 py-1 border border-slate-100">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => changePage(page - 1)}
                                        disabled={page === 1}
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto rounded-full text-slate-700 hover:bg-slate-100 hover:text-indigo-700 disabled:opacity-50 transition-all duration-200"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                                        <span className="hidden xs:inline">Anterior</span>
                                    </Button>
                                    
                                    <div className="flex items-center space-x-1 sm:space-x-2 mx-1 sm:mx-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                                            .map((p, i, arr) => (
                                                <React.Fragment key={p}>
                                                    {i > 0 && arr[i - 1] !== p - 1 && (
                                                        <span className="text-slate-400 px-1">...</span>
                                                    )}
                                                    <Button
                                                        variant={p === page ? "default" : "ghost"}
                                                        size="sm"
                                                        onClick={() => changePage(p)}
                                                        className={`w-8 h-8 sm:w-9 sm:h-9 p-0 text-xs sm:text-sm rounded-full ${
                                                            p === page 
                                                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md' 
                                                                : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-700'
                                                        } transition-all duration-200`}
                                                    >
                                                        {p}
                                                    </Button>
                                                </React.Fragment>
                                            ))}
                                    </div>
                                    
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => changePage(page + 1)}
                                        disabled={page === totalPages}
                                        className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto rounded-full text-slate-700 hover:bg-slate-100 hover:text-indigo-700 disabled:opacity-50 transition-all duration-200"
                                    >
                                        <span className="hidden xs:inline">Siguiente</span>
                                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RegistroMotos;