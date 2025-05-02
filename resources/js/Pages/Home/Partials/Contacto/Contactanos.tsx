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
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Contáctanos</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Teléfonos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Teléfonos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Principal:</p>
                    <a 
                      href={`tel:${contactoData.telefonos.principal}`}
                      className="text-primary hover:underline"
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
                      className="text-primary hover:underline"
                    >
                      {contactoData.telefonos.whatsapp}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Correos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Correos Electrónicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(contactoData.correos).map(([tipo, email]) => (
                    <div key={tipo}>
                      <p className="font-medium capitalize">{tipo}:</p>
                      <a 
                        href={`mailto:${email}`}
                        className="text-primary hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Nuestro Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contactoData.personal.map((persona, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <p className="font-medium text-lg">{persona.nombre}</p>
                      <p className="text-muted-foreground">{persona.cargo}</p>
                      <a 
                        href={`mailto:${persona.contacto}`}
                        className="text-primary hover:underline text-sm"
                      >
                        {persona.contacto}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Horarios de Atención */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Atención Telefónica:</p>
                    <p>{contactoData.horarioAtencion.telefonica}</p>
                  </div>
                  <div>
                    <p className="font-medium">Atención por Email:</p>
                    <p>{contactoData.horarioAtencion.email}</p>
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