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
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100 py-8 px-0">
      <div className="w-full px-0 sm:px-6">
        <Card className="shadow-xl rounded-2xl border border-blue-100 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-2xl">
            <CardTitle className="text-2xl font-extrabold text-blue-800">Nuevos Pedidos</CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              Gestión de pedidos recientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              {/* Desktop Table */}
              <Table className="min-w-full">
                <TableHeader className="hidden sm:table-header-group">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>N° Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.map((pedido) => (
                    <React.Fragment key={pedido.id}>
                      <TableRow className="hidden sm:table-row">
                        <TableCell>{pedido.id}</TableCell>
                        <TableCell>
                          {pedido.numero_orden ? (
                            <span className="font-mono text-blue-700 font-bold">{pedido.numero_orden}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{pedido.cliente}</TableCell>
                        <TableCell>{pedido.fecha}</TableCell>
                        <TableCell>{pedido.hora ?? '-'}</TableCell>
                        <TableCell>
                          <span className="text-xs font-semibold">{pedido.estado}</span>
                        </TableCell>
                        <TableCell>
                          {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          {pedido.total !== null && pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => toggleRow(pedido.id)} aria-label="Ver detalles">
                            Detalles del pedido{expandedRows.includes(pedido.id) ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(pedido.id) && (
                        <TableRow className="hidden sm:table-row">
                          <TableCell colSpan={9}>
                            <div className="p-4">
                              <div className="font-semibold mb-2">Productos del pedido:</div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Foto</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {pedido.items?.map((item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>
                                        <img
                                          src={
                                            item.imagen
                                              ? (item.imagen.startsWith("http")
                                                  ? item.imagen
                                                  : `/storage/${item.imagen}`)
                                              : "/images/placeholder.png"
                                          }
                                          alt={item.nombre_producto}
                                          className="w-12 h-12 object-cover rounded"
                                          onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = "/images/placeholder.png";
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>{item.nombre_producto}</TableCell>
                                      <TableCell>{formatPrice(item.precio_unitario)}</TableCell>
                                      <TableCell>{item.cantidad}</TableCell>
                                      <TableCell>{formatPrice(item.subtotal)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              {pedido.referencia_pago && (
                                <div className="mt-6">
                                  <div className="font-semibold mb-2 text-blue-700">Comprobante de pago:</div>
                                  <img
                                    src={
                                      pedido.referencia_pago.startsWith('http')
                                        ? pedido.referencia_pago
                                        : `/storage/${pedido.referencia_pago}`
                                    }
                                    alt="Comprobante de pago"
                                    className="w-64 max-w-full rounded-lg border border-blue-200 shadow"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.src = "/images/placeholder.png";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="mt-6 flex justify-end">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 text-right">
                                  <span className="font-bold text-blue-900 mr-2">Total del pedido:</span>
                                  <span className="font-extrabold text-blue-700 text-lg">
                                    {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center gap-2">
                                <label className="font-semibold" htmlFor={`estado-select-${pedido.id}`}>Actualizar estado:</label>
                                <select
                                  id={`estado-select-${pedido.id}`}
                                  name={`estado-select-${pedido.id}`}
                                  className="border rounded px-2 py-1"
                                  value={estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()}
                                  onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="procesando">Procesando</option>
                                  <option value="completado">Completado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                                <Button
                                  size="sm"
                                  onClick={() => actualizarEstadoPedido(pedido.id)}
                                  disabled={loading[pedido.id] || (estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()) === pedido.estado.toLowerCase()}
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

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4 px-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow-md p-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        {pedido.numero_orden && (
                          <div className="text-xs font-mono text-blue-700 font-bold">
                            N° Orden: {pedido.numero_orden}
                          </div>
                        )}
                        <p className="font-medium text-sm">{pedido.cliente}</p>
                        <p className="text-xs text-gray-500">
                          {pedido.fecha}
                          {pedido.hora && (
                            <span className="ml-2 text-blue-700 font-semibold">
                              {pedido.hora}
                            </span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge
                            variant={
                              pedido.estado === "Pendiente"
                                ? "secondary"
                                : pedido.estado === "Procesando"
                                ? "outline"
                                : pedido.estado === "Completado"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {pedido.estado}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {pedido.metodo_pago || '-'}
                          </span>
                        </div>
                        <p className="text-sm font-bold">
                          Total: {pedido.total !== undefined ? formatPrice(pedido.total) : '-'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(pedido.id)}
                        className="ml-2"
                      >
                        {expandedRows.includes(pedido.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {expandedRows.includes(pedido.id) && (
                      <div className="mt-4">
                        <div className="font-semibold mb-2 text-sm">Productos:</div>
                        <div className="overflow-x-auto -mx-3">
                          <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                  <tr className="text-xs">
                                    <th className="p-2 text-left">Producto</th>
                                    <th className="p-2 text-right">Cant.</th>
                                    <th className="p-2 text-right">Precio</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {pedido.items?.map((item, idx) => (
                                    <tr key={idx} className="text-xs">
                                      <td className="p-2">
                                        <div className="flex items-center">
                                          <img
                                            src={item.imagen?.startsWith("http") ? item.imagen : `/storage/${item.imagen}`}
                                            alt={item.nombre_producto}
                                            className="w-8 h-8 object-cover rounded mr-2"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                            }}
                                          />
                                          <span className="whitespace-normal break-words">
                                            {item.nombre_producto}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-2 text-right">{item.cantidad}</td>
                                      <td className="p-2 text-right">{formatPrice(item.subtotal)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {pedido.referencia_pago && (
                          <div className="mt-4">
                            <div className="font-semibold mb-2 text-sm text-blue-700">Comprobante:</div>
                            <img
                              src={pedido.referencia_pago.startsWith('http') ? pedido.referencia_pago : `/storage/${pedido.referencia_pago}`}
                              alt="Comprobante"
                              className="w-full max-w-[200px] rounded-lg border border-blue-200 shadow"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/placeholder.png";
                              }}
                            />
                          </div>
                        )}

                        <div className="mt-4 space-y-2">
                          <label className="text-sm font-semibold block" htmlFor={`estado-select-m-${pedido.id}`}>
                            Actualizar estado:
                          </label>
                          <div className="flex gap-2">
                            <select
                              id={`estado-select-m-${pedido.id}`}
                              className="text-sm flex-1 min-w-0 rounded-md border border-gray-300 px-2 py-1"
                              value={estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()}
                              onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="procesando">Procesando</option>
                              <option value="completado">Completado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                            <Button
                              size="sm"
                              className="whitespace-nowrap"
                              onClick={() => actualizarEstadoPedido(pedido.id)}
                              disabled={loading[pedido.id] || (estadoEditando[pedido.id] ?? pedido.estado.toLowerCase()) === pedido.estado.toLowerCase()}
                            >
                              {loading[pedido.id] ? '...' : 'Actualizar'}
                            </Button>
                          </div>
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