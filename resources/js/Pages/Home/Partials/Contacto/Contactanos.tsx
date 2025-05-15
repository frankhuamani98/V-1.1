import React from 'react';
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Phone, Mail, Users, Clock, MapPin } from 'lucide-react';
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
      <div className="relative" style={{ minHeight: '500px' }}>
        {/* Imagen de fondo de moto */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-95">
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Moto de fondo"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="container mx-auto py-8 px-4 relative">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-rose-500 to-amber-500">Contáctanos</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-rose-500 to-amber-500 mx-auto mb-3"></div>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Estamos aquí para atender todas tus consultas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Teléfonos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full"
            >
              <Card className="overflow-hidden border-none shadow-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-blue-600/10 to-rose-600/10 dark:from-blue-600/20 dark:to-rose-600/20 p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-blue-600 to-rose-600 p-1.5 rounded-lg shadow-sm">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-rose-600 font-bold">
                      Teléfonos
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="relative p-4"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2h4v4H2V2zm12 0h4v4H2V2zM2 14h4v4H2v-4zm12 0h4v4H2v-4z' fill='%232563EB' fill-opacity='0.05'/%3E%3C/svg%3E")`,
                    backgroundSize: '20px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat'
                  }}
                >
                  <div className="space-y-3 text-center">
                    <div>
                      <p className="font-medium text-sm">Principal:</p>
                      <a
                        href={`tel:${contactoData.telefonos.principal}`}
                        className="text-blue-600 hover:underline font-semibold text-sm"
                      >
                        {contactoData.telefonos.principal}
                      </a>
                    </div>
                    <div>
                      <p className="font-medium text-sm">WhatsApp:</p>
                      <a
                        href={`https://wa.me/${contactoData.telefonos.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:underline font-semibold text-sm"
                      >
                        {contactoData.telefonos.whatsapp}
                      </a>
                    </div>

                    <div className="flex justify-center pt-1">
                      <a
                        href={`tel:${contactoData.telefonos.principal}`}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-rose-600 text-white text-xs px-3 py-1.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        Llamar ahora
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Correos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <Card className="overflow-hidden border-none shadow-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-amber-400/10 dark:from-blue-500/20 dark:to-amber-400/20 p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-blue-500 to-amber-400 p-1.5 rounded-lg shadow-sm">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-amber-400 font-bold">
                      Correos
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="relative p-4"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0V0zm6 0h4v4H6V0zm6 0h4v4H6V0zM0 6h4v4H0V6zm6 0h4v4H6V6zm6 0h4v4H6V6zM0 12h4v4H0v-4zm6 0h4v4H6v-4zm6 0h4v4H6v-4z' fill='%233B82F6' fill-opacity='0.05'/%3E%3C/svg%3E")`,
                    backgroundSize: '16px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat'
                  }}
                >
                  <div className="space-y-3 text-center">
                    {Object.entries(contactoData.correos).slice(0, 2).map(([tipo, email]) => (
                      <div key={tipo}>
                        <p className="font-medium text-sm capitalize">{tipo}:</p>
                        <a
                          href={`mailto:${email}`}
                          className="text-blue-600 hover:underline font-semibold text-sm truncate block"
                        >
                          {email}
                        </a>
                      </div>
                    ))}

                    <div className="flex justify-center pt-1">
                      <a
                        href={`mailto:${Object.values(contactoData.correos)[0]}`}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-amber-400 text-white text-xs px-3 py-1.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        Enviar email
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Equipo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              <Card className="overflow-hidden border-none shadow-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-blue-600/10 to-pink-600/10 dark:from-blue-600/20 dark:to-pink-600/20 p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-blue-600 to-pink-600 p-1.5 rounded-lg shadow-sm">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600 font-bold">
                      Equipo
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="relative p-4"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='2' fill='%231D4ED8' fill-opacity='0.05'/%3E%3Ccircle cx='12' cy='4' r='2' fill='%23EC4899' fill-opacity='0.05'/%3E%3Ccircle cx='20' cy='4' r='2' fill='%231D4ED8' fill-opacity='0.05'/%3E%3Ccircle cx='4' cy='12' r='2' fill='%23EC4899' fill-opacity='0.05'/%3E%3Ccircle cx='12' cy='12' r='2' fill='%231D4ED8' fill-opacity='0.05'/%3E%3Ccircle cx='20' cy='12' r='2' fill='%23EC4899' fill-opacity='0.05'/%3E%3Ccircle cx='4' cy='20' r='2' fill='%231D4ED8' fill-opacity='0.05'/%3E%3Ccircle cx='12' cy='20' r='2' fill='%23EC4899' fill-opacity='0.05'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%231D4ED8' fill-opacity='0.05'/%3E%3C/svg%3E")`,
                    backgroundSize: '24px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat'
                  }}
                >
                  <div className="space-y-2 text-center">
                    {contactoData.personal.slice(0, 2).map((persona, index) => (
                      <div key={index} className="p-2 rounded-lg bg-white/50 dark:bg-neutral-700/50">
                        <p className="font-semibold text-sm">{persona.nombre}</p>
                        <p className="text-xs text-muted-foreground">{persona.cargo}</p>
                        <a
                          href={`mailto:${persona.contacto}`}
                          className="text-blue-600 hover:underline text-xs block mt-1"
                        >
                          {persona.contacto}
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Horario de atención */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full"
            >
              <Card className="overflow-hidden border-none shadow-md bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 dark:from-rose-500/20 dark:to-amber-500/20 p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="bg-gradient-to-br from-rose-500 to-amber-500 p-1.5 rounded-lg shadow-sm">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-500 font-bold">
                      Horario
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className="relative p-4"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2h4v4H2V2zm6 0h4v4H8V2zm6 0h4v4h-4V2zM2 8h4v4H2V8zm6 0h4v4H8V8zm6 0h4v4h-4V8zM2 14h4v4H2v-4zm6 0h4v4H8v-4zm6 0h4v4h-4v-4z' fill='%23EC4899' fill-opacity='0.05'/%3E%3C/svg%3E")`,
                    backgroundSize: '20px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat'
                  }}
                >
                  <div className="space-y-3 text-center">
                    <div>
                      <p className="font-medium text-sm">Atención telefónica:</p>
                      <p className="text-muted-foreground font-semibold text-sm">
                        {contactoData.horarioAtencion.telefonica}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Respuesta a emails:</p>
                      <p className="text-muted-foreground font-semibold text-sm">
                        {contactoData.horarioAtencion.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
