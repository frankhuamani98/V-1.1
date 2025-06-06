import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Check, Home, Star, Tag, Siren as Fire, Truck, Shield, ArrowLeft, ArrowRight, Package, RefreshCw, CreditCard, Clock, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { HeartIcon, StarIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import RelatedProductsCarousel from './RelatedProductsCarousel';
import Header from '../../Header';
import Footer from '../../Footer';
import WhatsAppButton from '@/Components/WhatsAppButton';
import type { PageProps } from '@/types';

interface MotosCompatibles {
  id: number;
  marca: string;
  modelo: string;
  año: string;
}

interface ProductoDetalle {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  descripcion_corta: string;
  precio: number;
  descuento: number;
  precio_final: number;
  imagen_principal: string;
  imagenes_adicionales: Array<{ url: string; estilo?: string }>;
  calificacion: number;
  total_reviews: number;
  stock: number;
  categoria: {
    id: number;
    nombre: string;
  };
  subcategoria: {
    id: number;
    nombre: string;
  };
  motos_compatibles: MotosCompatibles[];
}

interface Props extends PageProps {
  producto: ProductoDetalle;
  productosRelacionados: Array<{
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
}

export default function Details({ producto, productosRelacionados }: Props) {
  const handleImageUrl = (image: string): string => {
    return image.startsWith('http') ? image : `/storage/${image}`;
  };

  const [selectedColor, setSelectedColor] = useState('Negro');
  const [currentImage, setCurrentImage] = useState(handleImageUrl(producto.imagen_principal));
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>("descripcion");
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const buyNowFormRef = useRef<HTMLFormElement>(null);
  // Nuevo: obtener el token CSRF del meta tag
  const csrfToken = (typeof document !== "undefined")
    ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
    : '';

  const formatPrice = (price: number): string => {
    const formattedPrice = price.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedPrice.replace("PEN", "S/");
  };

  const precioFinal = producto.precio_final;
  // Cambia la condición para mostrar descuento solo si el precio base es mayor al precio final
  const hasDiscount = producto.precio > precioFinal;
  const ahorro = hasDiscount ? formatPrice(producto.precio - precioFinal) : '';

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);
    
    axios.get('/favorites')
      .then(response => {
        if (response.data.success && response.data.data) {
          const favoriteProductIds = response.data.data.map((item: any) => item.producto_id);
          setIsFavorite(favoriteProductIds.includes(producto.id));
        }
      })
      .catch(error => {
        console.error('Error fetching favorites:', error);
      });

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [producto.id]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    };
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleImageChange = (image: string) => {
    setCurrentImage(image);
  };

  const handleAddToCart = () => {
    if (producto.stock <= 0) {
      toast.error("Producto agotado", {
        description: "Este producto no se encuentra disponible en stock.",
        duration: 3000,
      });
      return;
    }

    axios.post('/cart/add', {
      producto_id: producto.id,
      quantity: quantity
    })
    .then(response => {
      if (response.data.success) {
        toast.success("Añadido al carrito", {
          description: `${producto.nombre} ha sido añadido a tu carrito.`,
          duration: 3000,
        });
        
        const event = new CustomEvent('cart-updated');
        window.dispatchEvent(event);
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('stock') ||
        errorMessage.includes('agotado') ||
        errorMessage.includes('disponible') ||
        errorMessage.includes('inventario') ||
        error.response?.status === 422
      ) {
        toast.error("Producto agotado", {
          description: "No hay suficiente stock disponible para este producto.",
          duration: 3000,
        });
      } else {
        toast.error("No se pudo añadir al carrito", {
          description: "El producto no está disponible en este momento.",
          duration: 3000,
        });
      }
    });
  };
  
  const toggleFavorite = () => {
    axios.post('/favorites/toggle', { producto_id: producto.id })
      .then(response => {
        if (response.data.success) {
          setIsFavorite(response.data.isFavorite);
          
          if (response.data.isFavorite) {
            toast.success("Añadido a favoritos", {
              description: `${producto.nombre} ha sido añadido a tus favoritos.`,
              duration: 3000,
            });
          } else {
            toast("Eliminado de favoritos", {
              description: `${producto.nombre} ha sido eliminado de tus favoritos.`,
              duration: 3000,
            });
          }
          
          const event = new CustomEvent('favorites-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        toast.error("Error al actualizar favoritos", {
          duration: 3000,
        });
      });
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, producto.stock));
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex mr-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({producto.total_reviews} reseñas)</span>
      </div>
    );
  };

  const handleBuyNow = async () => {
    if (producto.stock <= 0) {
      toast.error("No disponible para compra inmediata", {
        description: "Lo sentimos, este producto está temporalmente agotado. Te notificaremos cuando esté disponible nuevamente.",
        duration: 4000,
      });
      return;
    }

    try {
      await axios.post('/cart/add', {
        producto_id: producto.id,
        quantity: quantity
      });
      window.location.href = '/checkout/informacion';
    } catch (error: any) {
      const errorMessage = error.response?.data?.message?.toLowerCase() || '';
      if (
        errorMessage.includes('stock') ||
        errorMessage.includes('agotado') ||
        errorMessage.includes('disponible') ||
        errorMessage.includes('inventario') ||
        error.response?.status === 422
      ) {
        toast.error("Stock insuficiente", {
          description: "No hay suficiente stock para procesar tu compra inmediata. Por favor, revisa la cantidad o inténtalo más tarde.",
          duration: 4000,
        });
      } else {
        toast.error("Error en el proceso de compra", {
          description: "Hubo un problema al procesar tu compra inmediata. Por favor, inténtalo nuevamente en unos momentos.",
          duration: 4000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <nav className="mb-4">
          <ol className="flex items-center flex-wrap gap-2 py-2">
            <li>
              <a href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center text-sm">
                <Home className="w-3.5 h-3.5 mr-1" />
                Inicio
              </a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <a href={`/categorias/${producto.categoria.id}`} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">{producto.categoria.nombre}</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <a href="/categorias" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">
                {producto.subcategoria.nombre}
              </a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm truncate max-w-[200px]">
                {producto.nombre}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="product-container bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {producto.descuento > 0 && (
                  <Badge className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 px-3 py-1 text-sm">
                    -{producto.descuento}% OFF
                  </Badge>
                )}
                <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 px-3 py-1 text-sm">
                  <Fire className="w-3.5 h-3.5 mr-1" /> Más Vendido
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  className={`rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-900 ${isFavorite ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={toggleFavorite}
                >
                  <HeartIcon className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
                </Button>
              </div>
              <img
                src={currentImage}
                className="w-full main-image object-cover h-[300px] md:h-[500px] transition-opacity duration-150"
                alt={producto.nombre}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
              <div className="col-span-1">
                <img
                  src={handleImageUrl(producto.imagen_principal)}
                  className={`thumbnail w-full h-[80px] md:h-[120px] object-cover rounded-lg cursor-pointer transition-all duration-300 ${currentImage === handleImageUrl(producto.imagen_principal) ? 'border-2 border-gray-800 dark:border-gray-200' : 'border-2 border-transparent'}`}
                  alt="Vista principal"
                  onClick={() => handleImageChange(handleImageUrl(producto.imagen_principal))}
                />
              </div>
              {producto.imagenes_adicionales.map((image, index) => (
                <div key={index} className="col-span-1">
                  <img
                    src={handleImageUrl(image.url)}
                    className={`thumbnail w-full h-[80px] md:h-[120px] object-cover rounded-lg cursor-pointer transition-all duration-300 ${currentImage === handleImageUrl(image.url) ? 'border-2 border-gray-800 dark:border-gray-200' : 'border-2 border-transparent'}`}
                    alt={`Vista ${index + 1}`}
                    onClick={() => handleImageChange(handleImageUrl(image.url))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-start justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{producto.nombre}</h1>
                <Badge variant="outline" className="mt-1 md:mt-0 dark:border-gray-600">
                  <Package className="w-3.5 h-3.5 mr-1" /> En Stock
                </Badge>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-3">Código: {producto.codigo}</p>

              {renderRating(producto.calificacion)}

              <div className="mt-4 mb-6">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(precioFinal)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(producto.precio)}
                      </span>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 ml-2">
                        -{producto.descuento}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <div className="flex items-center">
                      <Badge variant="destructive" className="text-sm">
                        Ahorras {ahorro}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      ¡Oferta por tiempo limitado!  
                    </p>
                  </div>
                )}
              </div>

              <Separator className="my-4 dark:bg-gray-700" />

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {producto.descripcion_corta}
                </p>
              </div>

              <div className="mb-5">
                <h5 className="font-medium mb-3">Estilo/Variante:</h5>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 border-2 overflow-hidden ${currentImage === handleImageUrl(producto.imagen_principal) ? 'border-blue-600 dark:border-blue-500' : 'border-transparent'}`}
                      onClick={() => {
                        handleColorSelect('Principal');
                        handleImageChange(handleImageUrl(producto.imagen_principal));
                      }}
                    >
                      <img 
                        src={handleImageUrl(producto.imagen_principal)} 
                        alt="Variante Principal"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <small className="block mt-1">Principal</small>
                  </div>
                  {producto.imagenes_adicionales.map((imagen, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 border-2 overflow-hidden ${currentImage === handleImageUrl(imagen.url) ? 'border-blue-600 dark:border-blue-500' : 'border-transparent'}`}
                        onClick={() => {
                          handleColorSelect(imagen.estilo || `Variante ${index + 1}`);
                          handleImageChange(handleImageUrl(imagen.url));
                        }}
                      >
                        <img 
                          src={handleImageUrl(imagen.url)} 
                          alt={imagen.estilo || `Variante ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <small className="block mt-1">{imagen.estilo || `Variante ${index + 1}`}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <h5 className="font-medium mb-3">Cantidad:</h5>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 dark:border-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="w-16 mx-2">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))}
                      className="w-full h-10 text-center border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      min="1"
                      max={producto.stock}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= producto.stock}
                    className="h-10 w-10 dark:border-gray-700"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                    {producto.stock} disponibles
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <Button
                  className="w-full py-6 text-base"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Añadir al carrito
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full py-6 text-base"
                  onClick={handleBuyNow}
                >
                  <CreditCard className="mr-2 w-5 h-5" />
                  Comprar ahora
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                  <Tag className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="w-full">
                    <p className="text-sm font-semibold mb-1">Especificaciones del Producto</p>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      {expandedSection === 'detalles' ? (
                        <p>{producto.descripcion}</p>
                      ) : (
                        <p className="line-clamp-3">{producto.descripcion}</p>
                      )}
                      <button 
                        onClick={() => toggleSection('detalles')} 
                        className="text-blue-600 dark:text-blue-400 text-xs hover:underline flex items-center mt-1"
                      >
                        {expandedSection === 'detalles' ? (
                          <>Mostrar menos <ChevronUp className="w-3 h-3 ml-1" /></>
                        ) : (
                          <>Ver más detalles <ChevronDown className="w-3 h-3 ml-1" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                  <Package className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="w-full">
                    <p className="text-sm font-semibold mb-1">Compatibilidad con Motos</p>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {producto.motos_compatibles.length > 0 ? (
                        <div className="max-h-20 overflow-y-auto pr-2 custom-scrollbar">
                          {producto.motos_compatibles.map((moto, index) => (
                            <div key={moto.id} className="flex items-center mb-1 last:mb-0">
                              <Check className="w-3.5 h-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                              <span>{moto.marca} {moto.modelo} ({moto.año})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4 mr-1.5" />
                          <span>Compatible con todas las motos</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                  <Tag className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="w-full">
                    <p className="text-sm font-semibold mb-1">Categoría y Clasificación</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {producto.categoria.nombre}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {producto.subcategoria.nombre}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors">
                  <Package className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="w-full">
                    <p className="text-sm font-semibold mb-1">Estado del Inventario</p>
                    <div>
                      {producto.stock > 10 ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          <span className="text-sm">Stock disponible ({producto.stock} unidades)</span>
                        </div>
                      ) : producto.stock > 0 ? (
                        <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                          <span className="text-sm">¡Últimas {producto.stock} unidades disponibles!</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                          <span className="text-sm">Agotado temporalmente</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RelatedProductsCarousel products={productosRelacionados} isMobile={isMobile} />
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}