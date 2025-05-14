import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/Components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Progress } from "@/Components/ui/progress";
import { PauseIcon, PlayIcon, ShoppingCartIcon, HeartIcon, StarIcon, InfoIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/Components/ui/separator";
import { Link } from '@inertiajs/react';

interface RelatedProductsCarouselProps {
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    image: string;
    tag: string;
    stock: number;
    masVendido?: boolean;
    destacado?: boolean;
  }>;
  isMobile?: boolean;
}

const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({ products, isMobile = false }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  const handleImageUrl = (image: string): string => {
    return image.startsWith('http') ? image : `/storage/${image}`;
  };

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

  useEffect(() => {
    if (!api || !isPlaying) {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        setAutoplayInterval(null);
      }
      return;
    }

    setProgress(0);

    const intervalTime = 3000;
    const progressInterval = 30;
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

      toast.success("Añadido al carrito", {
        description: `${products.find(p => p.id === productId)?.name} ha sido añadido a tu carrito.`,
        duration: 3000,
      });

      return newCart;
    });
  };

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

  const calculateDiscount = (price: string, originalPrice: string) => {
    const currentPrice = parseFloat(price.replace('$', ''));
    const origPrice = parseFloat(originalPrice.replace('$', ''));

    if (origPrice > currentPrice) {
      const discount = Math.round(((origPrice - currentPrice) / origPrice) * 100);
      return discount;
    }

    return 0;
  };

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
          <h2 className="text-2xl font-bold">Productos Relacionados</h2>
          <p className="text-muted-foreground">Descubre más productos que podrían interesarte</p>
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
              {currentIndex + 1} / {products.length}
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
            {products.map((product) => {
              const discountPercentage = calculateDiscount(product.price, product.originalPrice);

              return (
                <CarouselItem key={product.id} className={isMobile ? "basis-full sm:basis-1/2" : "md:basis-1/2 lg:basis-1/3 xl:basis-1/4"}>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-border m-1">
                    <CardContent className="p-0">
                      <div className="relative">
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

                        <div className="overflow-hidden h-52 bg-muted/20">
                          <img
                            src={handleImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </div>

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
              {products.map((_, index) => (
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

export default RelatedProductsCarousel;