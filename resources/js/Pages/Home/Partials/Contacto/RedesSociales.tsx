import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Facebook, Instagram, Youtube, Share2 } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Button } from "@/Components/ui/button";
import Header from '@/Pages/Home/Header';
import Footer from '@/Pages/Home/Footer';
import ContactoNavigation from '@/Components/ContactoNavigation';
import WhatsAppButton from "@/Components/WhatsAppButton"

export default function RedesSociales() {
  const socialNetworks = [
    {
      name: "Facebook",
      username: "@RudolfMotos",
      description: "Conecta con nuestra comunidad y descubre nuestras motos y servicios de motor.",
      url: "https://www.facebook.com/share/1CJtYs47j3/",
      icon: <Facebook className="h-6 w-6" />,
      color: "#1877F2",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      buttonBg: "bg-[#1877F2] hover:bg-[#0e6edf]",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10h20v20H20V10zm30 0h20v20H50V10zm30 0h20v20H80V10zM20 40h20v20H20V40zm30 0h20v20H50V40zm30 0h20v20H80V40zM20 70h20v20H20V70zm30 0h20v20H50V70zm30 0h20v20H80V70z' fill='%231877F2' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
    },
    {
      name: "Instagram",
      username: "@RudolfMotos",
      description: "Explora nuestra galería de motos y eventos a través de fotografías y videos exclusivos.",
      url: "https://instagram.com/rodoftmotors",
      icon: <Instagram className="h-6 w-6" />,
      color: "#E4405F",
      bgColor: "bg-pink-100",
      textColor: "text-pink-600",
      buttonBg: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h50v50H0zm50 0h50v50H50zm0 50h50v50H50zm0-25h25v25H50z' fill='%23E4405F' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
    },
    {
      name: "Youtube",
      username: "Rudolf Motos",
      description: "Videos sobre nuestras motos, demostraciones y eventos exclusivos del mundo motero.",
      url: "https://youtube.com/rodoftmotorstv",
      icon: <Youtube className="h-6 w-6" />,
      color: "#FF0000",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      buttonBg: "bg-[#FF0000] hover:bg-[#d90000]",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20V20zm40 0h20v20H60V20zm0 40h20v20H60V60zM20 60h20v20H20V60z' fill='%23FF0000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`
    },
    {
      name: "TikTok",
      username: "@RudolfMotos",
      description: "Contenido breve y dinámico sobre nuestros servicios, novedades y tendencias en nuestra tienda.",
      url: "https://www.tiktok.com/@rudolf_motors?_t=8s9j0KmESjV&_r=1",
      icon: (
        <>
          <span className="block dark:hidden">
            <FaTiktok className="h-5 w-5 text-[#00f2ea]" />
          </span>
          <span className="hidden dark:block">
            <FaTiktok className="h-5 w-5 text-white" />
          </span>
        </>
      ),
      color: "#00f2ea",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800 dark:text-white",
      buttonBg: "bg-gradient-to-r from-[#00f2ea] to-[#ff0050]",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L50 0M50 50L100 50M50 50L0 50M50 50L50 100' stroke='%2300f2ea' stroke-opacity='0.05' stroke-width='8'/%3E%3C/svg%3E")`
    }
  ];

  return (
    <>
      <Header />
      <ContactoNavigation currentPage="redes" />
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-900 rounded-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 md:px-8 py-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-2.5 md:p-3.5 rounded-full flex-shrink-0">
                  <Share2 className="h-5 w-5 md:h-6 md:w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">Redes Sociales</CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Conecta con nosotros en todas nuestras plataformas sociales
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {socialNetworks.map((network, index) => (
                  <div 
                    key={index} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div 
                      className="p-6 flex flex-col h-full relative"
                      style={{
                        backgroundImage: network.backgroundImage,
                        backgroundSize: '150px',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="flex items-center mb-4">
                        <div className={`${network.bgColor} dark:bg-slate-800 p-3 rounded-full mr-4`}>
                          <div className={network.textColor}>{network.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">{network.name}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">Síguenos y comparte</p>
                        </div>
                      </div>
                      
                      <p className={`font-medium text-lg mb-2`} style={{ color: network.color }}>
                        {network.username}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow">
                        {network.description}
                      </p>
                      
                      <Button 
                        onClick={() => window.open(network.url, "_blank")} 
                        className={`w-full text-white flex items-center justify-center gap-2 ${network.buttonBg}`}
                      >
                        Visitar perfil
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
