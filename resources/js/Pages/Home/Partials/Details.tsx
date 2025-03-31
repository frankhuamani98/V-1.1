import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Home, Star, Tag, Siren as Fire, Truck, Shield, ArrowLeft, ArrowRight, Package, RefreshCw, CreditCard, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { HeartIcon, StarIcon } from "lucide-react";
import { toast } from "sonner";
import RelatedProductsCarousel from './RelatedProductsCarousel';
import Header from '../Header';
import Footer from '../Footer';

function App() {
  const [selectedColor, setSelectedColor] = useState('Negro');
  const [currentImage, setCurrentImage] = useState('https://images.unsplash.com/photo-1520970014086-2208d157c9e2');
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>("descripcion");
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const productImages = [
    'https://images.unsplash.com/photo-1520970014086-2208d157c9e2',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
    'https://images.unsplash.com/photo-1553062407151-7111542de6e8'
  ];

  const especificaciones = [
    { nombre: "Material", valor: "Acero O-Ring Militar" },
    { nombre: "Longitud", valor: "120 eslabones" },
    { nombre: "Resistencia", valor: "8,500 lbs" },
    { nombre: "Peso", valor: "1.2 kg" },
    { nombre: "Compatibilidad", valor: "Modelos 2018-2023" },
    { nombre: "Garantía", valor: "3 años" },
    { nombre: "Origen", valor: "Importado" },
    { nombre: "Certificaciones", valor: "ISO 9001, CE" }
  ];

  const opcionesEnvio = [
    { tipo: "Estándar", tiempo: "3-5 días hábiles", costo: "Gratis" },
    { tipo: "Express", tiempo: "1-2 días hábiles", costo: "$9.99" },
    { tipo: "Internacional", tiempo: "7-14 días hábiles", costo: "$29.99" }
  ];

  const relatedProducts = [
    {
      id: 1,
      name: "Cadena Transmisión Sport Series",
      description: "Cadena de transmisión ligera para motocicletas deportivas de media cilindrada",
      price: "$69.99",
      originalPrice: "$89.99",
      rating: 4.5,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1558981852-426c6c22a060",
      tag: "Oferta, Nuevo",
      stock: 25
    },
    {
      id: 2,
      name: "Kit de Piñones Premium",
      description: "Kit completo de piñones delantero y trasero compatibles con cadenas Elite",
      price: "$129.99",
      originalPrice: "$149.99",
      rating: 4.7,
      reviews: 56,
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc",
      tag: "Más Vendido",
      stock: 8
    },
    {
      id: 3,
      name: "Lubricante Especial Cadenas",
      description: "Lubricante de alto rendimiento para cadenas de transmisión con O-Ring",
      price: "$24.99",
      originalPrice: "$24.99",
      rating: 4.9,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1581299894341-367e6517569c",
      tag: "Recomendado",
      stock: 42
    },
    {
      id: 4,
      name: "Tensor de Cadena Automático",
      description: "Tensor automático para mantener la tensión óptima de la cadena en todo momento",
      price: "$59.99",
      originalPrice: "$79.99",
      rating: 4.3,
      reviews: 34,
      image: "https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1",
      tag: "Oferta, Limitado",
      stock: 3
    }
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleImageChange = (image: string) => {
    setCurrentImage(image);
  };

  const handleAddToCart = () => {
    toast.success("Producto añadido al carrito", {
      description: `Cadena Transmisión Elite Pro Series (${selectedColor}) x${quantity} ha sido añadido a tu carrito.`,
      duration: 3000,
    });
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
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
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(124 reseñas)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col text-gray-900 dark:text-gray-100">
      <Header  />
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
              <a href="/categorias" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">Categorías</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <a href="/categorias/motos" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">Repuestos para Motos</a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium text-sm truncate max-w-[200px]">
                Cadena Transmisión Elite Pro Series
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="product-container bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <Badge className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 px-3 py-1 text-sm">
                  -30% OFF
                </Badge>
                <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 px-3 py-1 text-sm">
                  <Fire className="w-3.5 h-3.5 mr-1" /> Más Vendido
                </Badge>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-900"
                  onClick={() => toast.success("Añadido a favoritos")}
                >
                  <HeartIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </div>
              <img
                src={currentImage}
                className="w-full main-image object-cover h-[300px] md:h-[500px] transition-opacity duration-150"
                alt="Cadena de transmisión elite"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
              {productImages.map((image, index) => (
                <div key={index} className="col-span-1">
                  <img
                    src={image}
                    className={`thumbnail w-full h-[80px] md:h-[120px] object-cover rounded-lg cursor-pointer transition-all duration-300 ${currentImage === image ? 'border-2 border-gray-800 dark:border-gray-200' : 'border-2 border-transparent'}`}
                    alt={`Vista ${index + 1}`}
                    onClick={() => handleImageChange(image)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-start justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">Cadena Transmisión Elite Pro Series</h1>
                <Badge variant="outline" className="mt-1 md:mt-0 dark:border-gray-600">
                  <Package className="w-3.5 h-3.5 mr-1" /> En Stock
                </Badge>
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-3">Código: CT-2023-PRO</p>

              {renderRating(4.8)}

              <div className="mt-4 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$89.99</span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">$129.99</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 ml-2">
                    Ahorra $40.00
                  </Badge>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  ¡Oferta por tiempo limitado!
                </p>
              </div>

              <Separator className="my-4 dark:bg-gray-700" />

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Cadena de transmisión de alta resistencia diseñada para motocicletas de alto rendimiento.
                  Fabricada con materiales premium para garantizar durabilidad y rendimiento óptimo en
                  condiciones extremas.
                </p>
              </div>

              <div className="mb-5">
                <h5 className="font-medium mb-3">Color:</h5>
                <div className="flex color-selector gap-4 items-center">
                  <div className="text-center">
                    <div
                      className={`color-option bg-black w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === 'Negro' ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-200 dark:ring-offset-gray-800' : ''}`}
                      onClick={() => handleColorSelect('Negro')}
                    ></div>
                    <small className="block mt-1">Negro</small>
                  </div>
                  <div className="text-center">
                    <div
                      className={`color-option bg-[#C0C0C0] w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === 'Plateado' ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-200 dark:ring-offset-gray-800' : ''}`}
                      onClick={() => handleColorSelect('Plateado')}
                    ></div>
                    <small className="block mt-1">Plateado</small>
                  </div>
                  <div className="text-center">
                    <div
                      className={`color-option bg-[#FFD700] w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === 'Dorado' ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-200 dark:ring-offset-gray-800' : ''}`}
                      onClick={() => handleColorSelect('Dorado')}
                    ></div>
                    <small className="block mt-1">Dorado</small>
                  </div>
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
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-10 text-center border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      min="1"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10 dark:border-gray-700"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                    15 disponibles
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
                  variant="secondary"
                  className="w-full py-6 text-base"
                  onClick={() => toast.success("¡Compra ahora!")}
                >
                  <CreditCard className="mr-2 w-5 h-5" />
                  Comprar ahora
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Truck className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Envío gratis</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">En pedidos superiores a $50</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Devolución gratuita</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">30 días de garantía</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Garantía de 3 años</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Contra defectos de fabricación</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Pago seguro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Múltiples métodos de pago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block mb-8">
          <Tabs defaultValue="descripcion" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
              <TabsTrigger value="envio">Envío</TabsTrigger>
              <TabsTrigger value="opiniones">Opiniones</TabsTrigger>
            </TabsList>
            <TabsContent value="descripcion" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-2">
              <h3 className="text-xl font-bold mb-4">Descripción del Producto</h3>
              <div className="space-y-4">
                <p>
                  La Cadena de Transmisión Elite Pro Series está diseñada para ofrecer un rendimiento excepcional en motocicletas de alta potencia. Fabricada con acero O-Ring de grado militar, esta cadena proporciona una resistencia superior y una durabilidad inigualable incluso en las condiciones más exigentes.
                </p>
                <p>
                  Cada eslabón está tratado térmicamente para aumentar su resistencia al desgaste y a la corrosión, lo que garantiza una vida útil prolongada. Los sellos O-Ring mantienen la lubricación interna, reduciendo el mantenimiento necesario y mejorando el rendimiento general.
                </p>
                <p>
                  La Elite Pro Series es compatible con una amplia gama de motocicletas deportivas y de alto rendimiento, ofreciendo una transmisión de potencia suave y eficiente. Su diseño de precisión reduce el ruido y las vibraciones, proporcionando una experiencia de conducción más agradable.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                      Durabilidad Superior
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Fabricada con materiales de la más alta calidad para resistir condiciones extremas y uso intensivo.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                      Mantenimiento Reducido
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Los sellos O-Ring retienen la lubricación, reduciendo la frecuencia de mantenimiento necesario.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                      Rendimiento Óptimo
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Transmisión de potencia eficiente con mínima pérdida de energía para un mejor rendimiento.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                      Compatibilidad Universal
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Diseñada para adaptarse a una amplia gama de modelos de motocicletas de alto rendimiento.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="especificaciones" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-2">
              <h3 className="text-xl font-bold mb-4">Especificaciones Técnicas</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {especificaciones.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                        <td className="py-3 px-4 font-medium">{spec.nombre}</td>
                        <td className="py-3 px-4">{spec.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold mb-2">Nota importante:</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Para un rendimiento óptimo, se recomienda la instalación profesional y el uso de lubricantes específicos para cadenas de transmisión O-Ring.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="envio" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-2">
              <h3 className="text-xl font-bold mb-4">Información de Envío</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="py-3 px-4 text-left">Tipo de Envío</th>
                      <th className="py-3 px-4 text-left">Tiempo Estimado</th>
                      <th className="py-3 px-4 text-left">Costo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opcionesEnvio.map((opcion, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                        <td className="py-3 px-4 font-medium">{opcion.tipo}</td>
                        <td className="py-3 px-4">{opcion.tiempo}</td>
                        <td className="py-3 px-4">{opcion.costo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                    Política de Envío
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Los pedidos se procesan y envían dentro de las 24 horas hábiles siguientes a la confirmación del pago. Los tiempos de entrega pueden variar según la ubicación y el método de envío seleccionado.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <RefreshCw className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                    Política de Devoluciones
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto. El artículo debe estar en su embalaje original y en condiciones no utilizadas para ser elegible para un reembolso completo.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="opiniones" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mt-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Opiniones de Clientes</h3>
                <Button onClick={() => toast.info("Función para escribir reseña")}>
                  Escribir una reseña
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold">4.8</div>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${i < 5 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Basado en 124 reseñas</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm w-8">5 ★</span>
                      <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm w-8 text-right">85%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-8">4 ★</span>
                      <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm w-8 text-right">10%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-8">3 ★</span>
                      <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full rounded-full" style={{ width: '3%' }}></div>
                      </div>
                      <span className="text-sm w-8 text-right">3%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-8">2 ★</span>
                      <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full rounded-full" style={{ width: '1%' }}></div>
                      </div>
                      <span className="text-sm w-8 text-right">1%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-8">1 ★</span>
                      <div className="flex-1 mx-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full rounded-full" style={{ width: '1%' }}></div>
                      </div>
                      <span className="text-sm w-8 text-right">1%</span>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div className="border-b dark:border-gray-700 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Carlos M.</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${i < 5 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                                strokeWidth={1.5}
                              />
                            ))}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Hace 2 semanas</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="dark:border-gray-600">Compra verificada</Badge>
                      </div>
                      <p className="text-sm">
                        Excelente cadena de transmisión. La instalé en mi moto deportiva y el rendimiento ha mejorado notablemente. Muy silenciosa y la calidad es evidente. Recomendada 100%.
                      </p>
                    </div>

                    <div className="border-b dark:border-gray-700 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Laura T.</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                                strokeWidth={1.5}
                              />
                            ))}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Hace 1 mes</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="dark:border-gray-600">Compra verificada</Badge>
                      </div>
                      <p className="text-sm">
                        Muy buena relación calidad-precio. La cadena es robusta y se nota que durará mucho tiempo. El envío fue rápido y llegó bien empaquetada.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Miguel A.</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${i < 5 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                                strokeWidth={1.5}
                              />
                            ))}
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Hace 2 meses</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="dark:border-gray-600">Compra verificada</Badge>
                      </div>
                      <p className="text-sm">
                        Segunda vez que compro esta cadena. La anterior me duró más de 2 años con uso intensivo. Calidad superior a otras marcas que he probado. El color dorado se ve espectacular en mi moto.
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4 dark:border-gray-700">
                    Ver todas las reseñas
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:hidden mb-8">
          <div className="space-y-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex justify-between items-center"
                onClick={() => toggleSection('descripcion')}
              >
                <h3 className="font-semibold">Descripción</h3>
                {expandedSection === 'descripcion' ?
                  <ChevronUp className="w-5 h-5" /> :
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              {expandedSection === 'descripcion' && (
                <div className="p-4 pt-0 border-t dark:border-gray-700">
                  <div className="space-y-3">
                    <p className="text-sm">
                      La Cadena de Transmisión Elite Pro Series está diseñada para ofrecer un rendimiento excepcional en motocicletas de alta potencia. Fabricada con acero O-Ring de grado militar, esta cadena proporciona una resistencia superior y una durabilidad inigualable.
                    </p>
                    <p className="text-sm">
                      Cada eslabón está tratado térmicamente para aumentar su resistencia al desgaste y a la corrosión, lo que garantiza una vida útil prolongada.
                    </p>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-1 flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-300" />
                          Durabilidad Superior
                        </h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          Fabricada con materiales de la más alta calidad para resistir condiciones extremas.
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-1 flex items-center">
                          <Star className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-300" />
                          Rendimiento Óptimo
                        </h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          Transmisión de potencia eficiente con mínima pérdida de energía.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex justify-between items-center"
                onClick={() => toggleSection('especificaciones')}
              >
                <h3 className="font-semibold">Especificaciones</h3>
                {expandedSection === 'especificaciones' ?
                  <ChevronUp className="w-5 h-5" /> :
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              {expandedSection === 'especificaciones' && (
                <div className="p-4 pt-0 border-t dark:border-gray-700">
                  <div className="space-y-2">
                    {especificaciones.map((spec, index) => (
                      <div key={index} className={`p-2 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'} rounded`}>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{spec.nombre}:</span>
                          <span className="text-sm">{spec.valor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex justify-between items-center"
                onClick={() => toggleSection('envio')}
              >
                <h3 className="font-semibold">Envío</h3>
                {expandedSection === 'envio' ?
                  <ChevronUp className="w-5 h-5" /> :
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              {expandedSection === 'envio' && (
                <div className="p-4 pt-0 border-t dark:border-gray-700">
                  <div className="space-y-3">
                    {opcionesEnvio.map((opcion, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h4 className="font-medium text-sm">{opcion.tipo}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{opcion.tiempo}</span>
                          <span className="text-xs font-medium">{opcion.costo}</span>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-3">
                      <h4 className="font-medium text-sm flex items-center">
                        <RefreshCw className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-300" />
                        Devoluciones
                      </h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                        30 días para devoluciones. El producto debe estar sin usar y en su embalaje original.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex justify-between items-center"
                onClick={() => toggleSection('opiniones')}
              >
                <h3 className="font-semibold">Opiniones</h3>
                {expandedSection === 'opiniones' ?
                  <ChevronUp className="w-5 h-5" /> :
                  <ChevronDown className="w-5 h-5" />
                }
              </button>
              {expandedSection === 'opiniones' && (
                <div className="p-4 pt-0 border-t dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-2">4.8</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < 5 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">124 reseñas</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">Carlos M.</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-3 h-3 ${i < 5 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs mt-1">
                        Excelente cadena de transmisión. La instalé en mi moto deportiva y el rendimiento ha mejorado notablemente...
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">Laura T.</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-3 h-3 ${i < 4 ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs mt-1">
                        Muy buena relación calidad-precio. La cadena es robusta y se nota que durará mucho tiempo...
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs dark:border-gray-700">
                      Ver todas las reseñas
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <RelatedProductsCarousel products={relatedProducts} isMobile={isMobile} />
      </div>
      <Footer />
    </div>
  );
}

export default App;