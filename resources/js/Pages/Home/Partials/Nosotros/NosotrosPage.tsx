import type React from "react"
import Header from "../../Header"
import Footer from "../../Footer"
import WhatsAppButton from "@/Components/WhatsAppButton"
import { Head } from "@inertiajs/react"
import { Award, Wrench, Target, Users, Heart, Shield, User, UserCog, Briefcase, Settings, BadgeCheck } from "lucide-react"
import { Card } from "@/Components/ui/card"

interface MiembroEquipo {
  id: number
  nombre: string
  cargo: string
  descripcion: string
  imagen: string
  activo: boolean
}

interface Props {
  equipo: MiembroEquipo[]
}

const NosotrosPage: React.FC<Props> = ({ equipo }) => {
  return (
    <>
      <Head title="Sobre Nosotros" />
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900">
        <section className="relative h-[60vh] flex items-center bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900">
          <div className="container mx-auto px-6 relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-['Bebas_Neue']">
              RUDOLF<br/>
              <span className="text-[#00a99d]">MOTOS</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Desde 2020, brindando servicio técnico especializado y repuestos de alta calidad.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 font-['Bebas_Neue']">MISIÓN</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Somos una organización dedicada a la venta de repuestos de alta calidad para motocicletas, 
                  y satisfacer las necesidades de los clientes y dar soluciones a los problemas que presentan 
                  las motocicletas en el menor tiempo posible.
                </p>
              </div>
              
              <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 font-['Bebas_Neue']">VISIÓN</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Ser la organización líder en venta de repuestos de alta calidad para motocicletas e importar 
                  directamente desde china los repuestos, accesorios, motocicletas y comercializar en todo el 
                  territorio peruano.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-8 font-['Bebas_Neue'] text-center">NUESTRA HISTORIA</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300">
              <p className="text-lg leading-relaxed">
                El 10 de junio del año 2020, RODOLFO ALFARO H, como representante legal, decidió fundar RUDOLF MOTOS 
                en medio de la pandemia de COVID-19, cuando el mundo entero estaba sumido en la incertidumbre.
              </p>
              <p className="text-lg leading-relaxed">
                A pesar de los desafíos, el joven RODOLFO ALFARO H, experto en mecánica de motocicletas, 
                vio una oportunidad única en el auge del mercado de las motocicletas, que alcanzó máximos 
                históricos durante ese período.
              </p>
              <p className="text-lg leading-relaxed">
                Hoy en día, la empresa está bien posicionada en el mercado, ofreciendo repuestos, 
                accesorios, cascos y servicios de taller mecánico a un público de economía regular a alta, 
                segmentando su nicho de mercado de manera efectiva.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12 font-['Bebas_Neue']">
              NUESTROS VALORES
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-6 h-6"/>,
                  title: "COMPROMISO",
                  description: "Dedicados a cumplir con las expectativas de nuestros clientes y a mejorar constantemente nuestros estándares de servicio."
                },
                {
                  icon: <Shield className="w-6 h-6"/>,
                  title: "RESPONSABILIDAD SOCIAL",
                  description: "Conscientes del impacto ambiental y social, trabajamos para contribuir positivamente a la comunidad."
                },
                {
                  icon: <Award className="w-6 h-6"/>,
                  title: "INTEGRIDAD",
                  description: "Mantenemos la transparencia y la honestidad en todas nuestras operaciones y relaciones comerciales."
                },
                {
                  icon: <Target className="w-6 h-6"/>,
                  title: "CALIDAD",
                  description: "Comprometidos a proporcionar repuestos de motocicletas de alta calidad para garantizar la seguridad."
                },
                {
                  icon: <Wrench className="w-6 h-6"/>,
                  title: "EXCELENCIA",
                  description: "Buscamos continuamente la excelencia en productos, servicios y procesos para satisfacer las necesidades."
                },
                {
                  icon: <Users className="w-6 h-6"/>,
                  title: "LEALTAD",
                  description: "Comprometidos con tu pasión, te acompañamos en cada kilómetro recorrido."
                }
              ].map((valor, index) => (
                <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00a99d] flex items-center justify-center text-white">
                    {valor.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3 font-['Bebas_Neue']">
                    {valor.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                    {valor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold text-center text-white mb-4 font-['Bebas_Neue']">
              NUESTRO EQUIPO
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
              Profesionales comprometidos con la excelencia en cada servicio
            </p>
            
            {equipo && equipo.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {equipo.map((miembro) => (
                  <Card key={miembro.id} className="bg-gray-800 border-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={miembro.imagen}
                        alt={miembro.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-white mb-1 font-['Bebas_Neue']">
                        {miembro.nombre.toUpperCase()}
                      </h3>
                      <h4 className="text-[#00a99d] text-md mb-3 flex items-center gap-1.5">
                        <BadgeCheck className="w-4 h-4" />
                        {miembro.cargo}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {miembro.descripcion}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { 
                    role: "GERENTE",
                    description: "Dirección estratégica y liderazgo empresarial",
                    icon: <User className="w-10 h-10" />
                  },
                  { 
                    role: "ADMINISTRADOR(A)", 
                    description: "Optimización de procesos y recursos",
                    icon: <UserCog className="w-10 h-10" />
                  },
                  { 
                    role: "JEFE(A) DE VENTAS",
                    description: "Gestión comercial y satisfacción del cliente",
                    icon: <Briefcase className="w-10 h-10" />
                  },
                  { 
                    role: "JEFE DE TALLER",
                    description: "Excelencia técnica y control de calidad",
                    icon: <Settings className="w-10 h-10" />
                  }
                ].map((member, index) => (
                  <div key={index} className="flex flex-col items-center p-6 bg-gray-800 dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-20 h-20 rounded-full bg-[#00a99d]/20 flex items-center justify-center mb-4 border-2 border-[#00a99d]">
                      <div className="text-[#00a99d]">
                        {member.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-['Bebas_Neue'] text-center">
                      {member.role}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed text-center">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  )
}

export default NosotrosPage
