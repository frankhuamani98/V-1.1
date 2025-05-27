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

// Info para BCP, Yape, Plin, Caja Cusco y Scotiabank
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
  // Filtrar solo BCP, Yape, Plin, Caja Cusco y Scotiabank
  const metodosFiltrados = metodos.filter(
    m => m.nombre.toLowerCase().includes('bcp') || m.id === 'bcp' ||
         m.nombre.toLowerCase().includes('yape') || m.id === 'yape' ||
         m.nombre.toLowerCase().includes('plin') || m.id === 'plin' ||
         m.nombre.toLowerCase().includes('waiky') || m.id === 'waiky' ||
         m.nombre.toLowerCase().includes('caja cusco') || m.id === 'caja_cusco' ||
         m.nombre.toLowerCase().includes('scotiabank') || m.id === 'scotiabank'
  );
  const [seleccionado, setSeleccionado] = useState<string | null>(metodosFiltrados[0]?.id ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showQrModalPlin, setShowQrModalPlin] = useState(false);
  const [showQrModalYape, setShowQrModalYape] = useState(false);
  const { post, processing, setData, data, errors } = useForm({
    pedido_id: pedido?.id,
    metodo: metodosFiltrados[0]?.id ?? '',
    referencia_pago: null as File | null,
  });

  // Estado para controlar cuál método está procesando
  const [processingMetodo, setProcessingMetodo] = useState<string | null>(null);

  // Nuevo estado para el modal de advertencia
  const [showWarning, setShowWarning] = useState(true);

  // Asegura que el método seleccionado se guarde correctamente
  const handleSeleccionar = (id: string) => {
    setSeleccionado(id);
    setData('metodo', id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, metodo: string) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setData('referencia_pago', e.target.files[0]);
      setData('metodo', metodo); // Asegura que el método correcto se envía
    }
  };

  const handleConfirmar = (e: React.FormEvent, metodo: string) => {
    e.preventDefault();
    setData('metodo', metodo); // Siempre actualiza el método antes de enviar
    setProcessingMetodo(metodo);
    post('/checkout/metodos-pago/procesar', {
      forceFormData: true,
      onFinish: () => setProcessingMetodo(null),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modal de advertencia legal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-80">
          <div
            className="bg-gradient-to-br from-yellow-100 via-red-100 to-yellow-50 border-4 border-red-600 rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-pulse mt-24"
          >
            <div className="flex flex-col items-center">
              <svg className="w-20 h-20 text-red-600 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-2xl font-extrabold text-red-700 mb-3 text-center drop-shadow-lg uppercase tracking-wider">
                ¡Advertencia Legal!
              </h2>
              <p className="text-red-900 text-center mb-6 font-semibold text-lg">
                <span className="block mb-2">
                  <span className="text-red-700 font-bold">ATENCIÓN:</span> El envío de comprobantes de pago <span className="underline decoration-wavy decoration-red-500">falsos</span> constituye un <span className="font-bold">delito grave</span>.
                </span>
                <span className="block mb-2">
                  Si intentas realizar una compra fraudulenta, tu información será <span className="font-bold text-red-700">denunciada ante las autoridades</span> y podrías enfrentar <span className="font-bold text-red-700">procesos legales</span> y <span className="font-bold text-red-700">multas superiores a S/ 5,000</span>.
                </span>
                <span className="block">
                  <span className="text-red-700 font-bold">NO ARRIESGUES TU LIBERTAD NI TU DINERO.</span>
                </span>
              </p>
              <button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold shadow-lg hover:from-red-700 hover:to-yellow-600 active:scale-95 transition text-lg"
                onClick={() => setShowWarning(false)}
              >
                Entiendo y acepto las consecuencias
              </button>
            </div>
            <span className="absolute top-2 right-4 text-4xl text-red-200 opacity-30 select-none pointer-events-none">⚠️</span>
          </div>
        </div>
      )}
      <Head title="Selecciona tu método de pago" />
      <Header />
      <main className="flex-grow flex flex-col justify-center z-10 relative">
        <div className="w-full max-w-5xl mx-auto py-10 px-2 sm:px-6 lg:px-10">
          <h1 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 tracking-tight drop-shadow-lg">
            Selecciona tu método de pago
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* BCP */}
            <div className="flex flex-col items-center border-2 border-blue-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:border-blue-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="https://play-lh.googleusercontent.com/gBpVaCpZsbBrLufT06aRpuLQvsUq1KAZUCEof_ps76mtB8_llJg3xv24mey8I0m3dUE=w240-h480-rw" alt="BCP" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-blue-700 mb-1 text-center drop-shadow">Depósito o transferencia BCP</div>
                <div className="text-blue-500 mb-3 text-center text-sm">Realiza la transferencia a la cuenta BCP y sube el comprobante.</div>
                <ul className="mb-3 text-blue-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Cuenta Soles: 19195138673067</li>
                  <li>Cuenta Interbancaria: 00219119513867306758</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <div className="text-xs text-blue-700 mb-1 text-center font-semibold">
                    Por favor, envía el comprobante después de realizar el pago.
                  </div>
                  <form
                    onSubmit={e => handleConfirmar(e, 'bcp')}
                    encType="multipart/form-data"
                    className="flex flex-col items-center gap-3"
                  >
                    <input type="hidden" name="metodo" value="bcp" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'bcp')}
                      className="block text-xs text-blue-700 border border-blue-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-blue-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processingMetodo === 'bcp'}
                    >
                      {processingMetodo === 'bcp' ? 'Procesando...' : 'Finalizar compra'}
                    </button>
                  </form>
                </div>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Yape */}
            <div className="flex flex-col items-center border-2 border-purple-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(131,24,255,0.25)] hover:border-purple-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="https://cdn.brandfetch.io/id08GK8vip/w/960/h/960/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" alt="Yape" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-purple-700 mb-1 text-center drop-shadow">Yape</div>
                <div className="text-purple-500 mb-3 text-center text-sm">Escanea el QR o transfiere al número Yape y sube el comprobante.</div>
                <ul className="mb-3 text-purple-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Número Yape: 999 888 777</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/pagos/qryape.jpg"
                    alt="QR Yape"
                    className="w-40 h-40 object-contain border border-purple-200 rounded-xl bg-white mb-2 shadow"
                  />
                  <div className="text-xs text-purple-700 mb-1 text-center font-semibold">
                    Por favor, envía el comprobante después de realizar el pago.
                  </div>
                  <form
                    onSubmit={e => handleConfirmar(e, 'yape')}
                    encType="multipart/form-data"
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    <input type="hidden" name="metodo" value="yape" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'yape')}
                      className="block text-xs text-purple-700 border border-purple-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-purple-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold shadow-lg hover:from-purple-500 hover:to-purple-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processingMetodo === 'yape'}
                    >
                      {processingMetodo === 'yape' ? 'Procesando...' : 'Finalizar compra'}
                    </button>
                  </form>
                </div>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Plin */}
            <div className="flex flex-col items-center border-2 border-cyan-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.25)] hover:border-cyan-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="https://plin.pe/wp-content/themes/plin/favicon/apple-icon-57x57.png" alt="Plin" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-cyan-700 mb-1 text-center drop-shadow">Plin</div>
                <div className="text-cyan-500 mb-3 text-center text-sm">Escanea el QR o transfiere al número Plin y sube el comprobante.</div>
                <ul className="mb-3 text-cyan-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Número Plin: 988 877 766</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/pagos/qrplin.jpg"
                    alt="QR Plin"
                    className="w-40 h-40 object-contain border border-cyan-200 rounded-xl bg-white mb-2 shadow"
                  />
                  <div className="text-xs text-cyan-700 mb-1 text-center font-semibold">
                    Por favor, envía el comprobante después de realizar el pago.
                  </div>
                  <form
                    onSubmit={e => handleConfirmar(e, 'plin')}
                    encType="multipart/form-data"
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    <input type="hidden" name="metodo" value="plin" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'plin')}
                      className="block text-xs text-cyan-700 border border-cyan-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-cyan-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold shadow-lg hover:from-cyan-500 hover:to-cyan-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processingMetodo === 'plin'}
                    >
                      {processingMetodo === 'plin' ? 'Procesando...' : 'Finalizar compra'}
                    </button>
                  </form>
                </div>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Waiky */}
            <div className="flex flex-col items-center border-2 border-pink-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(236,72,153,0.25)] hover:border-pink-500 duration-200 relative overflow-hidden min-h-[340px] animate-fade-in-glass">
              <span className="absolute right-2 top-2 text-pink-200 text-5xl opacity-30 pointer-events-none select-none">W</span>
              <img src="https://play-lh.googleusercontent.com/SQpDeQodE-GEQkSYJNcZL6oGxCDZO4QZ6HLiW0zA1RQGrg-BnDPES47CG3NMWSbkDKk=w240-h480-rw" alt="Waiky" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-pink-700 mb-1 text-center drop-shadow">Waiky</div>
                <div className="text-pink-500 mb-3 text-center text-sm">Escanea el QR o transfiere al número Waiky y sube el comprobante.</div>
                <ul className="mb-3 text-pink-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Número Waiky: 977 666 555</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="/pagos/qrwayki.jpg"
                    alt="QR Waiky"
                    className="w-40 h-40 object-contain border border-pink-200 rounded-xl bg-white mb-2 shadow"
                  />
                  <div className="text-xs text-pink-700 mb-1 text-center font-semibold">
                    Por favor, envía el comprobante después de realizar el pago.
                  </div>
                  <form
                    onSubmit={e => handleConfirmar(e, 'waiky')}
                    encType="multipart/form-data"
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    <input type="hidden" name="metodo" value="waiky" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'waiky')}
                      className="block text-xs text-pink-700 border border-pink-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-pink-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold shadow-lg hover:from-pink-500 hover:to-pink-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processingMetodo === 'waiky'}
                    >
                      {processingMetodo === 'waiky' ? 'Procesando...' : 'Finalizar compra'}
                    </button>
                  </form>
                </div>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Caja Cusco */}
            <div className="flex flex-col items-center border-2 border-red-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(239,68,68,0.25)] hover:border-red-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="https://logosandtypes.com/wp-content/uploads/2023/11/caja-cusco.svg" alt="Caja Cusco" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-red-700 mb-1 text-center drop-shadow">Caja Cusco</div>
                <div className="text-red-500 mb-3 text-center text-sm">Realiza la transferencia a la cuenta Caja Cusco y sube el comprobante.</div>
                <ul className="mb-3 text-red-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Ahorros soles: 106352321000159247</li>
                  <li>CCI: 80603532100015924728</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <div className="text-xs text-red-700 mb-1 text-center font-semibold">
                    Por favor, envía el comprobante después de realizar el pago.
                  </div>
                  <form
                    onSubmit={e => handleConfirmar(e, 'caja_cusco')}
                    encType="multipart/form-data"
                    className="flex flex-col items-center gap-3"
                  >
                    <input type="hidden" name="metodo" value="caja_cusco" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'caja_cusco')}
                      className="block text-xs text-red-700 border border-red-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-red-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:from-red-500 hover:to-red-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processingMetodo === 'caja_cusco'}
                    >
                      {processingMetodo === 'caja_cusco' ? 'Procesando...' : 'Finalizar compra'}
                    </button>
                  </form>
                </div>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Scotiabank */}
            <div className="flex flex-col items-center border-2 border-orange-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(251,146,60,0.25)] hover:border-orange-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="https://cdn.aglty.io/scotiabank-peru/imagenes/2022/logos/logo-scotiabank-symbol.svg" alt="Scotiabank" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-orange-700 mb-1 text-center drop-shadow">Scotiabank</div>
                <div className="text-orange-500 mb-3 text-center text-sm">Realiza la transferencia a la cuenta Scotiabank y sube el comprobante.</div>
                <ul className="mb-3 text-orange-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Tipo de cuenta: Cuenta Ahorro Soles</li>
                  <li>Número de cuenta: 3660168323</li>
                  <li>Código de Cuenta Interbancario: 00936620366016832360</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <div className="text-xs text-orange-700 mb-1 text-center font-semibold">
                    Por favor, envía el comprobante después de realizar el pago.
                  </div>
                  <form
                    onSubmit={e => handleConfirmar(e, 'scotiabank')}
                    encType="multipart/form-data"
                    className="flex flex-col items-center gap-3"
                  >
                    <input type="hidden" name="metodo" value="scotiabank" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'scotiabank')}
                      className="block text-xs text-orange-700 border border-orange-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-orange-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold shadow-lg hover:from-orange-500 hover:to-orange-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processingMetodo === 'scotiabank'}
                    >
                      {processingMetodo === 'scotiabank' ? 'Procesando...' : 'Finalizar compra'}
                    </button>
                  </form>
                </div>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Próximamente más métodos de pago */}
            <div className="col-span-1 md:col-span-2 xl:col-span-3 border-2 border-dashed border-gray-300 rounded-3xl p-8 bg-white/60 backdrop-blur-lg flex flex-col items-center justify-center w-full shadow-inner animate-pulse">
              <span className="text-3xl mb-2 animate-bounce">🚧</span>
              <span className="font-bold text-gray-600 text-lg mb-1">Próximamente más métodos de pago</span>
              <span className="text-gray-400 text-base">Estamos trabajando para ofrecerte más opciones.</span>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/cart" className="text-gray-700 hover:underline font-bold text-lg transition">Volver al carrito</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
