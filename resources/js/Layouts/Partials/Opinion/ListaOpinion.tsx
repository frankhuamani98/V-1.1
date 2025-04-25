import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Star, ThumbsUp, Trash, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/Components/ui/button";
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

  const toggleResponses = (opinionId: number) => {
    setExpandedOpinions((prev) => ({
      ...prev,
      [opinionId]: !prev[opinionId],
    }));
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Está seguro que desea eliminar esta opinión?")) {
      const url = isDashboard ? `/dashboard/opiniones/${id}` : `/opiniones/${id}`;
      router.delete(url);
    }
  };

  const handleDeleteRespuesta = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Está seguro que desea eliminar esta respuesta?")) {
      const url = isDashboard ? `/dashboard/opiniones/respuesta/${id}` : `/opiniones/respuesta/${id}`;
      router.delete(url);
    }
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {opiniones.map((opinion) => (
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
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <ThumbsUp size={14} className="text-gray-400" /> 
                    <span>{opinion.util} útil{opinion.util !== 1 ? "es" : ""}</span>
                  </div>
                  
                  {opinion.respuestas.length > 0 && (
                    <button
                      onClick={() => toggleResponses(opinion.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Reply size={14} />
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
                onClick={(e) => handleDelete(opinion.id, e)}
              >
                <Trash size={14} />
              </Button>
            )}
          </div>
          
          {/* Respuestas */}
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
                          onClick={(e) => handleDeleteRespuesta(respuesta.id, e)}
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
    </div>
  );
};

export default ListaOpinion;