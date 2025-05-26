import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
import { TrashIcon, HeartIcon, ShoppingCartIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

interface FavoriteItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  descuento: number;
  precio_final: number;
  imagen: string;
  estado: string;
}

interface FavoritesProps {
  favoriteItems: FavoriteItem[];
}

export default function Favorites({ favoriteItems: initialFavoriteItems }: FavoritesProps) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>(initialFavoriteItems);
  const [loading, setLoading] = useState<boolean>(false);
  const [showClearDialog, setShowClearDialog] = useState<boolean>(false);
  const { auth } = usePage<PageProps>().props;

  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replace('PEN', 'S/');
  };

  const handleImageUrl = (image: string): string => {
    return image?.startsWith('http') ? image : `/storage/${image}`;
  };

  const handleRemoveItem = (id: number) => {
    setLoading(true);
    axios.delete(`/favorites/${id}`)
      .then(response => {
        if (response.data.success) {
          setFavoriteItems(prev => prev.filter(item => item.id !== id));
          
          toast.success('Producto eliminado de favoritos', {
            duration: 3000,
          });
          
          const event = new CustomEvent('favorites-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error('Error removing from favorites:', error);
        toast.error('Error al eliminar de favoritos', {
          duration: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddToCart = (item: FavoriteItem) => {
    setLoading(true);
    
    window.dispatchEvent(new CustomEvent('add-to-cart', { 
      detail: {
        id: item.id,
        producto_id: item.producto_id,
        nombre: item.nombre,
        precio: item.precio,
        descuento: item.descuento,
        quantity: 1,
        imagen: item.imagen
      }
    }));

    axios.post('/cart/add', {
      producto_id: item.producto_id,
      quantity: 1
    })
    .then(response => {
      if (response.data.success) {
        toast.success(`${item.nombre} añadido al carrito`, {
          duration: 3000, 
        });
        
        const event = new CustomEvent('cart-updated');
        window.dispatchEvent(event);
      } else if (response.data.message === "El producto ya está en el carrito") {
        toast.info(`${item.nombre} ya está en el carrito`, {
          duration: 3000,
        });
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      
      if (error.response) {
        const { data } = error.response;
        if (data && data.message) {
          toast.error(data.message, {
            duration: 3000,
          });
        } else if (error.response.status === 422) {
          toast.error('No se pudo añadir el producto (error de validación)', {
            duration: 3000,
          });
        } else if (error.response.status === 404) {
          toast.error('El producto no está disponible actualmente', {
            duration: 3000,
            
          });
        } else if (error.response.status === 400) {
          toast.error('No hay suficiente stock disponible', {
            duration: 3000,
          });
        } else {
          toast.error(`Error al añadir al carrito: ${error.response.status}`, {
            duration: 3000,
          });
        }
      } else if (error.request) {
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión', {
          duration: 3000,
        });
      } else {
        toast.error('Error al añadir al carrito', {
          duration: 3000,
        });
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleClearFavorites = () => {
    setLoading(true);
    axios.delete('/favorites')
      .then(response => {
        if (response.data.success) {
          setFavoriteItems([]);
          
          toast.success('Favoritos vaciados', {
            duration: 3000,
          });
          
          const event = new CustomEvent('favorites-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error('Error clearing favorites:', error);
        toast.error('Error al vaciar favoritos', {
          duration: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
        setShowClearDialog(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="Mis Favoritos" />
      <Header />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              <span>Volver a la tienda</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mx-auto pr-12">Mis Favoritos</h1>
          </div>

          {favoriteItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <HeartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No tienes favoritos</h2>
              <p className="text-gray-500 mb-8">Añade productos a tus favoritos para verlos aquí</p>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {favoriteItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Link href={`/productos/${item.producto_id}`}>
                        <img
                          src={handleImageUrl(item.imagen)}
                          alt={item.nombre}
                          className="w-full h-52 object-cover object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.png';
                          }}
                        />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-red-50 text-red-600 transition-colors"
                        disabled={loading}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <Link href={`/productos/${item.producto_id}`} className="hover:text-blue-600 transition-colors">
                        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">{item.nombre}</h3>
                      </Link>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(item.precio_final)}
                          </div>
                          {item.descuento > 0 && (
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-red-600">-{item.descuento}%</span>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatPrice(item.precio)}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.estado === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.estado}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        disabled={loading || item.estado !== 'Activo'}
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón para vaciar favoritos */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowClearDialog(true)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 border border-red-600 hover:bg-red-50 rounded-lg py-3 px-6 transition-colors"
                  disabled={loading}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Vaciar favoritos
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación para vaciar favoritos */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos los productos de tu lista de favoritos.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearFavorites}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Eliminando..." : "Sí, vaciar favoritos"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
} 