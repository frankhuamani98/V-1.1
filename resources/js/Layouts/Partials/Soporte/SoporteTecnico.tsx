import React, { useState } from "react";

// Si tienes acceso a los datos de usuarios y admins, puedes importarlos aquí
// import ListaUsuarios from "../Usuarios/ListaUsuarios";
// import Administradores from "../Usuarios/Administradores";

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

  // Simulación de admins para ejemplo de integración
  const admins = users.filter(u => u.role === "Administrador").map(u => ({
    id: u.id,
    first_name: u.name.split(" ")[0],
    last_name: u.name.split(" ")[1] || "",
    email: `${u.name.replace(" ", ".").toLowerCase()}@correo.com`,
    phone: "123456789",
    status: "active",
  }));

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow">Panel de Soporte Técnico</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Estadísticas Clave */}
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Estadísticas Clave</h2>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">
              <span className="text-2xl">{tickets.filter(ticket => ticket.status === "Abierto").length}</span>
              <span className="ml-2 text-base">Tickets Abiertos</span>
            </p>
            <p className="text-yellow-600 font-semibold">
              <span className="text-2xl">{tickets.filter(ticket => ticket.status === "En progreso").length}</span>
              <span className="ml-2 text-base">En Progreso</span>
            </p>
            <p className="text-red-600 font-semibold">
              <span className="text-2xl">{tickets.filter(ticket => ticket.status === "Cerrado").length}</span>
              <span className="ml-2 text-base">Cerrados</span>
            </p>
          </div>
        </div>

        {/* Gestión de Tickets */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Gestión de Tickets</h2>
          <ul className="divide-y divide-blue-50">
            {tickets.map(ticket => (
              <li key={ticket.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className={`font-semibold ${ticket.priority === "Alta" ? "text-red-500" : ticket.priority === "Media" ? "text-yellow-500" : "text-green-500"}`}>
                    {ticket.title}
                  </span>
                  <span className="text-gray-500 ml-2 text-xs">({ticket.status})</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ml-2
                  ${ticket.priority === "Alta" ? "bg-red-100 text-red-700" : ticket.priority === "Media" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                  {ticket.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Administración de Usuarios */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Administración de Usuarios</h2>
          <ul className="divide-y divide-blue-50">
            {users.map(user => (
              <li key={user.id} className="py-3 flex items-center justify-between">
                <span className="font-semibold text-blue-700">{user.name}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold
                  ${user.role === "Administrador" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                  {user.role}
                </span>
              </li>
            ))}
          </ul>
          {/* Ejemplo de integración con Administradores */}
          <div className="mt-6">
            <h3 className="text-base font-semibold text-blue-600 mb-2">Ver Administradores</h3>
            {/* Aquí podrías renderizar el componente real si tienes acceso */}
            {/* <Administradores admins={admins} /> */}
            <ul className="divide-y divide-blue-50">
              {admins.map(admin => (
                <li key={admin.id} className="py-2 flex items-center justify-between">
                  <span className="font-medium text-blue-800">{admin.first_name} {admin.last_name}</span>
                  <span className="text-xs text-green-600 ml-2">Activo</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ejemplo de integración real con ListaUsuarios o Administradores */}
      {/* 
      <div className="mt-10">
        <ListaUsuarios users={usersDataFromBackend} />
        <Administradores admins={adminsDataFromBackend} />
      </div>
      */}
    </div>
  );
};

export default AdminPanel;















































































































































































































































