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
  WrenchIcon,
  CalendarIcon,
  PhoneIcon,
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
import { MapPin, Phone, Mail, Clock, Sun, Moon, Menu, X } from "lucide-react";
import "../../../css/app.css";

// Sample products for cart
const cartProducts = [
  {
    id: 1,
    name: "Casco Integral GT-Air II",
    price: 599.99,
    quantity: 1,
  },
  {
    id: 2,
    name: "Chaqueta de Cuero Alpinestars",
    price: 349.99,
    quantity: 1,
  },
  {
    id: 3,
    name: "Guantes Touring Gore-Tex",
    price: 89.99,
    quantity: 1,
  },
];

// Sample products for favorites
const favoriteProducts = [
  {
    id: 4,
    name: "Kawasaki Ninja ZX-10R",
    price: 16999.99,
  },
  {
    id: 5,
    name: "Botas Alpinestars SMX-6 V2",
    price: 229.99,
  },
];

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

// Cart Item Component
const CartItem = ({
  product,
  onRemove,
}: {
  product: any;
  onRemove: (id: number) => void;
}) => {
  return (
    <div className="flex items-start py-3 gap-3">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{product.name}</h4>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <span>
            {product.quantity} x ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(product.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Favorite Item Component
const FavoriteItem = ({
  product,
  onRemove,
}: {
  product: any;
  onRemove: (id: number) => void;
}) => {
  return (
    <div className="flex items-start py-3 gap-3">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{product.name}</h4>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <span>${product.price.toFixed(2)}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(product.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Header() {
  const { auth: { user }, categoriasMenu = [] } = usePage<{ auth: { user: { id: number; name: string; first_name: string; last_name: string; email: string } } }>().props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Cart and favorites state
  const [cart, setCart] = useState(cartProducts);
  const [favorites, setFavorites] = useState(favoriteProducts);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isFavoritesSheetOpen, setIsFavoritesSheetOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  // Calculate totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favorites.length;
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  // Remove item from favorites
  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  // Función para generar las iniciales del usuario
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Definimos las categorías fijas para Servicios, Reservas y Contactos
  const fixedCategories = [
    {
      title: "Servicios",
      href: "#",
      description: "Ofrecemos una amplia gama de servicios para tu motocicleta",
      icon: <WrenchIcon className="mr-2 h-4 w-4" />,
      subcategories: [
        { name: "Mantenimiento general", href: "#" },
        { name: "Reparación de motor y transmisión", href: "#" },
        { name: "Servicio de frenos y suspensión", href: "#" },
        { name: "Sistema eléctrico y diagnóstico", href: "#" },
        { name: "Cambio y balanceo de neumáticos", href: "#" },
        { name: "Personalización y accesorios", href: "#" },
        { name: "Ver más", href: "#" },
      ],
    },
    {
      title: "Reservas",
      href: "#",
      description: "Reserva tu cita para servicios",
      icon: <CalendarIcon className="mr-2 h-4 w-4" />,
      subcategories: [
        { name: "Reservar Citas", href: "/home/partials/Reservas/recervas" },
        { name: "Horarios Disponibles", href: "#" },
        { name: "Promociones", href: "#" },
        { name: "Agregar Reserva", href: "#" },
        { name: "Ver más", href: "#" },
      ],
    },
    {
      title: "Contactos",
      href: "#",
      description: "Ponte en contacto con nosotros para cualquier consulta",
      icon: <PhoneIcon className="mr-2 h-4 w-4" />,
      subcategories: [
        { name: "Ubicanos", href: "#" },
        { name: "Soporte", href: "#" },
        { name: "Correo Electrónico", href: "#" },
        { name: "Redes Sociales", href: "#" },
        { name: "Preguntas Frecuentes", href: "#" },
      ],
    },
  ];

  // Creamos la categoría de Productos dinámica
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
    title: "Productos",
    href: "#",
    description: "Estos son nuestros productos más relevantes",
    icon: <PackageIcon className="mr-2 h-4 w-4" />,
    subcategories: [
      ...(Array.isArray(categoriasMenu)
        ? categoriasMenu
            .slice(0, 6) // Mostrar solo las primeras 6 categorías
            .map((categoria: { nombre: string; id: number }) => ({
              name: categoria.nombre,
              href: `/productos/categoria/${categoria.id}`,
            }))
        : []),
      // Agregar la opción "Ver más" al final
      { name: "Ver más", href: "/productos" }
    ]
  };

  // Combinamos todas las categorías
  const allCategories = [productosCategory, ...fixedCategories];

  // Manejar el efecto de desplazamiento con debounce
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determinar si se está desplazando hacia arriba o hacia abajo
      const scrollingDown = currentScrollY > lastScrollY;

      // Aplicar el efecto de fondo cuando se desplaza más de 50px
      setIsScrolled(currentScrollY > 50);

      // Controlar la visibilidad de la barra superior con histéresis
      // Solo ocultarla cuando se desplaza hacia abajo Y ha pasado los 120px
      // Solo mostrarla cuando se desplaza hacia arriba Y está antes de los 80px
      if (scrollingDown && currentScrollY > 120) {
        setIsVisible(false);
      } else if (!scrollingDown && currentScrollY < 80) {
        setIsVisible(true);
      }

      // Actualizar la última posición de desplazamiento
      setLastScrollY(currentScrollY);
    };

    // Usar throttle para evitar demasiadas actualizaciones
    let timeoutId: number | null = null;
    const throttledScroll = () => {
      if (timeoutId === null) {
        timeoutId = window.setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100); // 100ms de throttle
      }
    };

    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  // Alternar el modo oscuro
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };
  // Alternar la barra de búsqueda
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Actualizar el estado de autenticación cuando el usuario cambie
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b" : "bg-background"
      )}
    >
      {/* Navegación principal */}
      <div className="w-full max-w-[2000px] mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto max-h-screen">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
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

          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="h-12">
              <img src="/logo.png" alt="Rudolf Motors Logo" className="h-14" />
            </Link>
          </div>

          {/* Navegación del escritorio */}
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

          {/* Acciones del lado derecho */}
          <div className="flex items-center space-x-2">
            {/* Barra de búsqueda */}
            <div
              className={cn(
                "transition-all duration-300 overflow-hidden",
                isSearchOpen ? "w-full md:w-64 opacity-100" : "w-0 opacity-0"
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

            {/* Botón de modo oscuro */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>

            {/* Favoritos - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <HeartIcon className="h-4 w-4" />
                    {favoritesCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {favoritesCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Mis Favoritos</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {favorites.length > 0 ? (
                      favorites.map((product) => (
                        <div key={product.id}>
                          <FavoriteItem product={product} onRemove={removeFromFavorites} />
                          <DropdownMenuSeparator />
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-muted-foreground">
                        No tienes productos favoritos
                      </div>
                    )}
                  </div>
                  {favorites.length > 0 && (
                    <div className="p-3">
                      <Button className="w-full" asChild>
                        <a href="#">Ver todos los favoritos</a>
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Carrito - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <ShoppingCartIcon className="h-4 w-4" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Mi Carrito</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {cart.length > 0 ? (
                      cart.map((product) => (
                        <div key={product.id}>
                          <CartItem product={product} onRemove={removeFromCart} />
                          <DropdownMenuSeparator />
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-muted-foreground">
                        Tu carrito está vacío
                      </div>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <>
                      <div className="p-3 border-t">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button asChild>
                            <a href="#">Finalizar Compra</a>
                          </Button>
                          <Button variant="outline" asChild>
                            <a href="/shop">Ver Carrito</a>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Carrito - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative md:hidden"
              onClick={() => setIsCartSheetOpen(true)}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Favoritos - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative md:hidden"
              onClick={() => setIsFavoritesSheetOpen(true)}
            >
              <HeartIcon className="h-4 w-4" />
              {favoritesCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                >
                  {favoritesCount}
                </Badge>
              )}
            </Button>

            {/* Menú de usuario */}
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
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShoppingBagIcon className="mr-2 h-4 w-4" />
                      <span>Pedidos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HeartIcon className="mr-2 h-4 w-4" />
                      <span>Favoritos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
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

      {/* Cart Sheet for Mobile */}
      <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Mi Carrito ({cartCount})</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              {cart.length > 0 ? (
                cart.map((product) => (
                  <div key={product.id} className="mb-4">
                    <CartItem product={product} onRemove={removeFromCart} />
                    <Separator className="mt-4" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBagIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Tu carrito está vacío</h3>
                  <p className="text-muted-foreground mt-1">Agrega algunos productos para comenzar</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 mt-auto">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="space-y-3">
                  <Button className="w-full">Finalizar Compra</Button>
                  <Button variant="outline" className="w-full">
                    <a href="/shop">Ver Carrito</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Favorites Sheet for Mobile */}
      <Sheet open={isFavoritesSheetOpen} onOpenChange={setIsFavoritesSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Mis Favoritos ({favoritesCount})</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              {favorites.length > 0 ? (
                favorites.map((product) => (
                  <div key={product.id} className="mb-4">
                    <FavoriteItem product={product} onRemove={removeFromFavorites} />
                    <Separator className="mt-4" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <HeartIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tienes favoritos</h3>
                  <p className="text-muted-foreground mt-1">Guarda productos para verlos más tarde</p>
                </div>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="border-t pt-4 mt-auto">
                <div className="space-y-3">
                  <Button className="w-full">Ver Todos los Favoritos</Button>
                  <Button variant="outline" className="w-full">Agregar Todo al Carrito</Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}