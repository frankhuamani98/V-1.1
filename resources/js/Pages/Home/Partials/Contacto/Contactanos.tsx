import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Phone, Mail, Users, Clock } from 'lucide-react';
import SocialNav from '@/Components/SocialNav';

interface ContactPerson {
  nombre: string;
  cargo: string;
  contacto: string;
}

interface Props {
  contactoData: {
    telefonos: {
      principal: string;
      whatsapp: string;
    };
    correos: {
      [key: string]: string;
    };
    personal: ContactPerson[];
    horarioAtencion: {
      telefonica: string;
      email: string;
    };
  };
}

export default function Contactanos({ contactoData }: Props) {
  return (
    <>
      <SocialNav />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-[#3B82F6]">Contáctanos</h1>
        <p className="text-center text-gray-600 mb-8">Estamos aquí para atender todas tus consultas</p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            {/* Teléfonos */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-[#3B82F6]">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-[#3B82F6]" />
                  </div>
                  Teléfonos
                </CardTitle>
              </CardHeader>
              <CardContent
                className="relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10h20v20H20V10zm30 0h20v20H50V10zm30 0h20v20H80V10zM20 40h20v20H20V40zm30 0h20v20H50V40zm30 0h20v20H80V40zM20 70h20v20H20V70zm30 0h20v20H50V70zm30 0h20v20H80V70z' fill='%233B82F6' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px',
                  backgroundPosition: 'center'
                }}
              >
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-medium">Principal:</p>
                    <a 
                      href={`tel:${contactoData.telefonos.principal}`}
                      className="text-[#3B82F6] hover:underline"
                    >
                      {contactoData.telefonos.principal}
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp:</p>
                    <a 
                      href={`https://wa.me/${contactoData.telefonos.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1877F2] hover:underline"
                    >
                      {contactoData.telefonos.whatsapp}
                    </a>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <a 
                      href={`tel:${contactoData.telefonos.principal}`}
                      className="inline-flex items-center gap-1 bg-[#3B82F6] text-white text-sm px-3 py-1 rounded"
                    >
                      Llamar ahora
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Correos */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-[#4B5563]">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-[#4B5563]" />
                  </div>
                  Correos Electrónicos
                </CardTitle>
              </CardHeader>
              <CardContent
                className="relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h50v50H0zm50 0h50v50H50zm0 50h50v50H50zm0-25h25v25H50z' fill='%234B5563' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px',
                  backgroundPosition: 'center'
                }}
              >
                <div className="space-y-4 text-center">
                  {Object.entries(contactoData.correos).map(([tipo, email]) => (
                    <div key={tipo}>
                      <p className="font-medium capitalize">{tipo}:</p>
                      <a 
                        href={`mailto:${email}`}
                        className="text-[#4B5563] hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                  
                  <div className="flex justify-center pt-2">
                    <a 
                      href={`mailto:${Object.values(contactoData.correos)[0]}`}
                      className="inline-flex items-center gap-1 bg-[#4B5563] text-white text-sm px-3 py-1 rounded"
                    >
                      Enviar email
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Personal */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-[#EF4444]">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-[#EF4444]" />
                  </div>
                  Nuestro Equipo
                </CardTitle>
              </CardHeader>
              <CardContent
                className="relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20V20zm40 0h20v20H60V20zm0 40h20v20H60V60zM20 60h20v20H20V60z' fill='%23EF4444' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px',
                  backgroundPosition: 'center'
                }}
              >
                <div className="space-y-6 text-center">
                  {contactoData.personal.map((persona, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <p className="font-medium text-lg">{persona.nombre}</p>
                      <p className="text-gray-600">{persona.cargo}</p>
                      <a 
                        href={`mailto:${persona.contacto}`}
                        className="text-[#EF4444] hover:underline text-sm"
                      >
                        {persona.contacto}
                      </a>
                    </div>
                  ))}
                  
                  <div className="flex justify-center pt-2">
                    <a 
                      href={`mailto:${contactoData.personal[0]?.contacto || ''}`}
                      className="inline-flex items-center gap-1 bg-[#EF4444] text-white text-sm px-3 py-1 rounded"
                    >
                      Contactar equipo
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horarios de Atención */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-center gap-2 text-[#0EA5E9]">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent
                className="relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L50 0M50 50L100 50M50 50L0 50M50 50L50 100' stroke='%230EA5E9' stroke-opacity='0.05' stroke-width='8'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px',
                  backgroundPosition: 'center'
                }}
              >
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-medium">Atención Telefónica:</p>
                    <p className="text-gray-600">{contactoData.horarioAtencion.telefonica}</p>
                  </div>
                  <div>
                    <p className="font-medium">Atención por Email:</p>
                    <p className="text-gray-600">{contactoData.horarioAtencion.email}</p>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <a 
                      href="#"
                      className="inline-flex items-center gap-1 bg-[#0EA5E9] text-white text-sm px-3 py-1 rounded"
                    >
                      Ver mapa
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}