import React from 'react';
import { Link } from '@inertiajs/react';
import { CalendarDays, Clock, ClipboardList, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReservaNavigationProps {
  currentPage?: string;
}

export default function ReservaNavigation({ currentPage }: ReservaNavigationProps) {
  const navItems = [
    {
      name: 'Agendar',
      href: '/reservas/agendar',
      icon: <CalendarDays className="h-4 w-4" />,
      key: 'agendar',
      matchValues: ['agendar', 'Agendar Servicio', 'agendar servicio']
    },
    {
      name: 'Mis Citas',
      href: '/reservas',
      icon: <Calendar className="h-4 w-4" />,
      key: 'citas',
      matchValues: ['citas', 'Mis Citas', 'mis citas']
    },
    {
      name: 'Horarios',
      href: '/reservas/horarios-atencion',
      icon: <Clock className="h-4 w-4" />,
      key: 'horarios',
      matchValues: ['horarios', 'Horarios de Atención', 'horarios atencion']
    },
    {
      name: 'Servicios',
      href: '/reservas/servicios-disponibles',
      icon: <ClipboardList className="h-4 w-4" />,
      key: 'servicios',
      matchValues: ['servicios', 'Servicios Disponibles', 'servicios disponibles']
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (!currentPage) return false;
    const normalizedCurrentPage = currentPage.toLowerCase();
    return item.matchValues.some(value => 
      normalizedCurrentPage.includes(value.toLowerCase())
    );
  };

  return (
    <div className="flex justify-center py-2">
      <div className="inline-flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 max-w-fit">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md",
              isActive(item)
                ? "bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 shadow-sm"
                : "text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
