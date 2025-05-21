import React, { useState, useEffect, ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  ShoppingCartIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  BellIcon,
  ShoppingBagIcon,
  LogInIcon,
  SettingsIcon,
  HelpCircleIcon,
  GlobeIcon,
  SunIcon,
  MoonIcon,
  ChevronRightIcon,
  TrashIcon,
  PackageIcon,
  ArrowRightIcon,
  WrenchIcon,
  CalendarIcon,
  PhoneIcon as Phone,
  MapPin,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/Components/ui/sheet";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import "../../../css/app.css";
import { toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
import { ProfileModal } from "@/Components/Modals/ProfileModal";

interface CartItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  precio_final: number;
  descuento: number;
  quantity: number;
  imagen?: string;
}

interface FavoriteItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  precio_final: number;
  descuento?: number;
  imagen?: string;
}

const formatPrice = (price: number): string => {
  const formattedPrice = price.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedPrice.replace("PEN", "S/");
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const CartItem = ({
  product,
  onRemove,
}: {
  product: CartItem;
  onRemove: (id: number) => void;
}) => {
  const subtotal = product.precio_final * product.quantity;
  
  return (
    <div className="group flex items-start py-3 gap-3 rounded-lg transition-all duration-200 hover:bg-accent/30">
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border border-border shadow-sm transition-transform duration-200 group-hover:scale-105">
        {product.imagen ? (
          <img 
            src={product.imagen.startsWith('http') ? product.imagen : `/storage/${product.imagen}`} 
            alt={product.nombre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.nombre}</h4>
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-background/80">
            {product.quantity}
          </Badge>
          <span className="mx-1 text-xs text-muted-foreground">x</span>
          <span className="text-sm font-medium">
            {formatPrice(product.precio_final)}
          </span>
          {product.descuento > 0 && (
            <>
              <span className="ml-2 text-xs line-through text-muted-foreground">{formatPrice(product.precio)}</span>
              <Badge variant="destructive" className="ml-1 text-[10px] h-4 px-1">
                -{product.descuento}%
              </Badge>
            </>
          )}
        </div>
        <div className="mt-1 text-sm font-medium">
          <span className="text-muted-foreground text-xs">Subtotal:</span> <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
        onClick={() => onRemove(product.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

const FavoriteItem = ({
  product,
  onRemove,
  onAddToCart,
}: {
  product: FavoriteItem;
  onRemove: (id: number) => void;
  onAddToCart: (product: FavoriteItem) => void;
}) => {
  const getDisplayPrice = () => {
    if (product.descuento && product.descuento > 0) {
      return (
        <div className="flex items-center">
          <span className="font-medium">{formatPrice(product.precio_final)}</span>
          <span className="ml-2 text-xs text-muted-foreground line-through">{formatPrice(product.precio)}</span>
          <Badge variant="destructive" className="ml-1 text-[10px] h-4 px-1">
            -{product.descuento}%
          </Badge>
        </div>
      );
    }
    return <span className="font-medium">{formatPrice(product.precio_final || product.precio)}</span>;
  };

  return (
    <div className="group flex items-start py-3 gap-3 rounded-lg transition-all duration-200 hover:bg-accent/30">
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border border-border shadow-sm transition-transform duration-200 group-hover:scale-105">
        {product.imagen ? (
          <img 
            src={product.imagen.startsWith('http') ? product.imagen : `/storage/${product.imagen}`}
            alt={product.nombre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.nombre}</h4>
        <div className="flex items-center mt-1 text-sm">
          {getDisplayPrice()}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 h-8 text-xs font-medium bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary border-primary/20 transition-all duration-200 group-hover:translate-y-[-2px]"
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCartIcon className="h-3 w-3 mr-1" />
          Añadir al carrito
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
        onClick={() => onRemove(product.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Header() {
  const { auth: { user }, categoriasMenu = [], categoriasServicio = [], servicios = [] } = usePage<{ 
    auth: { user: { id: number; name: string; first_name: string; last_name: string; email: string, username: string, dni: string, phone: string, address: string, sexo: string } },
    categoriasServicio: Array<{ id: number; nombre: string }>,
    servicios: Array<{ id: number; nombre: string; categoria_id: number }>
  }>().props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isFavoritesSheetOpen, setIsFavoritesSheetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchFavoriteItems();
    }
  }, [user]);

  const fetchCartItems = () => {
    if (user) {
      axios.get('/cart')
        .then(response => {
          if (response.data.success) {
            setCart(response.data.data || []);
          }
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
        });
    }
  };

  const fetchFavoriteItems = () => {
    if (user) {
      axios.get('/favorites')
        .then(response => {
          if (response.data.success) {
            setFavorites(response.data.data || []);
          }
        })
        .catch(error => {
          console.error('Error fetching favorite items:', error);
        });
    }
  };

  const handleAddToCart = (event: CustomEvent) => {
    const product = event.detail;
    const productId = product.producto_id || product.id;
    
    axios.post('/cart/add', {
      producto_id: productId,
      quantity: 1
    })
    .then(response => {
      if (response.data.success) {
        fetchCartItems();
        toast.success("Producto añadido al carrito", {
          duration: 3000,
        });
      } else if (response.data.message?.includes("ya está en el carrito")) {
        toast.info("Producto ya en el carrito", {
          description: `${product.nombre || 'Este producto'} ya está en tu carrito.`,
          duration: 3000,
        });
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      
      if (error.response?.data?.message?.includes("ya está en el carrito")) {
        toast.info("Producto ya en el carrito", {
          description: `${product.nombre || 'Este producto'} ya está en tu carrito.`,
          duration: 3000,
        });
        return;
      }
      
      if (error.response?.data?.message?.includes("stock disponible")) {
        toast.error("Stock insuficiente", {
          description: "No hay suficiente stock disponible para este producto.",
          duration: 3000,
        });
        return;
      }
      
      toast.error("Error al añadir al carrito", {
        duration: 3000,
      });
    });
  };

  const handleAddToFavorites = (event: CustomEvent) => {
    const product = event.detail;
    const productId = product.producto_id || product.id;
    
    axios.post('/favorites/add', {
      producto_id: productId
    })
    .then(response => {
      if (response.data.success) {
        fetchFavoriteItems();
        toast.success("Producto añadido a favoritos", {
          duration: 3000,
        });
      } else if (response.data.message?.includes("ya está en favoritos")) {
        toast.info("Producto ya en favoritos", {
          description: `${product.nombre || 'Este producto'} ya está en tus favoritos.`,
          duration: 3000,
        });
      }
    })
    .catch(error => {
      console.error('Error adding to favorites:', error);
      
      if (error.response?.data?.message?.includes("ya está en favoritos")) {
        toast.info("Producto ya en favoritos", {
          description: `${product.nombre || 'Este producto'} ya está en tus favoritos.`,
          duration: 3000,
        });
        return;
      }
      
      toast.error("Error al añadir a favoritos", {
        duration: 3000,
      });
    });
  };

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartItems();
    };

    const handleFavoritesUpdated = () => {
      fetchFavoriteItems();
    };

    window.addEventListener('cart-updated', handleCartUpdated);
    window.addEventListener('favorites-updated', handleFavoritesUpdated);
    window.addEventListener('add-to-cart', handleAddToCart as EventListener);
    window.addEventListener('add-to-favorites', handleAddToFavorites as EventListener);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdated);
      window.removeEventListener('favorites-updated', handleFavoritesUpdated);
      window.removeEventListener('add-to-cart', handleAddToCart as EventListener);
      window.removeEventListener('add-to-favorites', handleAddToFavorites as EventListener);
    };
  }, [user]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const cartCount = cart.length;
  const favoritesCount = favorites.length;
  const cartTotal = cart.reduce(
    (total, item) => total + item.precio_final * item.quantity,
    0
  );
  
  const removeFromCart = (id: number) => {
    axios.delete(`/cart/${id}`)
      .then(response => {
        if (response.data.success) {
          fetchCartItems();
          toast.success("Producto eliminado del carrito", {
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.error('Error removing from cart:', error);
        toast.error("Error al eliminar del carrito", {
          duration: 3000,
        });
      });
  };

  const removeFromFavorites = (id: number) => {
    axios.delete(`/favorites/${id}`)
      .then(response => {
        if (response.data.success) {
          fetchFavoriteItems();
          toast.success("Producto eliminado de favoritos", {
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.error('Error removing from favorites:', error);
        toast.error("Error al eliminar de favoritos", {
          duration: 3000,
        });
      });
  };

  const addToCartFromFavorites = (product: FavoriteItem) => {
    const productId = product.producto_id;
    
    axios.post('/cart/add', {
      producto_id: productId,
      quantity: 1
    })
    .then(response => {
      if (response.data.success) {
        if (response.data.message === "Product already in cart" || 
            response.data.message === "El producto ya está en el carrito") {
          toast.info("Producto ya en el carrito", {
            description: `${product.nombre} ya está en tu carrito.`,
            duration: 3000,
          });
        } else {
          fetchCartItems();
          toast.success("Añadido al carrito", {
            description: `${product.nombre} ha sido añadido a tu carrito.`,
            duration: 3000,
          });
        }
      } else if (response.data.message === "Product already in cart" || 
                 response.data.message === "El producto ya está en el carrito") {
        toast.info("Producto ya en el carrito", {
          description: `${product.nombre} ya está en tu carrito.`,
          duration: 3000,
        });
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      
      if (error.response) {
        const { data } = error.response;
        if (data && data.message) {
          toast.error(data.message, {
            duration: 3000,
          });
        } else if (error.response.status === 422) {
          toast.error('No se pudo añadir el producto (error de validación)', {
            duration: 3000,
          });
        } else if (error.response.status === 404) {
          toast.error('El producto no está disponible actualmente', {
            duration: 3000,
          });
        } else if (error.response.status === 400) {
          toast.error('No hay suficiente stock disponible', {
            duration: 3000,
          });
        } else {
          toast.error(`Error al añadir al carrito: ${error.response.status}`, {
            duration: 3000,
          });
        }
      } else if (error.request) {
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión', {
          duration: 3000,
        });
      } else {
        toast.error("Error al añadir al carrito", {
          duration: 3000,
        });
      }
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const serviceCategory = {
    title: "Servicios",
    href: "/servicios",
    description: "Ofrecemos una amplia gama de servicios para tu motocicleta",
    icon: <WrenchIcon className="mr-2 h-4 w-4" />,
    subcategories: [
      ...(Array.isArray(categoriasServicio) 
        ? categoriasServicio
            .slice(0, 4)
            .map(categoria => ({
              name: categoria.nombre,
              href: `/catalogo-servicios/categoria/${categoria.id}`,
            }))
        : []),
      { name: "Ver todos los servicios", href: "/catalogo-servicios" }
    ]
  };

  const fixedCategories = [
    {
      title: "Reservas",
      href: "/reservas",
      description: "Solicita una cita para tu moto",
      icon: <CalendarIcon className="mr-2 h-4 w-4" />,
      subcategories: [
        { name: "Agendar Servicio", href: "/reservas/agendar" },
        { name: "Mis Citas", href: "/reservas" },
        { name: "Servicios Disponibles", href: "/reservas/servicios-disponibles" },
        { name: "Horarios de Atención", href: "/reservas/horarios-atencion" }
      ],
    },      
    {
      title: "Contactos",
      href: "/contacto",
      description: "Ponte en contacto con nosotros para cualquier consulta",
      icon: <Phone className="mr-2 h-4 w-4" />,
      subcategories: [
        { name: "Ubicación", href: "/contacto/ubicacion" },
        { name: "Contáctanos", href: "/contacto/contactanos" },
        { name: "Redes Sociales", href: "/contacto/redes-sociales" },
      ],
    },
  ];

  interface Subcategory {
    name: string;
    href: string;
  }

  interface Category {
    title: string;
    href: string;
    description: string;
    icon: ReactNode;
    subcategories: Subcategory[];
  }

  const productosCategory: Category = {
    title: "Categorías",
    href: "/categorias",
    description: "Explora nuestros productos y accesorios para motos",
    icon: <PackageIcon className="mr-2 h-4 w-4" />,
    subcategories: [
      ...(Array.isArray(categoriasMenu)
        ? categoriasMenu
            .slice(0, 4)
            .map((categoria: { nombre: string; id: number }) => ({
              name: categoria.nombre,
              href: `/categorias/${categoria.id}`,
            }))
        : []),
      { name: "Ver todas las categorías", href: "/categorias" }
    ]
  };

  const allCategories = [productosCategory, serviceCategory, ...fixedCategories];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const scrollingDown = currentScrollY > lastScrollY;

      setIsScrolled(currentScrollY > 50);

      if (scrollingDown && currentScrollY > 120) {
        setIsVisible(false);
      } else if (!scrollingDown && currentScrollY < 80) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let timeoutId: number | null = null;
    const throttledScroll = () => {
      if (timeoutId === null) {
        timeoutId = window.setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b" : "bg-background"
        )}
      >
        <div className="w-full max-w-[2000px] mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <SheetDescription className="sr-only">
                    Menú principal de navegación del sitio
                  </SheetDescription>
                  <div className="flex justify-center mb-4">
                    <Link href="/" className="h-12">
                      <img src="/logo.png" alt="Rudolf Motors Logo" className="h-14" />
                    </Link>
                  </div>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    {allCategories.map((category) => (
                      <div key={category.title} className="space-y-2">
                        <div className="flex items-center font-medium text-lg">
                          {category.icon}
                          <span>{category.title}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2 pl-2">
                          {category.subcategories.map((subcategory) => (
                            <a
                              key={subcategory.name}
                              href={subcategory.href}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                              {subcategory.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <a href="#" className="flex items-center py-2 text-foreground hover:text-primary transition-colors">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Cuenta</span>
                    </a>
                    <button
                      className="w-full flex items-center py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsFavoritesSheetOpen(true)}
                    >
                      <HeartIcon className="mr-2 h-4 w-4" />
                      <span>Favoritos</span>
                      {favoritesCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {favoritesCount}
                        </Badge>
                      )}
                    </button>
                    <button
                      className="w-full flex items-center py-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsCartSheetOpen(true)}
                    >
                      <ShoppingBagIcon className="mr-2 h-4 w-4" />
                      <span>Carrito</span>
                      {cartCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {cartCount}
                        </Badge>
                      )}
                    </button>
                    <a href="#" className="flex items-center py-2 text-foreground hover:text-primary transition-colors">
                      <HelpCircleIcon className="mr-2 h-4 w-4" />
                      <span>Ayuda</span>
                    </a>
                  </div>
                </div>
                <SheetFooter>
                  <Button className="w-full" asChild>
                    <a href={isAuthenticated ? "/logout" : "/login"}>
                      {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
                    </a>
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center justify-center">
              <Link href="/" className="h-12">
                <img src="/logo.png" alt="Rudolf Motors Logo" className="h-14" />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  {allCategories.map((category) => (
                    <NavigationMenuItem key={category.title}>
                      <NavigationMenuTrigger className="flex items-center">
                        {category.icon}
                        <span>{category.title}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                          <div className="col-span-2">
                            <div className="mb-2 text-lg font-medium">{category.title}</div>
                            <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {category.subcategories.map((subcategory) => (
                                <a
                                  key={subcategory.name}
                                  href={subcategory.href}
                                  className="text-sm hover:underline py-1"
                                >
                                  {subcategory.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "hidden md:block transition-all duration-300 overflow-hidden",
                  isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                )}
              >
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="pl-9 h-9 w-full"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="h-9 w-9"
              >
                {isSearchOpen ? <XIcon className="h-4 w-4" /> : <SearchIcon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              >
                {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </Button>

              <div className="hidden md:block">
                <DropdownMenu open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 relative hover:bg-primary/10 transition-colors duration-200"
                    >
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: favoritesCount > 0 ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HeartIcon className="h-4 w-4" />
                      </motion.div>
                      {favoritesCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] shadow-sm border border-background animate-in fade-in duration-300"
                        >
                          {favoritesCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-96 p-0 overflow-hidden shadow-lg border-border/40 backdrop-blur-sm bg-background/95"
                    sideOffset={8}
                  >
                    <div className="bg-gradient-to-r from-rose-500/5 to-rose-500/10 p-4">
                      <div className="flex items-center justify-between">
                        <DropdownMenuLabel className="p-0 text-base flex items-center gap-2">
                          <HeartIcon className="h-4 w-4 text-rose-500" />
                          Mis Favoritos
                          {favoritesCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              {favoritesCount} {favoritesCount === 1 ? 'item' : 'items'}
                            </Badge>
                          )}
                        </DropdownMenuLabel>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-full" 
                          onClick={() => setIsFavoritesOpen(false)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20">
                      {favorites.length > 0 ? (
                        favorites.map((product) => (
                          <div key={product.id} className="mb-2 last:mb-0">
                            <FavoriteItem 
                              product={product} 
                              onRemove={removeFromFavorites} 
                              onAddToCart={addToCartFromFavorites} 
                            />
                            {/* No separator needed with the new design */}
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-rose-500/5 flex items-center justify-center mb-3">
                              <HeartIcon className="h-8 w-8 text-rose-500/40" />
                            </div>
                            <h3 className="text-base font-medium mb-1">No tienes favoritos</h3>
                            <p className="text-sm text-muted-foreground max-w-[200px]">Guarda productos para verlos más tarde</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {favorites.length > 0 && (
                      <div className="p-4 bg-muted/30 border-t">
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            className="w-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 border-rose-200 hover:text-rose-700"
                            onClick={() => {
                              const itemsToAdd = favorites.filter(item => 
                                !cart.some(cartItem => cartItem.producto_id === item.producto_id)
                              );
                              
                              if (itemsToAdd.length === 0) {
                                toast.info("Todos los favoritos ya están en el carrito", {
                                  duration: 3000,
                                });
                                return;
                              }
                              
                              itemsToAdd.forEach(item => {
                                const event = new CustomEvent('add-to-cart', { detail: {...item, quantity: 1} });
                                window.dispatchEvent(event);
                              });
                              
                              toast.success(`${itemsToAdd.length} producto(s) añadido(s) al carrito`, {
                                duration: 3000,
                              });
                              setIsFavoritesOpen(false);
                            }}
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-2" />
                            Agregar Todo al Carrito
                          </Button>
                          <Button asChild className="w-full bg-white text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg group hover:bg-gray-50 transition-all duration-200">
                            <a href="/favorites" className="flex items-center justify-center gap-1.5 py-1.5">
                              <HeartIcon className="h-4 w-4 text-rose-400 group-hover:text-rose-500 transition-colors duration-200" />
                              <span className="font-medium group-hover:text-gray-900 transition-colors duration-200">Ver todos los favoritos</span>
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="hidden md:block">
                <DropdownMenu open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 relative hover:bg-primary/10 transition-colors duration-200"
                    >
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: cartCount > 0 ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                      </motion.div>
                      {cartCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] shadow-sm border border-background animate-in fade-in duration-300"
                        >
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-96 p-0 overflow-hidden shadow-lg border-border/40 backdrop-blur-sm bg-background/95"
                    sideOffset={8}
                  >
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                      <div className="flex items-center justify-between">
                        <DropdownMenuLabel className="p-0 text-base flex items-center gap-2">
                          <ShoppingCartIcon className="h-4 w-4" />
                          Mi Carrito
                          {cartCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              {cartCount} {cartCount === 1 ? 'item' : 'items'}
                            </Badge>
                          )}
                        </DropdownMenuLabel>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-full" 
                          onClick={() => setIsCartOpen(false)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20">
                      {cart.length > 0 ? (
                        cart.map((product) => (
                          <div key={product.id} className="mb-2 last:mb-0">
                            <CartItem product={product} onRemove={removeFromCart} />
                            {/* No separator needed with the new design */}
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-3">
                              <ShoppingBagIcon className="h-8 w-8 text-primary/40" />
                            </div>
                            <h3 className="text-base font-medium mb-1">Tu carrito está vacío</h3>
                            <p className="text-sm text-muted-foreground max-w-[200px]">Añade productos a tu carrito para comenzar a comprar</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {cart.length > 0 && (
                      <div className="p-4 bg-muted/30 border-t">
                        <div className="flex justify-between mb-3">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button asChild className="w-full bg-white text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg group hover:bg-gray-50 transition-all duration-200">
                            <a href="/cart" className="flex items-center justify-center gap-1.5 py-1.5">
                              <ShoppingBagIcon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-200" />
                              <span className="font-medium group-hover:text-gray-900 transition-colors duration-200">Ver Carrito</span>
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative md:hidden hover:bg-primary/10 transition-colors duration-200"
                onClick={() => setIsCartSheetOpen(true)}
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: cartCount > 0 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                </motion.div>
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] shadow-sm border border-background animate-in fade-in duration-300"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative md:hidden hover:bg-primary/10 transition-colors duration-200"
                onClick={() => setIsFavoritesSheetOpen(true)}
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: favoritesCount > 0 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeartIcon className="h-4 w-4" />
                </motion.div>
                {favoritesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] shadow-sm border border-background animate-in fade-in duration-300"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    {user ? (
                      <Avatar className="h-7 w-7">
                        <AvatarFallback
                          className={cn(
                            "bg-[#cbd8fd] text-black dark:bg-[#2d3748] dark:text-white"
                          )}
                        >
                          {getInitials(
                            user.first_name || "",
                            user.last_name || ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        setIsProfileOpen(true);
                      }}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShoppingBagIcon className="mr-2 h-4 w-4" />
                        <span>Pedidos</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href="/logout">
                          <LogInIcon className="mr-2 h-4 w-4" />
                          <span>Cerrar Sesión</span>
                        </a>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <a href="/login" className="w-full">
                          <LogInIcon className="mr-2 h-4 w-4" />
                          <span>Iniciar Sesión</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/register" className="w-full">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Registrarse</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <HelpCircleIcon className="mr-2 h-4 w-4" />
                        <span>Ayuda</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {isSearchOpen && (
          <div className="w-full px-4 py-2 bg-background md:hidden">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-9 h-9 w-full"
              />
            </div>
          </div>
        )}
        <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                <SheetTitle className="m-0 p-0">Mi Carrito</SheetTitle>
                {cartCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </Badge>
                )}
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <XIcon className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
            
            <SheetDescription className="px-4 pt-2 pb-0 text-sm">
              Revisa los productos en tu carrito de compras
            </SheetDescription>
            
            <div className="mt-2 flex flex-col h-[calc(100vh-10rem)]">
              <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {cart.length > 0 ? (
                  cart.map((product) => (
                    <div key={product.id} className="mb-3 last:mb-0">
                      <CartItem product={product} onRemove={removeFromCart} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <ShoppingBagIcon className="h-10 w-10 text-primary/40" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
                    <p className="text-muted-foreground text-sm max-w-[250px]">Agrega algunos productos para comenzar tu compra</p>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t bg-muted/30 p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <a href="/cart">Ver Carrito</a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={isFavoritesSheetOpen} onOpenChange={setIsFavoritesSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500/5 to-rose-500/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5 text-rose-500" />
                <SheetTitle className="m-0 p-0">Mis Favoritos</SheetTitle>
                {favoritesCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {favoritesCount} {favoritesCount === 1 ? 'item' : 'items'}
                  </Badge>
                )}
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <XIcon className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
            
            <SheetDescription className="px-4 pt-2 pb-0 text-sm">
              Tus productos guardados como favoritos
            </SheetDescription>
            
            <div className="mt-2 flex flex-col h-[calc(100vh-10rem)]">
              <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {favorites.length > 0 ? (
                  favorites.map((product) => (
                    <div key={product.id} className="mb-3 last:mb-0">
                      <FavoriteItem 
                        product={product} 
                        onRemove={removeFromFavorites} 
                        onAddToCart={addToCartFromFavorites} 
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-rose-500/5 flex items-center justify-center mb-4">
                      <HeartIcon className="h-10 w-10 text-rose-500/40" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No tienes favoritos</h3>
                    <p className="text-muted-foreground text-sm max-w-[250px]">Guarda productos para verlos más tarde</p>
                  </div>
                )}
              </div>

              {favorites.length > 0 && (
                <div className="border-t bg-muted/30 p-4">
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 border-rose-200 hover:text-rose-700"
                      onClick={() => {
                        const itemsToAdd = favorites.filter(item => 
                          !cart.some(cartItem => cartItem.producto_id === item.producto_id)
                        );
                        
                        if (itemsToAdd.length === 0) {
                          toast.info("Todos los favoritos ya están en el carrito", {
                            duration: 3000,
                          });
                          return;
                        }
                        
                        itemsToAdd.forEach(item => {
                          const event = new CustomEvent('add-to-cart', { detail: {...item, quantity: 1} });
                          window.dispatchEvent(event);
                        });
                        
                        toast.success(`${itemsToAdd.length} producto(s) añadido(s) al carrito`, {
                          duration: 3000,
                        });
                        setIsFavoritesSheetOpen(false);
                      }}
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Agregar Todo al Carrito
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <a href="/favorites">Ver Todos los Favoritos</a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </>
  );
}