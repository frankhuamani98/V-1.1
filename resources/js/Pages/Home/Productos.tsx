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
  ExternalLinkIcon,
  ZapIcon,
  TrendingUpIcon,
  PercentIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from '@inertiajs/react';
import axios from "axios";

interface ProductosProps {
    productosDestacados: Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>;
    productosMasVendidos: Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>;
    todosProductos: Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>;
    productosRelacionadosPorSubcategoria: Record<number, Array<{
        id: number;
        name: string;
        price: string;
        originalPrice: string;
        rating: number;
        reviews: number;
        image: string;
        tag: string;
        stock: number;
        description: string;
    }>>;
}

interface CarouselSectionProps {
  title: string;
  productList: Array<{
    id: number;
    name: string;
    price: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    image: string;
    tag: string;
    stock: number;
    description: string;
  }>;
}

const getDiscountPercentage = (product: any) => {
  if (typeof product.descuento === "number" && product.descuento > 0) {
    return product.descuento;
  }
  const parsePrice = (price: string | undefined | null) =>
    typeof price === "string"
      ? Number(
          price
            .replace(/[^\d.,]/g, "")
            .replace(",", ".")
        )
      : 0;
  const original = parsePrice(product.originalPrice);
  const final = parsePrice(product.price);

  if (!isNaN(original) && !isNaN(final) && original > 0 && original > final) {
    return Math.round(((original - final) / original) * 100);
  }
  return 0;
};

const getTagBadges = (product: any) => {
  const tags: React.ReactNode[] = [];
  if (product.tag) {
    product.tag.split(", ").forEach((tag: string) => {
      if (tag === "Destacado") {
        tags.push(
          <div key="destacado" className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-0.5 rounded shadow-sm">
            <ZapIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Destacado</span>
          </div>
        );
      }
      if (tag === "Más Vendido") {
        tags.push(
          <div key="mas_vendido" className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded shadow-sm">
            <TrendingUpIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Más Vendido</span>
          </div>
        );
      }
      if (tag === "Oferta") {
        tags.push(
          <div key="oferta" className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
            <PercentIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Oferta</span>
          </div>
        );
      }
      if (tag === "Nuevo") {
        tags.push(
          <div key="nuevo" className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded shadow-sm">
            <span className="text-[10px] font-semibold uppercase">Nuevo</span>
          </div>
        );
      }
    });
  }
  const discountPercentage = getDiscountPercentage(product);
  if (discountPercentage > 0) {
    tags.push(
      <div key="descuento" className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
        <PercentIcon className="h-3 w-3" />
        <span className="text-[10px] font-semibold uppercase">-{discountPercentage}%</span>
      </div>
    );
  }
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
      {tags}
    </div>
  );
};

const CarouselSection: React.FC<CarouselSectionProps> = ({ title, productList }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api || isHovered) {
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
  }, [api, isHovered]); 

  const toggleFavorite = (productId: number) => {
    axios.post('/favorites/toggle', { producto_id: productId })
      .then(response => {
        if (response.data.success) {
          if (response.data.isFavorite) {
            setFavorites(prev => [...prev, productId]);
            toast.success("Añadido a favoritos", {
              description: `${productList.find(p => p.id === productId)?.name} ha sido añadido a tus favoritos.`,
              duration: 3000,
              style: {
                position: 'fixed',
                top: '64px',
                right: '10px',
                zIndex: 9999,
              }, 
            });
          } else {
            setFavorites(prev => prev.filter(id => id !== productId));
            toast("Eliminado de favoritos", {
              description: `${productList.find(p => p.id === productId)?.name} ha sido eliminado de tus favoritos.`,
              duration: 3000,
              style: {
                position: 'fixed',
                top: '64px',
                right: '10px',
                zIndex: 9999,
              }, 
            });
          }
          
          const event = new CustomEvent('favorites-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error('Error toggling favorite:', error);
        toast.error("Error primero inicie sesión ", {
          duration: 3000,
          style: {
            position: 'fixed',
            top: '64px',
            right: '10px',
            zIndex: 9999,
          },
        });
      });
  };

  const addToCart = (productId: number) => {
    axios.post('/cart/add', {
      producto_id: productId,
      quantity: 1
    })
    .then(response => {
      if (response.data.success) {
        setCart(prev => [...prev, productId]);
        
        toast.success("Añadido al carrito", {
          description: `${productList.find(p => p.id === productId)?.name} ha sido añadido a tu carrito.`,
          duration: 3000,
          style: {
            position: 'fixed',
            top: '64px',
            right: '10px',
            zIndex: 9999, 
          },
        });
        
        const event = new CustomEvent('cart-updated');
        window.dispatchEvent(event);
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      toast.error("Error al añadir al carrito", {
        duration: 3000,
        style: {
          position: 'fixed',
          top: '64px',
          right: '10px',
          zIndex: 9999,
        }
      });
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

  useEffect(() => {
    if (productList.length > 0) {
      axios.get('/favorites')
        .then(response => {
          if (response.data.success && response.data.data) {
            const favoriteProductIds = response.data.data.map((item: any) => item.producto_id);
            setFavorites(favoriteProductIds);
          }
        })
        .catch(error => {
          console.error('Error fetching favorites:', error);
        });
    }
  }, [productList]);

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">Descubre nuestros productos</p>
        </div>
        <div className="flex items-center gap-3">
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
              const discountPercentage = getDiscountPercentage(product);

              return (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-border">
                    <CardContent className="p-0">
                      <div className="relative">
                        {getTagBadges(product)}
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
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300';
                            }}
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
                          {/* Mostrar el precio base tachado solo si es mayor al precio final */}
                          {(() => {
                            // Parsea los precios a número para comparar correctamente
                            const parsePrice = (price: string | undefined | null) =>
                              typeof price === "string"
                                ? parseFloat(
                                    price
                                      .replace(/[^\d.,]/g, "")
                                      .replace(",", ".")
                                  )
                                : 0;
                            const original = parsePrice(product.originalPrice);
                            const final = parsePrice(product.price);
                            // Solo mostrar si el precio base es MAYOR al precio final
                            if (original > final) {
                              return (
                                <span className="text-sm text-muted-foreground line-through">
                                  {product.originalPrice}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {/* Mensaje de precio final y descuento */}
                        {(() => {
                          const discountPercentage = getDiscountPercentage(product);
                          return (
                            <div className="text-xs text-green-700 mt-1">
                              El precio final es <span className="font-semibold">{product.price}</span> con un descuento de <span className="font-semibold">{discountPercentage}%</span>.
                            </div>
                          );
                        })()}
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

const Productos: React.FC<ProductosProps> = ({ 
    productosDestacados, 
    productosMasVendidos, 
    todosProductos 
}) => {
    return (
        <div className="container mx-auto px-4">
            {productosDestacados.length > 0 && (
                <CarouselSection 
                    title="Productos Destacados" 
                    productList={productosDestacados} 
                />
            )}
            
            {productosMasVendidos.length > 0 && (
                <CarouselSection 
                    title="Lo Más Vendido" 
                    productList={productosMasVendidos} 
                />
            )}
            
            {todosProductos.length > 0 && (
                <CarouselSection 
                    title="Todos los Productos" 
                    productList={todosProductos} 
                />
            )}
        </div>
    );
};

export default Productos;