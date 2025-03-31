import React, { useState, useEffect } from 'react';
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

export default function ResponsiveCarousel() {
  const { props } = usePage();
  const banners = props.banners as Banner[] || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

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

  // Handle next slide
  const nextSlide = () => {
    if (isTransitioning || activeBanners.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
    );

    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handle previous slide
  const prevSlide = () => {
    if (isTransitioning || activeBanners.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeBanners.length - 1 : prevIndex - 1
    );

    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex || activeBanners.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Autoplay functionality
  useEffect(() => {
    let interval: number | undefined;

    if (autoplay && activeBanners.length > 0) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentIndex, autoplay, isTransitioning, activeBanners]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

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
      {/* Carousel container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div
            key={banner.id}
            className="relative flex-shrink-0 w-full h-full"
            style={{ minWidth: '100%' }}
          >
            {/* Background image with overlay */}
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

            {/* Content - Only shown if title or subtitle exists */}
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

      {/* Navigation arrows (only show if more than one banner) */}
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

      {/* Indicators (only show if more than one banner) */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="p-1 focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentIndex ? (
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