import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { MapPin, Building2, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SocialNav from '@/Components/SocialNav';

interface Props {
  ubicacionData: {
    establecimientos: {
      tienda: Establecimiento;
      taller: Establecimiento;
    };
  };
}

interface Establecimiento {
  nombre: string;
  tipo: string;
  direccion: string;
  referencias: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

export default function Ubicacion({ ubicacionData }: Props) {
  const [activeTab, setActiveTab] = useState('tienda');

  const getMapSrc = (establecimiento: string) => {
    if (establecimiento === 'tienda') {
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.217933614063!2d-71.97225122540556!3d-13.522213071123636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd609ffbe055f%3A0x8525e584e0f48f36!2sAv%20Huayna%20Capac%20168%2C%20Cusco%2008002!5e0!3m2!1ses-419!2spe!4v1746713608854!5m2!1ses-419!2spe";
    } else {
      return "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3879.2235244252015!2d-71.9690986!3d-13.5218697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDMxJzE4LjciUyA3McKwNTgnMDguOCJX!5e0!3m2!1ses-419!2spe!4v1746715939654!5m2!1ses-419!2spe";
    }
  };

  const LocationCard = ({ establecimiento, tipo, isActive }: { establecimiento: Establecimiento; tipo: 'tienda' | 'taller'; isActive: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 
          ${isActive 
            ? 'border-primary bg-primary/5 shadow-md' 
            : 'border-transparent hover:border-primary/20'}`}
        onClick={() => setActiveTab(tipo)}
        role="button"
        tabIndex={0}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
              {tipo === 'tienda' ? (
                <Building2 className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
              ) : (
                <Wrench className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{establecimiento.nombre}</CardTitle>
              <CardDescription>{establecimiento.tipo}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{establecimiento.direccion}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const establecimientoActivo = ubicacionData.establecimientos[activeTab as keyof typeof ubicacionData.establecimientos];

  return (
    <>
      <SocialNav />
      <div className="container mx-auto py-8 px-4">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nuestras Ubicaciones
        </motion.h1>
        <motion.p 
          className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Visítanos en cualquiera de nuestros locales especializados
        </motion.p>
        
        <div className="max-w-6xl mx-auto">
          {/* Location Selection Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <LocationCard 
              establecimiento={ubicacionData.establecimientos.tienda} 
              tipo="tienda"
              isActive={activeTab === 'tienda'}
            />
            <LocationCard 
              establecimiento={ubicacionData.establecimientos.taller} 
              tipo="taller"
              isActive={activeTab === 'taller'}
            />
          </div>

          {/* Location Details */}
          <motion.div 
            className="grid lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden h-full">
                <div className="h-[400px] lg:h-[500px] bg-muted relative">
                  <AnimatePresence mode="wait">
                    <motion.iframe
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={getMapSrc(activeTab)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                  </AnimatePresence>
                </div>
              </Card>
            </div>

            {/* Location Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Información del Local
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="pb-4 border-b">
                      <h3 className="font-semibold text-lg mb-2">{establecimientoActivo.nombre}</h3>
                      <p className="text-muted-foreground">{establecimientoActivo.direccion}</p>
                      <p className="text-sm text-muted-foreground mt-2">{establecimientoActivo.referencias}</p>
                    </div>
                    
                    <div className="pt-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${establecimientoActivo.coordenadas.lat},${establecimientoActivo.coordenadas.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Abrir en Google Maps</span>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}