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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
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
  estado: string;
  metodo_pago?: string;
  total?: number;
  referencia_pago?: string;
  items?: PedidoItem[];
}

interface Props {
  pedidos: Pedido[];
}

const EstadoPedidos = ({ pedidos: pedidosProp = [] }: Props) => {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosProp);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const actualizarEstado = (id: number, nuevoEstado: string) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
    router.patch(
      `/pedidos/${id}/actualizar-estado`,
      { estado: nuevoEstado.toLowerCase() },
      {
        preserveScroll: true,
        onSuccess: () => {
          window.location.reload();
        },
        onError: () => {
          toast.error("Error al actualizar el estado");
          setPedidos(pedidosProp);
        },
      }
    );
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "secondary";
      case "Procesando":
        return "outline";
      case "Completado":
        return "default";
      case "Cancelado":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "-";
    const num = Number(price);
    if (isNaN(num)) return "-";
    return "S/ " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Todos los Pedidos</CardTitle>
          <CardDescription>Gestiona y actualiza el estado de todos los pedidos.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabla en pantallas grandes */}
          <div className="overflow-x-auto hidden sm:block">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>N° Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Referencia Pago</TableHead>
                  <TableHead>Actualizar</TableHead>
                  <TableHead>Productos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <React.Fragment key={pedido.id}>
                    <TableRow>
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
                      <TableCell>
                        <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        {pedido.metodo_pago ?? <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {pedido.referencia_pago ? (
                          <img
                            src={
                              pedido.referencia_pago.startsWith('http')
                                ? pedido.referencia_pago
                                : `/storage/${pedido.referencia_pago}`
                            }
                            alt="Comprobante de pago"
                            className="w-16 h-16 object-cover rounded border"
                            onError={e => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = "/images/placeholder.png";
                            }}
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={pedido.estado}
                          onValueChange={(nuevoEstado) => actualizarEstado(pedido.id, nuevoEstado)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Selecciona un estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="Procesando">Procesando</SelectItem>
                            <SelectItem value="Completado">Completado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRow(pedido.id)}
                          aria-label="Ver productos"
                        >
                          {expandedRows.includes(pedido.id) ? "Ocultar" : "Ver"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(pedido.id) && (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <div className="p-4 bg-gray-50 rounded">
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
                                        onError={e => {
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
                            <div className="mt-4 flex justify-end">
                              <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 text-right">
                                <span className="font-bold text-blue-900 mr-2">Total del pedido:</span>
                                <span className="font-extrabold text-blue-700 text-lg">
                                  {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Vista en tarjetas para móviles */}
          <div className="sm:hidden space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
                {pedido.numero_orden && (
                  <div className="text-xs font-mono text-blue-700 font-bold mb-1">
                    N° Orden: {pedido.numero_orden}
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium truncate mr-2">{pedido.cliente}</p>
                  <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600"><strong>Fecha:</strong> {pedido.fecha}</p>
                  <p className="text-gray-600"><strong>Método:</strong> {pedido.metodo_pago ?? "-"}</p>
                  <p className="text-gray-600 col-span-2"><strong>Total:</strong> {formatPrice(pedido.total)}</p>
                </div>
                {pedido.referencia_pago && (
                  <div className="mt-2">
                    <img
                      src={
                        pedido.referencia_pago.startsWith('http')
                          ? pedido.referencia_pago
                          : `/storage/${pedido.referencia_pago}`
                      }
                      alt="Comprobante"
                      className="w-20 h-20 object-cover rounded border"
                      onError={e => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                )}
                <div className="mt-3 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRow(pedido.id)}
                    className="w-full"
                  >
                    {expandedRows.includes(pedido.id) ? "Ocultar productos" : "Ver productos"}
                  </Button>
                </div>
                {expandedRows.includes(pedido.id) && (
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Productos:</div>
                    <div className="space-y-3">
                      {pedido.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center p-2 bg-gray-50 rounded">
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
                            onError={e => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = "/images/placeholder.png";
                            }}
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.nombre_producto}</p>
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="inline-block mr-2">{formatPrice(item.precio_unitario)}</span>
                              <span className="inline-block mr-2">×</span>
                              <span className="inline-block">{item.cantidad}</span>
                            </div>
                            <p className="text-sm font-semibold mt-1">{formatPrice(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-blue-900">Total del pedido:</span>
                          <span className="font-extrabold text-blue-700">
                            {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <Select
                    value={pedido.estado}
                    onValueChange={(nuevoEstado) => actualizarEstado(pedido.id, nuevoEstado)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Procesando">Procesando</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadoPedidos;