<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\PedidoItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InformacionCheckout extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $cart = $user->cartItems()->with('producto')->get();

        $pedido = [
            'items' => $cart->map(function ($item) {
                $precio_final = $item->producto->precio_final;
                return [
                    'id' => $item->producto->id,
                    'nombre' => $item->producto->nombre,
                    'cantidad' => $item->quantity,
                    'precio_final' => $precio_final,
                    'subtotal' => $precio_final * $item->quantity,
                    'imagen' => $item->producto->imagen_principal,
                ];
            }),
            'subtotal' => $cart->sum(function ($item) {
                return $item->producto->precio_final * $item->quantity;
            }),
            'total' => $cart->sum(function ($item) {
                return $item->producto->precio_final * $item->quantity;
            }),
        ];

        return Inertia::render('Home/Partials/Checkout/InformacionCheckout', [
            'user' => [
                'nombre' => $user->nombre ?? $user->first_name ?? '',
                'apellidos' => $user->apellidos ?? $user->last_name ?? '',
                'dni' => $user->dni ?? '',
                'direccion' => $user->address ?? '',
            ],
            'pedido' => $pedido,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'dni' => 'required|string|max:20',
            'direccion_alternativa' => 'nullable|string',
        ]);

        session([
            'checkout_datos' => [
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'dni' => $request->dni,
                'direccion' => $request->direccion_alternativa ?: Auth::user()->address,
                'direccion_alternativa' => $request->direccion_alternativa,
            ]
        ]);

        return redirect()->route('checkout.metodos');
    }
    
    /**
     * Guarda la dirección alternativa para el pedido
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function guardarDireccionAlternativa(Request $request)
    {
        $request->validate([
            'direccion_alternativa' => 'required|string|max:255',
        ]);
        
        try {
            session(['direccion_alternativa' => $request->direccion_alternativa]);
            
            return response()->json([
                'success' => true,
                'message' => 'Dirección alternativa guardada correctamente',
                'direccion' => $request->direccion_alternativa
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar la dirección alternativa: ' . $e->getMessage()
            ], 500);
        }
    }
}

