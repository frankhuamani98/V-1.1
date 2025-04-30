import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Circle, CircleDot } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string | null;
  imagen_principal: string;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

export default function CarruselResponsivo() {
  const { banners } = usePage<PageProps>().props;
  const [indiceActual, setIndiceActual] = useState(0);
  const [estaTransicionando, setEstaTransicionando] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const carruselRef = useRef<HTMLDivElement>(null);

  // Filtrar banners activos
  const bannersActivos = (banners as Banner[]).filter(banner => {
    if (!banner.activo) return false;
    
    const ahora = new Date();
    const fechaInicio = banner.fecha_inicio ? new Date(banner.fecha_inicio) : null;
    const fechaFin = banner.fecha_fin ? new Date(banner.fecha_fin) : null;
    
    if (!fechaInicio && !fechaFin) return true;
    if (fechaInicio && !fechaFin) return ahora >= fechaInicio;
    if (!fechaInicio && fechaFin) return ahora <= fechaFin;
    return ahora >= fechaInicio! && ahora <= fechaFin!;
  });

  // Crear array con banners clonados para el efecto infinito
  const bannersInfinitos = [...bannersActivos, ...bannersActivos, ...bannersActivos];

  const moverA = useCallback((indice: number, suave = true) => {
    if (estaTransicionando || !carruselRef.current) return;

    setEstaTransicionando(true);
    const nuevoIndice = indice;
    
    if (suave) {
      carruselRef.current.style.transition = 'transform 500ms ease-in-out';
    } else {
      carruselRef.current.style.transition = 'none';
    }

    setIndiceActual(nuevoIndice);

    // Si llegamos al final del segundo set, saltar al primer set sin animación
    if (nuevoIndice >= bannersActivos.length * 2) {
      setTimeout(() => {
        if (carruselRef.current) {
          carruselRef.current.style.transition = 'none';
          setIndiceActual(nuevoIndice % bannersActivos.length);
        }
      }, 500);
    }

    // Si retrocedemos al inicio del primer set, saltar al segundo set sin animación
    if (nuevoIndice < 0) {
      setTimeout(() => {
        if (carruselRef.current) {
          carruselRef.current.style.transition = 'none';
          setIndiceActual(bannersActivos.length - 1);
        }
      }, 500);
    }

    setTimeout(() => setEstaTransicionando(false), 500);
  }, [bannersActivos.length, estaTransicionando]);

  const siguienteBanner = useCallback(() => {
    if (bannersActivos.length <= 1) return;
    moverA(indiceActual + 1);
  }, [indiceActual, bannersActivos.length, moverA]);

  const bannerAnterior = useCallback(() => {
    if (bannersActivos.length <= 1) return;
    moverA(indiceActual - 1);
  }, [indiceActual, bannersActivos.length, moverA]);

  useEffect(() => {
    if (!autoPlay || bannersActivos.length <= 1) return;

    const intervalo = setInterval(siguienteBanner, 5000);
    return () => clearInterval(intervalo);
  }, [autoPlay, siguienteBanner, bannersActivos.length]);

  // Reiniciar posición al montar el componente
  useEffect(() => {
    if (carruselRef.current) {
      setIndiceActual(bannersActivos.length);
      carruselRef.current.style.transform = `translateX(-${bannersActivos.length * 100}%)`;
    }
  }, [bannersActivos.length]);

  // Manejar transición
  useEffect(() => {
    if (carruselRef.current) {
      carruselRef.current.style.transform = `translateX(-${indiceActual * 100}%)`;
    }
  }, [indiceActual]);

  if (bannersActivos.length === 0) return null;

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-xl h-[50vh] md:h-[60vh] lg:h-[70vh]"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div
        ref={carruselRef}
        className="flex h-full"
      >
        {bannersInfinitos.map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="relative flex-shrink-0 w-full h-full"
            style={{ minWidth: '100%' }}
          >
            <div className="absolute inset-0 w-full h-full">
              {banner.imagen_principal.startsWith('http') ? (
                <img
                  src={banner.imagen_principal}
                  alt={banner.titulo}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/1600x900?text=Imagen+no+disponible';
                  }}
                />
              ) : (
                <img
                  src={`/storage/${banner.imagen_principal}`}
                  alt={banner.titulo}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/1600x900?text=Imagen+no+disponible';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-16 text-white">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">{banner.titulo}</h2>
              {banner.subtitulo && (
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-md">{banner.subtitulo}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {bannersActivos.length > 1 && (
        <>
          <button
            onClick={bannerAnterior}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={siguienteBanner}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Siguiente banner"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {bannersActivos.map((_, indice) => {
              const indiceReal = indiceActual % bannersActivos.length;
              return (
                <button
                  key={indice}
                  onClick={() => moverA(indice + bannersActivos.length)}
                  className="p-1 focus:outline-none"
                  aria-label={`Ir al banner ${indice + 1}`}
                >
                  {indice === indiceReal ? (
                    <CircleDot size={16} className="text-white" />
                  ) : (
                    <Circle size={16} className="text-white/70" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}