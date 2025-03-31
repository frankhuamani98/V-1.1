import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Circle, CircleDot } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Banner {
  id: number;
  titulo: string | null;
  subtitulo: string | null;
  imagen_principal: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

export default function InfiniteCarousel() {
  const { props } = usePage();
  const banners = props.banners as Banner[] || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Filtrar solo banners activos y vigentes
  const activeBanners = banners.filter(banner => {
    if (!banner.activo) return false;
    
    const now = new Date();
    const startDate = banner.fecha_inicio ? new Date(banner.fecha_inicio) : null;
    const endDate = banner.fecha_fin ? new Date(banner.fecha_fin) : null;
    
    const startValid = !startDate || startDate <= now;
    const endValid = !endDate || endDate >= now;
    
    return startValid && endValid;
  });

  // Clonamos los primeros y últimos banners para el efecto infinito
  const extendedBanners = [
    activeBanners[activeBanners.length - 1], // último banner al inicio
    ...activeBanners,
    activeBanners[0] // primer banner al final
  ];

  const totalSlides = extendedBanners.length;
  const realCurrentIndex = currentIndex + 1; // Ajustamos por el slide clonado al inicio

  // Navegación con efecto infinito
  const goToSlide = useCallback((newIndex: number, transition = true) => {
    if (isTransitioning || activeBanners.length === 0) return;
    
    setTransitionEnabled(transition);
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, activeBanners.length]);

  const nextSlide = useCallback(() => {
    if (realCurrentIndex === totalSlides - 1) {
      // Si estamos en el último slide clonado, saltamos sin animación al real
      goToSlide(0, false);
      // Luego movemos al slide 1 con animación
      setTimeout(() => goToSlide(1), 50);
    } else {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, realCurrentIndex, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (realCurrentIndex === 0) {
      // Si estamos en el primer slide clonado, saltamos sin animación al final real
      goToSlide(totalSlides - 3, false);
      // Luego movemos al penúltimo slide con animación
      setTimeout(() => goToSlide(totalSlides - 2), 50);
    } else {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, realCurrentIndex, totalSlides, goToSlide]);

  // Autoplay functionality
  useEffect(() => {
    let interval: number | undefined;

    if (autoplay && activeBanners.length > 1) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 5000); // Cambia cada 5 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, nextSlide, activeBanners.length]);

  // Pausar autoplay al interactuar
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Ir a slide específico (para los indicadores)
  const goToRealSlide = (index: number) => {
    goToSlide(index + 1); // +1 por el slide clonado al inicio
  };

  if (activeBanners.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay banners activos para mostrar</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-xl h-[50vh] md:h-[60vh] lg:h-[70vh]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Contenedor del carrusel */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(-${realCurrentIndex * 100}%)`,
          transition: transitionEnabled ? 'transform 500ms ease-in-out' : 'none'
        }}
      >
        {extendedBanners.map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="relative flex-shrink-0 w-full h-full"
            style={{ minWidth: '100%' }}
          >
            {/* Imagen de fondo con overlay */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={banner.imagen_principal}
                alt={banner.titulo || "Banner sin título"}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 
                    "https://placehold.co/800x400/f3f4f6/a3a3a3?text=Imagen+no+disponible";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            </div>

            {/* Contenido (solo si hay título o subtítulo) */}
            {(banner.titulo || banner.subtitulo) && (
              <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-16 text-white">
                {banner.titulo && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                    {banner.titulo}
                  </h2>
                )}
                {banner.subtitulo && (
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-md">
                    {banner.subtitulo}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flechas de navegación (solo si hay más de un banner) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicadores (solo si hay más de un banner) */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToRealSlide(index)}
              className="p-1 focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === (realCurrentIndex - 1) % activeBanners.length ? (
                <CircleDot size={16} className="text-white" />
              ) : (
                <Circle size={16} className="text-white/70" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}