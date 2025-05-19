import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '../../Header';
import Footer from '../../Footer';

interface MetodoPago {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Props {
  pedido: any;
  metodos: MetodoPago[];
}

const infoMetodos: Record<string, { cuentas?: string[]; qr?: string; instrucciones?: string }> = {
  tarjeta: {
    instrucciones: 'Serás redirigido a la pasarela de pago para ingresar los datos de tu tarjeta.',
  },
  yape: {
    cuentas: ['Número Yape: 999 888 777'],
    qr: '/images/qr-yape.png',
    instrucciones: 'Escanea el QR o transfiere al número Yape y sube el comprobante.',
  },
  plin: {
    cuentas: ['Número Plin: 988 877 766'],
    qr: '/images/qr-plin.png',
    instrucciones: 'Escanea el QR o transfiere al número Plin y sube el comprobante.',
  },
  transferencia: {
    cuentas: [
      'BCP: 123-4567890-0-12',
      'Interbank: 123-4567890123',
      'BBVA: 123-45678901',
      'Scotiabank: 123-456789012',
    ],
    instrucciones: 'Realiza la transferencia a una de las cuentas y sube el comprobante.',
  },
};

export default function MetodosPago({ pedido, metodos }: Props) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { post, processing, setData, data, errors } = useForm({
    pedido_id: pedido?.id,
    metodo: '',
    referencia_pago: null as File | null,
  });

  const handleSeleccionar = (id: string) => {
    setSeleccionado(id);
    setData('metodo', id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setData('referencia_pago', e.target.files[0]);
    }
  };

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    post('/checkout/metodos-pago/procesar', {
      forceFormData: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="Selecciona tu método de pago" />
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Selecciona tu método de pago</h1>
          <div className="space-y-4">
            {metodos.map((metodo) => (
              <div
                key={metodo.id}
                className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between ${
                  seleccionado === metodo.id ? 'border-blue-600 bg-blue-50' : ''
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-800">{metodo.nombre}</div>
                  <div className="text-gray-600 text-sm">{metodo.descripcion}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSeleccionar(metodo.id)}
                  className={`mt-3 md:mt-0 px-5 py-2 rounded transition ${
                    seleccionado === metodo.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>

          {/* Mostrar detalles del método seleccionado */}
          {seleccionado && (
            <form onSubmit={handleConfirmar} className="mt-8" encType="multipart/form-data">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Detalles de pago</h2>
                {infoMetodos[seleccionado]?.instrucciones && (
                  <div className="mb-2 text-gray-700">{infoMetodos[seleccionado].instrucciones}</div>
                )}
                {infoMetodos[seleccionado]?.cuentas && (
                  <ul className="mb-2 text-gray-700 list-disc pl-5">
                    {infoMetodos[seleccionado].cuentas!.map((cuenta, idx) => (
                      <li key={idx}>{cuenta}</li>
                    ))}
                  </ul>
                )}
                {infoMetodos[seleccionado]?.qr && (
                  <div className="mb-2">
                    <img src={infoMetodos[seleccionado].qr} alt="QR" className="w-40 h-40 object-contain" />
                  </div>
                )}
                {/* Campo para subir comprobante si NO es tarjeta */}
                {seleccionado !== 'tarjeta' && (
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subir comprobante de pago (foto)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-700"
                      required
                    />
                    {errors.referencia_pago && (
                      <div className="text-red-600 text-xs mt-1">{errors.referencia_pago}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-75"
                  disabled={processing}
                >
                  {processing ? 'Procesando...' : 'Finalizar compra'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8">
            <Link href="/cart" className="text-blue-600 hover:underline">Volver al carrito</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

