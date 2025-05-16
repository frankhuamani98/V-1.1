<?php

namespace App\Http\Controllers\Shop;

use App\Models\FavoriteItem;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class FavoriteController extends Controller
{
    /**
     * Get all favorite items for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $favoriteItems = Auth::user()->favoriteItems()->get();
        
        return response()->json([
            'success' => true,
            'data' => $favoriteItems
        ]);
    }
    
    /**
     * Add a product to favorites.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id'
        ]);
        
        $producto = Producto::findOrFail($request->producto_id);
        
        $existingItem = Auth::user()->favoriteItems()
            ->where('producto_id', $producto->id)
            ->first();
            
        if ($existingItem) {
            return response()->json([
                'success' => true,
                'message' => 'El producto ya está en favoritos',
                'data' => $existingItem
            ]);
        }
        
        $precio_original = $producto->precio;
        $descuento = $producto->descuento ?? 0;
        $precio_final = $producto->precio_final ?? $precio_original;
        
        if (!$producto->precio_final && $descuento > 0) {
            $precio_final = $precio_original - ($precio_original * $descuento / 100);
        }
        
        $favoriteItem = new FavoriteItem([
            'producto_id' => $producto->id,
            'nombre' => $producto->nombre,
            'precio' => $precio_original,
            'precio_original' => $precio_original,
            'precio_final' => $precio_final,
            'igv' => $producto->incluye_igv ? ($precio_final * 0.18) : null,
            'descuento' => $descuento,
            'imagen' => $producto->imagen_principal
        ]);
        
        Auth::user()->favoriteItems()->save($favoriteItem);
        
        return response()->json([
            'success' => true,
            'message' => 'Producto añadido a favoritos',
            'data' => $favoriteItem
        ]);
    }
    
    /**
     * Remove a favorite item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $favoriteItem = Auth::user()->favoriteItems()->findOrFail($id);
        $favoriteItem->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado de favoritos'
        ]);
    }
    
    /**
     * Toggle a product in favorites (add if not exists, remove if exists).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id'
        ]);
        
        $producto = Producto::findOrFail($request->producto_id);
        
        $existingItem = Auth::user()->favoriteItems()
            ->where('producto_id', $producto->id)
            ->first();
            
        if ($existingItem) {
            $existingItem->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado de favoritos',
                'isFavorite' => false
            ]);
        } else {
            $precio_original = $producto->precio;
            $descuento = $producto->descuento ?? 0;
            $precio_final = $producto->precio_final ?? $precio_original;
            
            if (!$producto->precio_final && $descuento > 0) {
                $precio_final = $precio_original - ($precio_original * $descuento / 100);
            }
            
            $favoriteItem = new FavoriteItem([
                'producto_id' => $producto->id,
                'nombre' => $producto->nombre,
                'precio' => $precio_original,
                'precio_original' => $precio_original,
                'precio_final' => $precio_final,
                'igv' => $producto->incluye_igv ? ($precio_final * 0.18) : null,
                'descuento' => $descuento,
                'imagen' => $producto->imagen_principal
            ]);
            
            Auth::user()->favoriteItems()->save($favoriteItem);
            
            return response()->json([
                'success' => true,
                'message' => 'Producto añadido a favoritos',
                'data' => $favoriteItem,
                'isFavorite' => true
            ]);
        }
    }
    
    /**
     * Check if a product is in favorites.
     *
     * @param  int  $productoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function check($productoId)
    {
        $isFavorite = Auth::user()->favoriteItems()
            ->where('producto_id', $productoId)
            ->exists();
            
        return response()->json([
            'success' => true,
            'isFavorite' => $isFavorite
        ]);
    }
    
    /**
     * Clear all favorite items for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear()
    {
        Auth::user()->favoriteItems()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Lista de favoritos vaciada'
        ]);
    }
}
