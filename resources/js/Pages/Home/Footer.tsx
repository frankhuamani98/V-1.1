import React from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Separator } from "@/Components/ui/separator";
import { Link, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ArrowRightIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeadphonesIcon,
  ChevronRightIcon,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import "../../../css/app.css";
import "../../../css/Icons.css";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  username: string;
  email: string;
}

interface PageProps {
  auth: {
    user: User;
  };
  categoriasMenu?: Array<{
    id: number;
    nombre: string;
    estado: string;
    subcategorias: Array<{
      id: number;
      nombre: string;
      estado: string;
    }>;
  }>;
  categoriasServicio?: Array<{
    id: number;
    nombre: string;
  }>;
  [key: string]: any;
}

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = new FormData(form).get("email") as string;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    toast.success("¡Gracias por suscribirte!", {
      description: "Recibirás nuestras últimas ofertas y novedades."
    });
    form.reset();
  };

  const currentYear = new Date().getFullYear();
  const { categoriasMenu = [], categoriasServicio = [] } = usePage<PageProps>().props;

  const categoriasActivas = categoriasMenu?.filter?.(categoria => categoria.estado === "Activo") || [];

  return (
    <footer className="bg-[var(--custom-footer)] text-white pt-12 pb-6">
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <CreditCardIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Pagos Seguros</h4>
              <p className="text-xs text-neutral-400">Pagos digitales y en tienda</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Envío y Retiro</h4>
              <p className="text-xs text-neutral-400">Entrega rápida y segura</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Garantía de Calidad</h4>
              <p className="text-xs text-neutral-400">Productos originales garantizados</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <HeadphonesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Soporte Especializado</h4>
              <p className="text-xs text-neutral-400">Asesoría profesional en motos</p>
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-800 my-8" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center sm:justify-start">
              <span className="mr-2">Rudolf</span>Motos
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Especialistas en repuestos y accesorios para motocicletas desde 2020. Comprometidos con la calidad y el servicio técnico especializado para mantener tu moto en óptimas condiciones.
            </p>
            <ul className="flex space-x-4 justify-center sm:justify-start">
              <li className="icon facebook">
                <a href="https://www.facebook.com/share/18iALvh7gW/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              </li>
              <li className="icon instagram">
                <a href="https://www.instagram.com/rudolfmotos?igsh=MWRwZmJwZDRtemRtcA==" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10">
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </li>
              <li className="icon tiktok">
                <a href="https://www.tiktok.com/@rudolf_motors?_t=ZM-8uR1MIiFUZz&_r=1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10">
                  <FaTiktok className="h-5 w-5" />
                </a>
              </li>
              <li className="icon youtube">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10">
                  <YoutubeIcon className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>

            <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4 flex justify-center sm:justify-start">Menú Principal</h3>
            <ul className="space-y-3">
              <li>
              <a
                href="/"
                className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group"
              >
                <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                Inicio
              </a>
              </li>
              <li>
              <a
                href="/categorias"
                className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group"
              >
                <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                Productos
              </a>
              </li>
              <li>
              <Link
                href={route('nosotros')}
                className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group"
              >
                <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                Nosotros
              </Link>
              </li>
              <li>
              <a
                href="/contacto/contactanos"
                className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group"
              >
                <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                Contacto
              </a>
              </li>
            </ul>
            </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">Categorías</h3>
            <p className="text-neutral-400 text-sm mb-5">
              Explora nuestros productos y accesorios para motos
            </p>
            <ul className="space-y-3">
              {categoriasActivas.slice(0, 4).map((categoria) => (
                <li key={categoria.id}>
                  <a 
                    href={`/categorias/${categoria.id}`} 
                    className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group"
                  >
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {categoria.nombre}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="/categorias" 
                  className="text-neutral-300 text-sm hover:text-white transition-colors flex items-center justify-center sm:justify-start group"
                >
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-[var(--custom-blue)]" />
                  Ver todas las categorías
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">Servicios Técnicos</h3>
            <p className="text-neutral-400 text-sm mb-5">
              Ofrecemos una amplia gama de servicios para tu motocicleta
            </p>
            <ul className="space-y-3">
              {Array.isArray(categoriasServicio) && categoriasServicio.slice(0, 4).map((categoria) => (
                <li key={categoria.id}>
                  <a 
                    href={`/catalogo-servicios/categoria/${categoria.id}`} 
                    className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group"
                  >
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {categoria.nombre}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="/catalogo-servicios" 
                  className="text-neutral-300 text-sm hover:text-white transition-colors flex items-center justify-center sm:justify-start group"
                >
                  <ChevronRightIcon className="h-4 w-4 mr-2 text-[var(--custom-blue)]" />
                  Ver todos los servicios
                </a>
              </li>
            </ul>
          </div>
        </div>          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-neutral-800">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 bg-[var(--custom-blue)] rounded-full flex items-center justify-center">
              <MapPinIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-neutral-400">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=-13.521869713279548,-71.96909860496798" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-neutral-200 transition-colors"
              >
                <div>Taller Técnico Rudolf Motos</div>
              </a>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-[var(--custom-blue)] rounded-full flex items-center justify-center">
              <PhoneIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-neutral-400">+51 913 223 471</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <div className="w-10 h-10 bg-[var(--custom-blue)] rounded-full flex items-center justify-center">
              <MailIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-neutral-400">
              <a href="mailto:rogeralfarohuaman@gmail.com" className="hover:text-neutral-200 transition-colors">motosrudolf10062020@gmail.com</a>
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-800">
          <div className="text-left mb-4 md:mb-0 md:w-1/3">
            <p className="text-xs text-neutral-500">
              © {currentYear} DEFYMAJR. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex flex-col items-center mb-4 md:mb-0 md:w-1/3">
            <div className="flex flex-wrap justify-center gap-2 mt-2 sm:mt-4">
              <img src="https://cdn.brandfetch.io/id08GK8vip/w/960/h/960/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" alt="Yape" className="h-8 opacity-70 hover:opacity-100 transition-opacity rounded-lg" />
              <img src="https://plin.pe/wp-content/themes/plin/favicon/apple-icon-57x57.png" alt="Plin" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://play-lh.googleusercontent.com/gBpVaCpZsbBrLufT06aRpuLQvsUq1KAZUCEof_ps76mtB8_llJg3xv24mey8I0m3dUE=w240-h480-rw" alt="BCP" className="h-8 opacity-70 hover:opacity-100 transition-opacity rounded-lg" />
              <img src="https://logosandtypes.com/wp-content/uploads/2023/11/caja-cusco.svg" alt="Caja Cusco" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://play-lh.googleusercontent.com/SQpDeQodE-GEQkSYJNcZL6oGxCDZO4QZ6HLiW0zA1RQGrg-BnDPES47CG3NMWSbkDKk=w240-h480-rw" alt="Wayki" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://cdn.aglty.io/scotiabank-peru/imagenes/2022/logos/logo-scotiabank-symbol.svg" alt="Scotiabank" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="text-center mb-4 md:mb-0 md:w-1/3">
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
              <a 
                href="/pdf/terminosycondiciones.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-neutral-500 hover:text-[var(--custom-blue)] transition-colors"
              >
                Términos y condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
