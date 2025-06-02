import React from "react";

const ManualUsuario = () => {
  return (
    <div className="p-0 sm:p-6 w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100">
      <div className="w-full bg-white rounded-none sm:rounded-2xl shadow-lg border-b sm:border border-blue-100 px-4 sm:px-12 py-8 sm:py-12">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4 drop-shadow">Manual del Administrador</h1>
        <p className="text-lg text-blue-900 mb-8">
          Bienvenido al manual para administradores del sistema. Aquí encontrarás información útil para gestionar usuarios, tickets y configuraciones avanzadas.
        </p>
        <div className="bg-white rounded-xl shadow p-6 mb-8 border border-blue-50">
          <ol className="list-decimal list-inside space-y-4 text-gray-800">
            <li>
              <span className="font-semibold text-blue-700">Acceso al panel:</span>{" "}
              Ingresa con tu cuenta de administrador para acceder a todas las funciones del sistema.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Gestión de usuarios:</span>{" "}
              Visualiza, edita, activa/inactiva y elimina usuarios desde la sección de usuarios.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Gestión de administradores:</span>{" "}
              Asigna o quita roles de administrador a los usuarios según sea necesario.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Soporte técnico:</span>{" "}
              Supervisa y responde tickets de soporte enviados por los usuarios.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Reportes y estadísticas:</span>{" "}
              Consulta estadísticas clave sobre el uso del sistema y el estado de los tickets.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Configuraciones:</span>{" "}
              Accede a las opciones avanzadas para personalizar el sistema según las necesidades de tu organización.
            </li>
            <li>
              <span className="font-semibold text-blue-700">Cerrar sesión:</span>{" "}
              Haz clic en tu perfil y selecciona "Cerrar sesión" para salir de forma segura.
            </li>
          </ol>
        </div>
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-2xl font-bold mb-3 text-blue-700">Recursos útiles</h2>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>
              <a href="#" className="underline hover:text-blue-900 font-medium">Ver video tutorial para administradores</a>
            </li>
            <li>
              <a href="#" className="underline hover:text-blue-900 font-medium">Descargar manual PDF</a>
            </li>
            <li>
              <a href="#" className="underline hover:text-blue-900 font-medium">Preguntas frecuentes (FAQ)</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManualUsuario;


























