import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '../../Header';
import Footer from '../../Footer';
import axios from 'axios';

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
  const [showModal, setShowModal] = useState(false);
  const [direccionAlternativa, setDireccionAlternativa] = useState('');
  const [usarDireccionAlternativa, setUsarDireccionAlternativa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Nuevo: useForm para el envío del pedido
  const { post, processing, setData } = useForm({
    nombre: user.nombre,
    apellidos: user.apellidos,
    dni: user.dni,
    direccion_alternativa: '', // se actualizará si el usuario la ingresa
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/checkout/direccion-alternativa', {
        direccion_alternativa: direccionAlternativa
      });
      
      if (response.data.success) {
        setUsarDireccionAlternativa(true);
        setMensaje('Dirección alternativa guardada correctamente');
        // Actualiza el campo en useForm
        setData('direccion_alternativa', direccionAlternativa);
        setTimeout(() => {
          setShowModal(false);
          setMensaje('');
        }, 1500);
      }
    } catch (error) {
      setMensaje('Error al guardar la dirección alternativa');
    } finally {
      setLoading(false);
    }
  };

  // Nuevo: manejar el submit del pedido
  const handlePedidoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/checkout/informacion', {
      onSuccess: () => {
        // Redirige a métodos de pago automáticamente por el backend
      },
    });
  };

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
                <div className="flex items-center justify-between">
                  <div className="text-gray-900">{usarDireccionAlternativa ? direccionAlternativa : user.direccion}</div>
                  <button 
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    {usarDireccionAlternativa ? 'Cambiar' : 'Cambiar'}
                  </button>
                </div>
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

          {/* Cambia los botones por un formulario */}
          <form onSubmit={handlePedidoSubmit}>
            <div className="flex justify-end space-x-4">
              <Link
                href="/cart"
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Volver al carrito
              </Link>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-75"
                disabled={processing}
              >
                {processing ? 'Guardando pedido...' : 'Continuar con el pago'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      {/* Modal para dirección alternativa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Dirección alternativa</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {mensaje && (
              <div className={`p-2 mb-4 rounded ${mensaje.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {mensaje}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva dirección de entrega
                </label>
                <textarea
                  id="direccion"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={direccionAlternativa}
                  onChange={(e) => setDireccionAlternativa(e.target.value)}
                  placeholder="Ingresa la dirección completa"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-75"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}