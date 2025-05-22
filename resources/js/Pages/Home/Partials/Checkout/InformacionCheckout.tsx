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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <Head title="Información de tu pedido" />
      <Header />

      <div className="container mx-auto py-12 px-0 sm:px-2 lg:px-4 flex-grow">
        <div className="w-full bg-white/90 dark:bg-gray-900/95 rounded-3xl shadow-2xl p-4 sm:p-10 md:p-14 border border-gray-100 dark:border-blue-900 transition-all backdrop-blur-md">
          <h1 className="text-4xl font-extrabold mb-10 text-blue-900 dark:text-blue-100 text-center tracking-tight flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Información de tu pedido
          </h1>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4 border-b-2 border-blue-100 dark:border-blue-800 pb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Datos personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4 border border-blue-100 dark:border-blue-800 flex items-center gap-3 shadow-sm">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs">Nombre</span>
                  <div className="text-blue-900 dark:text-blue-100 text-base">{user.nombre}</div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4 border border-blue-100 dark:border-blue-800 flex items-center gap-3 shadow-sm">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs">Apellidos</span>
                  <div className="text-blue-900 dark:text-blue-100 text-base">{user.apellidos}</div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4 border border-blue-100 dark:border-blue-800 flex items-center gap-3 shadow-sm">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div>
                  <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs">DNI</span>
                  <div className="text-blue-900 dark:text-blue-100 text-base">{user.dni}</div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4 border border-blue-100 dark:border-blue-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243a4 4 0 00-5.657 5.657z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div>
                    <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs">Dirección</span>
                    <div className="text-blue-900 dark:text-blue-100 text-base">{usarDireccionAlternativa ? direccionAlternativa : user.direccion}</div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="ml-2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white rounded-lg shadow hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 transition"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Resumen de pedido
            </h2>
            <span className="text-sm text-blue-700 dark:text-blue-300 mb-4 block">{pedido.items.length} Producto{pedido.items.length > 1 ? 's' : ''}</span>
            <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl border border-blue-100 dark:border-blue-800 p-5 mb-4">
              {pedido.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-3 border-b border-blue-200 dark:border-blue-800 last:border-b-0">
                  {/* Imagen igual que en carrito */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-blue-900">
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
                    <div className="font-bold text-blue-900 dark:text-blue-100 text-sm">{item.nombre}</div>
                    {/* Puedes agregar una descripción si la tienes */}
                    {/* <div className="text-xs text-blue-700 dark:text-blue-300">Descripción corta</div> */}
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Cantidad: {item.cantidad}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Precio unitario: {formatPrice(item.precio_final)}
                    </div>
                  </div>
                  <div className="font-bold text-blue-900 dark:text-blue-100 text-base">{formatPrice(item.subtotal)}</div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <Link href="/cart" className="text-blue-700 dark:text-blue-300 font-semibold hover:underline">Añadir más productos</Link>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-blue-700 dark:text-blue-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 12h6M9 16h6M9 8h6" /><circle cx="12" cy="12" r="10" /></svg>
                Si tienes un cupón agrégalo en el siguiente paso
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-2xl p-5">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-blue-900 dark:text-blue-100 font-semibold">Subtotal</span>
                <span className="text-blue-900 dark:text-blue-100">{formatPrice(pedido.subtotal)}</span>
              </div>
              {/* Simulación de descuento si aplica */}
              {pedido.subtotal > pedido.total && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold">Descuento</span>
                  <span className="text-blue-700 dark:text-blue-300">- {formatPrice(pedido.subtotal - pedido.total)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-blue-900 dark:text-blue-100">Costo de envío</span>
                <span className="text-blue-700 dark:text-blue-300">Revísalo en el paso Pago</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-4">
                <span className="text-blue-900 dark:text-blue-100">Total Pedido</span>
                <span className="text-blue-700 dark:text-blue-300">{formatPrice(pedido.total)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePedidoSubmit}>
            <div className="flex flex-col md:flex-row justify-end gap-6 mt-12">
              <Link
                href="/cart"
                className="px-7 py-3 rounded-xl border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-200 bg-white dark:bg-blue-950 hover:bg-blue-50 dark:hover:bg-blue-900 transition font-semibold shadow"
              >
                Volver al carrito
              </Link>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white font-bold shadow-xl hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 transition disabled:opacity-75"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M4 12a8 8 0 018-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Guardando pedido...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 w-full max-w-lg border border-blue-200 dark:border-blue-800 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243a4 4 0 00-5.657 5.657z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Dirección alternativa
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-blue-400 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100 transition"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {mensaje && (
              <div className={`p-4 mb-6 rounded-xl text-center font-semibold ${mensaje.includes('Error') ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'}`}>
                {mensaje}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <label htmlFor="direccion" className="block text-base font-bold text-blue-800 dark:text-blue-200 mb-3">
                  Nueva dirección de entrega
                </label>
                <textarea
                  id="direccion"
                  rows={3}
                  className="w-full border border-blue-300 dark:border-blue-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-950 dark:text-blue-100 resize-none text-base"
                  value={direccionAlternativa}
                  onChange={(e) => setDireccionAlternativa(e.target.value)}
                  placeholder="Ingresa la dirección completa"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-blue-300 dark:border-blue-700 rounded-xl text-blue-700 dark:text-blue-200 bg-white dark:bg-blue-950 hover:bg-blue-50 dark:hover:bg-blue-900 transition font-semibold"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 dark:hover:from-blue-800 dark:hover:to-blue-700 transition disabled:opacity-75"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M4 12a8 8 0 018-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Guardando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
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