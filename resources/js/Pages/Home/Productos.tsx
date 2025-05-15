import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/Components/ui/carousel";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Separator } from "@/Components/ui/separator";
import { Progress } from "@/Components/ui/progress";
import {
  PauseIcon,
  PlayIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  InfoIcon,
  TagIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from '@inertiajs/react'; // Importar Link de Inertia.js

const products = [
  {
    id: 1,
    name: "Auriculares Premium",
    price: "$129.99",
    originalPrice: "$159.99",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    tag: "Más Vendido, Nuevo",
    stock: 15,
    description: "Auriculares inalámbricos de alta calidad con cancelación de ruido y sonido premium.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$199.99",
    originalPrice: "$199.99",
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    tag: "Más Vendido, Oferta",
    stock: 8,
    description: "Smartwatch de última generación con seguimiento de salud e integración con smartphone.",
  },
  {
    id: 3,
    name: "Audífonos Inalámbricos",
    price: "$89.99",
    originalPrice: "$109.99",
    rating: 4.5,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D",
    tag: "Más Vendido, Nuevo",
    stock: 22,
    description: "Audífonos inalámbricos compactos con sonido cristalino y larga duración de batería.",
  },
  {
    id: 4,
    name: "Cámara Digital",
    price: "$349.99",
    originalPrice: "$429.99",
    rating: 4.7,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    tag: "Más Vendido, Oferta",
    stock: 5,
    description: "Cámara digital de grado profesional con características avanzadas para entusiastas de la fotografía.",
  },
  {
    id: 5,
    name: "Altavoz Portátil",
    price: "$79.99",
    originalPrice: "$79.99",
    rating: 4.4,
    reviews: 118,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydGFibGUlMjBzcGVha2VyfGVufDB8fDB8fHww",
    tag: "Más Vendido, Nuevo",
    stock: 18,
    description: "Altavoz portátil resistente al agua con sonido 360° y 20 horas de duración de batería.",
  },
  {
    id: 6,
    name: "Rastreador de Fitness",
    price: "$59.99",
    originalPrice: "$69.99",
    rating: 4.3,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zml0bmVzcyUyMHRyYWNrZXJ8ZW58MHx8MHx8fDA%3D",
    tag: "Más Vendido, Oferta",
    stock: 25,
    description: "Rastrea tus metas de fitness con este dispositivo cómodo y elegante.",
  },
  {
    id: 7,
    name: "Teclado Mecánico",
    price: "$149.99",
    originalPrice: "$179.99",
    rating: 4.9,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVjaGFuaWNhbCUyMGtleWJvYXJkfGVufDB8fDB8fHww",
    tag: "Más Vendido, Limitado",
    stock: 3,
    description: "Teclado mecánico premium con iluminación RGB personalizable y switches táctiles.",
  },
  {
    id: 8,
    name: "Ratón Gaming",
    price: "$69.99",
    originalPrice: "$89.99",
    rating: 4.6,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwbW91c2V8ZW58MHx8MHx8fDA%3D",
    tag: "Más Vendido, Oferta",
    stock: 12,
    description: "Ratón de alta precisión para gaming con DPI ajustable y botones programables.",
  },
];

interface CarouselSectionProps {
  title: string;
  productList: typeof products;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ title, productList }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  // Manejar la selección del carrusel
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Manejar la reproducción automática
  useEffect(() => {
    if (!api || !isPlaying) {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        setAutoplayInterval(null);
      }
      return;
    }

    // Reiniciar el progreso
    setProgress(0);

    // Crear nuevo intervalo
    const intervalTime = 3000;
    const progressInterval = 30; // Actualizar el progreso cada 30ms
    const progressStep = (progressInterval / intervalTime) * 100;

    let currentProgress = 0;

    const progressTimer = setInterval(() => {
      currentProgress += progressStep;
      setProgress(Math.min(currentProgress, 100));
    }, progressInterval);

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
      currentProgress = 0;
      setProgress(0);
    }, intervalTime);

    setAutoplayInterval(interval);

    return () => {
      clearInterval(interval);
      clearInterval(progressTimer);
    };
  }, [api, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];

      // Mostrar notificación toast
      if (newFavorites.includes(productId)) {
        toast.success("Añadido a favoritos", {
          description: `${products.find(p => p.id === productId)?.name} ha sido añadido a tus favoritos.`,
          duration: 3000,
        });
      } else {
        toast("Eliminado de favoritos", {
          description: `${products.find(p => p.id === productId)?.name} ha sido eliminado de tus favoritos.`,
          duration: 3000,
        });
      }

      return newFavorites;
    });
  };

  const addToCart = (productId: number) => {
    setCart(prev => {
      const newCart = [...prev, productId];

      // Mostrar notificación toast
      toast.success("Añadido al carrito", {
        description: `${products.find(p => p.id === productId)?.name} ha sido añadido a tu carrito.`,
        duration: 3000,
      });

      return newCart;
    });
  };

  const viewDetails = (productId: number) => {
    toast.info("Ver detalles", {
      description: `Viendo detalles de ${products.find(p => p.id === productId)?.name}`,
      duration: 3000,
    });
  };

  // Generar la visualización de la calificación
  const renderRating = (rating: number, reviews: number) => {
    return (
      <div className="flex items-center mt-1">
        <div className="flex mr-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted stroke-muted-foreground"}`}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {rating} ({reviews})
        </span>
      </div>
    );
  };

  // Calcular el porcentaje de descuento
  const calculateDiscount = (price: string, originalPrice: string) => {
    const currentPrice = parseFloat(price.replace('$', ''));
    const origPrice = parseFloat(originalPrice.replace('$', ''));

    if (origPrice > currentPrice) {
      const discount = Math.round(((origPrice - currentPrice) / origPrice) * 100);
      return discount;
    }

    return 0;
  };

  // Indicador de stock
  const renderStockIndicator = (stock: number) => {
    let stockClass = "bg-green-500";
    let stockText = "En Stock";

    if (stock <= 5) {
      stockClass = "bg-red-500";
      stockText = "Stock Bajo";
    } else if (stock <= 10) {
      stockClass = "bg-yellow-500";
      stockText = "Stock Limitado";
    }

    return (
      <div className="flex items-center mt-1">
        <div className={`w-2 h-2 rounded-full ${stockClass} mr-1.5`}></div>
        <span className="text-xs text-muted-foreground">{stockText}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">Descubre nuestros productos tecnológicos</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="rounded-full h-9 w-9"
          >
            {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          </Button>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {productList.length}
            </span>
            <Progress value={progress} className="w-20 h-1.5" />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <TooltipProvider>
        <Carousel
          setApi={setApi}
          className="w-full max-w-6xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {productList.map((product) => {
              const discountPercentage = calculateDiscount(product.price, product.originalPrice);

              return (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4">
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-border">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Etiquetas del producto */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {product.tag &&
                            product.tag.split(", ").map((tag, index) => (
                              <Badge
                                key={index}
                                className={`${
                                  tag === "Oferta" ? "bg-red-500 hover:bg-red-600" :
                                  tag === "Nuevo" ? "bg-blue-500 hover:bg-blue-600" :
                                  tag === "Más Vendido" ? "bg-amber-500 hover:bg-amber-600" :
                                  tag === "Limitado" ? "bg-purple-500 hover:bg-purple-600" :
                                  "bg-green-500 hover:bg-green-600"
                                }`}
                              >
                                {tag}
                              </Badge>
                            ))}

                          {discountPercentage > 0 && (
                            <Badge variant="destructive">
                              {discountPercentage}% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className={`rounded-full bg-background/80 backdrop-blur-sm shadow-sm ${
                                  favorites.includes(product.id) ? "text-red-500" : "text-muted-foreground"
                                }`}
                                onClick={() => toggleFavorite(product.id)}
                              >
                                <HeartIcon className="h-4 w-4" fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {favorites.includes(product.id) ? "Eliminar de favoritos" : "Añadir a favoritos"}
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Imagen del producto */}
                        <div className="overflow-hidden h-52 bg-muted/20">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* Detalles del producto */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>

                        {renderRating(product.rating, product.reviews)}
                        {renderStockIndicator(product.stock)}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-xs text-muted-foreground cursor-help">
                              <InfoIcon className="h-3 w-3 mr-1" />
                              <span className="line-clamp-1">{product.description}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {product.description}
                          </TooltipContent>
                        </Tooltip>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-lg">{product.price}</span>
                          {discountPercentage > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                      <Button
                        className="w-full gap-1.5"
                        onClick={() => addToCart(product.id)}
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        Añadir al Carrito
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-1.5"
                        asChild
                      >
                        <Link href={`/details/${product.id}`}>
                          <ExternalLinkIcon className="h-4 w-4" />
                          Ver Detalles
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <div className="flex items-center justify-center mt-6 gap-4">
            <CarouselPrevious className="static transform-none mx-1 h-8 w-8" />

            <div className="flex gap-1.5">
              {productList.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className={`w-2.5 h-2.5 rounded-full p-0 ${
                    currentIndex === index ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>

            <CarouselNext className="static transform-none mx-1 h-8 w-8" />
          </div>
        </Carousel>
      </TooltipProvider>
    </div>
  );
};

export default function App() {
  // Filtrar productos destacados
  const featuredProducts = products.filter(product => product.tag.includes("Nuevo") || product.tag.includes("Oferta"));

  // Filtrar productos más vendidos
  const bestSellingProducts = products.filter(product => product.tag.includes("Más Vendido"));

  return (
    <div className="container mx-auto px-4">
      <CarouselSection title="Productos Destacados" productList={featuredProducts} />
      <CarouselSection title="Lo Más Vendido" productList={bestSellingProducts} />
      <CarouselSection title="Todos los Productos" productList={products} />
    </div>
  );
}