<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InformacionCheckout extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Suponiendo que tienes un método para obtener el carrito del usuario
        $cart = $user->cartItems()->with('producto')->get();

        $pedido = [
            'items' => $cart->map(function ($item) {
                $precio_final = $item->producto->precio_final;
                return [
                    'nombre' => $item->producto->nombre,
                    'cantidad' => $item->quantity,
                    'precio_final' => $precio_final,
                    'subtotal' => $precio_final * $item->quantity,
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
                // Ajusta aquí si tus columnas son diferentes
                'nombre' => $user->nombre ?? $user->first_name ?? '',
                'apellidos' => $user->apellidos ?? $user->last_name ?? '',
                'dni' => $user->dni ?? '',
                'direccion' => $user->direccion ?? '',
            ],
            'pedido' => $pedido,
        ]);
    }
}

