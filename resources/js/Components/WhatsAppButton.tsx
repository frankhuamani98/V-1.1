import React, { useState, useEffect, useRef } from 'react';

const usePulseAnimation = (): string => {
  const [pulseClass, setPulseClass] = useState('');

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setPulseClass('animate-[ping-slow_1.5s_cubic-bezier(0,0,0.2,1)_infinite]');
    }, 3000);

    const intervalTimer = setInterval(() => {
      setPulseClass('animate-[ping-slow_1.5s_cubic-bezier(0,0,0.2,1)_infinite]');
      const stopTimer = setTimeout(() => {
        setPulseClass('');
      }, 2000);
      return () => clearTimeout(stopTimer);
    }, 15000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return pulseClass;
};

const PHONE_NUMBER = "51922276296";

const MESSAGE_OPTIONS = [
  { text: "¡Hola! Me gustaría recibir más información sobre sus servicios" },
  { text: "Quisiera agendar una consulta personalizada" },
  { text: "¿Cuáles son sus horarios de atención?" },
  { text: "Me interesa conocer los precios de sus productos" },
  { text: "Necesito ayuda con un problema técnico" }
];

interface MessageOptionType {
  text: string;
}

const MessageOption: React.FC<{
  option: MessageOptionType;
  index: number;
  isSelected: boolean;
  onSelectMessage: (message: string, index: number) => void;
}> = ({ option, index, isSelected, onSelectMessage }) => {
  const colorVariants = [
    'from-green-700 to-green-600',     // Verde oscuro a verde medio
    'from-green-800 to-green-700',     // Verde más oscuro a verde oscuro
    'from-green-700 to-emerald-600',   // Verde oscuro a verde esmeralda
    'from-green-800 to-green-600',     // Verde más oscuro a verde medio
    'from-emerald-700 to-green-600'    // Verde esmeralda oscuro a verde medio
  ];

  return (
    <button
      key={index}
      className={`w-full text-left p-2 rounded-lg transition-all duration-200 flex items-center text-xs
        ${isSelected
          ? 'border-2 border-white shadow-md scale-[1.02]'
          : 'border border-white/20 shadow-sm hover:shadow-md opacity-90 hover:opacity-100'}
        bg-gradient-to-r ${colorVariants[index % colorVariants.length]}`}
      onClick={() => onSelectMessage(option.text, index)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium drop-shadow-sm">
          {option.text}
        </p>
      </div>
      {isSelected && (
        <svg
          className="w-3 h-3 ml-1 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

const WhatsAppButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pulseClass = usePulseAnimation();

  useEffect(() => {
    if (showDialog) {
      setIsDialogVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsDialogVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showDialog]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowDialog(false);
      }
    };

    if (showDialog) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDialog]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedMessage = localStorage.getItem('whatsappMessage');
    if (savedMessage) setMessageInput(savedMessage);
  }, []);

  useEffect(() => {
    if (messageInput) {
      localStorage.setItem('whatsappMessage', messageInput);
    }
  }, [messageInput]);

  useEffect(() => {
    if (showDialog && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [showDialog]);

  const handleButtonClick = () => {
    setShowDialog(prev => !prev);
  };

  const handleSendMessage = () => {
    const messageToSend = messageInput.trim();
    if (!messageToSend) return;
    openWhatsApp(messageToSend);
  };

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const formattedNumber = PHONE_NUMBER.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setShowDialog(false);
    setSelectedOptionIndex(null);
  };

  const handleSelectMessage = (message: string, index: number) => {
    setMessageInput(message);
    setSelectedOptionIndex(index);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-700 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
      >
        <button
          onClick={handleButtonClick}
          aria-label="Contactar por WhatsApp"
          className={`flex items-center justify-center w-14 h-14 rounded-full
          transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden
          bg-[#25D366] shadow-lg hover:shadow-xl`}
        >
          <div className={`absolute inset-0 rounded-full bg-[#128C7E] opacity-0 ${pulseClass}`}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-80 rounded-full group-hover:opacity-0 transition-opacity"></div>
          <svg
            className="w-7 h-7 text-white drop-shadow-sm relative z-10 transition-transform group-hover:scale-110"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
          </svg>
        </button>
      </div>

      {isDialogVisible && (
        <div
          ref={dialogRef}
          className={`fixed bottom-20 right-6 z-50 w-64 rounded-xl overflow-hidden border border-white/20
          transition-all duration-300 backdrop-blur-sm
          ${showDialog ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          bg-gradient-to-br from-slate-900/95 to-teal-800/95 bg-[length:100px_100px] shadow-xl shadow-black/30`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-teal-600 opacity-95"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative px-3 py-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white text-xs tracking-wide drop-shadow-sm">Enviar mensaje</h2>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-white/80 hover:text-white transition-colors p-0.5 hover:bg-white/10 rounded-full"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-1.5 bg-gradient-to-b from-teal-900/10 to-emerald-900/05 bg-[length:100px_100px]">
            <div className="grid grid-cols-1 gap-1.5">
              {MESSAGE_OPTIONS.map((option, index) => (
                <MessageOption
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedOptionIndex === index}
                  onSelectMessage={handleSelectMessage}
                />
              ))}
            </div>
          </div>

          <div className="p-2 border-t border-white/10 bg-gradient-to-b from-slate-900/80 to-teal-800/80">
            <div className="flex items-center space-x-1 rounded-lg p-1.5 transition-all bg-white/15 border border-white/20 shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-2 py-1 bg-transparent text-xs focus:outline-none transition-all text-white placeholder-white/60 text-shadow-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center
                  ${
                    !messageInput.trim()
                      ? 'bg-white/20 text-white/40 cursor-not-allowed'
                      : 'text-white shadow-sm bg-gradient-to-r from-rose-600 to-amber-500'
                  }`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="text-center mt-1">
              <span className="text-[0.6rem] text-white/60">Powered by WhatsApp Business</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
