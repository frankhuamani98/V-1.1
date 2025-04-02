import React, { useState, useEffect } from 'react';
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
  // Obtener los banners de las props de Inertia
  const { banners } = usePage<PageProps>().props;
  const [indiceActual, setIndiceActual] = useState(0);
  const [estaTransicionando, setEstaTransicionando] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Filtrar banners activos y que estén dentro del rango de fechas
  const bannersActivos = (banners as Banner[]).filter(banner => {
    if (!banner.activo) return false;
    
    const ahora = new Date();
    const fechaInicio = banner.fecha_inicio ? new Date(banner.fecha_inicio) : null;
    const fechaFin = banner.fecha_fin ? new Date(banner.fecha_fin) : null;
    
    // Si no hay fechas definidas, mostrar el banner
    if (!fechaInicio && !fechaFin) return true;
    
    // Si solo hay fecha de inicio, mostrar si la fecha actual es posterior
    if (fechaInicio && !fechaFin) return ahora >= fechaInicio;
    
    // Si solo hay fecha de fin, mostrar si la fecha actual es anterior
    if (!fechaInicio && fechaFin) return ahora <= fechaFin;
    
    // Si ambas fechas están definidas, mostrar si está dentro del rango
    return ahora >= fechaInicio! && ahora <= fechaFin!;
  });

  // Ir al siguiente banner
  const siguienteBanner = () => {
    if (estaTransicionando || bannersActivos.length <= 1) return;

    setEstaTransicionando(true);
    setIndiceActual(indiceAnterior =>
      indiceAnterior === bannersActivos.length - 1 ? 0 : indiceAnterior + 1
    );

    setTimeout(() => setEstaTransicionando(false), 500);
  };

  // Ir al banner anterior
  const bannerAnterior = () => {
    if (estaTransicionando || bannersActivos.length <= 1) return;

    setEstaTransicionando(true);
    setIndiceActual(indiceAnterior =>
      indiceAnterior === 0 ? bannersActivos.length - 1 : indiceAnterior - 1
    );

    setTimeout(() => setEstaTransicionando(false), 500);
  };

  // Ir a un banner específico
  const irABanner = (indice: number) => {
    if (estaTransicionando || indice === indiceActual || bannersActivos.length <= 1) return;

    setEstaTransicionando(true);
    setIndiceActual(indice);

    setTimeout(() => setEstaTransicionando(false), 500);
  };

  // Configurar el auto-play
  useEffect(() => {
    let intervalo: number | undefined;

    if (autoPlay && bannersActivos.length > 1) {
      intervalo = window.setInterval(() => {
        siguienteBanner();
      }, 5000); // Cambiar cada 5 segundos
    }

    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }
    };
  }, [indiceActual, autoPlay, estaTransicionando, bannersActivos.length]);

  // Pausar el auto-play al pasar el mouse
  const manejarMouseEntra = () => setAutoPlay(false);
  const manejarMouseSale = () => setAutoPlay(true);

  // No mostrar nada si no hay banners activos
  if (bannersActivos.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-xl h-[50vh] md:h-[60vh] lg:h-[70vh]"
      onMouseEnter={manejarMouseEntra}
      onMouseLeave={manejarMouseSale}
    >
      {/* Contenedor del carrusel */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${indiceActual * 100}%)` }}
      >
        {bannersActivos.map((banner) => (
          <div
            key={banner.id}
            className="relative flex-shrink-0 w-full h-full"
            style={{ minWidth: '100%' }}
          >
            {/* Imagen de fondo con superposición - maneja tanto URLs como rutas locales */}
            <div className="absolute inset-0 w-full h-full">
              {banner.imagen_principal.startsWith('http') ? (
                <img
                  src={banner.imagen_principal}
                  alt={banner.titulo}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Manejar errores de carga de imagen
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
                    // Manejar errores de carga de imagen
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/1600x900?text=Imagen+no+disponible';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            </div>

            {/* Contenido del banner */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-16 text-white">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">{banner.titulo}</h2>
              {banner.subtitulo && (
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-md">{banner.subtitulo}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar controles solo si hay más de un banner */}
      {bannersActivos.length > 1 && (
        <>
          {/* Flechas de navegación */}
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

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {bannersActivos.map((_, indice) => (
              <button
                key={indice}
                onClick={() => irABanner(indice)}
                className="p-1 focus:outline-none"
                aria-label={`Ir al banner ${indice + 1}`}
              >
                {indice === indiceActual ? (
                  <CircleDot size={16} className="text-white" />
                ) : (
                  <Circle size={16} className="text-white/70" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}