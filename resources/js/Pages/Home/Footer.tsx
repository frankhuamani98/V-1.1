import React from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Separator } from "@/Components/ui/separator";
import "../../../css/app.css";
import "../../../css/Icons.css";

import { FaTiktok } from 'react-icons/fa';
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
  ChevronRightIcon
} from "lucide-react";

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

  return (
    <footer className="bg-[var(--custom-footer)] text-white pt-12 pb-6">
      {/* Payment and Shipping Info */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <CreditCardIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Pago Seguro</h4>
              <p className="text-xs text-neutral-400">Múltiples métodos de pago</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Envío Rápido</h4>
              <p className="text-xs text-neutral-400">A todo el país</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Garantía de Calidad</h4>
              <p className="text-xs text-neutral-400">Productos originales</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 bg-[var(--custom-blue)] rounded-full flex items-center justify-center mb-2 sm:mb-0">
              <HeadphonesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-sm">Soporte 24/7</h4>
              <p className="text-xs text-neutral-400">Atención personalizada</p>
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-800 my-8" />
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* About Column */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center sm:justify-start">
              <span className="mr-2">Rudolf</span>Motors
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Somos especialistas en partes y accesorios para motocicletas, ofreciendo la más amplia selección de productos de alta calidad para todas las marcas y modelos.
            </p>
            <ul className="flex space-x-4 justify-center sm:justify-start">
              <li className="icon facebook">
                <a href="https://www.facebook.com/share/18iALvh7gW/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              </li>
              <li className="icon instagram">
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10">
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

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4 flex justify-center sm:justify-start">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {["Inicio", "Catálogo", "Ofertas", "Sobre Nosotros", "Contacto", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group">
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">Categorías</h3>
            <ul className="space-y-3">
              {["Repuestos de Motor", "Sistemas de Freno", "Suspensión", "Accesorios", "Neumáticos", "Lubricantes", "Equipamiento"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 text-sm hover:text-neutral-200 transition-colors flex items-center justify-center sm:justify-start group">
                    <ChevronRightIcon className="h-4 w-4 mr-2 text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-4">Mantente Informado</h3>
            <p className="text-neutral-400 text-sm mb-5">
              Suscríbete para recibir las últimas novedades, ofertas exclusivas y consejos para el mantenimiento de tu moto.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3 max-w-xs mx-auto sm:mx-0">
              <div className="flex">
                <Input
                  type="email"
                  name="email"
                  placeholder="Tu correo electrónico"
                  className="bg-neutral-800 border-neutral-700 text-sm rounded-l-md"
                />
                <Button type="submit" className="bg-[var(--custom-blue)] hover:bg-blue-900 rounded-l-none px-4">
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-neutral-500">
                Al suscribirte, aceptas nuestra política de privacidad.
              </p>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-neutral-800">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 bg-[var(--custom-blue)] rounded-full flex items-center justify-center">
              <MapPinIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-neutral-400">
              <a href="https://maps.app.goo.gl/aihry7fG7kKrb5xp6"
                target="_blank" rel="noopener noreferrer" className="hover:text-neutral-200 transition-colors"> Av Huayna Capac 168, Cusco </a>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-[var(--custom-blue)] rounded-full flex items-center justify-center">
              <PhoneIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-neutral-400">+51 997 205 032</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-3">
            <div className="w-10 h-10 bg-[var(--custom-blue)] rounded-full flex items-center justify-center">
              <MailIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-neutral-400">
              <a href="mailto:rogeralfarohuaman@gmail.com" className="hover:text-neutral-200 transition-colors">rogeralfarohuaman@gmail.com </a>
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-800">
  <div className="text-left mb-4 md:mb-0 md:w-1/3">
    <p className="text-xs text-neutral-500">
      © {currentYear} student. Todos los derechos reservados.
    </p>
  </div>
  <div className="flex flex-col items-center mb-4 md:mb-0 md:w-1/3">
    <div className="flex flex-wrap justify-center gap-2 mt-2 sm:mt-4">
      <img src="https://cdn.brandfetch.io/id08GK8vip/w/960/h/960/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" alt="Yape" className="h-8 opacity-70 hover:opacity-100 transition-opacity rounded-lg" />
      <img src="https://plin.pe/wp-content/themes/plin/favicon/apple-icon-57x57.png" alt="Plin" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
      <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
      <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="MasterCard" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
      <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="PayPal" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
      <img src="https://cdn-icons-png.flaticon.com/128/5968/5968299.png" alt="Apple Pay" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
    </div>
  </div>
  <div className="text-center mb-4 md:mb-0 md:w-1/3">
    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
      <a href="#" className="text-xs text-neutral-500 hover:text-[var(--custom-blue)] transition-colors">Términos y Condiciones</a>
      <a href="#" className="text-xs text-neutral-500 hover:text-[var(--custom-blue)] transition-colors">Política de Privacidad</a>
      <a href="#" className="text-xs text-neutral-500 hover:text-[var(--custom-blue)] transition-colors">Política de Cookies</a>
    </div>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;
