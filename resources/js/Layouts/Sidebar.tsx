import { useEffect, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { ChevronDown, ChevronRight, Home, LogOut, CalendarIcon, Users, BarChart as ChartBar, Cog, Menu, FileText, CreditCard, Bell, HelpCircle, UserPlus, Truck, Calendar, BarChart2, PieChart, TrendingUp, Layers, MessageCircle, Tag, Megaphone, Package, Wrench , Briefcase, Bike, MessageSquare, Hammer } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  subItems?: Array<{ label: string; href: string }>;
  isActive?: boolean;
  activeHref?: string;
};

const NavItem = ({ icon, label, href, subItems, isActive, activeHref }: NavItemProps) => {
  const isSubItemActive = subItems?.some(item => item.href === activeHref);
  const [isOpen, setIsOpen] = useState(isSubItemActive || isActive);
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative",
          isActive || isSubItemActive
            ? "bg-indigo-50/80 text-indigo-700 font-medium"
            : "hover:bg-gray-100/80 text-gray-700"
        )}
        onClick={(e) => {
          if (hasSubItems) {
            setIsOpen(!isOpen);
            e.stopPropagation();
          }
        }}
        style={{ marginBottom: hasSubItems && isOpen ? 8 : 2 }}
      >
        {href && !hasSubItems ? (
          <Link
            href={href}
            className="flex items-center space-x-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded-lg"
            tabIndex={0}
          >
            <div className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-105",
              isActive ? "text-indigo-600" : "text-gray-600"
            )}>
              {icon}
            </div>
            <span className="tracking-wide text-[14.5px]">{label}</span>
          </Link>
        ) : (
          <div className="flex items-center space-x-3 w-full select-none">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-105",
              isOpen || isSubItemActive ? "text-indigo-600" : "text-gray-600"
            )}>
              {icon}
            </div>
            <span className="tracking-wide text-[14.5px]">{label}</span>
          </div>
        )}
        {hasSubItems && (
          <div className="flex-shrink-0 transition-transform duration-300">
            <div className={cn(
              "p-1 rounded-full transition-colors",
              isOpen || isSubItemActive ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"
            )}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
        )}
      </div>
      {hasSubItems && isOpen && (
        <div className="ml-4 mt-1 space-y-0.5 pl-4">
          {subItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-[14px] rounded-md transition-all duration-150 relative group",
                item.href === activeHref
                  ? "bg-indigo-50/60 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100/60 hover:text-gray-900"
              )}
              tabIndex={-1}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                router.visit(item.href, { preserveScroll: true });
              }}
              onMouseDown={e => e.preventDefault()}
            >
              {item.href === activeHref && (
                <div className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full top-1/2 -translate-y-1/2" />
              )}
              <span className="ml-2">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeHref?: string;
}

declare global {
  interface Window {
    __sidebarScrollY?: number;
  }
}

const Sidebar = ({ isOpen, toggleSidebar, activeHref = window.location.pathname }: SidebarProps) => {
  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      isActive: activeHref === "/dashboard",
    },
    {
      icon: <Users size={20} />,
      label: "Gestión de Usuarios",
      subItems: [
        { label: "Lista de Usuarios", href: "/usuarios" },
        { label: "Administradores", href: "/usuarios/administradores" },
      ],
    },
    {
      icon: <Package size={20} />,
      label: "Gestión de Pedidos",
      subItems: [
        { label: "Nuevos Pedidos", href: "/pedidos/nuevos" },
        { label: "Estado de Pedidos", href: "/pedidos/estado" },
        { label: "Pedidos Finalizados", href: "/pedidos/finalizados" },
        { label: "Historial de Pedidos", href: "/pedidos/historial" },
      ],
    },
    {
      icon: <CalendarIcon size={20} />,
      label: "Gestión de Reservas",
      subItems: [
        { label: "Todas las Reservas", href: "/dashboard/reservas" },
        { label: "Reservas Confirmadas", href: "/dashboard/reservas/confirmadas" },
        { label: "Horarios de Atención", href: "/dashboard/reservas/horario-atencion" },
      ],
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Gestión de Productos",
      subItems: [
        { label: "Agregar Producto", href: "/productos/agregar" },
        { label: "Inventario de Productos", href: "/productos/inventario" },
      ],
    },
    {
      icon: <Layers size={20} />,
      label: "Gestión de Categorías",
      subItems: [
        { label: "Categorías Principales", href: "/categorias/principales" },
        { label: "Subcategorías", href: "/categorias/subcategorias" },
        { label: "Lista de Categorías y Subcategorías", href: "/categorias/lista" },
      ],
    },
    {
      icon: <Hammer size={20} />,
      label: "Gestión de Servicios",
      subItems: [
        { label: "Agregar Categoría", href: "/servicios/categorias/crear" },
        { label: "Agregar Servicio", href: "/servicios/crear" },
        { label: "Lista General", href: "/servicios" },
      ],
    },
    {
      icon: <Bike size={20} />,
      label: "Gestión de Motos",
      subItems: [
        { label: "Registro de Motos", href: "/motos/registro" },
      ],
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Gestión de Opiniones",
      subItems: [
        { label: "Lista de Opiniones", href: "/dashboard/opiniones" },
      ],
    },
    {
      icon: <Megaphone size={20} />,
      label: "Gestión de Banners",
      subItems: [
        { label: "Subir un Banners", href: "/banners/subir" },
        { label: "Historial de Banners", href: "/banners/historial" },
      ],
    },
    {
      icon: <Briefcase size={20} />,
      label: "Gestión de Equipo",
      subItems: [
        { label: "Administrar Equipo", href: "/equipo/dashboard" },
      ],
    },
    {
      icon: <FileText size={20} />,
      label: "Gestión de Facturación",
      subItems: [
        { label: "Factura", href: "/facturacion/factura" },
        { label: "Boleta", href: "/facturacion/boleta" },
        { label: "Manual", href: "/facturacion/manual" }
      ],
    },
    // {
    //   icon: <HelpCircle size={20} />,
    //   label: "Soporte y Ayuda",
    //   subItems: [
    //     { label: "Manual del Usuario", href: "/soporte/manual" },
    //     { label: "Soporte Técnico", href: "/soporte/tecnico" },
    //   ],
    // },
  ];

  const sidebarNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ref = sidebarNavRef.current;
    if (!ref) return;
    const saveScroll = () => {
      window.__sidebarScrollY = ref.scrollTop;
    };
    ref.addEventListener('scroll', saveScroll);
    return () => {
      ref.removeEventListener('scroll', saveScroll);
    };
  }, []);

  useEffect(() => {
    const restoreScroll = () => {
      const ref = sidebarNavRef.current;
      if (ref && typeof window.__sidebarScrollY === 'number') {
        ref.scrollTop = window.__sidebarScrollY;
      }
    };
    window.addEventListener('inertia:finish', restoreScroll);
    restoreScroll();
    return () => {
      window.removeEventListener('inertia:finish', restoreScroll);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/80 shadow-lg flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-gray-100 bg-white/70 backdrop-blur-xl">
          <div className="flex items-center justify-center">
            <Link href="/" className="relative group">
              <div className="absolute -inset-3 bg-indigo-50/70 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <img 
                src="/logo.png" 
                alt="Rudolf Motors Logo" 
                className="h-10 relative drop-shadow-md transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xl" 
              />
            </Link>
          </div>
        </div>
        <nav
          ref={sidebarNavRef}
          className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <div className="space-y-0.5">
            {navItems.slice(0, 1).map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                subItems={item.subItems}
                isActive={item.isActive}
                activeHref={activeHref}
              />
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70" />
          <div className="space-y-0.5">
            {navItems.slice(1, 7).map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                subItems={item.subItems}
                isActive={item.isActive}
                activeHref={activeHref}
              />
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70" />
          <div className="space-y-0.5">
            {navItems.slice(7, 13).map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                subItems={item.subItems}
                isActive={item.isActive}
                activeHref={activeHref}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;