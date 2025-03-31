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
  }).sort((a, b) => a.orden - b.orden); // Ordenar por el campo 'orden'

  // Solo crear efecto infinito si hay suficientes banners
  const shouldUseInfinite = activeBanners.length > 1;
  const extendedBanners = shouldUseInfinite 
    ? [
        activeBanners[activeBanners.length - 1],
        ...activeBanners,
        activeBanners[0]
      ]
    : activeBanners;

  const totalSlides = extendedBanners.length;
  const realCurrentIndex = shouldUseInfinite ? currentIndex + 1 : currentIndex;

  const goToSlide = useCallback((newIndex: number, transition = true) => {
    if (isTransitioning || activeBanners.length === 0) return;
    
    setTransitionEnabled(transition);
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, activeBanners.length]);

  const nextSlide = useCallback(() => {
    if (!shouldUseInfinite) return;
    
    if (realCurrentIndex === totalSlides - 1) {
      goToSlide(0, false);
      setTimeout(() => goToSlide(1), 50);
    } else {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, realCurrentIndex, totalSlides, goToSlide, shouldUseInfinite]);

  const prevSlide = useCallback(() => {
    if (!shouldUseInfinite) return;
    
    if (realCurrentIndex === 0) {
      goToSlide(totalSlides - 3, false);
      setTimeout(() => goToSlide(totalSlides - 2), 50);
    } else {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, realCurrentIndex, totalSlides, goToSlide, shouldUseInfinite]);

  // Autoplay functionality
  useEffect(() => {
    let interval: number | undefined;

    if (autoplay && shouldUseInfinite) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, nextSlide, shouldUseInfinite]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const goToRealSlide = (index: number) => {
    goToSlide(shouldUseInfinite ? index + 1 : index);
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
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {(banner.titulo || banner.subtitulo) && (
              <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-16 text-white">
                {banner.titulo && (
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                    {banner.titulo}
                  </h2>
                )}
                {banner.subtitulo && (
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl">
                    {banner.subtitulo}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

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

      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToRealSlide(index)}
              className="p-1 focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === (realCurrentIndex - (shouldUseInfinite ? 1 : 0)) % activeBanners.length ? (
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