import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
import WhatsAppButton from '@/Components/WhatsAppButton';
import { TrashIcon, HeartIcon, ShoppingCartIcon, ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
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
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Head title="Mis Favoritos" />
      <Header />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="group relative overflow-hidden rounded-full pl-10 pr-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-300 hover:shadow-md"
              >
                <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="absolute left-0 top-0 flex h-full w-10 items-center justify-center rounded-l-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors">
                  <ArrowLeftIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </span>
                <span className="relative">Volver a la tienda</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Mis Favoritos</h1>
            <div className="w-[100px]"></div>
          </div>

          {favoriteItems.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="pt-10">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <HeartIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No tienes favoritos</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Añade productos a tus favoritos para verlos aquí</p>
                <Link href="/">
                  <Button 
                    className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300 py-2.5 px-6 rounded-full group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/0 via-indigo-500/10 to-indigo-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                    <span className="relative flex items-center">
                      <ShoppingBagIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span>Explorar productos</span>
                    </span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {favoriteItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Link href={`/productos/${item.producto_id}`}>
                        <div className="w-full h-52 overflow-hidden bg-white dark:bg-slate-950">
                          <img
                            src={handleImageUrl(item.imagen)}
                            alt={item.nombre}
                            className="w-full h-52 object-cover object-center hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.png';
                            }}
                          />
                        </div>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110 text-red-500 hover:text-red-600 border-0 hover:bg-white/95 dark:hover:bg-slate-900/95 transition-all duration-300 ease-in-out"
                        disabled={loading}
                      >
                        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        <TrashIcon className="w-4 h-4 relative z-10" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <Link href={`/productos/${item.producto_id}`} className="hover:text-indigo-600 transition-colors">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">{item.nombre}</h3>
                      </Link>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {formatPrice(item.precio_final)}
                          </div>
                          {item.descuento > 0 && (
                            <div className="flex items-center mt-1">
                              <Badge variant="destructive" className="text-xs font-medium bg-red-100 text-red-700 hover:bg-red-100 hover:text-red-700">
                                -{item.descuento}%
                              </Badge>
                              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 line-through">
                                {formatPrice(item.precio)}
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge variant={item.estado === 'Activo' ? 'default' : 'secondary'} className={`${item.estado === 'Activo' ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {item.estado}
                        </Badge>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300 py-2.5 rounded-lg group relative overflow-hidden"
                        onClick={() => handleAddToCart(item)}
                        disabled={loading || item.estado !== 'Activo'}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400/0 via-indigo-400/20 to-indigo-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                        <span className="relative flex items-center justify-center">
                          <ShoppingCartIcon className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                          <span>Añadir al carrito</span>
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botón para vaciar favoritos */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowClearDialog(true)}
                  className="relative overflow-hidden text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:shadow-md dark:border-red-900/50 rounded-full px-6 py-2.5 group transition-all duration-300"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative flex items-center">
                    <TrashIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span>Vaciar favoritos</span>
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación para vaciar favoritos */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Esta acción eliminará todos los productos de tu lista de favoritos.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={loading} 
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-lg"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearFavorites}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
              <span className="relative">
                {loading ? "Eliminando..." : "Sí, vaciar favoritos"}
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <WhatsAppButton />
      <Footer />
    </div>
  );
} 