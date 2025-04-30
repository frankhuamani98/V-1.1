"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const phoneNumber = "51993303312"

  const messageOptions = [
    {
      text: "¡Hola! Me gustaría obtener más información",
      icon: "💬",
      tag: "Consulta",
    },
    {
      text: "Me interesa agendar una cita",
      icon: "📆",
      tag: "Cita",
    },
    {
      text: "Necesito soporte técnico",
      icon: "⚡",
      tag: "Soporte",
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const savedMessage = localStorage.getItem("whatsappMessage")
    if (savedMessage) setMessageInput(savedMessage)
  }, [])

  useEffect(() => {
    if (messageInput) {
      localStorage.setItem("whatsappMessage", messageInput)
    }
  }, [messageInput])

  // Focus input when dialog opens
  useEffect(() => {
    if (showDialog && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [showDialog])

  const handleButtonClick = () => {
    setShowDialog(true)
  }

  const handleSendMessage = () => {
    const messageToSend = messageInput.trim()
    if (!messageToSend) return

    openWhatsApp(messageToSend)
  }

  const openWhatsApp = (message: string) => {
    // Properly encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Use window.open with specific parameters for better compatibility
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")

    // Reset state after sending
    setShowDialog(false)
    setSelectedOptionIndex(null)
  }

  const handleSelectMessage = (message: string, index: number) => {
    // Update the input field with the selected message
    setMessageInput(message)
    setSelectedOptionIndex(index)

    // Focus the input field to allow editing
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

  return (
    <>
      {/* WhatsApp Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <button
          onClick={handleButtonClick}
          aria-label="Contactar por WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping"></div>
          <svg
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>

      {/* WhatsApp Dialog */}
      {showDialog && (
        <div className="fixed bottom-24 right-6 z-50 w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-5 py-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm tracking-wide">Enviar mensaje</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick message options - Premium styling */}
          <div className="p-3 space-y-2 bg-gradient-to-b from-white to-[#f7fdf8]">
            <div className="grid grid-cols-1 gap-2">
              {messageOptions.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-center space-x-3
                    ${
                      selectedOptionIndex === index
                        ? "bg-[#e7f7e9] border-[#25D366] border shadow-md"
                        : "bg-white hover:bg-[#f0f9f1] border border-gray-100 hover:border-[#25D366]/40 shadow-sm hover:shadow-md"
                    }`}
                  onClick={() => handleSelectMessage(option.text, index)}
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white text-sm shadow-inner">
                    {option.icon}
                  </span>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-800 font-medium line-clamp-1">{option.text}</p>
                      <span className="inline-block text-[10px] mt-1 px-2 py-0.5 rounded-full font-medium bg-[#E8F5E9] text-[#1E8449]">
                        {option.tag}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 ${selectedOptionIndex === index ? "text-[#25D366]" : "text-[#25D366] opacity-70"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom message input with send button */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                className="flex-1 p-2 bg-transparent text-sm focus:outline-none transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`p-2 rounded-lg transition-all ${
                  !messageInput.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1ea952] hover:to-[#0d7164] text-white shadow-sm"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">Powered by WhatsApp Business</p>
          </div>
        </div>
      )}
    </>
  )
}

export default WhatsAppButton
