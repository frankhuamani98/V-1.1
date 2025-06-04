<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Services\NotificacionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetodosPagoController extends Controller
{
    protected $notificacionService;
    
    public function __construct(NotificacionService $notificacionService)
    {
        $this->notificacionService = $notificacionService;
    }
    public function index(Request $request)
    {
        $user = Auth()->user();
        $datos = session('checkout_datos');
        $cart = $user->cartItems()->with('producto')->get();

        $metodos = [
            [
                'id' => 'tarjeta',
                'nombre' => 'Tarjeta de crédito/débito',
                'descripcion' => 'Visa, Mastercard, American Express',
            ],
            [
                'id' => 'yape',
                'nombre' => 'Yape',
                'descripcion' => 'Pago rápido con Yape',
            ],
            [
                'id' => 'plin',
                'nombre' => 'Plin',
                'descripcion' => 'Pago rápido con Plin',
            ],
            [
                'id' => 'transferencia',
                'nombre' => 'Transferencia bancaria',
                'descripcion' => 'BCP, Interbank, BBVA, Scotiabank',
            ],
        ];

        return Inertia::render('Home/Partials/Checkout/MetodosPago', [
            'pedido' => [
                'user' => $datos,
                'items' => $cart->map(function ($item) {
                    return [
                        'id' => $item->producto->id,
                        'nombre' => $item->producto->nombre,
                        'cantidad' => $item->quantity,
                        'precio_final' => $item->producto->precio_final,
                        'subtotal' => $item->producto->precio_final * $item->quantity,
                        'imagen' => $item->producto->imagen_principal,
                    ];
                }),
                'subtotal' => $cart->sum(fn($item) => $item->producto->precio_final * $item->quantity),
                'total' => $cart->sum(fn($item) => $item->producto->precio_final * $item->quantity),
            ],
            'metodos' => $metodos,
        ]);
    }

    public function procesar(Request $request)
    {
        $request->validate([
            'metodo' => 'required|string',
            'referencia_pago' => 'required|image|max:5120',
        ]);

        $user = Auth()->user();
        $datos = session('checkout_datos');
        $cart = $user->cartItems()->with('producto')->get();

        if (!$datos || $cart->isEmpty()) {
            return redirect()->route('checkout.informacion')->with('error', 'Faltan datos o el carrito está vacío.');
        }

        $total = $cart->reduce(function ($carry, $item) {
            return $carry + ($item->producto->precio_final * $item->quantity);
        }, 0);

        $referenciaPath = $request->file('referencia_pago')->store('pagos/referencias', 'public');

        try {
            \DB::beginTransaction();

            $ultimoPedido = \App\Models\Pedido::orderByDesc('id')->first();
            if ($ultimoPedido && preg_match('/ORD-(\d+)/', $ultimoPedido->numero_orden, $matches)) {
                $ultimoNumero = intval($matches[1]);
            } else {
                $ultimoNumero = 0;
            }
            $nuevoNumero = $ultimoNumero + 1;
            $nuevoNumeroOrden = 'ORD-' . str_pad($nuevoNumero, 5, '0', STR_PAD_LEFT);

            $pedido = \App\Models\Pedido::create([
                'user_id' => $user->id,
                'nombre' => $datos['nombre'],
                'apellidos' => $datos['apellidos'],
                'dni' => $datos['dni'],
                'direccion' => $datos['direccion'],
                'direccion_alternativa' => $datos['direccion_alternativa'],
                'subtotal' => $total,
                'total' => $total,
                'estado' => 'pendiente',
                'metodo_pago' => $request->metodo,
                'referencia_pago' => $referenciaPath,
                'numero_orden' => $nuevoNumeroOrden,
            ]);

            foreach ($cart as $item) {
                \App\Models\PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $item->producto->id,
                    'nombre_producto' => $item->producto->nombre,
                    'cantidad' => $item->quantity,
                    'precio_unitario' => $item->producto->precio_final,
                    'subtotal' => $item->producto->precio_final * $item->quantity,
                ]);

                // Descontar stock del producto
                $producto = $item->producto;
                $producto->stock = max(0, $producto->stock - $item->quantity);
                $producto->save();
            }

            $user->cartItems()->delete();
            session()->forget('checkout_datos');
            session()->forget('direccion_alternativa');
            
            $this->notificacionService->crearNotificacionPedido($pedido, 'creado');

            \DB::commit();

            return redirect()->route('checkout.confirmacion', ['id' => $pedido->id]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->with('error', 'Error al procesar el pago: ' . $e->getMessage());
        }
    }
}

