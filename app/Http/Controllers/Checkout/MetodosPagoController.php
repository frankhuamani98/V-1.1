<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetodosPagoController extends Controller
{
    public function index(Request $request)
    {
        // Puedes obtener el pedido por ID si lo necesitas
        $pedidoId = $request->query('pedido_id');
        $pedido = $pedidoId ? Pedido::find($pedidoId) : null;

        // Métodos de pago disponibles (puedes personalizar esto)
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
            'pedido' => $pedido,
            'metodos' => $metodos,
        ]);
    }

    public function procesar(Request $request)
    {
        $request->validate([
            'pedido_id' => 'required|exists:pedidos,id',
            'metodo' => 'required|string',
            'referencia_pago' => 'nullable|image|max:5120', // hasta 5MB
        ]);

        $pedido = Pedido::findOrFail($request->pedido_id);
        $user = $pedido->user;

        // Procesar archivo si existe
        $referenciaPath = null;
        if ($request->hasFile('referencia_pago')) {
            $referenciaPath = $request->file('referencia_pago')->store('pagos/referencias', 'public');
        }

        // Aquí iría la lógica de integración con el método de pago seleccionado
        $pagoExitoso = true; // Cambia esto según la lógica real

        if ($pagoExitoso) {
            // Actualiza el pedido como pagado
            $pedido->metodo_pago = $request->metodo;
            if ($referenciaPath) {
                $pedido->referencia_pago = $referenciaPath;
            }
            $pedido->estado = 'procesando'; // o 'completado' según tu flujo
            $pedido->save();

            // Ahora sí, borra el carrito del usuario
            $user->cartItems()->delete();

            // Redirige a confirmación de pago
            return redirect()->route('checkout.confirmacion', ['id' => $pedido->id]);
        } else {
            // No borra el carrito, solo muestra error
            return redirect()->back()->with('error', 'El pago no se realizó exitosamente. Intenta nuevamente.');
        }
    }
}

