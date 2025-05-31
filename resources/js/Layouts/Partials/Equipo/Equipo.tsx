import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { 
  Users,
  BadgeCheck, 
  AlertCircle,
  Plus,
  Search,
  Edit,
  Trash,
  X,
  Briefcase,
  FileText,
  Image as ImageIcon
} from "lucide-react";

interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
}

interface Props {
  equipo: MiembroEquipo[];
  isDashboard?: boolean;
}

const EquipoLista = ({ equipo, isDashboard = false }: Props) => {
  const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
    id: null as number | null,
    nombre: "",
    cargo: "",
    descripcion: "",
    imagen: null as File | null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [miembroToDelete, setMiembroToDelete] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      ...data,
      onSuccess: () => {
        resetForm();
        setShowForm(false);
      }
    };
    
    if (isEditing && data.id) {
      put(`/equipo/${data.id}`, formData);
    } else {
      post("/equipo/store", formData);
    }
  };

  const handleEdit = (miembro: MiembroEquipo) => {
    setData({
      id: miembro.id,
      nombre: miembro.nombre,
      cargo: miembro.cargo,
      descripcion: miembro.descripcion,
      imagen: null,
    });
    setPreviewImage(miembro.imagen || null);
    setIsEditing(true);
    setShowForm(true);
    document.getElementById('equipo-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    setMiembroToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (miembroToDelete) {
      destroy(`/equipo/${miembroToDelete}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setMiembroToDelete(null);
        },
      });
    }
  };

  const resetForm = () => {
    setData({
      id: null,
      nombre: "",
      cargo: "",
      descripcion: "",
      imagen: null,
    });
    setPreviewImage(null);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData("imagen", e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleActive = (id: number) => {
    put(`/equipo/${id}/toggle-active`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center">
            <div className="bg-indigo-600 text-white p-2 rounded-lg mr-3 shadow-md">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            Gestión del Equipo
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 pl-12 sm:pl-14 flex items-center">
            <BadgeCheck className="w-4 h-4 text-indigo-400 mr-2" />
            Sistema de gestión de miembros del equipo
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className={`${showForm 
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 hover:text-rose-800 border border-rose-200' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md'
                } px-4 sm:px-5 py-2 h-auto text-xs sm:text-sm rounded-full transition-all duration-200 font-medium`}
              >
                {showForm ? (
                  <>
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Cerrar
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Nuevo miembro
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
              <div className="relative flex-1 sm:w-64 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Buscar miembros..."
                  className="pl-9 w-full bg-white text-xs sm:text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <Card id="equipo-form" className="mb-6 sm:mb-8 bg-white border-0 rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-slate-100 p-4 sm:p-5">
              <CardTitle className="text-base sm:text-lg font-medium text-slate-800 flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                    Editar Miembro
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                    Nuevo Miembro
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 bg-white">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="nombre" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                    Nombre
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    <Input
                      id="nombre"
                      value={data.nombre}
                      onChange={(e) => setData("nombre", e.target.value)}
                      placeholder="Nombre del miembro"
                      className="pl-9 text-xs sm:text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <Label htmlFor="cargo" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                    Cargo
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    <Input
                      id="cargo"
                      value={data.cargo}
                      onChange={(e) => setData("cargo", e.target.value)}
                      placeholder="Cargo o puesto"
                      className="pl-9 text-xs sm:text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  {errors.cargo && <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="descripcion" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                    Descripción
                  </Label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-slate-400">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    <textarea
                      id="descripcion"
                      value={data.descripcion}
                      onChange={(e) => setData("descripcion", e.target.value)}
                      placeholder="Descripción del miembro"
                      className="pl-9 text-xs sm:text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                      rows={3}
                      required
                    />
                  </div>
                  {errors.descripcion && <p className="text-xs text-red-500 mt-1">{errors.descripcion}</p>}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="imagen" className="text-xs sm:text-sm font-medium text-slate-700 block mb-1 sm:mb-1.5">
                    Imagen
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                    <Input
                      id="imagen"
                      type="file"
                      onChange={handleImageChange}
                      className="pl-9 text-xs sm:text-sm rounded-lg border-slate-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      accept="image/*"
                      required={!isEditing}
                    />
                  </div>
                  {previewImage && (
                    <div className="mt-3">
                      <img
                        src={previewImage}
                        alt="Previsualización"
                        className="w-32 h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                    </div>
                  )}
                  {errors.imagen && <p className="text-xs text-red-500 mt-1">{errors.imagen}</p>}
                </div>

                <div className="sm:col-span-2 flex flex-col xs:flex-row gap-3 mt-2">
                  <Button
                    type="submit"
                    disabled={processing}
                    className={`${isEditing 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' 
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
                    } w-full xs:w-auto rounded-full px-5 sm:px-7 py-2 h-auto text-xs sm:text-sm font-medium shadow-md transition-all duration-200`}
                  >
                    {processing ? (
                      isEditing ? "Actualizando..." : "Guardando..."
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
                            Guardar
                          </>
                        )}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    variant="outline"
                    className="w-full xs:w-auto rounded-full border-slate-200 hover:bg-slate-100 text-slate-700 px-5 sm:px-7 py-2 h-auto text-xs sm:text-sm font-medium"
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {equipo
            .filter((miembro) => 
              miembro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              miembro.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
              miembro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((miembro) => (
              <Card
                key={miembro.id}
                className="bg-white border-0 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border
                      ${miembro.activo 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'}`
                    }
                  >
                    {miembro.activo ? (
                      <BadgeCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                    ) : (
                      <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                    )}
                    {miembro.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-medium text-slate-800">{miembro.nombre}</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">{miembro.cargo}</p>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-2">{miembro.descripcion}</p>
                  
                  <div className="mt-3 sm:mt-4 flex space-x-2">
                    <Button
                      onClick={() => handleEdit(miembro)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-[10px] sm:text-xs rounded-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 py-1.5 sm:py-2 h-auto transition-all duration-200"
                    >
                      <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(miembro.id)}
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
            ))
          }
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-lg border-0 shadow-lg max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium">Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              ¿Estás seguro de que deseas eliminar este miembro del equipo? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 flex-col sm:flex-row">
            <AlertDialogCancel 
              onClick={() => setMiembroToDelete(null)}
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
    </div>
  );
};

export default EquipoLista;