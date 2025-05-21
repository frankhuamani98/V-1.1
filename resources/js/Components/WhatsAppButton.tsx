"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

const WhatsAppButton = () => {
  // Configuración - Puedes modificar estos valores
  const PHONE_NUMBER = "51922276296"
  const MESSAGE_OPTIONS = [
    { text: "¡Hola! Me gustaría recibir más información sobre sus servicios" },
    { text: "Quisiera agendar una consulta personalizada" },
    { text: "¿Cuáles son sus horarios de atención?" },
    { text: "Me interesa conocer los precios de sus productos" },
    { text: "Necesito ayuda con un problema técnico" },
  ]

  // Estados
  const [isVisible, setIsVisible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [pulseClass, setPulseClass] = useState("")

  // Referencias
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Estilos CSS para animaciones
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(5px, -8px) rotate(15deg); }
        50% { transform: translate(-3px, 10px) rotate(30deg); }
        75% { transform: translate(8px, 6px) rotate(45deg); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) rotate(45deg); }
        25% { transform: translate(7px, -11px) rotate(60deg); }
        50% { transform: translate(-6px, 12px) rotate(75deg); }
        75% { transform: translate(10px, 8px) rotate(90deg); }
      }
      @keyframes float3 {
        0%, 100% { transform: translate(0, 0) rotate(90deg); }
        25% { transform: translate(9px, -14px) rotate(105deg); }
        50% { transform: translate(-9px, 14px) rotate(120deg); }
        75% { transform: translate(12px, 10px) rotate(135deg); }
      }
      @keyframes float4 {
        0%, 100% { transform: translate(0, 0) rotate(135deg); }
        25% { transform: translate(11px, -17px) rotate(150deg); }
        50% { transform: translate(-12px, 16px) rotate(165deg); }
        75% { transform: translate(14px, 12px) rotate(180deg); }
      }
      @keyframes float5 {
        0%, 100% { transform: translate(0, 0) rotate(180deg); }
        25% { transform: translate(13px, -20px) rotate(195deg); }
        50% { transform: translate(-15px, 18px) rotate(210deg); }
        75% { transform: translate(16px, 14px) rotate(225deg); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes ping-slow {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  // Animación de pulso
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setPulseClass("ping-slow")
    }, 3000)

    const intervalTimer = setInterval(() => {
      setPulseClass("ping-slow")
      const stopTimer = setTimeout(() => {
        setPulseClass("")
      }, 2000)
      return () => clearTimeout(stopTimer)
    }, 15000)

    return () => {
      clearTimeout(startTimer)
      clearInterval(intervalTimer)
    }
  }, [])

  // Mostrar/ocultar diálogo
  useEffect(() => {
    if (showDialog) {
      setIsDialogVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsDialogVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [showDialog])

  // Detectar clics fuera del diálogo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowDialog(false)
      }
    }

    if (showDialog) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDialog])

  // Mostrar botón con animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Cargar mensaje guardado
  useEffect(() => {
    const savedMessage = localStorage.getItem("whatsappMessage")
    if (savedMessage) setMessageInput(savedMessage)
  }, [])

  // Guardar mensaje
  useEffect(() => {
    if (messageInput) {
      localStorage.setItem("whatsappMessage", messageInput)
    }
  }, [messageInput])

  // Enfocar input al abrir diálogo
  useEffect(() => {
    if (showDialog && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [showDialog])

  // Manejadores de eventos
  const handleButtonClick = () => {
    setShowDialog((prev) => !prev)
  }

  const handleSendMessage = () => {
    const messageToSend = messageInput.trim()
    if (!messageToSend) return
    openWhatsApp(messageToSend)
  }

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message)
    const formattedNumber = PHONE_NUMBER.replace(/[^0-9]/g, "")
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    setShowDialog(false)
    setSelectedOptionIndex(null)
  }

  const handleSelectMessage = (message: string, index: number) => {
    setMessageInput(message)
    setSelectedOptionIndex(index)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  // Componente de opción de mensaje
  const MessageOption = ({
    option,
    index,
    isSelected,
  }: {
    option: { text: string }
    index: number
    isSelected: boolean
  }) => {
    return (
      <button
        key={index}
        className={`w-full text-left p-2 rounded-lg transition-all duration-200 flex items-center text-xs
          ${
            isSelected
              ? "border-2 border-white/20 shadow-md scale-[1.02] bg-[#044134]/90"
              : "border border-white/10 shadow-sm hover:shadow-md hover:bg-[#044134]/70"
          }
          bg-[#033025]/80 backdrop-blur-sm`}
        onClick={() => handleSelectMessage(option.text, index)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-white/90 font-medium tracking-wide" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            {option.text}
          </p>
        </div>
        {isSelected && (
          <svg className="w-3 h-3 ml-1 text-white/90" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    )
  }

  return (
    <>
      {/* Botón de WhatsApp */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-700 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
      >
        <button
          onClick={handleButtonClick}
          aria-label="Contactar por WhatsApp"
          className="flex items-center justify-center w-14 h-14 rounded-full
          transition-all duration-300 active:scale-95 group relative overflow-hidden
          bg-black shadow-lg hover:shadow-xl"
        >
          <div
            className={`absolute inset-0 rounded-full bg-[#128C7E] opacity-0 ${
              pulseClass === "ping-slow" ? "animate-[ping-slow_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" : ""
            }`}
          ></div>

          {/* Colorful background with particles */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-[-50%]" style={{ animation: "spin 12s linear infinite" }}>
                {[...Array(20)].map((_, i) => {
                  const colors = [
                    "bg-orange-500",
                    "bg-pink-500",
                    "bg-purple-500",
                    "bg-blue-500",
                    "bg-red-500",
                    "bg-yellow-500",
                  ]
                  const sizes = ["w-2 h-2", "w-3 h-3", "w-4 h-4"]
                  const positions = [
                    "top-1/4 left-1/4",
                    "top-1/3 left-1/2",
                    "top-1/2 left-1/3",
                    "top-2/3 left-1/4",
                    "top-3/4 left-1/2",
                    "top-1/2 left-2/3",
                    "top-1/4 right-1/4",
                    "top-1/3 right-1/3",
                    "top-1/2 right-1/4",
                    "bottom-1/4 left-1/4",
                    "bottom-1/3 left-1/3",
                    "bottom-1/2 left-1/4",
                  ]

                  return (
                    <div
                      key={i}
                      className={`absolute ${colors[i % colors.length]} ${sizes[i % sizes.length]} ${positions[i % positions.length]} rounded-sm transform rotate-45 opacity-80`}
                      style={{
                        transform: `rotate(${i * 20}deg) translateX(${(i % 3) * 10 + 20}px)`,
                        animation: `float${(i % 5) + 1} ${3 + (i % 3)}s infinite ease-in-out`,
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Logo de WhatsApp exactamente como en la imagen pero más pequeño */}
            <div className="relative z-10 w-10 h-10 bg-[#00E676] rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0Z"
                  fill="#00E676"
                />
                <path
                  d="M12 3.6C7.41 3.6 3.6 7.41 3.6 12C3.6 13.77 4.14 15.42 5.07 16.74L4.2 19.8L7.32 18.93C8.61 19.8 10.26 20.4 12 20.4C16.59 20.4 20.4 16.59 20.4 12C20.4 7.41 16.59 3.6 12 3.6ZM16.74 15.33C16.5 15.96 15.54 16.5 14.85 16.65C14.4 16.74 13.8 16.83 11.94 16.08C9.6 15.15 8.1 12.75 7.95 12.6C7.8 12.45 6.6 10.89 6.6 9.3C6.6 7.71 7.44 6.93 7.71 6.63C7.95 6.39 8.31 6.3 8.49 6.3C8.67 6.3 8.85 6.3 9 6.3C9.15 6.3 9.39 6.24 9.63 6.78C9.87 7.35 10.44 8.94 10.5 9.06C10.56 9.18 10.59 9.33 10.5 9.51C10.41 9.69 10.35 9.78 10.23 9.93C10.11 10.08 9.99 10.26 9.87 10.38C9.75 10.5 9.63 10.65 9.78 10.92C9.93 11.19 10.44 12.03 11.22 12.72C12.21 13.62 13.05 13.89 13.32 14.01C13.59 14.13 13.77 14.1 13.92 13.95C14.07 13.8 14.55 13.23 14.73 12.96C14.91 12.69 15.09 12.75 15.33 12.84C15.57 12.93 17.16 13.71 17.43 13.83C17.7 13.95 17.88 14.01 17.94 14.1C18 14.25 18 14.85 16.74 15.33Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Diálogo de mensajes */}
      {isDialogVisible && (
        <div
          ref={dialogRef}
          className={`fixed bottom-20 right-6 z-50 w-64 max-w-[calc(100vw-3rem)] rounded-xl overflow-hidden border border-white/20
          transition-all duration-300 backdrop-blur-sm
          ${showDialog ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
          shadow-xl shadow-black/30`}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('https://mail.nitro.pe/images/2015/noviembre/kawasaki_ninja_h2r.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backdropFilter: "brightness(1.3) contrast(1.3)",
          }}
        >
          {/* Encabezado del diálogo */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#044134] opacity-95"></div>
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
            ></div>
            <div className="relative px-3 py-2">
              <div className="flex items-center justify-between">
                <h2
                  className="font-bold text-white text-xs tracking-wide"
                  style={{
                    textShadow: "0 1px 2px rgba(229, 248, 227, 0.99)",
                    color: "#ffffff",
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: "0.3em",
                  }}
                >
                  Enviar mensaje
                </h2>
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

          {/* Opciones de mensajes */}
          <div className="p-2 space-y-1.5 bg-gradient-to-b from-[#044134]/40 to-[#044134]/30">
            <div className="grid grid-cols-1 gap-1.5 max-h-[40vh] overflow-y-auto pr-1">
              {MESSAGE_OPTIONS.map((option, index) => (
                <MessageOption key={index} option={option} index={index} isSelected={selectedOptionIndex === index} />
              ))}
            </div>
          </div>

          {/* Área de entrada de mensaje */}
          <div className="p-2 border-t border-white/10 bg-gradient-to-b from-black/40 to-black/30">
            <div className="flex items-center space-x-1 rounded-lg p-1.5 transition-all bg-black/30 border border-white/20 shadow-sm">
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-2 py-1 bg-transparent text-xs focus:outline-none transition-all text-white placeholder-white/60"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center
                  ${
                    !messageInput.trim()
                      ? "bg-white/20 text-white/40 cursor-not-allowed"
                      : "text-white shadow-sm bg-gradient-to-r from-[#044134] to-[#075E54]"
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
  )
}

export default WhatsAppButton
