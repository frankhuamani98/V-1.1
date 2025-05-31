import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Star, ThumbsUp, Trash, Reply, ChevronDown, ChevronUp, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Opinion {
  id: number;
  contenido: string;
  calificacion: number;
  util: number;
  created_at: string;
  es_soporte: boolean;
  usuario: {
    id: number;
    first_name: string;
    last_name: string;
  };
  respuestas: Array<{
    id: number;
    contenido: string;
    created_at: string;
    es_soporte: boolean;
    usuario: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }>;
}

interface Props {
  opiniones: Opinion[];
  showActions?: boolean;
  isDashboard?: boolean;
}

const ListaOpinion = ({ opiniones, showActions = false, isDashboard = false }: Props) => {
  const [expandedOpinions, setExpandedOpinions] = useState<Record<number, boolean>>({});
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [responseContent, setResponseContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [opinionToDelete, setOpinionToDelete] = useState<{id: number, type: 'opinion' | 'respuesta'} | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.rating-filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleResponses = (opinionId: number) => {
    setExpandedOpinions((prev) => ({
      ...prev,
      [opinionId]: !prev[opinionId],
    }));
  };

  const handleDelete = (id: number, type: 'opinion' | 'respuesta', e: React.MouseEvent) => {
    e.stopPropagation();
    setOpinionToDelete({id, type});
  };

  const confirmDelete = () => {
    if (!opinionToDelete) return;
    
    const url = isDashboard 
      ? opinionToDelete.type === 'opinion' 
        ? `/dashboard/opiniones/${opinionToDelete.id}` 
        : `/dashboard/opiniones/respuesta/${opinionToDelete.id}`
      : opinionToDelete.type === 'opinion'
        ? `/opiniones/${opinionToDelete.id}`
        : `/opiniones/respuesta/${opinionToDelete.id}`;
        
    router.delete(url);
    setOpinionToDelete(null);
  };

  const handleResponderSubmit = (opinionId: number, e: React.FormEvent) => {
    e.preventDefault();
    router.post(route('dashboard.opiniones.responder', opinionId), {
      contenido: responseContent
    }, {
      onSuccess: () => {
        setResponseContent("");
        setRespondingTo(null);
      }
    });
  };

  const handleMarcarUtil = (opinionId: number) => {
    router.post(route('dashboard.opiniones.util', opinionId));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const renderStars = (calificacion: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < calificacion ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}
      />
    ));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const getRandomColor = (id: number) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-purple-100 text-purple-600",
      "bg-green-100 text-green-600",
      "bg-amber-100 text-amber-600",
      "bg-rose-100 text-rose-600",
      "bg-cyan-100 text-cyan-600",
    ];
    return colors[id % colors.length];
  };

  const isExpanded = (opinionId: number) => expandedOpinions[opinionId] ?? false;

  const filteredOpiniones = opiniones.filter(opinion => {
    const matchesSearch = searchTerm === "" || 
      opinion.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${opinion.usuario.first_name} ${opinion.usuario.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === null || opinion.calificacion === filterRating;
    
    return matchesSearch && matchesRating;
  });
  
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredOpiniones.length / itemsPerPage)));
    setCurrentPage(1);
  }, [filteredOpiniones.length]);
  
  const paginatedOpiniones = filteredOpiniones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const ratingCounts = opiniones.reduce((acc, opinion) => {
    acc[opinion.calificacion] = (acc[opinion.calificacion] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isDashboard && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">Gestión de Opiniones</h1>
            </div>
            
            <div className="mt-6">
              <div className="bg-white shadow rounded-lg">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-medium text-gray-900">Listado de Opiniones de Clientes</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search box */}
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar opiniones..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                        />
                      </div>
                      
                      <div className="rating-filter-dropdown relative inline-block">
                        <button 
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${filterRating !== null ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'} shadow-sm`}
                        >
                          <Filter size={16} className={filterRating !== null ? 'text-indigo-500' : 'text-slate-500'} />
                          <span>
                            {filterRating !== null 
                              ? `${filterRating} ${filterRating === 1 ? 'estrella' : 'estrellas'}` 
                              : 'Filtrar por calificación'}
                          </span>
                          {filterRating !== null && (
                            <div className="flex ml-1">
                              {Array.from({ length: filterRating }).map((_, i) => (
                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          )}
                          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isFilterOpen && (
                          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-10">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                              <h4 className="text-sm font-medium text-slate-700">Calificaciones</h4>
                              {filterRating !== null && (
                                <button 
                                  onClick={() => {
                                    setFilterRating(null);
                                    setIsFilterOpen(false);
                                  }}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  Limpiar filtro
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {[5, 4, 3, 2, 1].map((rating) => {
                                const count = ratingCounts[rating] || 0;
                                return (
                                  <button
                                    key={rating}
                                    onClick={() => {
                                      setFilterRating(filterRating === rating ? null : rating);
                                      setIsFilterOpen(false);
                                    }}
                                    disabled={count === 0}
                                    className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${
                                      filterRating === rating
                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                        : "hover:bg-slate-50 text-slate-700"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="flex">
                                        {Array.from({ length: rating }).map((_, i) => (
                                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                        {Array.from({ length: 5 - rating }).map((_, i) => (
                                          <Star key={i} size={16} className="text-slate-200" />
                                        ))}
                                      </div>
                                      <span className="text-sm font-medium">{rating} {rating === 1 ? 'estrella' : 'estrellas'}</span>
                                    </div>
                                    <span className="flex items-center justify-center min-w-[28px] h-6 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full px-1.5">
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700 font-medium">Total opiniones</p>
                      <p className="text-2xl font-bold text-blue-800 mt-1">{opiniones.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-sm text-green-700 font-medium">Promedio</p>
                      <div className="flex items-center mt-1">
                        <p className="text-2xl font-bold text-green-800 mr-2">
                          {(opiniones.reduce((sum, op) => sum + op.calificacion, 0) / Math.max(1, opiniones.length)).toFixed(1)}
                        </p>
                        <Star size={20} className="fill-yellow-500 text-yellow-500" />
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <p className="text-sm text-amber-700 font-medium">Sin respuesta</p>
                      <p className="text-2xl font-bold text-amber-800 mt-1">
                        {opiniones.filter(op => op.respuestas.length === 0).length}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-sm text-purple-700 font-medium">Marcadas útiles</p>
                      <p className="text-2xl font-bold text-purple-800 mt-1">
                        {opiniones.filter(op => op.util > 0).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-6">
          {filteredOpiniones.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron opiniones</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || filterRating !== null ? 
                  "Intenta con otros criterios de búsqueda" : 
                  "Aún no hay opiniones registradas"}
              </p>
              {(searchTerm || filterRating !== null) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRating(null);
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6 max-w-7xl mx-auto">
              {paginatedOpiniones.map((opinion) => (
                <div 
                  key={opinion.id} 
                  className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold text-sm ${opinion.es_soporte ? "bg-blue-100 text-blue-600" : getRandomColor(opinion.usuario.id)}`}>
                        {opinion.es_soporte ? "ES" : getInitials(opinion.usuario.first_name, opinion.usuario.last_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {opinion.usuario.first_name} {opinion.usuario.last_name}
                          </h3>
                          {opinion.es_soporte && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              Soporte
                            </span>
                          )}
                          {opinion.respuestas.length === 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                              Sin respuesta
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex">
                            {renderStars(opinion.calificacion)}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(opinion.created_at)}</span>
                        </div>

                        <div className="mt-3 text-gray-700 leading-relaxed">
                          {opinion.contenido}
                        </div>
                        
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          {isDashboard ? (
                            <button
                              onClick={() => handleMarcarUtil(opinion.id)}
                              className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-primary transition-colors"
                            >
                              <ThumbsUp size={14} className={opinion.util > 0 ? "text-primary fill-primary" : "text-gray-400"} /> 
                              <span>{opinion.util} útil{opinion.util !== 1 ? "es" : ""}</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                              <ThumbsUp size={14} className="text-gray-400" /> 
                              <span>{opinion.util} útil{opinion.util !== 1 ? "es" : ""}</span>
                            </div>
                          )}
                          
                          {isDashboard && (
                            <button
                              onClick={() => setRespondingTo(opinion.id)}
                              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              <Reply size={14} />
                              <span>Responder</span>
                            </button>
                          )}
                          
                          {opinion.respuestas.length > 0 && (
                            <button
                              onClick={() => toggleResponses(opinion.id)}
                              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              <span>{opinion.respuestas.length} respuesta{opinion.respuestas.length !== 1 ? "s" : ""}</span>
                              {isExpanded(opinion.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {showActions && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleDelete(opinion.id, 'opinion', e)}
                      >
                        <Trash size={14} />
                      </Button>
                    )}
                  </div>
                  
                  {respondingTo === opinion.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <form onSubmit={(e) => handleResponderSubmit(opinion.id, e)}>
                        <div className="mb-2">
                          <label className="text-sm font-medium text-gray-700">Tu respuesta</label>
                        </div>
                        <textarea
                          value={responseContent}
                          onChange={(e) => setResponseContent(e.target.value)}
                          className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Escribe tu respuesta..."
                        />
                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setRespondingTo(null);
                              setResponseContent("");
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            disabled={!responseContent.trim()}
                          >
                            Responder
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {opinion.respuestas.length > 0 && isExpanded(opinion.id) && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="pl-4 md:pl-6 border-l-2 border-gray-200 space-y-4">
                        {opinion.respuestas.map((respuesta) => (
                          <div key={respuesta.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium ${respuesta.es_soporte ? "bg-blue-100 text-blue-600" : getRandomColor(respuesta.usuario.id)}`}>
                                  {respuesta.es_soporte ? "ES" : getInitials(respuesta.usuario.first_name, respuesta.usuario.last_name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h5 className="font-medium text-sm text-gray-900">
                                      {respuesta.usuario.first_name} {respuesta.usuario.last_name}
                                    </h5>
                                    {respuesta.es_soporte && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        Soporte
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(respuesta.created_at)}</p>
                                  <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                                    {respuesta.contenido}
                                  </div>
                                </div>
                              </div>
                              
                              {showActions && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => handleDelete(respuesta.id, 'respuesta', e)}
                                >
                                  <Trash size={12} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      let pageNumber: number;
                      
                      if (totalPages <= 5) {
                        pageNumber = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = idx + 1;
                        if (idx === 4) pageNumber = totalPages;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + idx;
                      } else {
                        pageNumber = currentPage - 2 + idx;
                      }
                      
                      if ((idx === 3 && pageNumber !== 4 && totalPages > 5) || 
                          (idx === 1 && pageNumber !== 2 && currentPage > 3)) {
                        return (
                          <span key={idx} className="px-2 text-gray-500">...</span>
                        );
                      }
                      
                      return (
                        <Button
                          key={idx}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNumber)}
                          className={`h-9 w-9 p-0 ${currentPage === pageNumber ? "bg-primary text-white" : ""}`}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={opinionToDelete !== null} onOpenChange={() => setOpinionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta {opinionToDelete?.type === 'opinion' ? 'opinión' : 'respuesta'}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpinionToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaOpinion;