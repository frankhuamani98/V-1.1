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
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  InfoIcon,
  ExternalLinkIcon,
  ZapIcon,
  TrendingUpIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    descripcion_corta: string;
    precio: number | string;
    descuento: number | string;
    imagen_principal: string;
    calificacion: number;
    destacado: boolean;
    mas_vendido: boolean;
    stock?: number;
}

interface CarouselSectionProps {
  title: string;
  productList: any[];
  showOnlyBestSellers?: boolean;
  showOnlyFeatured?: boolean;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ 
  title, 
  productList,
  showOnlyBestSellers = false,
  showOnlyFeatured = false
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
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

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];

      if (newFavorites.includes(productId)) {
        toast.success("Añadido a favoritos", {
          description: `${productList.find(p => p.id === productId)?.name} ha sido añadido a tus favoritos.`,
          duration: 3000,
        });
      } else {
        toast("Eliminado de favoritos", {
          description: `${productList.find(p => p.id === productId)?.name} ha sido eliminado de tus favoritos.`,
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
        description: `${productList.find(p => p.id === productId)?.name} ha sido añadido a tu carrito.`,
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
          {rating.toFixed(1)} ({reviews})
        </span>
      </div>
    );
  };

  const calculateDiscount = (price: string, originalPrice: string) => {
    const currentPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    const origPrice = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));

    if (origPrice > currentPrice && origPrice > 0) {
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
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">Descubre nuestros productos tecnológicos</p>
        </div>
        <div className="flex flex-col items-end">
          <Progress value={progress} className="w-20 h-1.5" />
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
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4"
                  onMouseEnter={() => setIsPlaying(false)}
                  onMouseLeave={() => setIsPlaying(true)}
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-border">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Etiquetas del producto */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {product.tag &&
                            product.tag.split(", ").map((tag: string, index: number) => (
                              <Badge
                                key={index}
                                className={`flex items-center ${
                                  tag === "Descuento" ? "bg-red-500 hover:bg-red-600" :
                                  tag === "Nuevo" ? "bg-blue-500 hover:bg-blue-600" :
                                  tag === "Más Vendido" ? "bg-amber-500 hover:bg-amber-600" :
                                  tag === "Destacado" ? "bg-purple-500 hover:bg-purple-600" :
                                  "bg-green-500 hover:bg-green-600"
                                }`}
                              >
                                {tag === "Destacado" ? (
                                  <>
                                    <StarIcon className="h-3 w-3 mr-1" />
                                    {tag}
                                  </>
                                ) : tag === "Más Vendido" ? (
                                  <>
                                    <TrendingUpIcon className="h-3 w-3 mr-1" />
                                    {tag}
                                  </>
                                ) : tag === "Descuento" ? (
                                  <>
                                    <ZapIcon className="h-3 w-3 mr-1" />
                                    {tag} {discountPercentage > 0 && `${discountPercentage}%`}
                                  </>
                                ) : (
                                  tag
                                )}
                              </Badge>
                            ))}

                          {discountPercentage > 0 && (!product.tag || !product.tag.includes("Descuento")) && (
                            <Badge className="flex items-center bg-red-500 hover:bg-red-600">
                              <ZapIcon className="h-3 w-3 mr-1" />
                              Descuento {discountPercentage}%
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
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-product.png';
                            }}
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
                        <Link href={`/productos/${product.id}`}>
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

interface ProductsProps {
    featuredProducts: Producto[];
    bestSellingProducts: Producto[];
    allProducts: Producto[];
}

const Products: React.FC<ProductsProps> = ({ 
    featuredProducts, 
    bestSellingProducts, 
    allProducts 
}) => {
    const formatPrice = (price: any): string => {
        if (typeof price === 'string' && price.startsWith('S/')) return price;
        const num = typeof price === 'number' ? price : parseFloat(price) || 0;
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const adaptProducts = (products: Producto[], options: {
      isFeatured?: boolean;
      isBestSeller?: boolean;
    } = {}) => {
        return products.map(product => {
            const precio = formatPrice(product.precio);
            const descuento = typeof product.descuento === 'string' ? parseFloat(product.descuento) : product.descuento;
            
            // Calcular precio original con descuento
            let precioOriginal = precio;
            if (descuento > 0) {
                const precioNumerico = parseFloat(precio.replace(/[^0-9.]/g, ''));
                precioOriginal = formatPrice(precioNumerico / (1 - descuento/100));
            }

            // Genera tags según el tipo de lista
            const tags = [];
            
            if (options.isBestSeller) {
              tags.push("Más Vendido");
              if (descuento > 0) tags.push("Descuento");
            } 
            else if (options.isFeatured) {
              tags.push("Destacado");
              if (descuento > 0) tags.push("Descuento");
            } 
            else {
              if (product.destacado) tags.push("Destacado");
              if (product.mas_vendido) tags.push("Más Vendido");
              if (descuento > 0) tags.push("Descuento");
              if (tags.length === 0) tags.push("Nuevo");
            }

            return {
                id: product.id,
                name: product.nombre,
                price: precio,
                originalPrice: precioOriginal,
                rating: product.calificacion || 4.5,
                reviews: Math.floor(Math.random() * 100) + 20,
                image: product.imagen_principal,
                tag: tags.join(", "),
                stock: product.stock || Math.floor(Math.random() * 50) + 5,
                description: product.descripcion_corta || "Descripción del producto",
            };
        });
    };

    return (
        <div className="container mx-auto px-4">
            <CarouselSection 
                title="Productos Destacados" 
                productList={adaptProducts(featuredProducts, { isFeatured: true })}
                showOnlyFeatured
            />
            
            <CarouselSection 
                title="Lo Más Vendido" 
                productList={adaptProducts(bestSellingProducts, { isBestSeller: true })}
                showOnlyBestSellers
            />
            
            <CarouselSection 
                title="Todos los Productos" 
                productList={adaptProducts(allProducts)}
            />
        </div>
    );
};

export default Products;