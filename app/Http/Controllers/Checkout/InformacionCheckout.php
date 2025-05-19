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

        // Suponiendo que tienes un método para obtener el carrito del usuario
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

        $user = Auth::user();
        $cart = $user->cartItems()->with('producto')->get();

        // Verificar que el carrito no esté vacío
        if ($cart->isEmpty()) {
            return redirect()->back()->with('error', 'Tu carrito está vacío');
        }

        $subtotal = $cart->sum(function ($item) {
            return $item->producto->precio_final * $item->quantity;
        });

        $total = $subtotal; // Aquí podrías añadir costos de envío, descuentos, etc.

        try {
            DB::beginTransaction();

            // Usar dirección alternativa de la sesión si existe
            $direccionAlternativa = $request->direccion_alternativa ?: session('direccion_alternativa');
            $direccionFinal = $direccionAlternativa ?: $user->address;

            // Crear el pedido
            $pedido = Pedido::create([
                'user_id' => $user->id,
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'dni' => $request->dni,
                'direccion' => $direccionFinal,
                'direccion_alternativa' => $direccionAlternativa,
                'subtotal' => $subtotal,
                'total' => $total,
                'estado' => 'pendiente',
            ]);

            // Crear los items del pedido
            foreach ($cart as $item) {
                PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $item->producto->id,
                    'nombre_producto' => $item->producto->nombre,
                    'cantidad' => $item->quantity,
                    'precio_unitario' => $item->producto->precio_final,
                    'subtotal' => $item->producto->precio_final * $item->quantity,
                ]);
            }

            // Limpiar la dirección alternativa de la sesión
            session()->forget('direccion_alternativa');

            DB::commit();

            // Redireccionar a la página de métodos de pago
            return redirect()->route('checkout.metodos', ['pedido_id' => $pedido->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Ocurrió un error al procesar tu pedido: ' . $e->getMessage());
        }
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
            // Almacenamos la dirección alternativa en la sesión para usarla después
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

