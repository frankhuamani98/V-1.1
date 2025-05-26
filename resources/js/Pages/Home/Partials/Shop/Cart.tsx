import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Header from '../../Header';
import Footer from '../../Footer';
import { TrashIcon, ShoppingCartIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="Mi Carrito" />
      <Header />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              <span>Volver a la tienda</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mx-auto pr-12">Mi Carrito</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-500 dark:text-gray-300 mb-8">Añade productos a tu carrito para comenzar a comprar</p>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
                <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div className="col-span-6 font-medium text-gray-700 dark:text-gray-100">Producto</div>
                  <div className="col-span-2 font-medium text-gray-700 dark:text-gray-100 text-center">Precio</div>
                  <div className="col-span-2 font-medium text-gray-700 dark:text-gray-100 text-center">Cantidad</div>
                  <div className="col-span-2 font-medium text-gray-700 dark:text-gray-100 text-right">Subtotal</div>
                </div>

                {/* Lista de productos */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 md:p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      {/* Producto (móvil y escritorio) */}
                      <div className="col-span-6 flex items-start mb-4 md:mb-0">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
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
                              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                                <Link href={`/productos/${item.producto_id}`} className="hover:text-blue-600 transition-colors">
                                  {item.nombre}
                                </Link>
                              </h3>
                            </div>
                            {item.descuento > 0 && (
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-red-600">-{item.descuento}%</span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-300 line-through">
                                  {formatPrice(item.precio)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-1 flex md:hidden justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatPrice(item.precio_final)}</p>
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="font-medium text-red-600 hover:text-red-800 flex items-center transition-colors text-sm"
                                disabled={loading}
                              >
                                <TrashIcon className="w-4 h-4 mr-1" />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Precio (solo escritorio) */}
                      <div className="col-span-2 hidden md:block text-center">
                        <span className="text-base font-medium text-gray-900 dark:text-gray-100">{formatPrice(item.precio_final)}</span>
                      </div>

                      {/* Cantidad (móvil y escritorio) */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex border border-gray-300 dark:border-gray-700 rounded-md">
                          <button
                            type="button"
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:text-gray-300"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1 || loading}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <div className="w-10 text-center py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.quantity}
                          </div>
                          <button
                            type="button"
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:text-gray-300"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={item.quantity >= item.stock || loading}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal y acciones (escritorio) */}
                      <div className="col-span-2 hidden md:flex md:items-center md:justify-end">
                        <span className="text-base font-medium text-gray-900 dark:text-gray-100 mr-4">
                          {formatPrice(item.subtotal)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          disabled={loading}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Móvil: Subtotal */}
                      <div className="mt-4 md:hidden">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-300">Subtotal:</span>
                          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de precios */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Resumen de la orden</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-base text-gray-700 dark:text-gray-200">Subtotal</span>
                      <span className="text-base font-medium text-gray-900 dark:text-gray-100">{formatPrice(total)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                      <span className="text-lg font-medium text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowClearDialog(true)}
                  className="text-red-600 hover:text-red-800 border border-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg py-3 px-6 transition-colors"
                  disabled={loading}
                >
                  Vaciar carrito
                </button>
                <Link
                  href="/checkout/informacion"
                  className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 transition-colors flex-1 text-center"
                >
                  Proceder al pago
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación para vaciar carrito */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos los productos de tu carrito de compras.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Eliminando..." : "Sí, vaciar carrito"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}