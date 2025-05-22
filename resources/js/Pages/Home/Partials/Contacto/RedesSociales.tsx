import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import Header from '@/Pages/Home/Header';
import Footer from '@/Pages/Home/Footer';
import ContactoNavigation from '@/Components/ContactoNavigation';

const RedesSociales = () => {
  return (
    <>
      <Header />
      <ContactoNavigation currentPage="redes" />
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-2 text-[#f43f5e]">
        Redes Sociales
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Conecta con nosotros en todas nuestras plataformas sociales
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md h-64">
          <div
            className="relative p-6 flex flex-col items-center justify-between h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10h20v20H20V10zm30 0h20v20H50V10zm30 0h20v20H80V10zM20 40h20v20H20V40zm30 0h20v20H50V40zm30 0h20v20H80V40zM20 70h20v20H20V70zm30 0h20v20H50V70zm30 0h20v20H80V70z' fill='%231877F2' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '150px',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center mb-2 w-full justify-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Facebook className="h-6 w-6 text-[#1877F2]" />
              </div>
              <span className="font-bold">Facebook</span>
            </div>

            <div className="text-[#1877F2] font-medium mb-2 text-center w-full">
              @RudolfMotos
            </div>

            <p className="text-gray-600 mb-4 text-sm text-center">
              Conecta con nuestra comunidad y descubre nuestras motos y servicios de motor.
            </p>

            <div className="w-full flex justify-center">
              <a
                href="https://www.facebook.com/share/1CJtYs47j3/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-[#1877F2] text-white text-sm px-3 py-1 rounded"
              >
                Visitar perfil
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md h-64">
          <div
            className="relative p-6 flex flex-col items-center justify-between h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h50v50H0zm50 0h50v50H50zm0 50h50v50H50zm0-25h25v25H50z' fill='%23E4405F' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '150px',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center mb-2 w-full justify-center">
              <div className="bg-pink-100 p-2 rounded-lg mr-3">
                <Instagram className="h-6 w-6 text-[#E4405F]" />
              </div>
              <span className="font-bold">Instagram</span>
            </div>

            <div className="text-[#E4405F] font-medium mb-2 text-center w-full">
              @RudolfMotos
            </div>

            <p className="text-gray-600 mb-4 text-sm text-center">
              Explora nuestra galería de motos y eventos a través de fotografías y videos exclusivos.
            </p>

            <div className="w-full flex justify-center">
              <a
                href="https://instagram.com/rodoftmotors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-sm px-3 py-1 rounded"
              >
                Visitar perfil
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md h-64">
          <div
            className="relative p-6 flex flex-col items-center justify-between h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20V20zm40 0h20v20H60V20zm0 40h20v20H60V60zM20 60h20v20H20V60z' fill='%23FF0000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '150px',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center mb-2 w-full justify-center">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <Youtube className="h-6 w-6 text-[#FF0000]" />
              </div>
              <span className="font-bold">Youtube</span>
            </div>

            <div className="text-[#FF0000] font-medium mb-2 text-center w-full">
              Rudolf Motos
            </div>

            <p className="text-gray-600 mb-4 text-sm text-center">
              Videos sobre nuestras motos, demostraciones y eventos exclusivos del mundo motero.
            </p>

            <div className="w-full flex justify-center">
              <a
                href="https://youtube.com/rodoftmotorstv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-[#FF0000] text-white text-sm px-3 py-1 rounded"
              >
                Visitar perfil
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md h-64">
          <div
            className="relative p-6 flex flex-col items-center justify-between h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L50 0M50 50L100 50M50 50L0 50M50 50L50 100' stroke='%2300f2ea' stroke-opacity='0.1' stroke-width='8'/%3E%3C/svg%3E")`,
              backgroundSize: '150px',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center mb-2 w-full justify-center">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <FaTiktok className="h-6 w-6 text-black" />
              </div>
              <span className="font-bold">Tiktok</span>
            </div>

            <div className="text-[#00f2ea] font-medium mb-2 text-center w-full">
              @RudolfMotos
            </div>

            <p className="text-gray-600 mb-4 text-sm text-center">
              Contenido breve y dinámico sobre nuestros servivios, novedades y tendencias en nuestras tienda.
            </p>

            <div className="w-full flex justify-center">
              <a
                href="https://www.tiktok.com/@rudolf_motors?_t=8s9j0KmESjV&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00f2ea] to-[#ff0050] text-white text-sm px-3 py-1 rounded"
              >
                Visitar perfil
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default RedesSociales;
