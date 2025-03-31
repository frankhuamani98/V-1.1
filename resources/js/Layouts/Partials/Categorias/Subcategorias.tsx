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
import { motion } from 'framer-motion';

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
                    showSuccessNotification('Subcategoría actualizada!');
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
                    showSuccessNotification('Subcategoría creada!');
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
    };

    const handleEliminar = (id: number) => {
        if (confirm('¿Eliminar esta subcategoría?')) {
            router.delete(`/categorias/subcategorias/${id}`, {
                onSuccess: () => {
                    showSuccessNotification('Subcategoría eliminada!');
                    router.reload({ only: ['subcategorias'] });
                }
            });
        }
    };

    // ... (resto de funciones auxiliares como getEstadoIcon, formatDate, etc.)

    return (
        <div className="p-6 space-y-6">
            {showSuccess && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                >
                    {successMessage}
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>
                        {editandoId ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nombre</Label>
                                <Input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Nombre de la subcategoría"
                                />
                            </div>
                            <div>
                                <Label>Categoría</Label>
                                <Select 
                                    value={categoriaId} 
                                    onValueChange={setCategoriaId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Estado</Label>
                                <Select value={estado} onValueChange={setEstado}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activo">Activo</SelectItem>
                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div className="flex justify-end space-x-2">
                            {editandoId && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancelar
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin mr-2" />
                                ) : editandoId ? (
                                    <Check className="mr-2" />
                                ) : (
                                    <PlusCircle className="mr-2" />
                                )}
                                {editandoId ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Listado de subcategorías */}
            <Card>
                <CardHeader>
                    <CardTitle>Listado de Subcategorías</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex justify-between">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {subcategorias
                            .filter(sub => 
                                sub.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                sub.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((subcategoria) => (
                                <div key={subcategoria.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div className="font-medium">{subcategoria.nombre}</div>
                                        <div className="text-sm text-gray-500">
                                            Categoría: {subcategoria.categoria.nombre}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditar(subcategoria)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEliminar(subcategoria.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Subcategorias;