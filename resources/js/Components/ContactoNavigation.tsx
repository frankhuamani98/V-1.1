import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface ContactoNavigationProps {
  currentPage?: string;
}

export default function ContactoNavigation({ currentPage }: ContactoNavigationProps) {
  const navItems = [
    {
      name: 'Ubicación',
      href: '/contacto/ubicacion',
      key: 'ubicacion',
      matchValues: ['ubicacion', 'Ubicación', 'ubicaciones']
    },
    {
      name: 'Contáctanos',
      href: '/contacto/contactanos',
      key: 'contactanos',
      matchValues: ['contactanos', 'Contáctanos', 'contacto']
    },
    {
      name: 'Redes Sociales',
      href: '/contacto/redes-sociales',
      key: 'redes',
      matchValues: ['redes', 'Redes Sociales', 'redes sociales']
    }
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
      <div className="inline-flex bg-gray-100 rounded-lg p-1 max-w-fit">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md",
              isActive(item)
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
