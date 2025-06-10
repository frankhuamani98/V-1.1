<?php

namespace App\Http\Controllers\Facturacion;

use App\Http\Controllers\Controller;
use App\Models\Facturacion;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FacturacionController extends Controller
{
    public function index()
    {
        $comprobantes = Facturacion::with(['pedido.items'])->latest()->get()
            ->map(function ($comprobante) {
                return [
                    'id' => $comprobante->id,
                    'numero_comprobante' => $comprobante->numero_comprobante,
                    'tipo_comprobante' => ucfirst($comprobante->tipo_comprobante),
                    'cliente' => $comprobante->nombre_cliente,
                    'documento' => $comprobante->getTipoDocumento() . ': ' . $comprobante->getNumeroDocumento(),
                    'fecha' => $comprobante->created_at->format('Y-m-d'),
                    'estado' => ucfirst($comprobante->estado),
                    'total' => $comprobante->total,
                    'items' => $comprobante->pedido->items->map(function ($item) {
                        return [
                            'nombre_producto' => $item->nombre_producto,
                            'cantidad' => $item->cantidad,
                            'precio_unitario' => $item->precio_unitario,
                            'subtotal' => $item->subtotal
                        ];
                    })
                ];
            });

        return Inertia::render('Facturacion/Index', [
            'comprobantes' => $comprobantes
        ]);
    }

    public function facturas()
    {
        $comprobantes = Facturacion::with(['pedido.items'])
            ->where('tipo_comprobante', 'factura')
            ->latest()
            ->get()
            ->map(function ($comprobante) {
                return [
                    'id' => $comprobante->id,
                    'numero_comprobante' => $comprobante->numero_comprobante,
                    'tipo_comprobante' => strtolower($comprobante->tipo_comprobante),
                    'cliente' => $comprobante->nombre_cliente,
                    'documento' => $comprobante->getTipoDocumento() . ': ' . $comprobante->getNumeroDocumento(),
                    'fecha' => $comprobante->created_at->format('Y-m-d'),
                    'estado' => ucfirst($comprobante->estado),
                    'total' => $comprobante->total,
                    'items' => $comprobante->pedido->items->map(function ($item) {
                        return [
                            'nombre_producto' => $item->nombre_producto,
                            'cantidad' => $item->cantidad,
                            'precio_unitario' => $item->precio_unitario,
                            'subtotal' => $item->subtotal
                        ];
                    })
                ];
            });

        return Inertia::render('Dashboard/Facturacion/Factura', [
            'comprobantes' => $comprobantes
        ]);
    }

    public function boletas()
    {
        $comprobantes = Facturacion::with(['pedido.items'])
            ->where('tipo_comprobante', 'boleta')
            ->latest()
            ->get()
            ->map(function ($comprobante) {
                return [
                    'id' => $comprobante->id,
                    'numero_comprobante' => $comprobante->numero_comprobante,
                    'tipo_comprobante' => strtolower($comprobante->tipo_comprobante),
                    'cliente' => $comprobante->nombre_cliente,
                    'documento' => $comprobante->getTipoDocumento() . ': ' . $comprobante->getNumeroDocumento(),
                    'fecha' => $comprobante->created_at->format('Y-m-d'),
                    'estado' => ucfirst($comprobante->estado),
                    'total' => $comprobante->total,
                    'items' => $comprobante->pedido->items->map(function ($item) {
                        return [
                            'nombre_producto' => $item->nombre_producto,
                            'cantidad' => $item->cantidad,
                            'precio_unitario' => $item->precio_unitario,
                            'subtotal' => $item->subtotal
                        ];
                    })
                ];
            });

        return Inertia::render('Dashboard/Facturacion/Boleta', [
            'comprobantes' => $comprobantes
        ]);
    }

    public function notasVenta()
    {
        $comprobantes = Facturacion::with(['pedido.items'])
            ->where('tipo_comprobante', 'nota_venta')
            ->latest()
            ->get()
            ->map(function ($comprobante) {
                return [
                    'id' => $comprobante->id,
                    'numero_comprobante' => $comprobante->numero_comprobante,
                    'tipo_comprobante' => strtolower($comprobante->tipo_comprobante),
                    'cliente' => $comprobante->nombre_cliente,
                    'documento' => $comprobante->getTipoDocumento() . ': ' . $comprobante->getNumeroDocumento(),
                    'fecha' => $comprobante->created_at->format('Y-m-d'),
                    'estado' => ucfirst($comprobante->estado),
                    'total' => $comprobante->total,
                    'items' => $comprobante->pedido->items->map(function ($item) {
                        return [
                            'nombre_producto' => $item->nombre_producto,
                            'cantidad' => $item->cantidad,
                            'precio_unitario' => $item->precio_unitario,
                            'subtotal' => $item->subtotal
                        ];
                    })
                ];
            });

        return Inertia::render('Dashboard/Facturacion/NotaVentas', [
            'comprobantes' => $comprobantes
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'pedido_id' => 'required|exists:pedidos,id',
                'tipo_comprobante' => 'required|in:factura,boleta,nota_venta',
                'numero_comprobante' => 'required|unique:facturacion,numero_comprobante',
                'observaciones' => 'nullable|string'
            ]);

            $validatedData = $this->validateByTipoComprobante($request);
            
            $pedido = Pedido::with('items')->findOrFail($request->pedido_id);
            
            $total = $pedido->items->sum('subtotal');
            $subtotal = $total / 1.18;
            $igv = $total - $subtotal;

            $facturacion = Facturacion::create(array_merge(
                $request->all(),
                $validatedData,
                [
                    'subtotal' => $subtotal,
                    'igv' => $igv,
                    'total' => $total,
                    'estado' => 'emitido',
                    'tipo_comprobante' => strtolower($request->tipo_comprobante)
                ]
            ));

            if ($pedido->estado !== 'completado') {
                $pedido->update(['estado' => 'completado']);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Comprobante generado correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error al generar el comprobante: ' . $e->getMessage())
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    protected function validateByTipoComprobante(Request $request)
    {
        $validatedData = [];

        switch ($request->tipo_comprobante) {
            case 'factura':
            case 'boleta':
            case 'nota_venta':
                $validatedData = $request->validate([
                    'dni' => 'required|digits:8',
                    'nombre_cliente' => 'required|string|max:255'
                ]);
                break;
        }

        return $validatedData;
    }

    public function show(Facturacion $facturacion)
    {
        $facturacion->load(['pedido.items']);
        
        return Inertia::render('Dashboard/Facturacion/Show', [
            'comprobante' => [
                'id' => $facturacion->id,
                'numero_comprobante' => $facturacion->numero_comprobante,
                'tipo_comprobante' => ucfirst($facturacion->tipo_comprobante),
                'fecha_emision' => $facturacion->created_at->format('Y-m-d'),
                'estado' => ucfirst($facturacion->estado),
                'cliente' => [
                    'nombre' => $facturacion->nombre_cliente,
                    'documento' => [
                        'tipo' => 'DNI',
                        'numero' => $facturacion->dni
                    ]
                ],
                'items' => $facturacion->pedido->items->map(function ($item) {
                    return [
                        'nombre_producto' => $item->nombre_producto,
                        'cantidad' => $item->cantidad,
                        'precio_unitario' => $item->precio_unitario,
                        'subtotal' => $item->subtotal
                    ];
                }),
                'totales' => [
                    'subtotal' => $facturacion->subtotal,
                    'igv' => $facturacion->igv,
                    'total' => $facturacion->total
                ],
                'observaciones' => $facturacion->observaciones
            ]
        ]);
    }

    public function anular(Facturacion $facturacion)
    {
        try {
            DB::beginTransaction();

            if ($facturacion->estado === 'anulado') {
                throw new \Exception('El comprobante ya se encuentra anulado.');
            }

            $facturacion->update([
                'estado' => 'anulado',
                'observaciones' => trim($facturacion->observaciones . "\nAnulado el: " . now()->format('Y-m-d H:i:s'))
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Comprobante anulado correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error al anular el comprobante: ' . $e->getMessage())
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }

    public function generateNumeroComprobante($tipo)
    {
        $prefijo = [
            'factura' => 'F',
            'boleta' => 'B',
            'nota_venta' => 'NV'
        ][$tipo] ?? '';

        if (empty($prefijo)) {
            throw new \Exception('Tipo de comprobante no válido');
        }

        $ultimoNumero = Facturacion::where('tipo_comprobante', $tipo)
            ->orderBy('id', 'desc')
            ->value('numero_comprobante');

        if (!$ultimoNumero) {
            return $prefijo . '001-000001';
        }

        $numero = intval(substr($ultimoNumero, -6));
        $siguiente = str_pad($numero + 1, 6, '0', STR_PAD_LEFT);

        return $prefijo . '001-' . $siguiente;
    }
}
