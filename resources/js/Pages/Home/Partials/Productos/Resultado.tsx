import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import Header from '../../Header';
import Footer from '../../Footer';
import {
  StarIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  FilterIcon,
  HeartIcon,
  TruckIcon,
  CheckCircleIcon,
  InfoIcon,
  SearchIcon,
  PhoneIcon,
  PlusIcon,
  ChevronDownIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Link } from '@inertiajs/react';
import { useTheme } from "next-themes";
// import { useTheme } from "@/Components/theme-provider"; // Removed as it's not exported

interface Producto {
    id: number;
    nombre: string;
    descripcion_corta: string;
    precio: number;
    descuento: number;
    precio_final: number;
    imagen_principal: string;
    calificacion: number;
    stock: number;
    categoria: string;
    subcategoria: string;
    compatibility: string;
    destacado?: boolean;
    mas_vendido?: boolean;
}

interface Categoria {
    id: number;
    nombre: string;
    subcategorias: Subcategoria[];
}

interface Subcategoria {
    id: number;
    nombre: string;
}

interface ResultadoProps {
    year: string;
    brand: string;
    model: string;
    productos: Producto[];
    categorias: Categoria[];
    subcategorias: Record<number, string>;
    motoEncontrada: boolean;
    motoInfo?: {
        marca: string;
        modelo: string;
        year: string;
    };
}

const formatPrice = (price: number): string => {
    // Redondear el precio a 2 decimales
    const roundedPrice = Math.round(price * 100) / 100;
    // Si es un número entero, no mostrar decimales
    if (Number.isInteger(roundedPrice)) {
        return `S/${roundedPrice}`;
    }
    // Si tiene decimales, mostrar máximo 2
    return `S/${roundedPrice.toFixed(2)}`;
};

const ProductCard = ({ product }: { product: Producto }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageError, setImageError] = useState(false);
  // const { theme } = useTheme(); // Removed as useTheme is not available

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <StarIcon key={i} size={16} className="text-yellow-500 fill-yellow-500" />;
          } else if (i === fullStars && hasHalfStar) {
            return (
              <div key={i} className="relative">
                <StarIcon size={16} className="text-gray-300 dark:text-gray-500" />
                <StarIcon 
                  size={16} 
                  className="text-yellow-500 fill-yellow-500 absolute top-0 left-0 w-1/2 overflow-hidden" 
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
              </div>
            );
          } else {
            return <StarIcon key={i} size={16} className="text-gray-300 dark:text-gray-500" />;
          }
        })}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch(compatibility) {
      case "100% Compatible": return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
      case "Media": return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200";
      case "Baja": return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  const getDiscountBadge = (discount: number) => {
    if (discount > 0) {
      return (
        <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white">
          {discount}% OFF
        </Badge>
      );
    }
    return null;
  };

  const getTagBadges = (product: Producto) => {
    const tags = [];
    if (product.destacado) tags.push({ label: "Destacado", color: "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700" });
    if (product.mas_vendido) tags.push({ label: "Más Vendido", color: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700" });
    if (product.descuento > 0) tags.push({ label: "Descuento", color: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" });

    return tags.map((tag, index) => (
      <Badge
        key={index}
        className={`absolute ${index === 0 ? 'top-2' : 'top-11'} left-2 z-10 ${tag.color} text-white`}
      >
        {tag.label}
      </Badge>
    ));
  };

  const getStockStatus = (stock: number) => {
    return stock > 0 ? 'Disponible' : 'Agotado';
  };

  const precioFormateado = formatPrice(product.precio_final);
  const precioOriginalFormateado = product.descuento > 0 ? formatPrice(product.precio) : null;

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-gray-800/30 border border-gray-200 dark:border-gray-700 h-full flex flex-col group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 sm:h-40 md:h-48 lg:h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {getTagBadges(product)}
        {getDiscountBadge(product.descuento)}
        
        <img
          src={imageError ? '/images/placeholder-product.png' : product.imagen_principal}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        
        {(isHovered || isMobile) && (
          <div className="absolute top-2 right-2 z-10" style={{ opacity: isMobile ? 1 : undefined }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HeartIcon size={16} className="text-gray-600 dark:text-gray-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agregar a favoritos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 dark:text-white">
            {product.nombre}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={`${getCompatibilityColor(product.compatibility)} text-xs whitespace-nowrap ml-1`}
                >
                  {product.compatibility}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compatibilidad: {product.compatibility}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge 
          variant="secondary" 
          className="mb-2 text-xs dark:bg-gray-700 dark:text-gray-200"
        >
          {product.categoria} / {product.subcategoria}
        </Badge>
        {renderStars(product.calificacion)}
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-lg sm:text-xl font-bold dark:text-white">
              {precioFormateado}
            </p>
            {product.descuento > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                {precioOriginalFormateado}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <TruckIcon size={14} className="text-green-600 dark:text-green-400 mr-1" />
            <span className="text-xs text-green-600 dark:text-green-400">Envío gratis</span>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <CheckCircleIcon 
            size={14} 
            className={product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"} 
          />
          <span className={`text-xs ml-1 ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {getStockStatus(product.stock)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-2">
        <Button 
          className="w-full text-sm dark:bg-primary dark:hover:bg-primary/90"
          disabled={product.stock <= 0}
        >
          <ShoppingCartIcon size={16} className="mr-2" />
          Agregar
        </Button>
        <Button 
          className="w-full text-sm" 
          variant="outline"
          asChild
        >
          <Link href={`/productos/${product.id}`}>
            <PlusIcon size={16} className="mr-2" />
            Ver más detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Resultado: React.FC<ResultadoProps> = ({ 
  year,
  brand,
  model,
  productos,
  categorias,
  subcategorias,
  motoEncontrada,
  motoInfo
}) => {
  const [activeTab, setActiveTab] = useState("todos");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { theme } = useTheme();

  const filteredProducts = productos.filter(product => {
    if (searchQuery && !product.nombre.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedCategory && product.categoria !== categorias.find(c => c.id === selectedCategory)?.nombre) {
      return false;
    }
    
    if (selectedSubcategory && product.subcategoria !== subcategorias[selectedSubcategory]) {
      return false;
    }
    
    if (activeTab !== "todos" && product.categoria !== activeTab) {
      return false;
    }
    
    return true;
  });

  const featuredProducts = productos.filter(p => p.destacado);
  const bestSellingProducts = productos.filter(p => p.mas_vendido);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!year || !brand || !model) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">No hay datos disponibles</h1>
        <p className="text-gray-600 dark:text-gray-400">Por favor, realiza una búsqueda primero.</p>
        <Button 
          className="mt-4" 
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="resultado-page bg-background text-foreground min-h-screen">
      <Header />

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="text-sm"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Volver
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">
            Repuestos para tu Moto
          </h1>
        </div>

        <div className={`${isMobile ? 'mt-4' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
            {!isMobile && (
              <div className="w-full md:w-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">
                  Repuestos para {motoInfo?.marca} {motoInfo?.modelo} ({motoInfo?.year})
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {motoEncontrada 
                    ? `Mostrando ${filteredProducts.length} productos` 
                    : "Mostrando productos generales"}
                </p>
              </div>
            )}

            {isMobile ? (
              <div className="w-full">
                <h1 className="text-xl font-bold mb-2 dark:text-white">
                  Repuestos para {motoInfo?.marca} {motoInfo?.modelo} ({motoInfo?.year})
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
                  {motoEncontrada 
                    ? `${filteredProducts.length} productos` 
                    : "Productos generales"}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant="outline" 
                    className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-xs"
                  >
                    {brand} {model} {year}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1 text-xs"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <FilterIcon size={14} />
                    Filtros
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="w-full md:w-auto bg-gray-50 dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Badge 
                      variant="outline" 
                      className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                    >
                      Tu Vehículo
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 gap-1 dark:hover:bg-gray-700"
                      onClick={() => (window.location.href = "/")}
                    >
                      <FilterIcon size={14} />
                      Cambiar
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Año</p>
                      <p className="font-semibold text-sm sm:text-base dark:text-white">{year}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Marca</p>
                      <p className="font-semibold text-sm sm:text-base dark:text-white">{brand}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Modelo</p>
                      <p className="font-semibold text-sm sm:text-base dark:text-white">{model}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mobile filters dropdown */}
          {isMobile && showMobileFilters && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="mb-3">
                <h3 className="font-medium mb-2 dark:text-white">Categorías</h3>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 text-sm"
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedCategory && (
                <div className="mb-3">
                  <h3 className="font-medium mb-2 dark:text-white">Subcategorías</h3>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 text-sm"
                    value={selectedSubcategory || ""}
                    onChange={(e) => setSelectedSubcategory(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Todas las subcategorías</option>
                    {categorias
                      .find(c => c.id === selectedCategory)
                      ?.subcategorias.map(sub => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="font-medium mb-2 dark:text-white">Precio</h3>
                  <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 text-sm">
                    <option>Todos</option>
                    <option>Menos de S/50</option>
                    <option>S/50 - S/100</option>
                    <option>S/100 - S/200</option>
                    <option>Más de S/200</option>
                  </select>
                </div>
                <div>
                  <h3 className="font-medium mb-2 dark:text-white">Disponibilidad</h3>
                  <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 text-sm">
                    <option>Todos</option>
                    <option>En stock</option>
                    <option>Ofertas</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                >
                  Limpiar
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          )}

          {/* Sección de productos destacados */}
          {featuredProducts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 dark:text-white">Productos Destacados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {featuredProducts.slice(0, 5).map(product => (
                  <ProductCard key={`featured-${product.id}`} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Sección de más vendidos */}
          {bestSellingProducts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 dark:text-white">Los Más Vendidos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {bestSellingProducts.slice(0, 5).map(product => (
                  <ProductCard key={`best-${product.id}`} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Filtros de categorías y subcategorías */}
          {!isMobile && (
            <div className="mb-4 sm:mb-6 bg-background p-4 rounded-lg shadow-sm border border-border">
              <h2 className="text-lg font-semibold mb-3 dark:text-white">Filtrar productos</h2>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setActiveTab("todos");
                  }}
                >
                  Todos los productos
                </Button>
                
                {categorias.map(categoria => (
                  <Button
                    key={categoria.id}
                    variant={selectedCategory === categoria.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(categoria.id);
                      setSelectedSubcategory(null);
                      setActiveTab(categoria.nombre);
                    }}
                  >
                    {categoria.nombre}
                  </Button>
                ))}
              </div>
              
              {selectedCategory && (
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2 dark:text-white">Subcategorías:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!selectedSubcategory ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubcategory(null)}
                    >
                      Todas
                    </Button>
                    {categorias
                      .find(c => c.id === selectedCategory)
                      ?.subcategorias.map(sub => (
                        <Button
                          key={sub.id}
                          variant={selectedSubcategory === sub.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSubcategory(sub.id)}
                        >
                          {sub.nombre}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="my-3 sm:my-4 md:my-6" />

          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 md:mb-6 gap-3 sm:gap-4">
              <div className="flex items-center">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold mr-2 dark:text-white">
                  {selectedCategory 
                    ? `Productos en ${categorias.find(c => c.id === selectedCategory)?.nombre}${selectedSubcategory ? ` > ${subcategorias[selectedSubcategory]}` : ''}`
                    : "Todos los Productos"}
                </h2>
                {motoEncontrada && (
                  <Badge 
                    variant="outline" 
                    className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs"
                  >
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64 md:w-80">
                  <SearchIcon 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
                  />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="pl-9 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm dark:bg-gray-800 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {!isMobile && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <FilterIcon size={16} />
                  </Button>
                )}
              </div>
            </div>

            {isFilterOpen && !isMobile && (
              <Card className="mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Precio</label>
                      <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-1.5 sm:py-2 px-3 bg-white dark:bg-gray-800 focus:border-primary focus:ring focus:ring-primary/30 focus:ring-opacity-50 transition-colors text-sm dark:text-white">
                        <option>Todos los precios</option>
                        <option>Menos de S/50</option>
                        <option>S/50 - S/100</option>
                        <option>S/100 - S/200</option>
                        <option>Más de S/200</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Compatibilidad</label>
                      <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-1.5 sm:py-2 px-3 bg-white dark:bg-gray-800 focus:border-primary focus:ring focus:ring-primary/30 focus:ring-opacity-50 transition-colors text-sm dark:text-white">
                        <option>Todas</option>
                        <option>100% Compatible</option>
                        <option>Media</option>
                        <option>Baja</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Disponibilidad</label>
                      <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm py-1.5 sm:py-2 px-3 bg-white dark:bg-gray-800 focus:border-primary focus:ring focus:ring-primary/30 focus:ring-opacity-50 transition-colors text-sm dark:text-white">
                        <option>Todos</option>
                        <option>En stock</option>
                        <option>Ofertas</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 sm:mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2 text-xs sm:text-sm"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Limpiar
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs sm:text-sm"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Aplicar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Listado de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border">
                  <InfoIcon 
                    size={48} 
                    className="mx-auto text-gray-400 dark:text-gray-500 mb-4" 
                  />
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">No se encontraron productos</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery
                      ? `No hay resultados para "${searchQuery}"`
                      : "No hay productos con los filtros seleccionados"}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                      setSearchQuery("");
                      setActiveTab("todos");
                    }}
                  >
                    Mostrar todos los productos
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20 mb-4 sm:mb-6 md:mb-8">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 dark:text-white">
                    ¿No encuentras lo que buscas?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                    {motoEncontrada
                      ? `Contamos con más repuestos para tu ${brand} ${model} ${year}. Contáctanos.`
                      : "Contáctanos y te ayudaremos a encontrar lo que necesitas."}
                  </p>
                  <Button className="w-full md:w-auto gap-2 text-sm">
                    <PhoneIcon size={16} />
                    Contactar a un especialista
                  </Button>
                </div>
                <div className="hidden md:flex w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-primary/20 dark:bg-primary/30 rounded-full items-center justify-center">
                  <PhoneIcon size={24} className="text-primary dark:text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resultado;