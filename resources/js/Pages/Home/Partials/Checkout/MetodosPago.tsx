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
  const { post, processing, setData, data, errors } = useForm({
    pedido_id: pedido?.id,
    metodo: metodosFiltrados[0]?.id ?? '',
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-orange-200 via-yellow-100 to-red-200 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
      </div>
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
              <img src="/images/bcp-logo.png" alt="BCP" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-blue-700 mb-1 text-center drop-shadow">Depósito o transferencia BCP</div>
                <div className="text-blue-500 mb-3 text-center text-sm">Realiza la transferencia a la cuenta BCP y sube el comprobante.</div>
                <ul className="mb-3 text-blue-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Cuenta Soles: 19195138673067</li>
                  <li>Cuenta Interbancaria: 00219119513867306758</li>
                </ul>
                <form onSubmit={handleConfirmar} encType="multipart/form-data" className="flex flex-col items-center gap-3">
                  <input type="hidden" name="metodo" value="bcp" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-xs text-blue-700 border border-blue-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-blue-300 transition"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold shadow-lg hover:from-blue-500 hover:to-blue-700 active:scale-95 transition w-full max-w-xs text-sm"
                    disabled={processing}
                  >
                    {processing ? 'Procesando...' : 'Finalizar compra'}
                  </button>
                </form>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Yape */}
            <div className="flex flex-col items-center border-2 border-purple-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(131,24,255,0.25)] hover:border-purple-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="/images/yape-logo.png" alt="Yape" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-purple-700 mb-1 text-center drop-shadow">Yape</div>
                <div className="text-purple-500 mb-3 text-center text-sm">Escanea el QR o transfiere al número Yape y sube el comprobante.</div>
                <ul className="mb-3 text-purple-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Número Yape: 999 888 777</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <img src="/images/qr-yape.png" alt="QR Yape" className="w-24 h-24 object-contain border border-purple-200 rounded-xl bg-white mb-2 shadow" />
                  <form onSubmit={handleConfirmar} encType="multipart/form-data" className="flex flex-col items-center gap-3 w-full">
                    <input type="hidden" name="metodo" value="yape" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block text-xs text-purple-700 border border-purple-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-purple-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold shadow-lg hover:from-purple-500 hover:to-purple-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processing}
                    >
                      {processing ? 'Procesando...' : 'Finalizar compra'}
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
              <img src="/images/plin-logo.png" alt="Plin" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-cyan-700 mb-1 text-center drop-shadow">Plin</div>
                <div className="text-cyan-500 mb-3 text-center text-sm">Escanea el QR o transfiere al número Plin y sube el comprobante.</div>
                <ul className="mb-3 text-cyan-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Número Plin: 988 877 766</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <img src="/images/qr-plin.png" alt="QR Plin" className="w-24 h-24 object-contain border border-cyan-200 rounded-xl bg-white mb-2 shadow" />
                  <form onSubmit={handleConfirmar} encType="multipart/form-data" className="flex flex-col items-center gap-3 w-full">
                    <input type="hidden" name="metodo" value="plin" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block text-xs text-cyan-700 border border-cyan-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-cyan-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold shadow-lg hover:from-cyan-500 hover:to-cyan-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processing}
                    >
                      {processing ? 'Procesando...' : 'Finalizar compra'}
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
              <img src="/images/waiky-logo.png" alt="Waiky" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-pink-700 mb-1 text-center drop-shadow">Waiky</div>
                <div className="text-pink-500 mb-3 text-center text-sm">Escanea el QR o transfiere al número Waiky y sube el comprobante.</div>
                <ul className="mb-3 text-pink-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Número Waiky: 977 666 555</li>
                </ul>
                <div className="flex flex-col items-center gap-3">
                  <img src="/images/qr-waiky.png" alt="QR Waiky" className="w-24 h-24 object-contain border border-pink-200 rounded-xl bg-white mb-2 shadow" />
                  <form onSubmit={handleConfirmar} encType="multipart/form-data" className="flex flex-col items-center gap-3 w-full">
                    <input type="hidden" name="metodo" value="waiky" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block text-xs text-pink-700 border border-pink-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-pink-300 transition"
                      required
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold shadow-lg hover:from-pink-500 hover:to-pink-700 active:scale-95 transition w-full max-w-xs text-sm"
                      disabled={processing}
                    >
                      {processing ? 'Procesando...' : 'Finalizar compra'}
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
              <img src="/images/caja-cusco-logo.png" alt="Caja Cusco" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-red-700 mb-1 text-center drop-shadow">Caja Cusco</div>
                <div className="text-red-500 mb-3 text-center text-sm">Realiza la transferencia a la cuenta Caja Cusco y sube el comprobante.</div>
                <ul className="mb-3 text-red-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Ahorros soles: 106352321000159247</li>
                  <li>CCI: 80603532100015924728</li>
                </ul>
                <form onSubmit={handleConfirmar} encType="multipart/form-data" className="flex flex-col items-center gap-3">
                  <input type="hidden" name="metodo" value="caja_cusco" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-xs text-red-700 border border-red-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-red-300 transition"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:from-red-500 hover:to-red-700 active:scale-95 transition w-full max-w-xs text-sm"
                    disabled={processing}
                  >
                    {processing ? 'Procesando...' : 'Finalizar compra'}
                  </button>
                </form>
                {errors.referencia_pago && (
                  <div className="text-red-500 text-xs mt-2 text-center">{errors.referencia_pago}</div>
                )}
              </div>
            </div>
            {/* Scotiabank */}
            <div className="flex flex-col items-center border-2 border-orange-400 rounded-3xl shadow-2xl bg-white/60 backdrop-blur-lg p-6 transition hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(251,146,60,0.25)] hover:border-orange-500 duration-200 min-h-[340px] animate-fade-in-glass">
              <img src="/images/scotiabank-logo.png" alt="Scotiabank" className="w-20 h-14 object-contain mb-3 opacity-95 drop-shadow-xl" />
              <div className="w-full">
                <div className="font-bold text-lg text-orange-700 mb-1 text-center drop-shadow">Scotiabank</div>
                <div className="text-orange-500 mb-3 text-center text-sm">Realiza la transferencia a la cuenta Scotiabank y sube el comprobante.</div>
                <ul className="mb-3 text-orange-700 list-disc pl-5 text-center text-xs space-y-1">
                  <li>Tipo de cuenta: Cuenta Ahorro Soles</li>
                  <li>Número de cuenta: 3660168323</li>
                  <li>Código de Cuenta Interbancario: 00936620366016832360</li>
                </ul>
                <form onSubmit={handleConfirmar} encType="multipart/form-data" className="flex flex-col items-center gap-3">
                  <input type="hidden" name="metodo" value="scotiabank" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-xs text-orange-700 border border-orange-200 rounded-lg px-3 py-2 bg-white/80 w-full max-w-xs shadow focus:ring-2 focus:ring-orange-300 transition"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold shadow-lg hover:from-orange-500 hover:to-orange-700 active:scale-95 transition w-full max-w-xs text-sm"
                    disabled={processing}
                  >
                    {processing ? 'Procesando...' : 'Finalizar compra'}
                  </button>
                </form>
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

