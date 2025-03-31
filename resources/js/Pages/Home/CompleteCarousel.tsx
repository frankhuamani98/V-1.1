import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Circle, CircleDot } from 'lucide-react';

// Advertisement type definition
interface Advertisement {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

// Sample advertisement data
const advertisements: Advertisement[] = [
  {
    id: 1,
    title: "Summer Collection",
    subtitle: "Discover our new arrivals with up to 40% off",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    ctaText: "Shop Now",
    ctaLink: "/summer-collection"
  },
  {
    id: 2,
    title: "Premium Headphones",
    subtitle: "Experience crystal clear sound with noise cancellation",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    ctaText: "Learn More",
    ctaLink: "/headphones"
  },
  {
    id: 3,
    title: "Luxury Watches",
    subtitle: "Timeless elegance for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    ctaText: "View Collection",
    ctaLink: "/watches"
  },
  {
    id: 4,
    title: "Smart Home Devices",
    subtitle: "Transform your living space with cutting-edge technology",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055e2e28ed1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    ctaText: "Discover",
    ctaLink: "/smart-home"
  },
  {
    id: 5,
    title: "Wireless Earbuds",
    subtitle: "Crystal clear sound with long battery life",
    imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ctaText: "Buy Now",
    ctaLink: "/earbuds"
  }
];

export default function ResponsiveCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  // Handle next slide
  const nextSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
    );

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handle previous slide
  const prevSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1
    );

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Go to specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Autoplay functionality
  useEffect(() => {
    let interval: number | undefined;

    if (autoplay) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentIndex, autoplay, isTransitioning]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

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
        {advertisements.map((ad) => (
          <div
            key={ad.id}
            className="relative flex-shrink-0 w-full h-full"
            style={{ minWidth: '100%' }}
          >
            {/* Background image with overlay */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-8 lg:px-16 text-white">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">{ad.title}</h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-md">{ad.subtitle}</p>
              <a
                href={ad.ctaLink}
                className="inline-block px-6 py-3 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700 w-fit"
              >
                {ad.ctaText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
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

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {advertisements.map((_, index) => (
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
    </div>
  );
}