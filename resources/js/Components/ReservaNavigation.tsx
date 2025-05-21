import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function ReservaNavigation({ currentPage }: { currentPage: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  const navItems = [
    {
      name: "Inicio",
      href: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      name: "Servicios Disponibles",
      href: "/reservas/servicios-disponibles",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      name: "Agendar Servicio",
      href: "/reservas/agendar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      ),
    },
    {
      name: "Horarios de Atención",
      href: "/reservas/horarios-atencion",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      name: "Mis Citas",
      href: "/reservas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
    },
  ];

  const handleNavigation = (href: string) => {
    router.visit(href, { preserveScroll: true });
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 p-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center p-2 bg-transparent border-none cursor-pointer ${currentPage === item.name 
                ? "text-primary font-medium" 
                : "text-gray-600 hover:text-primary"}`}
            >
              <div className="w-6 h-6">{item.icon}</div>
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'translate-x-0' : '-translate-x-[calc(100%-3rem)]'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-r-xl overflow-hidden border-r border-t border-b border-gray-200">
        <div className="w-64 p-3">
          {navItems.map((item, index) => (
            <button 
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={`flex items-center gap-3 p-3 my-1 rounded-lg transition-all duration-200 w-full text-left bg-transparent border-none cursor-pointer ${currentPage === item.name 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-gray-700 hover:bg-gray-100"}`}
            >
              <div className={`flex-shrink-0 ${isExpanded ? '' : 'ml-1'}`}>{item.icon}</div>
              <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.name}
              </span>
              {!isExpanded && index === 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
