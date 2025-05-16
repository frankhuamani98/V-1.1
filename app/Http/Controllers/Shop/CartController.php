<?php

namespace App\Http\Controllers\Shop;

use App\Models\CartItem;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class CartController extends Controller
{
    /**
     * Get all cart items for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cartItems = Auth::user()->cartItems()->get();
        
        return response()->json([
            'success' => true,
            'data' => $cartItems
        ]);
    }
    
    /**
     * Add a product to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'quantity' => 'required|integer|min:1'
        ]);
        
        $producto = Producto::findOrFail($request->producto_id);
        
        $existingItem = Auth::user()->cartItems()
            ->where('producto_id', $producto->id)
            ->first();
            
        if ($existingItem) {
            $existingItem->quantity += $request->quantity;
            $existingItem->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Cantidad actualizada en el carrito',
                'data' => $existingItem
            ]);
        }
        
        $precio = $producto->precio;
        $descuento = $producto->descuento ?? 0;
        $precio_final = $producto->precio_final ?? $precio;
        
        if (!$producto->precio_final && $descuento > 0) {
            $precio_final = $precio - ($precio * $descuento / 100);
        }
        
        $cartItem = new CartItem([
            'producto_id' => $producto->id,
            'nombre' => $producto->nombre,
            'precio' => $precio,
            'precio_final' => $precio_final,
            'igv' => $producto->incluye_igv ? ($precio_final * 0.18) : null,
            'descuento' => $descuento,
            'quantity' => $request->quantity,
            'imagen' => $producto->imagen_principal
        ]);
        
        Auth::user()->cartItems()->save($cartItem);
        
        return response()->json([
            'success' => true,
            'message' => 'Producto añadido al carrito',
            'data' => $cartItem
        ]);
    }
    
    /**
     * Update the quantity of a cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        
        $cartItem = Auth::user()->cartItems()->findOrFail($id);
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Cantidad actualizada',
            'data' => $cartItem
        ]);
    }
    
    /**
     * Remove a cart item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cartItem = Auth::user()->cartItems()->findOrFail($id);
        $cartItem->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado del carrito'
        ]);
    }
    
    /**
     * Clear all cart items for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear()
    {
        Auth::user()->cartItems()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Carrito vaciado'
        ]);
    }
}
