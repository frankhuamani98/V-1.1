import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Phone, Mail, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";
import ContactoNavigation from "@/Components/ContactoNavigation";
import WhatsAppButton from "@/Components/WhatsAppButton"

export default function Contactanos() {
  const contactInfo = {
    whatsapp: "+51 913 223 471",
    email: "motosrudolf10062020@gmail.com"
  };

  const handleWhatsAppClick = () => {
    const formattedNumber = contactInfo.whatsapp.replace(/\s+/g, "").replace(/[+]/g, "");
    window.open(`https://wa.me/${formattedNumber}`, "_blank");
  };

  const handleEmailClick = () => {
    window.open(`mailto:${contactInfo.email}`, "_blank");
  };

  return (
    <>
      <Header />
      <ContactoNavigation currentPage="contactanos" />
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden bg-white dark:bg-slate-900 rounded-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 md:px-8 py-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-2.5 md:p-3.5 rounded-full flex-shrink-0">
                  <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">Contáctanos</CardTitle>
                  <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Estamos aquí para ayudarte con cualquier consulta
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* WhatsApp Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                  <div className="p-6 flex flex-col h-full relative" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20V20zm40 0h20v20H60V20zm0 40h20v20H60V60zM20 60h20v20H20V60z' fill='%2325D366' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px',
                    backgroundPosition: 'center'
                  }}>
                    <div className="flex items-center mb-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full mr-4">
                        <Phone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">WhatsApp</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Respuesta rápida</p>
                      </div>
                    </div>
                    
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium text-lg mb-2">{contactInfo.whatsapp}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow">
                      Contáctanos por WhatsApp para una respuesta inmediata a tus consultas sobre nuestros productos y servicios.
                    </p>
                    
                    <Button 
                      onClick={handleWhatsAppClick}
                      className="group w-full bg-white dark:bg-slate-900 hover:bg-[#25D366]/10 dark:hover:bg-emerald-900/30
                        text-emerald-600 dark:text-emerald-400 font-medium
                        flex items-center justify-center gap-3 py-3.5 px-4 rounded-full
                        border border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-400
                        transition-all duration-300 ease-out hover:scale-[1.01]"
                    >
                      <span className="text-sm tracking-wide">Enviar mensaje</span>
                      <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                  <div className="p-6 flex flex-col h-full relative" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L50 0M50 50L100 50M50 50L0 50M50 50L50 100' stroke='%232563eb' stroke-opacity='0.05' stroke-width='8'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px',
                    backgroundPosition: 'center'
                  }}>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Correo Electrónico</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Consultas detalladas</p>
                      </div>
                    </div>
                    
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mb-2">{contactInfo.email}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow">
                      Envíanos un correo electrónico para consultas más detalladas, cotizaciones o información sobre nuestros servicios.
                    </p>
                    
                    <Button 
                      onClick={handleEmailClick}
                      className="group w-full bg-white dark:bg-slate-900 hover:bg-blue-500/10 dark:hover:bg-blue-900/30
                        text-blue-600 dark:text-blue-400 font-medium
                        flex items-center justify-center gap-3 py-3.5 px-4 rounded-full
                        border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-400
                        transition-all duration-300 ease-out hover:scale-[1.01]"
                    >
                      <span className="text-sm tracking-wide">Enviar correo</span>
                      <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
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