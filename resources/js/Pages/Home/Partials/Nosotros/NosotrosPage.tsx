import React from 'react';
import Header from '@/Pages/Home/Header';
import Footer from '@/Pages/Home/Footer';
import WhatsAppButton from '@/Components/WhatsAppButton';
import { Head } from '@inertiajs/react';

const NosotrosPage: React.FC = () => {
  return (
    <>
      <Head title="Sobre Nosotros" />
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Sobre Nosotros</h1>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Bienvenido a nuestra página "Sobre Nosotros". Aquí compartiremos la historia de nuestra empresa, nuestra misión, visión y los valores que nos impulsan cada día.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Somos un equipo apasionado dedicado a ofrecer [describe tu producto/servicio principal] de la más alta calidad. Creemos firmemente en [menciona un valor fundamental, ej: la innovación, la satisfacción del cliente, la sostenibilidad].
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-4">Nuestra Historia</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              [Aquí puedes agregar un breve resumen de la historia de la empresa. Cuándo se fundó, por quién, y algunos hitos importantes.]
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-4">Nuestra Misión</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              [Describe la misión de tu empresa. ¿Cuál es su propósito principal?]
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-4">Nuestra Visión</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              [Describe la visión a futuro de tu empresa. ¿Hacia dónde se dirige?]
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-6">
              Gracias por visitarnos y por tu interés en conocernos más.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default NosotrosPage;
