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
import { 
  addToCart, 
  addToFavorites, 
  isInCart, 
  isInFavorites,
  removeFromFavorites
} from "@/lib/cartHelpers";

interface Product {
  id: number;
  nombre: string;
  precio: number;
  descuento: number;
  descripcion_corta: string;
  imagen_principal: string;
  stock: number;
  destacado: boolean;
  mas_vendido: boolean;
  calificacion: number;
  total_reviews: number;
}

interface ProductsProps {
  featuredProducts: Product[];
  bestSellingProducts: Product[];
  allProducts: Product[];
}

interface CarouselSectionProps {
  title: string;
  productList: Product[];
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ title, productList }) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateFavoritesFromStorage = () => {
      if (typeof window !== 'undefined') {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          try {
            const favoriteItems = JSON.parse(storedFavorites);
            const favoriteIds = favoriteItems.map((item: any) => item.id);
            setFavorites(favoriteIds);
          } catch (error) {
            console.error('Error parsing favorites from localStorage:', error);
          }
        } else {
          setFavorites([]);
        }
      }
    };
    
    const updateCartFromStorage = () => {
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          try {
            const cartItems = JSON.parse(storedCart);
            setCart(cartItems.map((item: any) => item.id));
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
          }
        } else {
          setCart([]);
        }
      }
    };
    
    updateFavoritesFromStorage();
    updateCartFromStorage();
    
    window.addEventListener('favorites-updated', updateFavoritesFromStorage);
    window.addEventListener('cart-updated', updateCartFromStorage);
    
    return () => {
      window.removeEventListener('favorites-updated', updateFavoritesFromStorage);
      window.removeEventListener('cart-updated', updateCartFromStorage);
    };
  }, []);

  const formatPrice = (price: number): string => {
    const formattedPrice = price.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedPrice.replace("PEN", "S/");
  };

  const calculateFinalPrice = (price: number, descuento: number): number => {
    const priceWithIgv = price * 1.18; // Aplica IGV del 18%
    return descuento > 0 ? priceWithIgv - (priceWithIgv * descuento / 100) : priceWithIgv;
  };

  const renderPrice = (product: Product) => {
    const precioBase = formatPrice(product.precio);
    const precioFinal = formatPrice(calculateFinalPrice(product.precio, product.descuento));
    const descuento = product.descuento > 0 ? `-${product.descuento}%` : null;

    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-lg">{precioFinal}</span>
        {product.descuento > 0 && (
          <>
            <span className="text-sm text-muted-foreground line-through">{precioBase}</span>
            <span className="text-sm text-red-500">{descuento}</span>
          </>
        )}
      </div>
    );
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
    const product = productList.find(p => p.id === productId);
    if (!product) return;
    
    const isFavorited = favorites.includes(productId);
    
    if (isFavorited) {
      removeFromFavorites(productId);
      
      setFavorites(prev => prev.filter(id => id !== productId));
      
      toast("Eliminado de favoritos", {
        description: `${product.nombre} ha sido eliminado de tus favoritos.`,
        duration: 3000,
      });
    } else {
      const favoriteProduct = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        descuento: product.descuento,
        imagen: product.imagen_principal
      };
      
      addToFavorites(favoriteProduct);
      
      setFavorites(prev => [...prev, productId]);
      
      toast.success("Añadido a favoritos", {
        description: `${product.nombre} ha sido añadido a tus favoritos.`,
        duration: 3000,
      });
    }
  };

  const handleAddToCart = (productId: number) => {
    const product = productList.find(p => p.id === productId);
    if (!product) return;
    
    if (isInCart(productId)) {
      toast.info("Producto ya en el carrito", {
        description: `${product.nombre} ya está en tu carrito.`,
        duration: 3000,
      });
      return;
    }
    
    const addedSuccessfully = addToCart(product);
    
    if (addedSuccessfully) {
      setCart(prev => {
        const newCart = [...prev, productId];
        
        toast.success("Añadido al carrito", {
          description: `${product.nombre} ha sido añadido a tu carrito.`,
          duration: 3000,
        });
  
        return newCart;
      });
    }
  };

  const viewDetails = (productId: number) => {
    toast.info("Ver detalles", {
      description: `Viendo detalles de ${productList.find(p => p.id === productId)?.nombre}`,
      duration: 3000,
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

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (originalPrice && originalPrice > price) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
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

  const sortProducts = (products: Product[]): Product[] => {
    if (title === "Productos Destacados") {
      return [...products].sort((a, b) => {
        if (b.destacado !== a.destacado) return b.destacado ? 1 : -1;
        if (b.mas_vendido !== a.mas_vendido) return b.mas_vendido ? 1 : -1;
        return b.descuento - a.descuento;
      });
    } else if (title === "Lo Más Vendido") {
      return [...products].sort((a, b) => {
        if (b.mas_vendido !== a.mas_vendido) return b.mas_vendido ? 1 : -1;
        if (b.destacado !== a.destacado) return b.destacado ? 1 : -1;
        return b.descuento - a.descuento;
      });
    }
    return products;
  };

  const renderLabels = (product: Product) => {
    const labels: JSX.Element[] = [];

    if (title === "Productos Destacados") {
      if (product.destacado) {
        labels.push(
          <div key="destacado" className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-0.5 rounded shadow-sm">
            <ZapIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Destacado</span>
          </div>
        );
      }
      if (product.mas_vendido) {
        labels.push(
          <div key="mas_vendido" className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded shadow-sm">
            <TrendingUpIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Más Vendido</span>
          </div>
        );
      }
      if (product.descuento > 0) {
        labels.push(
          <div key="descuento" className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
            <PercentIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">-{product.descuento}%</span>
          </div>
        );
      }
    } else if (title === "Lo Más Vendido") {
      if (product.mas_vendido) {
        labels.push(
          <div key="mas_vendido" className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded shadow-sm">
            <TrendingUpIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Más Vendido</span>
          </div>
        );
      }
      if (product.destacado) {
        labels.push(
          <div key="destacado" className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-0.5 rounded shadow-sm">
            <ZapIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Destacado</span>
          </div>
        );
      }
      if (product.descuento > 0) {
        labels.push(
          <div key="descuento" className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
            <PercentIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">-{product.descuento}%</span>
          </div>
        );
      }
    } else if (title === "Todos los Productos") {
      if (product.destacado) {
        labels.push(
          <div key="destacado" className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-0.5 rounded shadow-sm">
            <ZapIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Destacado</span>
          </div>
        );
      }
      if (product.mas_vendido) {
        labels.push(
          <div key="mas_vendido" className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded shadow-sm">
            <TrendingUpIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">Más Vendido</span>
          </div>
        );
      }
      if (product.descuento > 0) {
        labels.push(
          <div key="descuento" className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
            <PercentIcon className="h-3 w-3" />
            <span className="text-[10px] font-semibold uppercase">-{product.descuento}%</span>
          </div>
        );
      }
    }

    return labels;
  };

  const sortedProductList = sortProducts(productList);

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
            {sortedProductList.map((product) => {
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
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {renderLabels(product)}
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
                            src={product.imagen_principal}
                            alt={product.nombre}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.nombre}</h3>

                        {renderRating(product.calificacion, product.total_reviews)}
                        {renderStockIndicator(product.stock)}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-xs text-muted-foreground cursor-help">
                              <InfoIcon className="h-3 w-3 mr-1" />
                              <span className="line-clamp-1">{product.descripcion_corta}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {product.descripcion_corta}
                          </TooltipContent>
                        </Tooltip>

                        {renderPrice(product)}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                      <Button
                        className="w-full gap-1.5"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        {product.stock > 0 ? "Añadir al Carrito" : "Sin Stock"}
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

const Products: React.FC<ProductsProps> = ({ featuredProducts, bestSellingProducts, allProducts }) => {
  return (
    <div className="container mx-auto px-4">
      <CarouselSection title="Productos Destacados" productList={featuredProducts} />
      <CarouselSection title="Lo Más Vendido" productList={bestSellingProducts} />
      <CarouselSection title="Todos los Productos" productList={allProducts} />
    </div>
  );
};

export default Products;