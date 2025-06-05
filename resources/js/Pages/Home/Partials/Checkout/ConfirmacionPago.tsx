import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '../../Header';
import Footer from '../../Footer';

export default function ConfirmacionPago() {
  const { pedido, numero_orden } = usePage().props as any;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Head title="¡Compra realizada!" />
      <Header />
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 transform translate-x-8 -translate-y-8">
                <svg className="w-32 h-32 text-green-400 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-3xl font-bold mb-2">¡Comprobante enviado!</h1>
                <p className="text-green-50 text-lg">Tu pedido está pendiente de verificación</p>
              </div>
            </div>

            <div className="p-8">
              {numero_orden && (
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-blue-900">Número de Orden</h3>
                      <p className="text-2xl font-bold text-blue-700">#{numero_orden}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-start bg-yellow-50 p-4 rounded-xl">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Pendiente de verificación</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Estamos verificando tu comprobante de pago. Este proceso puede tomar hasta 24 horas hábiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-600">
                      Te notificaremos por WhatsApp una vez que confirmemos tu pago. Después de la confirmación, coordinaremos la entrega de tu pedido.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/"
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Volver al inicio
                </Link>
                <Link
                  href="/pedidos/mis-pedidos"
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Ver mis pedidos
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos pasos</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                  1
                </div>
                <p className="ml-3 text-gray-600">Verificaremos tu comprobante de pago</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                  2
                </div>
                <p className="ml-3 text-gray-600">Te enviaremos un mensaje por WhatsApp</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                  3
                </div>
                <p className="ml-3 text-gray-600">Coordinaremos la entrega de tu pedido</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

