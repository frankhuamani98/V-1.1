import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '../../Header';
import Footer from '../../Footer';

interface PedidoItem {
  nombre: string;
  cantidad: number;
  precio_final: number;
  subtotal: number;
}

interface Props {
  user: {
    nombre: string;
    apellidos: string;
    dni: string;
    direccion: string;
  };
  pedido: {
    items: PedidoItem[];
    subtotal: number;
    total: number;
  };
}

const formatPrice = (price: number): string =>
  price.toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace('PEN', 'S/');

export default function InformacionCheckout({ user, pedido }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="Información de tu pedido" />
      <Header />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Información de tu pedido</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Datos personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Nombre:</span>
                <div className="text-gray-900">{user.nombre}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Apellidos:</span>
                <div className="text-gray-900">{user.apellidos}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">DNI:</span>
                <div className="text-gray-900">{user.dni}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dirección:</span>
                <div className="text-gray-900">{user.direccion}</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Resumen del pedido</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Producto</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Unidad</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-2">{item.nombre}</td>
                      <td className="px-4 py-2 text-center">{item.cantidad}</td>
                      <td className="px-4 py-2 text-right">{formatPrice(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Subtotal y Total */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-700">Subtotal</span>
                <span className="text-base font-semibold text-gray-900">{formatPrice(pedido.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(pedido.total)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/cart"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Volver al carrito
            </Link>
            <Link
              href="/checkout/metodos-pago"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Continuar con el pago
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

