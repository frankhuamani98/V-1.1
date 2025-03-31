import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { FaThumbsUp, FaThumbsDown, FaMeh, FaCheck, FaTrash } from "react-icons/fa";

const ListaComentarios = () => {
  // Datos de ejemplo con identificadores únicos
  const comentariosEjemplo = [
    { id: 1, contenido: "Excelente servicio, muy recomendado. ⭐⭐⭐⭐⭐", tipo: "positivo", usuario: "Juan Pérez", fecha: "2023-10-01", aprobado: true },
    { id: 2, contenido: "Tuve un problema con la entrega, pero lo solucionaron rápido. ⭐⭐⭐⭐", tipo: "positivo", usuario: "María López", fecha: "2023-10-02", aprobado: true },
    { id: 3, contenido: "La atención al cliente podría mejorar. ⭐⭐⭐", tipo: "neutral", usuario: "Carlos Gómez", fecha: "2023-10-03", aprobado: false },
    { id: 4, contenido: "Gran calidad en los productos, estoy satisfecho. ⭐⭐⭐⭐⭐", tipo: "positivo", usuario: "Ana Martínez", fecha: "2023-10-04", aprobado: true },
    { id: 5, contenido: "No me gustó la experiencia de compra. ⭐⭐", tipo: "negativo", usuario: "Luis Ramírez", fecha: "2023-10-05", aprobado: false },
    { id: 6, contenido: "Entrega rápida y eficiente. ⭐⭐⭐⭐⭐", tipo: "positivo", usuario: "Sofía Díaz", fecha: "2023-10-06", aprobado: true },
    { id: 7, contenido: "El producto llegó defectuoso, mala experiencia. ⭐", tipo: "negativo", usuario: "Pedro Sánchez", fecha: "2023-10-07", aprobado: false },
    { id: 8, contenido: "Muy buen servicio, volveré a comprar. ⭐⭐⭐⭐⭐", tipo: "positivo", usuario: "Laura Torres", fecha: "2023-10-08", aprobado: true },
    { id: 9, contenido: "El producto no cumplió con mis expectativas. ⭐⭐", tipo: "negativo", usuario: "Diego Fernández", fecha: "2023-10-09", aprobado: false },
    { id: 10, contenido: "Buena atención, pero la entrega tardó un poco. ⭐⭐⭐⭐", tipo: "neutral", usuario: "Elena Rodríguez", fecha: "2023-10-10", aprobado: false },
  ];

  // Estado para filtrar comentarios y controlar la paginación
  const [filtro, setFiltro] = useState("todos");
  const [comentariosVisibles, setComentariosVisibles] = useState(6);
  const [comentarios, setComentarios] = useState(comentariosEjemplo);

  // Función para filtrar comentarios según el tipo seleccionado
  const comentariosFiltrados = comentarios.filter((comentario) => {
    if (filtro === "todos") return true;
    return comentario.tipo === filtro;
  });

  // Función para cargar más comentarios
  const cargarMasComentarios = () => {
    setComentariosVisibles((prev) => prev + 3);
  };

  // Función para aprobar un comentario
  const aprobarComentario = (id: number) => {
    const nuevosComentarios = comentarios.map((comentario) =>
      comentario.id === id ? { ...comentario, aprobado: true } : comentario
    );
    setComentarios(nuevosComentarios);
  };

  // Función para eliminar un comentario
  const eliminarComentario = (id: number) => {
    const nuevosComentarios = comentarios.filter((comentario) => comentario.id !== id);
    setComentarios(nuevosComentarios);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Lista de Comentarios</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver todos los comentarios registrados en el sistema.
        </p>
      </div>

      {/* Botones de filtro */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button
          variant="outline"
          onClick={() => setFiltro("positivo")}
          className="flex-1 md:flex-none transition duration-300 ease-in-out hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Mostrar comentarios positivos"
        >
          Comentarios Positivos
        </Button>
        <Button
          variant="outline"
          onClick={() => setFiltro("negativo")}
          className="flex-1 md:flex-none transition duration-300 ease-in-out hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Mostrar comentarios negativos"
        >
          Comentarios Negativos
        </Button>
        <Button
          variant="outline"
          onClick={() => setFiltro("neutral")}
          className="flex-1 md:flex-none transition duration-300 ease-in-out hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          aria-label="Mostrar comentarios neutrales"
        >
          Comentarios Neutrales
        </Button>
        <Button
          variant="outline"
          onClick={() => setFiltro("todos")}
          className="flex-1 md:flex-none transition duration-300 ease-in-out hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Mostrar todos los comentarios"
        >
          Ver Todos
        </Button>
      </div>

      {/* Contenedor de comentarios en cuadrícula */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {comentariosFiltrados.slice(0, comentariosVisibles).map((comentario) => (
          <div
            key={comentario.id}
            className="border p-4 rounded-lg shadow-md bg-white transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-2">
              {comentario.tipo === "positivo" && <FaThumbsUp className="text-green-500 mr-2" aria-hidden="true" />}
              {comentario.tipo === "negativo" && <FaThumbsDown className="text-red-500 mr-2" aria-hidden="true" />}
              {comentario.tipo === "neutral" && <FaMeh className="text-yellow-500 mr-2" aria-hidden="true" />}
              <p className="text-gray-700 font-semibold">{comentario.usuario}</p>
            </div>
            <p className="text-gray-700 mb-2">{comentario.contenido}</p>
            <p className="text-gray-500 text-sm">{comentario.fecha}</p>
            {/* Botones de aprobar y eliminar */}
            <div className="flex justify-end mt-2 space-x-2">
              {!comentario.aprobado && (
                <Button
                  variant="outline"
                  onClick={() => aprobarComentario(comentario.id)}
                  className="text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Aprobar comentario"
                >
                  <FaCheck />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => eliminarComentario(comentario.id)}
                className="text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Eliminar comentario"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón "Ver más" */}
      {comentariosVisibles < comentariosFiltrados.length && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={cargarMasComentarios}
            className="transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Ver más comentarios"
          >
            Ver más
          </Button>
        </div>
      )}
    </div>
  );
};


export default ListaComentarios;
