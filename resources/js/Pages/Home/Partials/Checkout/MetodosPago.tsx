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

const infoMetodos: Record<string, { cuentas?: string[]; instrucciones?: string; qr?: string }> = {
  bcp: {
    cuentas: [
      'Cuenta Soles: 19195138673067',
      'Cuenta Interbancaria: 00219119513867306758',
    ],
    instrucciones: 'Realiza la transferencia a la cuenta BCP y sube el comprobante.',
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
  waiky: {
    cuentas: ['Número Waiky: 977 666 555'],
    qr: '/images/qr-waiky.png',
    instrucciones: 'Escanea el QR o transfiere al número Waiky y sube el comprobante.',
  },
  caja_cusco: {
    cuentas: [
      'Ahorros soles: 106352321000159247',
      'CCI: 80603532100015924728',
    ],
    instrucciones: 'Realiza la transferencia a la cuenta Caja Cusco y sube el comprobante.',
  },
  scotiabank: {
    cuentas: [
      'Tipo de cuenta: Cuenta Ahorro Soles',
      'Número de cuenta: 3660168323',
      'Código de Cuenta Interbancario: 00936620366016832360',
    ],
    instrucciones: 'Realiza la transferencia a la cuenta Scotiabank y sube el comprobante.',
  },
};

export default function MetodosPago({ pedido, metodos }: Props) {
  const ordenDeseado = ['yape', 'plin', 'waiky', 'bcp', 'caja_cusco', 'scotiabank'];
  const metodosFiltrados = metodos
    .filter(m => ordenDeseado.includes(m.id))
    .sort((a, b) => ordenDeseado.indexOf(a.id) - ordenDeseado.indexOf(b.id));

  const [seleccionado, setSeleccionado] = useState<string | null>(metodosFiltrados[0]?.id ?? null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [showQrModal, setShowQrModal] = useState(false);
  const [showQrModalPlin, setShowQrModalPlin] = useState(false);
  const [showQrModalYape, setShowQrModalYape] = useState(false);
  const { post, processing, setData, data, errors } = useForm({
    pedido_id: pedido?.id,
    metodo: metodosFiltrados[0]?.id ?? '',
    referencia_pago: null as File | null,
  });

  const [processingMetodo, setProcessingMetodo] = useState<string | null>(null);

  const [showWarning, setShowWarning] = useState(true);

  const handleSeleccionar = (id: string) => {
    setSeleccionado(id);
    setData('metodo', id);
  };

  const getImagePreview = (metodo: string) => {
    const file = files[metodo];
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, metodo: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [metodo]: file }));
      setData('referencia_pago', file);
      setData('metodo', metodo);
    }
  };

  React.useEffect(() => {
    return () => {
      Object.values(files).forEach(file => {
        if (file) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [files]);

  const renderUploadBox = (metodo: string, color: string) => {
    const preview = getImagePreview(metodo);
    return (
      <div className="relative w-full">
        <input
          type="file"
          accept="image/*"
          onChange={e => handleFileChange(e, metodo)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          required
        />
        <div className={`w-full bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-${color}-400 transition-all duration-200 relative`} style={{ minHeight: '150px' }}>
          {preview ? (
            <div className="relative w-full h-full" style={{ minHeight: '120px' }}>
              <img
                src={preview}
                alt="Vista previa del comprobante"
                className="absolute inset-0 w-full h-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                <p className="text-white text-sm font-medium">Cambiar imagen</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center mb-2">
                <svg className={`w-8 h-8 text-${color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-700">Subir comprobante</div>
              <div className="text-xs text-gray-500 mt-1">Haz clic o arrastra tu archivo aquí</div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleConfirmar = (e: React.FormEvent, metodo: string) => {
    e.preventDefault();
    setData('metodo', metodo);
    setData('referencia_pago', files[metodo]);
    setProcessingMetodo(metodo);
    post('/checkout/metodos-pago/procesar', {
      forceFormData: true,
      onFinish: () => {
        setProcessingMetodo(null);
        setFiles(prev => ({ ...prev, [metodo]: null }));
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative transform transition-all sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Aviso Importante
              </h2>
              <p className="text-gray-700 text-center mb-6 text-base leading-relaxed">
                <span className="block mb-3">
                  Le informamos que la presentación de comprobantes de pago falsificados constituye un <span className="font-semibold text-red-600">delito grave</span>.
                </span>
                <span className="block mb-3">
                  Cualquier intento de fraude resultará en la <span className="font-semibold text-red-600">denuncia de su información</span> a las autoridades pertinentes, lo que podría acarrear <span className="font-semibold text-red-600">acciones legales</span> y <span className="font-semibold text-red-600">sanciones económicas significativas</span>.
                </span>
                <span className="block font-semibold">
                  Se recomienda proceder con total honestidad.
                </span>
              </p>
              <button
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-6 py-3 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-all"
                onClick={() => setShowWarning(false)}
              >
                Comprendo y Acepto los Términos
              </button>
            </div>
            <span className="absolute top-4 right-4 text-gray-300 text-4xl opacity-20 pointer-events-none select-none">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        </div>
      )}
      <Head title="Selecciona tu método de pago" />
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900 text-center mb-2">
            Selecciona tu método de pago
          </h1>
          <p className="text-center text-gray-600 mb-10">Elige el método que prefieras para completar tu compra</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Yape */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src="https://cdn.brandfetch.io/id08GK8vip/w/960/h/960/theme/dark/icon.jpeg" 
                       alt="Yape" 
                       className="w-12 h-12 rounded-lg shadow-sm" />
                  <span className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full">
                    Popular
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Yape</h3>
                <p className="text-sm text-gray-600 mb-4">Paga de forma rápida y segura con Yape</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Para pagar:</span>
                    <span className="ml-2">Escanea el código QR</span>
                  </div>
                  <img
                    src="/pagos/qryape.jpg"
                    alt="QR Yape"
                    className="w-32 h-32 mx-auto rounded-lg shadow-sm bg-white p-2 border border-gray-100"
                  />
                </div>
                <form onSubmit={e => handleConfirmar(e, 'yape')} className="space-y-3">
                  {renderUploadBox('yape', 'purple')}
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                    disabled={processingMetodo === 'yape'}
                  >
                    {processingMetodo === 'yape' ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                      : 'Pagar con Yape'
                    }
                  </button>
                </form>
                {errors.referencia_pago && (
                  <p className="mt-2 text-sm text-red-600">{errors.referencia_pago}</p>
                )}
              </div>
            </div>

            {/* Plin */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src="https://plin.pe/wp-content/themes/plin/favicon/apple-icon-57x57.png" 
                       alt="Plin" 
                       className="w-12 h-12 rounded-lg shadow-sm" />
                  <span className="px-3 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 rounded-full">
                    Rápido
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plin</h3>
                <p className="text-sm text-gray-600 mb-4">Transfiere fácilmente desde cualquier banco</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Para pagar:</span>
                    <span className="ml-2">Escanea el código QR</span>
                  </div>
                  <img
                    src="/pagos/qrplin.jpg"
                    alt="QR Plin"
                    className="w-32 h-32 mx-auto rounded-lg shadow-sm bg-white p-2 border border-gray-100"
                  />
                </div>
                <form onSubmit={e => handleConfirmar(e, 'plin')} className="space-y-3">
                  {renderUploadBox('plin', 'cyan')}
                  <button
                    type="submit"
                    className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors"
                    disabled={processingMetodo === 'plin'}
                  >
                    {processingMetodo === 'plin' ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                      : 'Pagar con Plin'
                    }
                  </button>
                </form>
                {errors.referencia_pago && (
                  <p className="mt-2 text-sm text-red-600">{errors.referencia_pago}</p>
                )}
              </div>
            </div>

            {/* Waiky */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src="https://play-lh.googleusercontent.com/SQpDeQodE-GEQkSYJNcZL6oGxCDZO4QZ6HLiW0zA1RQGrg-BnDPES47CG3NMWSbkDKk=w240-h480-rw" 
                       alt="Waiky" 
                       className="w-12 h-12 rounded-lg shadow-sm" />
                  <span className="px-3 py-1 text-xs font-medium text-pink-600 bg-pink-50 rounded-full">
                    Nuevo
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Wayki</h3>
                <p className="text-sm text-gray-600 mb-4">Paga de forma rápida con Wayki</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Para pagar:</span>
                    <span className="ml-2">Escanea el código QR</span>
                  </div>
                  <img
                    src="/pagos/qrwayki.jpg"
                    alt="QR Waiky"
                    className="w-32 h-32 mx-auto rounded-lg shadow-sm bg-white p-2 border border-gray-100"
                  />
                </div>
                <form onSubmit={e => handleConfirmar(e, 'waiky')} className="space-y-3">
                  {renderUploadBox('waiky', 'pink')}
                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                    disabled={processingMetodo === 'waiky'}
                  >
                    {processingMetodo === 'waiky' ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                      : 'Pagar con Wayki'
                    }
                  </button>
                </form>
                {errors.referencia_pago && (
                  <p className="mt-2 text-sm text-red-600">{errors.referencia_pago}</p>
                )}
              </div>
            </div>

            {/* BCP */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src="https://play-lh.googleusercontent.com/gBpVaCpZsbBrLufT06aRpuLQvsUq1KAZUCEof_ps76mtB8_llJg3xv24mey8I0m3dUE=w240-h480-rw" 
                       alt="BCP" 
                       className="w-12 h-12 rounded-lg shadow-sm" />
                  <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    Seguro
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">BCP</h3>
                <p className="text-sm text-gray-600 mb-4">Transferencia o depósito bancario</p>
                <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">Cuenta Soles</span>
                      <span className="text-sm text-gray-900">19195138673067</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">CCI</span>
                      <span className="text-sm text-gray-900">00219119513867306758</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={e => handleConfirmar(e, 'bcp')} className="space-y-3">
                  {renderUploadBox('bcp', 'blue')}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    disabled={processingMetodo === 'bcp'}
                  >
                    {processingMetodo === 'bcp' ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                      : 'Pagar con BCP'
                    }
                  </button>
                </form>
                {errors.referencia_pago && (
                  <p className="mt-2 text-sm text-red-600">{errors.referencia_pago}</p>
                )}
              </div>
            </div>

            {/* Caja Cusco */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src="https://logosandtypes.com/wp-content/uploads/2023/11/caja-cusco.svg" 
                       alt="Caja Cusco" 
                       className="w-12 h-12 rounded-lg shadow-sm" />
                  <span className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                    Confiable
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Caja Cusco</h3>
                <p className="text-sm text-gray-600 mb-4">Transferencia o depósito bancario</p>
                <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">Cuenta Ahorros</span>
                      <span className="text-sm text-gray-900">106352321000159247</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">CCI</span>
                      <span className="text-sm text-gray-900">80603532100015924728</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={e => handleConfirmar(e, 'caja_cusco')} className="space-y-3">
                  {renderUploadBox('caja_cusco', 'red')}
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    disabled={processingMetodo === 'caja_cusco'}
                  >
                    {processingMetodo === 'caja_cusco' ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                      : 'Pagar con Caja Cusco'
                    }
                  </button>
                </form>
                {errors.referencia_pago && (
                  <p className="mt-2 text-sm text-red-600">{errors.referencia_pago}</p>
                )}
              </div>
            </div>

            {/* Scotiabank */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img src="https://cdn.aglty.io/scotiabank-peru/imagenes/2022/logos/logo-scotiabank-symbol.svg" 
                       alt="Scotiabank" 
                       className="w-12 h-12 rounded-lg shadow-sm" />
                  <span className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full">
                    Internacional
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scotiabank</h3>
                <p className="text-sm text-gray-600 mb-4">Transferencia o depósito bancario</p>
                <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">Cuenta Ahorros</span>
                      <span className="text-sm text-gray-900">3660168323</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500">CCI</span>
                      <span className="text-sm text-gray-900">00936620366016832360</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={e => handleConfirmar(e, 'scotiabank')} className="space-y-3">
                  {renderUploadBox('scotiabank', 'orange')}
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                    disabled={processingMetodo === 'scotiabank'}
                  >
                    {processingMetodo === 'scotiabank' ? 
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                      : 'Pagar con Scotiabank'
                    }
                  </button>
                </form>
                {errors.referencia_pago && (
                  <p className="mt-2 text-sm text-red-600">{errors.referencia_pago}</p>
                )}
              </div>
            </div>

            {/* Información del proceso de pago */}
            <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">¿Cómo funciona el proceso de pago?</h3>
                  <p className="text-gray-600 text-center mb-6">El proceso es simple y seguro</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm mr-3">1</span>
                      <h4 className="font-medium text-gray-900">Selecciona el método</h4>
                    </div>
                    <p className="text-sm text-gray-600">Elige el método de pago que prefieras entre las opciones disponibles: Yape, Plin, Wayki o transferencia bancaria.</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm mr-3">2</span>
                      <h4 className="font-medium text-gray-900">Realiza el pago</h4>
                    </div>
                    <p className="text-sm text-gray-600">Transfiere el monto exacto utilizando los datos proporcionados. Guarda el comprobante de la operación.</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm mr-3">3</span>
                      <h4 className="font-medium text-gray-900">Sube el comprobante</h4>
                    </div>
                    <p className="text-sm text-gray-600">Sube la imagen o captura del comprobante de pago. Verificaremos y confirmaremos tu pedido.</p>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-900">Próximamente más opciones</h4>
                      <p className="mt-1 text-sm text-blue-700">Estamos trabajando para implementar pagos en línea con tarjeta de crédito/débito y otros métodos digitales para brindarte mayor comodidad.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/cart" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al carrito
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
