import type React from "react"
import { useState, useEffect } from "react"

const WhatsAppButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [messageInput, setMessageInput] = useState(() => {
    return localStorage.getItem("whatsappMessage") || ""
  })
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
    localStorage.setItem("whatsappMessage", messageInput)
  }, [messageInput])

  const handleButtonClick = () => {
    setShowDialog(true)
  }

  const handleSendMessage = () => {
    const messageToSend = messageInput.trim()
    if (!messageToSend) return

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageToSend)}`
    window.open(whatsappUrl, "_blank")
    setShowDialog(false)
  }

  const handleSelectMessage = (message: string) => {
    setMessageInput(message)
  }

  return (
    <>
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

      {showDialog && (
        <div className="fixed bottom-24 right-6 z-50 w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">Enviar mensaje</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick message options */}
          <div className="p-3 space-y-2">
            {messageOptions.map((option, index) => (
              <div
                key={index}
                className={`group rounded-lg transition-all duration-200 cursor-pointer border ${
                  messageInput === option.text
                    ? "bg-[#dcf8c6] border-[#25D366]/30 shadow-sm"
                    : "hover:bg-gray-50 border-gray-100 hover:border-[#25D366]/20"
                }`}
                onClick={() => handleSelectMessage(option.text)}
              >
                <div className="p-2.5 flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full ${
                      messageInput === option.text ? "bg-[#25D366] text-white" : "bg-[#25D366]/10 text-[#25D366]"
                    } transform transition-all duration-200 ${
                      messageInput === option.text ? "scale-110" : "group-hover:scale-105"
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        messageInput === option.text ? "text-[#075e54] font-medium" : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          messageInput === option.text
                            ? "bg-[#25D366] text-white"
                            : "bg-[#25D366]/10 text-[#075e54]"
                        }`}
                      >
                        {option.tag}
                      </span>
                      {messageInput === option.text && (
                        <div className="ml-2 text-[#25D366]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom message input */}
          <div className="px-3 py-2 bg-gray-50/80">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Escribe tu mensaje personalizado..."
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Send button */}
          <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-2 ${
                !messageInput.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#25D366] hover:bg-[#22c15e] text-white shadow-md hover:shadow-lg"
              }`}
            >
              <span>Abrir chat</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-4-4l4 4m-4 4l4-4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default WhatsAppButton
