import { toast } from "sonner";

export const addToCart = (product: any) => {
  if (isInCart(product.id)) {
    toast.info("Producto ya en carrito", {
      description: `${product.nombre || product.name} ya está en tu carrito.`,
      duration: 3000,
    });
    return false;
  }

  let finalPrice = product.precio || product.price;
  if (product.descuento && product.descuento > 0) {
    finalPrice = finalPrice - (finalPrice * product.descuento / 100);
  }

  const cartProduct = {
    id: product.id,
    nombre: product.nombre || product.name,
    precio: finalPrice,
    precio_original: product.precio || product.price,
    descuento: product.descuento || 0,
    imagen: product.imagen_principal || product.imagen || product.image,
    quantity: 1
  };

  const event = new CustomEvent('add-to-cart', { detail: cartProduct });
  window.dispatchEvent(event);
  return true;
};

export const addToFavorites = (product: any) => {
  if (isInFavorites(product.id)) {
    return false;
  }
  
  const favoriteProduct = {
    id: product.id,
    nombre: product.nombre || product.name,
    precio: product.precio || product.price,
    descuento: product.descuento || 0,
    imagen: product.imagen_principal || product.imagen || product.image
  };

  const event = new CustomEvent('add-to-favorites', { detail: favoriteProduct });
  window.dispatchEvent(event);
  return true;
};

export const getCartItems = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

export const getFavoriteItems = () => {
  if (typeof window !== 'undefined') {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }
  return [];
};

export const isInCart = (productId: number) => {
  const cart = getCartItems();
  return cart.some((item: any) => item.id === productId);
};

export const isInFavorites = (productId: number) => {
  const favorites = getFavoriteItems();
  return favorites.some((item: any) => item.id === productId);
};

export const removeFromCart = (productId: number) => {
  if (typeof window !== 'undefined') {
    const cart = getCartItems();
    const updatedCart = cart.filter((item: any) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);
    
    return updatedCart;
  }
  return [];
};

export const removeFromFavorites = (productId: number) => {
  if (typeof window !== 'undefined') {
    const favorites = getFavoriteItems();
    
    const productExists = favorites.some((item: any) => item.id === productId);
    if (!productExists) {
      return favorites;
    }
  
    const updatedFavorites = favorites.filter((item: any) => item.id !== productId);
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    const event = new CustomEvent('favorites-updated');
    window.dispatchEvent(event);
    
    return updatedFavorites;
  }
  return [];
};

export const updateCartItemQuantity = (productId: number, quantity: number) => {
  if (typeof window !== 'undefined') {
    const cart = getCartItems();
    const updatedCart = cart.map((item: any) => 
      item.id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);
    
    return updatedCart;
  }
  return [];
};

export const clearCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify([]));
    
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);
  }
};

export const calculateCartTotal = () => {
  const cart = getCartItems();
  return cart.reduce(
    (total: number, item: any) => total + item.precio * item.quantity, 
    0
  );
};

export const getCartCount = () => {
  const cart = getCartItems();
  return cart.reduce((total: number, item: any) => total + item.quantity, 0);
}; 