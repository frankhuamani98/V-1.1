<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\FavoriteItem;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        try {
            $favoriteItems = FavoriteItem::where('user_id', $user->id)
                ->with(['producto' => function($query) {
                    $query->select('id', 'nombre', 'precio', 'descuento', 'precio_final', 'imagen_principal', 'estado');
                }])
                ->get()
                ->map(function($item) {
                    $precio_final = $item->producto->precio_final;
                    
                    Log::debug('Favorite item price details', [
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
                        'estado' => $item->producto->estado,
                    ];
                });

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'data' => $favoriteItems,
                ]);
            }

            return Inertia::render('Home/Partials/Shop/Favorites', [
                'favoriteItems' => $favoriteItems,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching favorite items', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if (request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener los productos favoritos',
                    'error' => $e->getMessage()
                ], 500);
            }
            
            return Inertia::render('Home/Partials/Shop/Favorites', [
                'favoriteItems' => [],
                'error' => 'No se pudieron cargar los productos favoritos'
            ]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
        ]);

        $user = Auth::user();
        $producto = Producto::findOrFail($request->producto_id);

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

        $existingItem = FavoriteItem::where('user_id', $user->id)
            ->where('producto_id', $request->producto_id)
            ->first();

        if ($existingItem) {
            return response()->json([
                'success' => false,
                'message' => 'El producto ya está en favoritos',
            ], 200);
        }

        FavoriteItem::create([
            'user_id' => $user->id,
            'producto_id' => $request->producto_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Producto agregado a favoritos',
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $favoriteItem = FavoriteItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $favoriteItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado de favoritos',
        ]);
    }

    public function clear()
    {
        $user = Auth::user();
        FavoriteItem::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Favoritos vaciados',
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
        ]);

        $user = Auth::user();
        $producto = Producto::findOrFail($request->producto_id);

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

        $existingItem = FavoriteItem::where('user_id', $user->id)
            ->where('producto_id', $request->producto_id)
            ->first();

        if ($existingItem) {
            $existingItem->delete();
            return response()->json([
                'success' => true,
                'isFavorite' => false,
                'message' => 'Producto eliminado de favoritos',
            ]);
        } else {
            FavoriteItem::create([
                'user_id' => $user->id,
                'producto_id' => $request->producto_id,
            ]);
            return response()->json([
                'success' => true,
                'isFavorite' => true,
                'message' => 'Producto agregado a favoritos',
            ]);
        }
    }

    public function check($productoId)
    {
        $user = Auth::user();
        $isFavorite = FavoriteItem::where('user_id', $user->id)
            ->where('producto_id', $productoId)
            ->exists();

        return response()->json([
            'success' => true,
            'isFavorite' => $isFavorite,
        ]);
    }
}
