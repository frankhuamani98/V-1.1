import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useForm, router } from '@inertiajs/react';
import { toast } from "sonner";

interface PedidoItem {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen?: string;
}

interface Pedido {
  id: number;
  numero_orden?: string;
  cliente: string;
  fecha: string;
  hora?: string;
  estado: string;
  metodo_pago?: string;
  total?: number;
  referencia_pago?: string;
  items?: PedidoItem[];
}

interface Props {
  pedidos: Pedido[];
}

const NuevosPedidos = ({ pedidos: pedidosProp = [] }: Props) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosProp);
  const [estadoEditando, setEstadoEditando] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  const getAvailableStates = (currentEstado: string) => {
    switch (currentEstado.toLowerCase()) {
      case "pendiente":
        return ["pendiente", "procesando", "completado", "cancelado"];
      case "procesando":
        return ["procesando", "completado", "cancelado"];
      case "completado":
        return ["completado", "cancelado"];
      case "cancelado":
        return ["cancelado"];
      default:
        return ["pendiente", "procesando", "completado", "cancelado"];
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number | string): string => {
    const num = Number(price);
    if (isNaN(num)) return "-";
    return `S/ ${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const handleEstadoChange = (pedidoId: number, nuevoEstado: string) => {
    setEstadoEditando((prev) => ({
      ...prev,
      [pedidoId]: nuevoEstado,
    }));
  };

  const actualizarEstadoPedido = async (pedidoId: number) => {
    const nuevoEstado = estadoEditando[pedidoId];
    if (!nuevoEstado) return;
    setLoading((prev) => ({ ...prev, [pedidoId]: true }));

    router.patch(
      `/pedidos/${pedidoId}/actualizar-estado`,
      { estado: nuevoEstado },
      {
        preserveScroll: true,
        onSuccess: () => {
          window.location.reload();
        },
        onError: () => {
          toast.error("Error al actualizar el estado");
        },
        onFinish: () => {
          setLoading((prev) => ({ ...prev, [pedidoId]: false }));
        },
      }
    );
  };

  return (
    <div className="w-full py-8 px-0">
      <div className="w-full px-0 sm:px-6">
        <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-xl py-4 px-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Nuevos Pedidos</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Gestión de pedidos recientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table className="min-w-full">
                <TableHeader className="hidden sm:table-header-group bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">ID</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">N° Orden</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Cliente</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Fecha</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Hora</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Estado</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Método de Pago</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Total</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-4 py-3">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.map((pedido) => (
                    <React.Fragment key={pedido.id}>
                      <TableRow className="hidden sm:table-row border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.id}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          {pedido.numero_orden ? (
                            <span className="font-mono text-blue-600 font-bold">{pedido.numero_orden}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.cliente}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.fecha}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.hora ?? '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          <Badge
                            variant="outline"
                            className={(() => {
                              switch (pedido.estado) {
                                case "Pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                                case "Procesando": return "bg-blue-100 text-blue-800 border-blue-200";
                                case "Completado": return "bg-green-100 text-green-800 border-green-200";
                                case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
                                default: return "bg-gray-100 text-gray-800 border-gray-200";
                              }
                            })() + " text-xs font-semibold px-2.5 py-0.5 rounded-full"}
                          >
                            {pedido.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          {pedido.total !== null && pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          <Button variant="outline" size="sm" onClick={() => toggleRow(pedido.id)} aria-label="Ver detalles" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            Detalles del pedido{expandedRows.includes(pedido.id) ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(pedido.id) && (
                        <TableRow className="hidden sm:table-row">
                          <TableCell colSpan={9}>
                            <div className="p-4 bg-gray-50 rounded-lg mt-2">
                              <div className="font-semibold mb-3 text-gray-700">Productos del pedido:</div>
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-100">
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-3 py-2">Foto</TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-3 py-2">Producto</TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-3 py-2">Precio</TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-3 py-2">Cantidad</TableHead>
                                    <TableHead className="text-gray-600 font-semibold text-xs uppercase tracking-wider px-3 py-2">Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {pedido.items?.map((item, idx) => (
                                    <TableRow key={idx} className="border-b border-gray-100 last:border-b-0">
                                      <TableCell className="px-3 py-2 text-sm text-gray-800">
                                        <img
                                          src={
                                            item.imagen
                                              ? (item.imagen.startsWith("http")
                                                  ? item.imagen
                                                  : `/storage/${item.imagen}`)
                                              : "/images/placeholder.png"
                                          }
                                          alt={item.nombre_producto}
                                          className="w-10 h-10 object-cover rounded-md border border-gray-200"
                                          onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = "/images/placeholder.png";
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell className="px-3 py-2 text-sm text-gray-800">{item.nombre_producto}</TableCell>
                                      <TableCell className="px-3 py-2 text-sm text-gray-800">{formatPrice(item.precio_unitario)}</TableCell>
                                      <TableCell className="px-3 py-2 text-sm text-gray-800">{item.cantidad}</TableCell>
                                      <TableCell className="px-3 py-2 text-sm text-gray-800">{formatPrice(item.subtotal)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {pedido.referencia_pago && (
                                  <div>
                                    <div className="font-semibold mb-2 text-blue-700">Comprobante de pago:</div>
                                    <img
                                      src={
                                        pedido.referencia_pago.startsWith('http')
                                          ? pedido.referencia_pago
                                          : `/storage/${pedido.referencia_pago}`
                                      }
                                      alt="Comprobante de pago"
                                      className="w-64 max-w-full rounded-lg border border-blue-200 shadow-sm"
                                      onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.src = "/images/placeholder.png";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="md:text-right">
                                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 inline-block">
                                    <span className="font-bold text-blue-900 mr-2">Total del pedido:</span>
                                    <span className="font-extrabold text-blue-700 text-lg">
                                      {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 flex items-center gap-3">
                                <label className="font-semibold text-gray-700 text-sm" htmlFor={`estado-select-${pedido.id}`}>Actualizar estado:</label>
                                <select
                                  id={`estado-select-${pedido.id}`}
                                  name={`estado-select-${pedido.id}`}
                                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  value={estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()}
                                  onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                                >
                                  {getAvailableStates(pedido.estado).map((state) => (
                                    <option key={state} value={state}>
                                      {state.charAt(0).toUpperCase() + state.slice(1)}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  size="sm"
                                  onClick={() => actualizarEstadoPedido(pedido.id)}
                                  disabled={loading[pedido.id] || (estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()) === pedido.estado.toLowerCase()}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {loading[pedido.id] ? 'Actualizando...' : 'Actualizar estado'}
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              <div className="sm:hidden space-y-4 px-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        {pedido.numero_orden && (
                          <div className="text-xs font-mono text-blue-600 font-bold mb-1">
                            N° Orden: {pedido.numero_orden}
                          </div>
                        )}
                        <p className="font-semibold text-base text-gray-800">{pedido.cliente}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {pedido.fecha}
                          {pedido.hora && (
                            <span className="ml-2 text-gray-600 font-medium">
                              {pedido.hora}
                            </span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center mt-2">
                          <Badge
                            variant="outline"
                            className={(() => {
                              switch (pedido.estado) {
                                case "Pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
                                case "Procesando": return "bg-blue-100 text-blue-800 border-blue-200";
                                case "Completado": return "bg-green-100 text-green-800 border-green-200";
                                case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
                                default: return "bg-gray-100 text-gray-800 border-gray-200";
                              }
                            })() + " text-xs font-semibold px-2.5 py-0.5 rounded-full"}
                          >
                            {pedido.estado}
                          </Badge>
                          <span className="text-xs text-gray-500 font-medium">
                            {pedido.metodo_pago || '-'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(pedido.id)}
                        className="ml-2 text-gray-500 hover:bg-gray-100"
                      >
                        {expandedRows.includes(pedido.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {expandedRows.includes(pedido.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="font-semibold mb-3 text-sm text-gray-700">Productos:</div>
                        <div className="overflow-x-auto -mx-1">
                          <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden rounded-md border border-gray-200">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="text-xs bg-gray-50">
                                    <th className="p-2 text-left text-gray-600 font-semibold">Producto</th>
                                    <th className="p-2 text-right text-gray-600 font-semibold">Cant.</th>
                                    <th className="p-2 text-right text-gray-600 font-semibold">Precio</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {pedido.items?.map((item, idx) => (
                                    <tr key={idx} className="text-xs hover:bg-gray-50">
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <img
                                            src={item.imagen?.startsWith("http") ? item.imagen : `/storage/${item.imagen}`}
                                            alt={item.nombre_producto}
                                            className="w-8 h-8 object-cover rounded-md mr-2 border border-gray-200"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                            }}
                                          />
                                          <span className="whitespace-normal break-words text-gray-800 font-medium">
                                            {item.nombre_producto}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-2 text-right text-gray-700 font-medium">{item.cantidad}</td>
                                      <td className="p-2 text-right text-gray-700 font-medium">{formatPrice(item.subtotal)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-4">
                          {pedido.referencia_pago && (
                            <div>
                              <div className="font-semibold mb-2 text-sm text-blue-700">Comprobante:</div>
                              <img
                                src={pedido.referencia_pago.startsWith('http') ? pedido.referencia_pago : `/storage/${pedido.referencia_pago}`}
                                alt="Comprobante"
                                className="w-full max-w-[200px] rounded-lg border border-blue-200 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                }}
                              />
                            </div>
                          )}
                          <div className="text-right">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 inline-block">
                              <span className="font-bold text-blue-900 mr-2 text-sm">Total del pedido:</span>
                              <span className="font-extrabold text-blue-700 text-base">
                                {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="font-semibold text-gray-700 text-sm block mb-1" htmlFor={`estado-select-mobile-${pedido.id}`}>Actualizar estado:</label>
                          <select
                            id={`estado-select-mobile-${pedido.id}`}
                            name={`estado-select-mobile-${pedido.id}`}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                            value={estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()}
                            onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                          >
                            {getAvailableStates(pedido.estado).map((state) => (
                              <option key={state} value={state}>
                                {state.charAt(0).toUpperCase() + state.slice(1)}
                              </option>
                            ))}
                          </select>
                          <Button
                            className="mt-2 w-full"
                            onClick={() => actualizarEstadoPedido(pedido.id)}
                            disabled={loading[pedido.id] || (estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()) === pedido.estado.toLowerCase()}
                          >
                            {loading[pedido.id] ? "Actualizando..." : "Guardar Cambios"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NuevosPedidos;