"use client";

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Recycle as Motorcycle, BadgeCheck, AlertCircle, Calendar, Tag, Box } from 'lucide-react';

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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <Card className="shadow-xl border-t-4 border-t-blue-600">
                    <CardHeader className="bg-white rounded-t-lg border-b">
                        <div className="flex items-center space-x-3">
                            <Motorcycle className="w-6 h-6 text-blue-600" />
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                {isEditing ? 'Editar Moto' : 'Registrar Nueva Moto'}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="año" className="text-sm font-medium text-gray-700">Año</Label>
                                <Input
                                    id="año"
                                    type="number"
                                    value={data.año}
                                    onChange={(e) => setData('año', e.target.value)}
                                    placeholder="Ingrese el año de la moto"
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.año && <p className="text-sm text-red-500">{errors.año}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modelo" className="text-sm font-medium text-gray-700">Modelo</Label>
                                <Input
                                    id="modelo"
                                    value={data.modelo}
                                    onChange={(e) => setData('modelo', e.target.value)}
                                    placeholder="Ingrese el modelo de la moto"
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="marca" className="text-sm font-medium text-gray-700">Marca</Label>
                                <Input
                                    id="marca"
                                    value={data.marca}
                                    onChange={(e) => setData('marca', e.target.value)}
                                    placeholder="Ingrese la marca de la moto"
                                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="estado" className="text-sm font-medium text-gray-700">Estado</Label>
                                <Select
                                    value={data.estado}
                                    onValueChange={(value) => setData('estado', value)}
                                >
                                    <SelectTrigger className="w-full border-gray-300">
                                        <SelectValue placeholder="Seleccione un estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
                            </div>
                            <div className="md:col-span-2 flex space-x-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                >
                                    {processing ? (
                                        isEditing ? 'Actualizando...' : 'Registrando...'
                                    ) : (
                                        isEditing ? 'Actualizar Moto' : 'Registrar Moto'
                                    )}
                                </Button>
                                {isEditing && (
                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 md:flex-none bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Cancelar Edición
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Lista de motos mejorada */}
                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-3">
                                    <Motorcycle className="w-8 h-8 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-800">Motos Registradas</h2>
                                </div>
                                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                                    <span className="text-blue-700 font-medium">{motos.length} {motos.length === 1 ? 'Moto' : 'Motos'}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {motos.map((moto) => (
                                    <div
                                        key={moto.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
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
                                            <p className="text-blue-100 mt-1">{moto.modelo}</p>
                                        </div>
                                        <div className="p-5">
                                            <div className="space-y-3">
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                                                    <span className="font-medium">Año:</span>
                                                    <span className="ml-2">{moto.año}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Tag className="w-5 h-5 mr-2 text-blue-500" />
                                                    <span className="font-medium">Modelo:</span>
                                                    <span className="ml-2">{moto.modelo}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Box className="w-5 h-5 mr-2 text-blue-500" />
                                                    <span className="font-medium">Marca:</span>
                                                    <span className="ml-2">{moto.marca}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-6">
                                                <Button
                                                    onClick={() => handleEdit(moto)}
                                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2"
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(moto.id)}
                                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegistroMotos;
