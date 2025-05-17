<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        try {
            $cartItems = CartItem::where('user_id', $user->id)
                ->with(['producto' => function($query) {
                    $query->select('id', 'nombre', 'precio', 'descuento', 'precio_final', 'imagen_principal', 'stock', 'estado');
                }])
                ->get()
                ->map(function($item) {
                    $precio_final = $item->producto->precio_final;
                    
                    Log::debug('Cart item price details', [
                        'producto_id' => $item->producto_id,
                        'nombre' => $item->producto->nombre,
                        'precio' => $item->producto->precio,
                        'descuento' => $item->producto->descuento,
                        'precio_final' => $precio_final
                    ]);
                    
                    return [
                        'id' => $item->id,
                        'producto_id' => $item->producto_id,
                        'nombre' => $item->producto->nombre,
                        'precio' => $item->producto->precio,
                        'descuento' => $item->producto->descuento,
                        'precio_final' => $precio_final,
                        'imagen' => $item->producto->imagen_principal,
                        'quantity' => $item->quantity,
                        'stock' => $item->producto->stock,
                        'estado' => $item->producto->estado,
                        'subtotal' => $precio_final * $item->quantity,
                    ];
                });

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'data' => $cartItems,
                    'total' => $cartItems->sum('subtotal'),
                ]);
            }

            return Inertia::render('Home/Partials/Shop/Cart', [
                'cartItems' => $cartItems,
                'total' => $cartItems->sum('subtotal'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching cart items', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if (request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener los productos del carrito',
                    'error' => $e->getMessage()
                ], 500);
            }
            
            return Inertia::render('Home/Partials/Shop/Cart', [
                'cartItems' => [],
                'total' => 0,
                'error' => 'No se pudieron cargar los productos del carrito'
            ]);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'producto_id' => 'required|exists:productos,id',
                'quantity' => 'sometimes|integer|min:1',
            ]);

            $user = Auth::user();
            $producto = Producto::findOrFail($request->producto_id);
            
            $quantity = $request->quantity ?? 1;

            \Log::info('Adding product to cart', [
                'producto_id' => $request->producto_id,
                'producto_estado' => $producto->estado,
                'expected_estado' => Producto::ESTADO_ACTIVO,
                'stock' => $producto->stock,
                'quantity' => $quantity,
            ]);

            if (strtolower($producto->estado) !== strtolower(Producto::ESTADO_ACTIVO)) {
                return response()->json([
                    'success' => false,
                    'message' => 'El producto no está disponible',
                    'debug' => [
                        'estado_actual' => $producto->estado,
                        'estado_esperado' => Producto::ESTADO_ACTIVO
                    ]
                ], 400);
            }

            if ($producto->stock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay suficiente stock disponible',
                    'debug' => [
                        'stock_disponible' => $producto->stock,
                        'cantidad_solicitada' => $quantity
                    ]
                ], 400);
            }

            $existingItem = CartItem::where('user_id', $user->id)
                ->where('producto_id', $request->producto_id)
                ->first();

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $quantity;
                
                if ($producto->stock < $newQuantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No hay suficiente stock disponible para la cantidad total',
                        'debug' => [
                            'stock_disponible' => $producto->stock,
                            'cantidad_actual' => $existingItem->quantity,
                            'cantidad_nueva' => $quantity,
                            'total' => $newQuantity
                        ]
                    ], 400);
                }
                
                $existingItem->update([
                    'quantity' => $newQuantity
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Cantidad actualizada en el carrito',
                ]);
            }

            CartItem::create([
                'user_id' => $user->id,
                'producto_id' => $request->producto_id,
                'quantity' => $quantity,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Producto agregado al carrito',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error adding product to cart', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar el producto al carrito: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $producto = Producto::findOrFail($cartItem->producto_id);

        if ($producto->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'No hay suficiente stock disponible',
            ], 400);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cantidad actualizada',
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado del carrito',
        ]);
    }

    public function clear()
    {
        $user = Auth::user();
        CartItem::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Carrito vaciado',
        ]);
    }
}
