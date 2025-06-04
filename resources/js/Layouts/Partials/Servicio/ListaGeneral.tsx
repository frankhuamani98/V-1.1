import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { ChevronDown, ChevronUp, ListChecks, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
}

interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  orden: number;
  servicios: Servicio[];
}

interface ListaGeneralProps {
  categorias: CategoriaServicio[];
}

const ListaGeneral = ({ categorias: initialCategorias }: ListaGeneralProps) => {
  const [categorias] = useState<CategoriaServicio[]>(initialCategorias);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategoria, setModalCategoria] = useState<CategoriaServicio | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  const handleOpenModal = (categoria: CategoriaServicio) => {
    setModalCategoria(categoria);
    setModalOpen(true);
  };

  const categoriasFiltradas = categorias.filter(cat => {
    const matchCategoria = cat.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchServicio = cat.servicios.some(serv => serv.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategoria || matchServicio;
  });

  const totalPages = Math.ceil(categoriasFiltradas.length / itemsPerPage);
  const paginatedCategorias = categoriasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Listado General de Servicios</h1>
        <p className="text-gray-500 text-base mt-1">
          Visualiza todas las categorías y sus servicios registrados en el sistema.
        </p>
      </div>
      <div className="mb-6 flex items-center gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por categoría o servicio..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200 text-base"
          />
        </div>
      </div>
      <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
        <CardHeader className="px-4 sm:px-6 bg-white border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Servicios</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Listado detallado de categorías y servicios disponibles
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          {categoriasFiltradas.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ListChecks className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No hay categorías de servicios registradas</p>
              <p className="text-gray-500 text-sm mt-1">No hay categorías disponibles para mostrar</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                {paginatedCategorias.map((categoria) => {
                  const maxPreview = 6;
                  const serviciosPreview = categoria.servicios.slice(0, maxPreview);
                  const serviciosRestantes = categoria.servicios.length - maxPreview;
                  return (
                    <div key={categoria.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 p-6 flex flex-col gap-4 h-full min-h-[260px] max-h-[340px]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                          <ListChecks className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-lg truncate">{categoria.nombre}</h3>
                            <Badge className={categoria.estado ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                              {categoria.estado ? "Activo" : "Inactivo"}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-700 ml-2">{categoria.servicios.length} servicios</Badge>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 min-h-[20px]">
                            {categoria.descripcion ? categoria.descripcion : <span className="italic text-gray-400">Sin descripción</span>}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">Orden: {categoria.orden}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-2 font-medium">Servicios de esta categoría:</p>
                          {categoria.servicios && categoria.servicios.length > 0 ? (
                            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto items-center">
                              {serviciosPreview.map((servicio) => (
                                <div key={servicio.id} className="flex items-center gap-2 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs max-w-[120px]">
                                  <span className="font-medium text-gray-800 truncate">{servicio.nombre}</span>
                                  <Badge className={servicio.estado ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                                    {servicio.estado ? "Activo" : "Inactivo"}
                                  </Badge>
                                </div>
                              ))}
                              {serviciosRestantes > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="px-2 py-1 rounded border-gray-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                                  onClick={() => handleOpenModal(categoria)}
                                >
                                  +{serviciosRestantes} más
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="py-4 text-center">
                              <span className="text-gray-400 text-sm">No hay servicios registrados en esta categoría</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="ml-4 mt-2"
                          onClick={() => handleOpenModal(categoria)}
                        >
                          Ver detalle
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="border-t border-gray-100 px-6 py-4 mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, categoriasFiltradas.length)} de {categoriasFiltradas.length} categorías
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9 p-0 rounded-lg border-gray-200"
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                      </Button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-700">
                        {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9 p-0 rounded-lg border-gray-200"
                      >
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de la categoría</DialogTitle>
            <DialogDescription>
              {modalCategoria && (
                <div>
                  <span className="font-semibold text-blue-700 text-lg">{modalCategoria.nombre}</span>
                  <div className="mt-1 text-gray-500 text-sm">
                    Estado: <span className={modalCategoria.estado ? 'text-emerald-600' : 'text-red-600'}>{modalCategoria.estado ? 'Activo' : 'Inactivo'}</span> | Orden: {modalCategoria.orden}
                  </div>
                  <div className="mt-1 text-gray-500 text-sm">
                    Descripción: {modalCategoria.descripcion ? modalCategoria.descripcion : <span className="italic text-gray-400">Sin descripción</span>}
                  </div>
                  <div className="mt-1 text-blue-700 text-sm font-medium">
                    Total servicios: {modalCategoria.servicios.length}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {modalCategoria && modalCategoria.servicios.length > 0 ? (
              modalCategoria.servicios.map((servicio) => (
                <div key={servicio.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-base truncate">{servicio.nombre}</span>
                      <Badge className={servicio.estado ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                        {servicio.estado ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[18px]">
                      {servicio.descripcion ? servicio.descripcion : <span className="italic text-gray-400">Sin descripción</span>}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">No hay servicios en esta categoría</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaGeneral;