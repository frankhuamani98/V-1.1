import type React from "react"
import Header from "@/Pages/Home/Header"
import Footer from "@/Pages/Home/Footer"
import WhatsAppButton from "@/Components/WhatsAppButton"
import { Head } from "@inertiajs/react"
import { Heart, Shield, Award, Zap, Users } from "lucide-react"

const NosotrosPage: React.FC = () => {
  return (
    <>
      <Head title="Sobre Nosotros" />
      <Header />
      <main className="flex-grow">
        <div className="relative w-full min-h-screen overflow-hidden bg-black">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 z-10 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Asymmetrical Grid Layout */}
          <div className="container mx-auto relative z-20 h-full px-4 md:px-6 py-12">
            <div className="grid grid-cols-12 grid-rows-6 gap-4 md:gap-6 h-full">
              {/* Large Panel - Sobre Nosotros (now smaller) */}
              <div className="col-span-12 md:col-span-7 row-span-2 bg-gradient-to-br from-[#00a99d] to-[#00796b] p-4 md:p-6 relative overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-[#ffa500] opacity-80"></div>
                <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full bg-[#ffa500] opacity-70"></div>
                <div className="absolute top-1/2 right-8 w-8 h-8 rounded-full bg-[#ffa500] opacity-90"></div>

                <div className="flex flex-col md:flex-row md:items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-[#ffa500] mb-2 md:mb-0">
                    <img
                      src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                      alt="Motorcycle mechanic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-[#ffa500] text-3xl md:text-4xl font-bold tracking-wider uppercase font-['Bebas_Neue']">SOBRE</h2>
                    <h2 className="text-[#ffa500] text-3xl md:text-4xl font-bold tracking-wider uppercase font-['Bebas_Neue']">NOSOTROS</h2>
                  </div>
                </div>

                <p className="text-white text-base md:text-lg max-w-xl font-medium leading-relaxed">
                  En <span className="font-bold text-[#ffa500]">MotoHighPerformance</span>,
                  no solo reparamos motocicletas,
                  las <span className="font-bold">resucitamos</span>. Especialistas en motocicletas de alta gama,
                  ofrecemos servicio técnico <span className="italic">elite</span> y repuestos originales
                  para las marcas más exclusivas del mercado.
                </p>

                <div className="text-xs text-white/70 mt-6 flex justify-between items-center">
                  <span className="font-mono tracking-widest">WWW.MOTOHIGHPERFORMANCE.COM</span>
                  <span className="font-bold text-lg">01</span>
                </div>

                {/* Agregar el GIF al final de la sección */}
                <div className="absolute bottom-8 right-4 w-24 h-24">
                  <img
                    src="https://th.bing.com/th/id/R.34843958c0816c26e2758abdc44b3c3d?rik=aIqDnutj8HSfKA&riu=http%3a%2f%2fi737.photobucket.com%2falbums%2fxx20%2foficinadogif%2fmoto.gif&ehk=GR9QW8%2bW8g9ahggurVcTQHgYN5Vhugt5ayRgbpCTtsc%3d&risl=&pid=ImgRaw&r=0"
                    alt="Motorcycle animation"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Tall Panel - Nuestra Visión */}
              <div className="col-span-10 md:col-span-5 row-span-6 bg-gradient-to-b from-[#111] to-[#000] p-6 md:p-8 relative overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#00a99d]/20 blur-md"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#00a99d]/40 blur-sm"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-2 font-['Bebas_Neue']">NUESTRA</h2>
                  <h2 className="text-5xl md:text-6xl font-bold text-[#00a99d] mb-6 font-['Bebas_Neue']">VISIÓN</h2>

                  <div className="w-full max-w-xs aspect-square rounded-xl overflow-hidden mb-6 border-4 border-[#00a99d]/50 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                      alt="Futuristic motorcycle concept"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-white/80 text-lg md:text-xl text-center max-w-md font-medium leading-relaxed">
                    Ser el <span className="font-bold">referente absoluto</span> en servicio técnico y venta de repuestos para motocicletas
                    de alta gama, fusionando <span className="text-[#ffa500]">tecnología de punta</span> con artesanía mecánica para ofrecer
                    experiencias únicas a nuestros clientes.
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 text-2xl text-white/30 font-mono">#VISION2025</div>
              </div>

              {/* Wide Panel - Nuestra Historia */}
              <div className="col-span-12 md:col-span-7 row-span-3 bg-gradient-to-r from-[#ffa500] to-[#ff8c00] p-6 md:p-8 relative overflow-hidden rounded-xl shadow-2xl">
                <h2 className="text-[#ff4500] text-4xl font-bold mb-6 font-['Bebas_Neue'] tracking-wider">NUESTRA HISTORIA</h2>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1558980394-4c7c9299fe96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="Vintage motorcycle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="Racing motorcycle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="https://mail.nitro.pe/images/2015/noviembre/kawasaki_ninja_h2r.jpg"
                      alt="Motorcycle workshop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="Modern motorcycle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <p className="text-black text-lg md:text-xl font-medium leading-relaxed">
                  Nacidos en 2005 de la pasión por las <span className="font-bold">dos ruedas</span>, comenzamos como un pequeño taller especializado. Hoy somos <span className="text-[#ff4500]">referentes nacionales</span> en el mundo de las motos de alta gama, distribuidores oficiales y <span className="italic">artesanos de la mecánica de precisión</span>.
                </p>

                <div className="text-sm text-black/70 mt-4 font-mono tracking-wider">
                  <span>MOMENTOS CLAVE EN NUESTRA TRAYECTORIA</span>
                </div>
              </div>

              {/* Medium Panel - Nuestra Misión */}
              <div className="col-span-12 md:col-span-5 row-span-3 bg-gradient-to-br from-[#ffa500] to-[#ff8c00] p-6 md:p-8 relative overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-t-[#00a99d] border-l-[100px] border-l-transparent"></div>

                <div className="mt-8">
                  <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-none tracking-tighter font-['Bebas_Neue']">
                    NUESTRA
                  </h2>
                  <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-none tracking-tighter font-['Bebas_Neue']">
                    MISIÓN
                  </h2>
                </div>

                <div className="flex items-center mt-8">
                  <div className="w-96 h-40 rounded-xl overflow-hidden mr-6 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
                      alt="Motorcycle parts"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-black text-lg md:text-xl font-medium leading-relaxed">
                    Ofrecer <span className="font-bold">servicios técnicos de élite</span> y repuestos <span className="text-[#ff4500]">100% originales</span> para motocicletas de alta gama, donde cada ajuste es una <span className="italic">obra de arte mecánica</span> y cada cliente una prioridad absoluta.
                  </p>
                </div>

                <div className="text-sm text-black/70 mt-8 flex items-center font-mono tracking-wider">
                  <span>WWW.MOTOHIGHPERFORMANCE.COM</span>
                </div>
              </div>

              {/* Small Panel - Nuestros Valores (now perfectly fitted) */}
              <div className="col-span-12 md:col-span-7 row-span-3 bg-gradient-to-b from-[#222] to-[#111] p-6 md:p-8 rounded-xl shadow-2xl">
                <h2 className="text-4xl font-bold text-[#00a99d] mb-8 font-['Bebas_Neue'] tracking-wider">NUESTROS VALORES</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col bg-[#333]/50 p-5 rounded-xl h-full">
                    <div className="w-14 h-14 rounded-full bg-[#ffa500] flex items-center justify-center mb-4 mx-auto">
                      <Heart className="w-8 h-8 text-black" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-3 font-['Bebas_Neue'] tracking-wider">PASIÓN</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        Vivimos y respiramos motocicletas. Cada reparación es un acto de amor por la mecánica de precisión.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col bg-[#333]/50 p-5 rounded-xl h-full">
                    <div className="w-14 h-14 rounded-full bg-[#ffa500] flex items-center justify-center mb-4 mx-auto">
                      <Shield className="w-8 h-8 text-black" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-3 font-['Bebas_Neue'] tracking-wider">EXCELENCIA</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        No aceptamos lo "suficientemente bueno". Cada detalle debe ser perfecto para montar en tu moto.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col bg-[#333]/50 p-5 rounded-xl h-full">
                    <div className="w-14 h-14 rounded-full bg-[#ffa500] flex items-center justify-center mb-4 mx-auto">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-bold mb-3 font-['Bebas_Neue'] tracking-wider">INNOVACIÓN</h3>
                      <p className="text-white/80 text-base leading-relaxed">
                        Adoptamos las últimas tecnologías para mantener tu moto a la vanguardia del rendimiento.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                        alt="Motorcycle engine"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="https://mail.nitro.pe/images/2015/noviembre/kawasaki_ninja_h2r.jpg"
                        alt="Motorcycle tools"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                        alt="Motorcycle service"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="mt-16 bg-[#111]/70 p-8 rounded-xl shadow-2xl border border-[#333]">
              <h2 className="text-4xl font-bold text-[#00a99d] mb-12 text-center font-['Bebas_Neue'] tracking-wider">EL EQUIPO</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#222] p-6 rounded-xl shadow-lg border border-[#ffa500]/20">
                  <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[#ffa500]">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                      alt="Mechanic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center font-['Bebas_Neue'] tracking-wider">CARLOS MÉNDEZ</h3>
                  <p className="text-[#ffa500] text-center mb-4 text-lg">JEFE DE TALLER</p>
                  <p className="text-white/80 text-base text-center leading-relaxed">
                    "20 años resucitando motores que otros dan por perdidos. La precisión es mi religión."
                  </p>
                </div>

                <div className="bg-[#222] p-6 rounded-xl shadow-lg border border-[#00a99d]/20">
                  <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[#00a99d]">
                    <img
                      src="https://images.unsplash.com/photo-1601758003122-53c40e686a19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="Mechanic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center font-['Bebas_Neue'] tracking-wider">LAURA RAMÍREZ</h3>
                  <p className="text-[#00a99d] text-center mb-4 text-lg">DIRECTORA TÉCNICA</p>
                  <p className="text-white/80 text-base text-center leading-relaxed">
                    "Cada moto es un lienzo y la mecánica nuestro arte. No hay desafío que no podamos superar."
                  </p>
                </div>

                <div className="bg-[#222] p-6 rounded-xl shadow-lg border border-[#ffa500]/20">
                  <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[#ffa500]">
                    <img
                      src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
                      alt="Mechanic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center font-['Bebas_Neue'] tracking-wider">JAVIER LÓPEZ</h3>
                  <p className="text-[#ffa500] text-center mb-4 text-lg">ESPECIALISTA ELECTRÓNICO</p>
                  <p className="text-white/80 text-base text-center leading-relaxed">
                    "La electrónica es el alma de las motos modernas. Mi trabajo es mantener esa alma vibrante."
                  </p>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="mt-16 text-center bg-[#00a99d]/10 p-12 rounded-xl border border-[#00a99d]/30 shadow-2xl">
              <h3 className="text-4xl font-bold text-[#ffa500] mb-6 font-['Bebas_Neue'] tracking-wider">¡GRACIAS POR ELEGIRNOS!</h3>
              <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                En <span className="font-bold text-[#ffa500]">MotoHighPerformance</span>, no somos solo mecánicos, somos <span className="italic">artesanos del asfalto</span>.
                Cada moto que entra por nuestras puertas recibe el trato de una obra maestra, porque sabemos que para ti no es solo un vehículo, es <span className="text-[#00a99d]">pasión sobre ruedas</span>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default NosotrosPage
