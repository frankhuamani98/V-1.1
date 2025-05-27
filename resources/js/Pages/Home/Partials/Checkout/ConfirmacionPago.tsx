import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '../../Header';
import Footer from '../../Footer';

export default function ConfirmacionPago() {
  const { pedido, numero_orden } = usePage().props as any;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="¡Compra realizada!" />
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-700">¡Gracias por tu compra!</h1>
          <p className="mb-6 text-gray-700">
            Tu pedido ha sido registrado correctamente.<br />
            {numero_orden && (
              <span className="block mt-2 text-blue-700 font-semibold">
                Número de Orden: #{numero_orden}
              </span>
            )}
            Pronto nos pondremos en contacto contigo para coordinar la entrega.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

