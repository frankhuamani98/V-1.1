import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
import { TrashIcon, ShoppingCartIcon, MinusIcon, PlusIcon, ArrowLeftIcon, ShoppingBagIcon, CreditCardIcon } from 'lucide-react';
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

interface CartItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  descuento: number;
  precio_final: number;
  imagen: string;
  quantity: number;
  stock: number;
  estado: string;
  subtotal: number; 
}

interface CartProps {
  cartItems: CartItem[];
  total: number;
}

export default function Cart({ cartItems: initialCartItems, total: initialTotal }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [total, setTotal] = useState<number>(initialTotal);
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

  const handleQuantityChange = (id: number, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1 || newQuantity > item.stock) return;

    setLoading(true);
    axios.put(`/cart/${id}`, { quantity: newQuantity })
      .then(response => {
        if (response.data.success) {
          const updatedItems = cartItems.map(item => {
            if (item.id === id) {
              const updatedItem = {
                ...item,
                quantity: newQuantity,
                subtotal: item.precio_final * newQuantity,
              };
              return updatedItem;
            }
            return item;
          });
          
          setCartItems(updatedItems);
          setTotal(updatedItems.reduce((sum, item) => sum + item.subtotal, 0));
          
          toast.success('Cantidad actualizada', {
            duration: 3000,
          });
        }
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
        toast.error('Error al actualizar cantidad', {
          duration: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveItem = (id: number) => {
    setLoading(true);
    axios.delete(`/cart/${id}`)
      .then(response => {
        if (response.data.success) {
          const updatedItems = cartItems.filter(item => item.id !== id);
          setCartItems(updatedItems);
          setTotal(updatedItems.reduce((sum, item) => sum + item.subtotal, 0));
          
          toast.success('Producto eliminado del carrito', {
            duration: 3000,
          });
          
          const event = new CustomEvent('cart-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error('Error removing item:', error);
        toast.error('Error al eliminar producto', {
          duration: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearCart = () => {
    setLoading(true);
    axios.delete('/cart')
      .then(response => {
        if (response.data.success) {
          setCartItems([]);
          setTotal(0);
          
          toast.success('Carrito vaciado', {
            duration: 3000,
          });
          
          const event = new CustomEvent('cart-updated');
          window.dispatchEvent(event);
        }
      })
      .catch(error => {
        console.error('Error clearing cart:', error);
        toast.error('Error al vaciar el carrito', {
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
      <Head title="Mi Carrito" />
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Mi Carrito</h1>
            <div className="w-[100px]"></div>
          </div>

          {cartItems.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="pt-10">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <ShoppingCartIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Tu carrito está vacío</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Añade productos a tu carrito para comenzar a comprar</p>
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
              <Card className="mb-8 border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <div className="col-span-6 font-medium text-slate-700 dark:text-slate-300">Producto</div>
                  <div className="col-span-2 font-medium text-slate-700 dark:text-slate-300 text-center">Precio</div>
                  <div className="col-span-2 font-medium text-slate-700 dark:text-slate-300 text-center">Cantidad</div>
                  <div className="col-span-2 font-medium text-slate-700 dark:text-slate-300 text-right">Subtotal</div>
                </div>

                {/* Lista de productos */}
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      {/* Producto (móvil y escritorio) */}
                      <div className="col-span-6 flex items-start mb-4 md:mb-0">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                          <img
                            src={handleImageUrl(item.imagen)}
                            alt={item.nombre}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.png';
                            }}
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                                <Link href={`/productos/${item.producto_id}`} className="hover:text-indigo-600 transition-colors">
                                  {item.nombre}
                                </Link>
                              </h3>
                            </div>
                            {(item.precio > item.precio_final) && (
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
                          <div className="mt-1 flex md:hidden justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatPrice(item.precio_final)}</p>
                            </div>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                disabled={loading}
                              >
                                <TrashIcon className="w-3.5 h-3.5 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Precio (solo escritorio) */}
                      <div className="col-span-2 hidden md:block text-center">
                        <span className="text-base font-medium text-slate-900 dark:text-slate-100">{formatPrice(item.precio_final)}</span>
                      </div>

                      {/* Cantidad (móvil y escritorio) */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-950">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none rounded-l-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:text-slate-300 dark:disabled:text-slate-600 transition-all duration-200 relative overflow-hidden group"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1 || loading}
                          >
                            <span className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <MinusIcon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                          </Button>
                          <div className="w-10 text-center py-2 text-sm font-medium text-slate-900 dark:text-slate-100 border-x border-slate-200 dark:border-slate-700">
                            {item.quantity}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none rounded-r-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:text-slate-300 dark:disabled:text-slate-600 transition-all duration-200 relative overflow-hidden group"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={item.quantity >= item.stock || loading}
                          >
                            <span className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            <PlusIcon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal y acciones (escritorio) */}
                      <div className="col-span-2 hidden md:flex md:items-center md:justify-end">
                        <span className="text-base font-medium text-slate-900 dark:text-slate-100 mr-4">
                          {formatPrice(item.subtotal)}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-110 text-red-500 hover:text-red-600 border-0 hover:bg-white/95 dark:hover:bg-slate-900/95 transition-all duration-300 ease-in-out"
                          disabled={loading}
                        >
                          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                          <TrashIcon className="w-4 h-4 relative z-10" />
                        </Button>
                      </div>

                      {/* Móvil: Subtotal */}
                      <div className="mt-4 md:hidden">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal:</span>
                          <span className="text-base font-medium text-slate-900 dark:text-slate-100">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de precios */}
              <Card className="mb-8 border-slate-200 dark:border-slate-800 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">Resumen de la orden</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-base text-slate-600 dark:text-slate-300">Subtotal</span>
                      <span className="text-base font-medium text-slate-900 dark:text-slate-100">{formatPrice(total)}</span>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-slate-900 dark:text-slate-100">Total</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowClearDialog(true)}
                  className="relative overflow-hidden text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:shadow-md dark:border-red-900/50 rounded-full px-6 py-2.5 group transition-all duration-300"
                  disabled={loading}
                >
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative flex items-center">
                    <TrashIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span>Vaciar carrito</span>
                  </span>
                </Button>
                <Link
                  href="/checkout/informacion"
                  className="flex-1"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300 py-2.5 rounded-lg group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400/0 via-indigo-400/20 to-indigo-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                    <span className="relative flex items-center justify-center">
                      <CreditCardIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span>Proceder al pago</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación para vaciar carrito */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Esta acción eliminará todos los productos de tu carrito de compras.
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
              onClick={handleClearCart}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
              <span className="relative">
                {loading ? "Eliminando..." : "Sí, vaciar carrito"}
              </span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}