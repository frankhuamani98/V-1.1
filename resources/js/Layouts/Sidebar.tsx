import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown, ChevronRight, Home, LogOut, Car, Users, BarChart as ChartBar, Cog, Menu, FileText, CreditCard, Bell, HelpCircle, UserPlus, Truck, Calendar, BarChart2, PieChart, TrendingUp, Layers, MessageCircle, Tag, Megaphone, Package, Wrench , Briefcase, Bike } from "lucide-react";
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
          "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors",
          isActive || isSubItemActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5 hover:text-primary"
        )}
        onClick={() => hasSubItems && setIsOpen(!isOpen)}
      >
        {href && !hasSubItems ? (
          <Link
            href={href}
            className="flex items-center space-x-3 w-full"
          >
            <div className="flex-shrink-0">{icon}</div>
            <span className="font-medium">{label}</span>
          </Link>
        ) : (
          <div className="flex items-center space-x-3 w-full">
            <div className="flex-shrink-0">{icon}</div>
            <span className="font-medium">{label}</span>
          </div>
        )}
        {hasSubItems && (
          <div className="flex-shrink-0">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        )}
      </div>
      {hasSubItems && isOpen && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
          {subItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "block py-1.5 px-2 text-sm rounded-md transition-colors",
                item.href === activeHref 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-primary/5 hover:text-primary"
              )}
              // Importante: No añadir evento onClick aquí para evitar cambiar el estado isOpen
            >
              {item.label}
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

const Sidebar = ({ isOpen, toggleSidebar, activeHref = window.location.pathname }: SidebarProps) => {
  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
      isActive: activeHref === "/dashboard",
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
      icon: <Calendar size={20} />,
      label: "Gestión de Reservas",
      subItems: [
        { label: "Reservas Nuevas", href: "/reservas/nuevas" },
        { label: "Estado de Reservas", href: "/reservas/estado" },
        { label: "Reservas Finalizadas", href: "/reservas/finalizadas" },
        { label: "Historial de Reservas", href: "/reservas/historial" },
      ],
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
      icon: <Bike size={20} />,
      label: "Gestión de Motos",
      subItems: [
        { label: "Registro de Motos", href: "/motos/registro" },

      ],
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Gestión de Comentarios",
      subItems: [
        { label: "Lista de Comentarios", href: "/comentarios/lista" },
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
      icon: <FileText size={20} />,
      label: "Gestión de Facturación",
      subItems: [
        { label: "Facturas Pendientes", href: "/facturacion/pendientes" },
        { label: "Historial de Facturas", href: "/facturacion/historial" },
      ],
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Soporte y Ayuda",
      subItems: [
        { label: "Manual del Usuario", href: "/soporte/manual" },
        { label: "Soporte Técnico", href: "/soporte/tecnico" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-card border-r shadow-lg flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <Link href="/" className="h-12">
              <img src="/logo.png" alt="Rudolf Motors Logo" className="h-14" />
            </Link>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {navItems.map((item, index) => (
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
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;