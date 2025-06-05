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
  imagen?: string;
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

  const { post, processing, setData } = useForm({
    nombre: user.nombre,
    apellidos: user.apellidos,
    dni: user.dni,
    direccion_alternativa: '',
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

  const handlePedidoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/checkout/informacion', {
      onSuccess: () => {
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <Head title="Información de tu pedido" />
      <Header />

      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 md:p-10 border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
          <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center tracking-tight flex items-center justify-center gap-3">
            <svg className="w-9 h-9 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Información de tu pedido
          </h1>
          
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Datos personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3 shadow-sm">
                <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">Nombre</span>
                  <div className="text-gray-900 dark:text-gray-100 text-base">{user.nombre}</div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3 shadow-sm">
                <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">Apellidos</span>
                  <div className="text-gray-900 dark:text-gray-100 text-base">{user.apellidos}</div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3 shadow-sm">
                <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">DNI</span>
                  <div className="text-gray-900 dark:text-gray-100 text-base">{user.dni}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-850 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">Dirección</span>
                    <div className="text-gray-900 dark:text-gray-100 text-base">{usarDireccionAlternativa ? direccionAlternativa : user.direccion}</div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="ml-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Resumen de pedido
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-300 mb-4 block">{pedido.items.length} Producto{pedido.items.length > 1 ? 's' : ''}</span>
            <div className="bg-white dark:bg-gray-850 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
              {pedido.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <img
                      src={
                        item.imagen
                          ? (item.imagen.startsWith('http')
                              ? item.imagen
                              : `/storage/${item.imagen}`)
                          : '/images/placeholder.png'
                      }
                      alt={item.nombre}
                      className="h-full w-full object-cover object-center"
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.nombre}</div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      Cantidad: {item.cantidad}
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      Precio unitario: {formatPrice(item.precio_final)}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-base">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 text-sm">
                <svg className="w-5 h-5 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0zM12 4v8m4-4H8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <Link href="/cart" className="text-blue-700 dark:text-blue-300 font-semibold hover:underline">Añadir más productos</Link>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-850 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-base mb-3">
                <span className="text-gray-800 dark:text-gray-200 font-medium">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{formatPrice(pedido.subtotal)}</span>
              </div>
              {pedido.subtotal > pedido.total && (
                <div className="flex justify-between items-center text-base mb-3">
                  <span className="text-red-600 dark:text-red-400 font-medium">Descuento</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">- {formatPrice(pedido.subtotal - pedido.total)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base mb-3">
                <span className="text-gray-800 dark:text-gray-200 font-medium">Costo de envío</span>
                <span className="text-gray-600 dark:text-gray-300">Revísalo en el paso Pago</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex justify-between items-center text-xl font-bold">
                <span className="text-gray-900 dark:text-gray-100">Total Pedido</span>
                <span className="text-blue-700 dark:text-blue-300">{formatPrice(pedido.total)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePedidoSubmit}>
            <div className="flex flex-col md:flex-row justify-end gap-4 mt-12">
              <Link
                href="/cart"
                className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold shadow-sm text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Volver al carrito
              </Link>
              <button
                type="submit"
                className="px-6 py-3 rounded-md bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-75 text-center"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M4 12a8 8 0 018-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Guardando pedido...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Continuar con el pago
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-xl transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243a4 4 0 00-5.657 5.657z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dirección alternativa
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {mensaje && (
              <div className={`p-4 mb-6 rounded-lg text-center font-medium ${mensaje.includes('Error') ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'}`}>
                {mensaje}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nueva dirección de entrega
                </label>
                <textarea
                  id="direccion"
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 resize-none text-base"
                  value={direccionAlternativa}
                  onChange={(e) => setDireccionAlternativa(e.target.value)}
                  placeholder="Ingresa la dirección completa"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition disabled:opacity-75"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M4 12a8 8 0 018-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Guardando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Guardar
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}