import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
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
  CalendarClock
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
    const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
        id: null as number | null,
        año: '',
        modelo: '',
        marca: '',
        estado: 'Activo',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/motos/registro/${data.id}`, {
                onSuccess: () => {
                    resetForm();
                },
            });
        } else {
            post('/motos/registro', {
                onSuccess: () => {
                    resetForm();
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
        setIsEditing(true);
        // Scroll to form
        document.getElementById('registro-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta moto?')) {
            destroy(`/motos/registro/${id}`, {
                onSuccess: () => {
                    resetForm();
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
    };

    const filteredMotos = motos.filter(moto => 
        moto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moto.año.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Motorcycle className="w-8 h-8 text-blue-600 mr-3" />
                        Sistema de Gestión de Motocicletas
                    </h1>
                    <p className="text-gray-600 mt-2">Administre su inventario de motocicletas de manera eficiente</p>
                </div>
                
                {/* Form Card */}
                <Card id="registro-form" className="shadow-xl border-t-4 border-t-blue-600 mb-10 transition-all duration-300 hover:shadow-2xl">
                    <CardHeader className="bg-white rounded-t-lg border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white p-2 rounded-full">
                                {isEditing ? (
                                    <Edit className="w-6 h-6 text-blue-600" />
                                ) : (
                                    <Plus className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                            <CardTitle className="text-2xl font-bold">
                                {isEditing ? 'Editar Motocicleta' : 'Registrar Nueva Motocicleta'}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="año" className="text-sm font-medium text-gray-700 flex items-center">
                                    <CalendarClock className="w-4 h-4 mr-2 text-blue-500" />
                                    Año
                                </Label>
                                <Input
                                    id="año"
                                    type="number"
                                    value={data.año}
                                    onChange={(e) => setData('año', e.target.value)}
                                    placeholder="Ingrese el año de la moto"
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    required
                                />
                                {errors.año && <p className="text-sm text-red-500">{errors.año}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modelo" className="text-sm font-medium text-gray-700 flex items-center">
                                    <Tag className="w-4 h-4 mr-2 text-blue-500" />
                                    Modelo
                                </Label>
                                <Input
                                    id="modelo"
                                    value={data.modelo}
                                    onChange={(e) => setData('modelo', e.target.value)}
                                    placeholder="Ingrese el modelo de la moto"
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    required
                                />
                                {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="marca" className="text-sm font-medium text-gray-700 flex items-center">
                                    <BoxIcon className="w-4 h-4 mr-2 text-blue-500" />
                                    Marca
                                </Label>
                                <Input
                                    id="marca"
                                    value={data.marca}
                                    onChange={(e) => setData('marca', e.target.value)}
                                    placeholder="Ingrese la marca de la moto"
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    required
                                />
                                {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estado" className="text-sm font-medium text-gray-700 flex items-center">
                                    <BadgeCheck className="w-4 h-4 mr-2 text-blue-500" />
                                    Estado
                                </Label>
                                <Select
                                    value={data.estado}
                                    onValueChange={(value) => setData('estado', value)}
                                >
                                    <SelectTrigger className="w-full border-gray-300 rounded-lg">
                                        <SelectValue placeholder="Seleccione un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
                            </div>
                            <div className="md:col-span-2 flex flex-wrap gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={`flex items-center space-x-2 ${isEditing ? 
                                        'bg-amber-500 hover:bg-amber-600' : 
                                        'bg-blue-600 hover:bg-blue-700'} 
                                        text-white px-6 py-2 rounded-lg transition-colors duration-200`}
                                >
                                    {isEditing ? (
                                        <Edit className="w-5 h-5" />
                                    ) : (
                                        <Plus className="w-5 h-5" />
                                    )}
                                    <span>
                                    {processing ? (
                                        isEditing ? 'Actualizando...' : 'Registrando...'
                                    ) : (
                                        isEditing ? 'Actualizar Motocicleta' : 'Registrar Motocicleta'
                                    )}
                                    </span>
                                </Button>
                                {isEditing && (
                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <span>Cancelar Edición</span>
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Lista de motos mejorada */}
                <Card className="shadow-xl border-t-4 border-t-indigo-600">
                    <CardHeader className="bg-white rounded-t-lg border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white p-2 rounded-full">
                                    <Motorcycle className="w-6 h-6 text-indigo-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">
                                    Inventario de Motocicletas
                                </CardTitle>
                                <div className="px-3 py-1 bg-white text-indigo-700 rounded-full font-medium text-sm">
                                    {filteredMotos.length} {filteredMotos.length === 1 ? 'Moto' : 'Motos'}
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Buscar motocicletas..."
                                    className="pl-10 pr-4 py-2 bg-white text-gray-800 rounded-lg border-none w-full md:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {filteredMotos.length === 0 ? (
                            <div className="text-center py-10">
                                <Motorcycle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-500">No hay motocicletas</h3>
                                <p className="text-gray-400 mt-2">
                                    {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'Agrega una motocicleta para comenzar'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMotos.map((moto) => (
                                    <div
                                        key={moto.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                    >
                                        <div className={`bg-gradient-to-r ${
                                            moto.estado === 'Activo'
                                                ? 'from-blue-500 to-indigo-600'
                                                : 'from-gray-500 to-gray-600'
                                        } p-6`}>
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-bold text-white">{moto.marca}</h3>
                                                <div className={`flex items-center px-3 py-1 rounded-full ${
                                                    moto.estado === 'Activo'
                                                        ? 'bg-green-400 text-white'
                                                        : 'bg-gray-400 text-white'
                                                }`}>
                                                    {moto.estado === 'Activo' ? (
                                                        <BadgeCheck className="w-4 h-4 mr-1" />
                                                    ) : (
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                    )}
                                                    <span className="text-sm font-medium">{moto.estado}</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/10 rounded-lg p-3 mt-4">
                                                <p className="text-white font-medium">{moto.modelo}</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    <CalendarClock className="w-5 h-5 mr-3 text-blue-500" />
                                                    <span className="font-medium">Año:</span>
                                                    <span className="ml-2 text-gray-600">{moto.año}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    <Tag className="w-5 h-5 mr-3 text-blue-500" />
                                                    <span className="font-medium">Modelo:</span>
                                                    <span className="ml-2 text-gray-600">{moto.modelo}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                    <BoxIcon className="w-5 h-5 mr-3 text-blue-500" />
                                                    <span className="font-medium">Marca:</span>
                                                    <span className="ml-2 text-gray-600">{moto.marca}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-6">
                                                <Button
                                                    onClick={() => handleEdit(moto)}
                                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(moto.id)}
                                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegistroMotos;