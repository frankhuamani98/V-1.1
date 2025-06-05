import React, { useState } from "react";
import { Link } from "@inertiajs/react";
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
  // Cambia el estado de apertura solo para el ítem principal, no para subopciones
  const [isOpen, setIsOpen] = useState(isSubItemActive || isActive);
  const hasSubItems = subItems && subItems.length > 0;

  // Paleta de colores suaves (no saturados)
  const palette = {
    hover: "bg-[#e3e8f0]", // azul-gris muy suave
    active: "bg-gradient-to-r from-[#c7d2fe] via-[#e0e7ff] to-[#f1f5f9]",
    border: "border-[#c7d2fe]",
    accent: "bg-[#f1f5f9]",
    text: "text-[#1e293b]",
    shadow: "shadow-lg",
    bullet: "bg-[#6366f1]",
    ring: "ring-[#6366f1]/20"
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          `flex items-center justify-between px-4 py-2 rounded-2xl cursor-pointer transition-all duration-200 group relative`,
          isActive || isSubItemActive
            ? `${palette.active} ${palette.text} ${palette.shadow} ring-2 ${palette.ring}`
            : `${palette.hover} hover:${palette.accent} hover:${palette.text} hover:shadow-md`
        )}
        // Solo permite abrir/cerrar el menú principal, no las subopciones
        onClick={(e) => {
          if (hasSubItems) {
            setIsOpen(!isOpen);
            e.stopPropagation();
          }
        }}
        style={{ marginBottom: hasSubItems ? 6 : 2, minHeight: 48, border: isActive || isSubItemActive ? `1.5px solid #c7d2fe` : undefined }}
      >
        {href && !hasSubItems ? (
          <Link
            href={href}
            className="flex items-center space-x-3 w-full focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30"
            tabIndex={0}
          >
            <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</div>
            <span className="font-semibold tracking-wide text-base">{label}</span>
          </Link>
        ) : (
          <div className="flex items-center space-x-3 w-full select-none">
            <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{icon}</div>
            <span className="font-semibold tracking-wide text-base">{label}</span>
          </div>
        )}
        {hasSubItems && (
          <div className={cn(
            "flex-shrink-0 transition-transform duration-300",
            isOpen ? "" : ""
          )}>
            <span className="inline-block bg-[#e0e7ff] rounded-full p-1">
              {/* El ícono no rota, solo cambia de flecha */}
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
          </div>
        )}
        {/* Glow effect for active */}
        {(isActive || isSubItemActive) && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r bg-[#6366f1] shadow-lg animate-pulse" />
        )}
      </div>
      {hasSubItems && isOpen && (
        <div className="ml-8 mt-2 space-y-1 border-l-4 border-[#c7d2fe] pl-4 bg-[#f1f5f9] rounded-xl py-2 shadow-inner">
          {subItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "block py-1.5 px-3 text-sm rounded-lg transition-all duration-150 font-medium relative group",
                item.href === activeHref
                  ? "bg-[#e0e7ff] text-[#6366f1] font-bold shadow"
                  : "hover:bg-[#e3e8f0] hover:text-[#6366f1]"
              )}
              tabIndex={0}
              // Evita que el click en la subopción cierre el menú principal
              onClick={e => e.stopPropagation()}
            >
              {/* Bullet for active subitem */}
              {item.href === activeHref && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#6366f1] shadow" />
              )}
              <span className="ml-3">{item.label}</span>
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
  // Ordena los ítems de navegación de más importante a menos importante
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
    // {
    //   icon: <FileText size={20} />,
    //   label: "Gestión de Facturación",
    //   subItems: [
    //     { label: "Facturas Pendientes", href: "/facturacion/pendientes" },
    //     { label: "Historial de Facturas", href: "/facturacion/historial" },
    //   ],
    // },
    // {
    //   icon: <HelpCircle size={20} />,
    //   label: "Soporte y Ayuda",
    //   subItems: [
    //     { label: "Manual del Usuario", href: "/soporte/manual" },
    //     { label: "Soporte Técnico", href: "/soporte/tecnico" },
    //   ],
    // },
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
          "fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] border-r shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-5 border-b bg-[#f8fafc] shadow-lg">
          <div className="flex items-center justify-center">
            <Link href="/" className="h-12">
              <img src="/logo.png" alt="Rudolf Motors Logo" className="h-16 mx-auto drop-shadow-2xl rounded-2xl" />
            </Link>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-2">
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
          <div className="my-4 border-t border-[#c7d2fe]" />
          <div className="space-y-2">
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
          <div className="my-4 border-t border-[#c7d2fe]" />
          <div className="space-y-2">
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



















































