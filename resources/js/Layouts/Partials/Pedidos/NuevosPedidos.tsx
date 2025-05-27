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
import { useForm } from '@inertiajs/react';

interface PedidoItem {
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen?: string;
}

interface Pedido {
  id: number;
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
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosProp); // Nuevo estado local para pedidos

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number | string): string => {
    const num = Number(price);
    if (isNaN(num)) return "-";
    return (
      "S/ " +
      num
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevos Pedidos</CardTitle>
          <CardDescription>Gestión de pedidos recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Tabla para escritorio */}
            <Table className="min-w-full">
              <TableHeader className="hidden sm:table-header-group">
                <TableRow>
                  <TableHead>ID</TableHead>
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
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell>{pedido.fecha}</TableCell>
                      <TableCell>{pedido.hora ?? '-'}</TableCell>
                      <TableCell>
                        {/* Mostrar solo el estado, sin selector */}
                        <span className="text-xs font-semibold">
                          {pedido.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {pedido.total !== null && pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => toggleRow(pedido.id)} aria-label="Ver detalles">
                          Detalles del pedido{" "}
                          {expandedRows.includes(pedido.id) ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(pedido.id) && (
                      <TableRow className="hidden sm:table-row">
                        <TableCell colSpan={8}>
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
                                  onError={e => {
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
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

            {/* Tarjetas móviles */}
            <div className="sm:hidden">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4 mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{pedido.cliente}</p>
                      <p className="text-xs text-gray-500">
                        {pedido.fecha}
                        {pedido.hora && (
                          <span className="ml-2 text-blue-700 font-semibold">
                            {pedido.hora}
                          </span>
                        )}
                      </p>
                      <span className="text-xs">
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
                        >
                          {pedido.estado}
                        </Badge>
                      </span>
                      <p className="text-xs text-gray-500">
                        Método de pago: {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                      </p>
                      <p className="text-xs text-gray-700 font-bold">
                        Total: {pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRow(pedido.id)}
                      aria-label="Ver detalles"
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
                      <div className="font-semibold mb-2">Productos del pedido:</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left p-2">Foto</th>
                              <th className="text-left p-2">Producto</th>
                              <th className="text-left p-2">Precio</th>
                              <th className="text-left p-2">Cantidad</th>
                              <th className="text-left p-2">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pedido.items?.map((item, idx) => (
                              <tr key={idx}>
                                <td className="p-2">
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
                                </td>
                                <td className="p-2">{item.nombre_producto}</td>
                                <td className="p-2">{formatPrice(item.precio_unitario)}</td>
                                <td className="p-2">{item.cantidad}</td>
                                <td className="p-2">{formatPrice(item.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
                            onError={e => {
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NuevosPedidos;