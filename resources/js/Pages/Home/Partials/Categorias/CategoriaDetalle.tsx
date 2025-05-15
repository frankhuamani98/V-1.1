import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
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
  ListIcon
} from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/Components/ui/tabs";
import { Link } from '@inertiajs/react';
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

  const calculateFinalPrice = (price: number, descuento: number): number => {
    if (descuento > 0) {
      const discountAmount = (price * descuento) / 100;
      return price - discountAmount;
    }
    return price;
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];

      if (newFavorites.includes(productId)) {
        toast.success("Añadido a favoritos", {
          description: `${productos.find(p => p.id === productId)?.nombre} ha sido añadido a tus favoritos.`,
          duration: 3000,
        });
      } else {
        toast("Eliminado de favoritos", {
          description: `${productos.find(p => p.id === productId)?.nombre} ha sido eliminado de tus favoritos.`,
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
        description: `${productos.find(p => p.id === productId)?.nombre} ha sido añadido a tu carrito.`,
        duration: 3000,
      });

      return newCart;
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
    const precioFinal = formatPrice(calculateFinalPrice(product.precio, product.descuento));
    const precioOriginal = product.descuento > 0 ? formatPrice(product.precio) : null;
    
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="font-bold text-lg">{precioFinal}</span>
        {precioOriginal && (
          <span className="text-sm text-muted-foreground line-through">
            {precioOriginal}
          </span>
        )}
        {product.descuento > 0 && (
          <span className="text-sm text-red-500">
            -{product.descuento}%
          </span>
        )}
      </div>
    );
  };

  const renderLabels = (product: Producto) => {
    return (
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {product.destacado && (
          <Badge className="bg-blue-500">Destacado</Badge>
        )}
        {product.mas_vendido && (
          <Badge className="bg-purple-500">Más Vendido</Badge>
        )}
        {product.descuento > 0 && (
          <Badge className="bg-red-500">-{product.descuento}%</Badge>
        )}
      </div>
    );
  };

  const renderGridView = (filteredProducts: Producto[]) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative">
              {renderLabels(product)}
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
            <CardFooter className="pt-0 px-4 pb-4">
              <Button 
                className="w-full" 
                onClick={() => addToCart(product.id)}
              >
                <ShoppingCartIcon className="mr-2 h-4 w-4" /> Añadir
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
                {renderLabels(product)}
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
                    className="flex-1" 
                    onClick={() => addToCart(product.id)}
                  >
                    <ShoppingCartIcon className="mr-2 h-4 w-4" /> Añadir al carrito
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
        return calculateFinalPrice(a.precio, a.descuento) - calculateFinalPrice(b.precio, b.descuento);
      case 'price-high':
        return calculateFinalPrice(b.precio, b.descuento) - calculateFinalPrice(a.precio, a.descuento);
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
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                {categoria.nombre}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{categoria.nombre}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora nuestra selección de productos en la categoría {categoria.nombre}.
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
      
      <Footer />
    </div>
  );
}