import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { MapPin, Clock, Car } from 'lucide-react';
import SocialNav from '@/Components/SocialNav';

interface Props {
  ubicacionData: {
    direccion: string;
    referencias: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
    horarios: {
      [key: string]: string;
    };
    estacionamiento: string;
    adicional: string;
  };
}

export default function Ubicacion({ ubicacionData }: Props) {
  return (
    <>
      <SocialNav />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Nuestra Ubicación</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mapa */}
          <Card className="overflow-hidden">
            <div className="h-[400px] bg-muted relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.2178484757737!2d-71.9696763!3d-13.522218299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd609ffbe055f%3A0x8525e584e0f48f36!2sAv%20Huayna%20Capac%20168%2C%20Cusco%2008002!5e0!3m2!1ses-419!2spe!4v1746204899802!5m2!1ses-419!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Card>

          {/* Información */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-2">{ubicacionData.direccion}</p>
                <p className="text-muted-foreground">{ubicacionData.referencias}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(ubicacionData.horarios).map(([dia, horario]) => (
                    <div key={dia} className="flex justify-between">
                      <span className="font-medium capitalize">{dia}</span>
                      <span>{horario}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="font-medium">Estacionamiento: </span>
                  {ubicacionData.estacionamiento}
                </p>
                <p>{ubicacionData.adicional}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}