import React, { useState } from "react";

const AdminPanel = () => {
  const [tickets, setTickets] = useState([
    { id: 1, title: "Problema de inicio de sesión", status: "Abierto", priority: "Alta" },
    { id: 2, title: "Error en la página de perfil", status: "En progreso", priority: "Media" },
    { id: 3, title: "Solicitud de restablecimiento de contraseña", status: "Cerrado", priority: "Baja" },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", role: "Usuario" },
    { id: 2, name: "María López", role: "Administrador" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estadísticas Clave */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Estadísticas Clave</h2>
          <p className="text-green-600">Tickets Abiertos: {tickets.filter(ticket => ticket.status === "Abierto").length}</p>
          <p className="text-yellow-600">Tickets en Progreso: {tickets.filter(ticket => ticket.status === "En progreso").length}</p>
          <p className="text-red-600">Tickets Cerrados: {tickets.filter(ticket => ticket.status === "Cerrado").length}</p>
        </div>

        {/* Gestión de Tickets */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Gestión de Tickets</h2>
          <ul>
            {tickets.map(ticket => (
              <li key={ticket.id} className="border-b border-gray-200 py-2">
                <span className={`font-medium ${ticket.priority === "Alta" ? "text-red-500" : ticket.priority === "Media" ? "text-yellow-500" : "text-green-500"}`}>
                  {ticket.title}
                </span>
                <span className="text-gray-600 ml-2">({ticket.status})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Administración de Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Administración de Usuarios</h2>
          <ul>
            {users.map(user => (
              <li key={user.id} className="border-b border-gray-200 py-2">
                <span className="font-medium text-blue-600">{user.name}</span>
                <span className="text-gray-600 ml-2">({user.role})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;















































































































































































































































