import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
import WhatsAppButton from "@/Components/WhatsAppButton"
import axios, { AxiosError } from 'axios';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon, 
  HomeIcon, 
  ChevronRightIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  ExternalLinkIcon,
  ZapIcon,
  TrendingUpIcon,
  PercentIcon,
} from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/Components/ui/tabs";
import { toast } from "sonner";

interface Subcategoria {
  id: number;
  nombre: string;
  categoria_id: number;
  estado: string;
}

interface Categoria {
  id: number;
  nombre: string;
  estado: string;
}

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion_corta: string;
  detalles: string;
  categoria_id: number;
  subcategoria_id: number;
  precio: number;
  descuento: number;
  precio_final: number;
  imagen_principal: string;
  imagenes_adicionales: string[];
  calificacion: number;
  stock: number;
  destacado: boolean;
  mas_vendido: boolean;
  estado: string;
}

interface Props extends PageProps {
  categoria: Categoria;
  subcategorias: Subcategoria[];
  productos: Producto[];
}

export default function CategoriaDetalle({ categoria, subcategorias, productos }: Props) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    if (productos.length > 0) {
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
  }, [productos]);

  const handleImageUrl = (image: string): string => {
    return image.startsWith('http') ? image : `/storage/${image}`;
  };

  const formatPrice = (price: number): string => {
    const formattedPrice = price.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedPrice.replace("PEN", "S/");
  };

  const toggleFavorite = (productId: number) => {
    axios.post('/favorites/toggle', { producto_id: productId })
      .then(response => {
        if (response.data.success) {
          if (response.data.isFavorite) {
            setFavorites(prev => [...prev, productId]);
            toast.success("Añadido a favoritos", {
              description: `${productos.find(p => p.id === productId)?.nombre} ha sido añadido a tus favoritos.`,
              duration: 3000,
            });
          } else {
            setFavorites(prev => prev.filter(id => id !== productId));
            toast("Eliminado de favoritos", {
              description: `${productos.find(p => p.id === productId)?.nombre} ha sido eliminado de tus favoritos.`,
              duration: 3000,
            });
          }
          
          const event = new CustomEvent('favorites-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error('Error toggling favorite:', error);
        toast.error("Error al actualizar favoritos", {
          duration: 3000,
        });
      });
  };

  const addToCart = (productId: number) => {
    const product = productos.find(p => p.id === productId);
    if (product && product.stock <= 0) {
      toast.error("Producto agotado", {
        description: "Este producto no se encuentra disponible en stock.",
        duration: 3000,
      });
      return;
    }

    axios.post('/cart/add', {
      producto_id: productId,
      quantity: 1
    })
    .then(response => {
      if (response.data.success) {
        setCart(prev => [...prev, productId]);
        
        toast.success("Añadido al carrito", {
          description: `${productos.find(p => p.id === productId)?.nombre} ha sido añadido a tu carrito.`,
          duration: 3000,
        });
        
        const event = new CustomEvent('cart-updated');
        window.dispatchEvent(event);
      }
    })
    .catch((error: AxiosError) => {
      console.error('Error adding to cart:', error);
      const errorMessage = typeof error.response?.data === 'object' && error.response?.data && 'message' in error.response.data
        ? String((error.response.data as { message?: string }).message).toLowerCase()
        : '';
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

  const renderRating = (rating: number) => {
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
          {rating.toFixed(1)}
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

  const renderPrice = (product: Producto) => {
    const precioFinal = formatPrice(product.precio_final); // Usar el precio final directamente
    const precioOriginal = product.descuento > 0 ? formatPrice(product.precio) : null;

    return (
      <div className="flex flex-col gap-0 mt-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{precioFinal}</span>
          {precioOriginal && (
            <span className="text-sm text-muted-foreground line-through">
              {precioOriginal}
            </span>
          )}
        </div>
        <div className="text-xs text-green-700 mt-1">
          El precio final es <span className="font-semibold">{precioFinal}</span> con un descuento de <span className="font-semibold">{product.descuento || 0}%</span>.
        </div>
      </div>
    );
  };

  const getTagBadges = (product: Producto) => {
    const tags: React.ReactNode[] = [];
    if (product.destacado) {
      tags.push(
        <div key="destacado" className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-0.5 rounded shadow-sm">
          <ZapIcon className="h-3 w-3" />
          <span className="text-[10px] font-semibold uppercase">Destacado</span>
        </div>
      );
    }
    if (product.mas_vendido) {
      tags.push(
        <div key="mas_vendido" className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded shadow-sm">
          <TrendingUpIcon className="h-3 w-3" />
          <span className="text-[10px] font-semibold uppercase">Más Vendido</span>
        </div>
      );
    }
    if (product.descuento > 0) {
      tags.push(
        <div key="descuento" className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
          <PercentIcon className="h-3 w-3" />
          <span className="text-[10px] font-semibold uppercase">-{product.descuento}%</span>
        </div>
      );
    }
    return (
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {tags}
      </div>
    );
  };

  const renderGridView = (filteredProducts: Producto[]) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative">
              {getTagBadges(product)}
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white text-gray-700 h-8 w-8"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <HeartIcon 
                    className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} 
                  />
                </Button>
              </div>
              <Link href={`/details/${product.id}`}>
                <div className="h-48 overflow-hidden">
                  <img
                    alt={product.nombre}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                    src={handleImageUrl(product.imagen_principal)}
                  />
                </div>
              </Link>
            </div>
            <CardContent className="p-4">
              <Link href={`/details/${product.id}`} className="block">
                <h3 className="font-medium text-sm line-clamp-2 min-h-[40px]">{product.nombre}</h3>
                {renderRating(product.calificacion)}
                {renderStockIndicator(product.stock)}
                {renderPrice(product)}
              </Link>
            </CardContent>
            <CardFooter className="pt-0 px-4 pb-4 flex flex-col gap-2">
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
        ))}
      </div>
    );
  };

  const renderListView = (filteredProducts: Producto[]) => {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-1/4">
                {getTagBadges(product)}
                <Link href={`/details/${product.id}`}>
                  <div className="h-48 sm:h-full overflow-hidden">
                    <img
                      alt={product.nombre}
                      className="h-full w-full object-cover"
                      src={handleImageUrl(product.imagen_principal)}
                    />
                  </div>
                </Link>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <Link href={`/details/${product.id}`} className="block">
                  <h3 className="font-medium text-lg mb-2">{product.nombre}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.descripcion_corta}</p>
                  <div className="flex items-center space-x-4 mb-2">
                    {renderRating(product.calificacion)}
                    {renderStockIndicator(product.stock)}
                  </div>
                  {renderPrice(product)}
                </Link>
                <div className="mt-auto pt-4 flex space-x-2">
                  <Button
                    className="flex-1 gap-1.5"
                    onClick={() => addToCart(product.id)}
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                    Añadir al Carrito
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <HeartIcon 
                      className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} 
                    />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5"
                    asChild
                  >
                    <Link href={`/details/${product.id}`}>
                      <ExternalLinkIcon className="h-4 w-4" />
                      Ver Detalles
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const handleSubcategoriaSelect = (subcategoria_id: number) => {
    setSelectedSubcategoria(selectedSubcategoria === subcategoria_id ? null : subcategoria_id);
  };

  const filteredProducts = productos.filter(product => 
    selectedSubcategoria === null || product.subcategoria_id === selectedSubcategoria
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.precio_final - b.precio_final;
      case 'price-high':
        return b.precio_final - a.precio_final;
      case 'rating':
        return b.calificacion - a.calificacion;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title={`${categoria.nombre} - Rudolf Motors`} />
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <nav className="mb-4">
          <ol className="flex items-center flex-wrap gap-2 py-2">
            <li>
              <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center text-sm">
                <HomeIcon className="w-3.5 h-3.5 mr-1" />
                Inicio
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <Link href="/categorias" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">
                Categorías
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm" title={`Categoría: ${categoria.nombre}`}>
                {categoria.nombre}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            {categoria.nombre}
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded">
              Categoría
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora nuestra selección de productos en la categoría <span className="font-semibold">{categoria.nombre}</span>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-medium text-lg mb-4">Subcategorías</h2>
                <Separator className="mb-4" />
                <div className="space-y-1">
                  <div 
                    className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${selectedSubcategoria === null ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setSelectedSubcategoria(null)}
                  >
                    Todas las subcategorías
                  </div>
                  {subcategorias.map((subcategoria) => (
                    <div 
                      key={subcategoria.id}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${selectedSubcategoria === subcategoria.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      onClick={() => handleSubcategoriaSelect(subcategoria.id)}
                    >
                      {subcategoria.nombre}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-3/4">
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mostrando {filteredProducts.length} productos
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-1">
                      <select
                        className="py-1 px-2 rounded border bg-transparent text-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Más recientes</option>
                        <option value="price-low">Precio: menor a mayor</option>
                        <option value="price-high">Precio: mayor a menor</option>
                        <option value="rating">Mejor valorados</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant={displayMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setDisplayMode('grid')}
                        className="h-8 w-8"
                      >
                        <GridIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={displayMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setDisplayMode('list')}
                        className="h-8 w-8"
                      >
                        <ListIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {filteredProducts.length > 0 ? (
              displayMode === 'grid' 
                ? renderGridView(sortedProducts) 
                : renderListView(sortedProducts)
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No hay productos disponibles en esta subcategoría.
                </p>
                <Button onClick={() => setSelectedSubcategoria(null)}>
                  Ver todas las subcategorías
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}