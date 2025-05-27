import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WelcomeAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem('welcomeAlertShown');
    
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('welcomeAlertShown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('welcomeAlertClosed', 'true');
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-20 right-6 z-50 max-w-sm
        bg-white/95 backdrop-blur-sm rounded-2xl 
        shadow-lg border border-gray-100/50 
        transition-all duration-500 ease-in-out transform
        ${isClosing 
          ? 'opacity-0 translate-x-8' 
          : 'opacity-100 translate-x-0'
        }
        hover:shadow-xl hover:-translate-y-0.5
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200/50 p-2.5 rounded-xl shadow-sm">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-400 rounded-full" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-gray-800 animate-fade-in">
              Hola 😊
            </p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed animate-fade-in-delayed">
              Por favor escríbenos por WhatsApp. Así podemos atenderte mejor y más rápido. ¡Gracias por tu comprensión! 🙌
            </p>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 rounded-full hover:bg-gray-100/50"
            aria-label="Cerrar mensaje"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}