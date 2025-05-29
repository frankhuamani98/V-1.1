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
  estado: string;
  direccion: string;
  numeroOrden: string;
  items?: PedidoItem[];
}

interface Props {
  pedidos: Pedido[];
}

const PedidosFinalizados = ({ pedidos: pedidosProp = [] }: Props) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPedidos = pedidosProp.filter(
    (pedido) =>
      (pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase())) &&
      pedido.estado === "Completado"
  );

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Completado":
        return "default";
      case "Cancelado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "-";
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
    <div className="p-2 sm:p-4">
      <Card className="shadow-lg border border-blue-100 bg-neutral-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Órdenes Finalizadas</CardTitle>
          <CardDescription className="text-blue-500">Consulta las reparaciones completadas en el taller.</CardDescription>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Buscar por cliente o número de orden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded w-full sm:max-w-md bg-neutral-50 text-neutral-900 transition"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPedidos.length === 0 ? (
            <div className="text-center text-sm text-blue-400">No hay órdenes finalizadas que coincidan con la búsqueda.</div>
          ) : (
            <>
              {/* Tabla en pantallas grandes */}
              <div className="overflow-x-auto hidden sm:block">
                <Table className="min-w-full bg-white rounded-lg shadow border border-blue-100">
                  <TableHeader>
                    <TableRow className="bg-blue-50 border-b border-blue-100">
                      <TableHead className="p-3 font-semibold text-blue-900">ID</TableHead>
                      <TableHead className="p-3 font-semibold text-blue-900">Cliente</TableHead>
                      <TableHead className="p-3 font-semibold text-blue-900">Fecha</TableHead>
                      <TableHead className="p-3 font-semibold text-blue-900">Estado</TableHead>
                      <TableHead className="p-3 font-semibold text-blue-900">Dirección</TableHead>
                      <TableHead className="p-3 font-semibold text-blue-900">Número de Orden</TableHead>
                      <TableHead className="p-3 font-semibold text-blue-900">Productos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => (
                      <React.Fragment key={pedido.id}>
                        <TableRow className="border-b hover:bg-blue-50 transition">
                          <TableCell className="p-3">{pedido.id}</TableCell>
                          <TableCell className="p-3">{pedido.cliente}</TableCell>
                          <TableCell className="p-3">{pedido.fecha}</TableCell>
                          <TableCell className="p-3">
                            <Badge variant={getBadgeVariant(pedido.estado)} className="px-2 py-1 rounded-full text-xs font-medium shadow bg-blue-100 text-blue-900 border border-blue-200">
                              {pedido.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-3">{pedido.direccion}</TableCell>
                          <TableCell className="p-3">{pedido.numeroOrden}</TableCell>
                          <TableCell className="p-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full border-blue-300 text-blue-900 hover:bg-blue-100 hover:text-blue-900 transition"
                              onClick={() => toggleRow(pedido.id)}
                              aria-label="Ver productos"
                            >
                              {expandedRows.includes(pedido.id) ? "Ocultar" : "Ver"}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedRows.includes(pedido.id) && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-blue-50 border-b">
                              <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-inner">
                                <div className="font-semibold mb-2 text-sm text-blue-900">Productos del pedido:</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-blue-100">
                                      <TableHead className="p-2 text-blue-900">Foto</TableHead>
                                      <TableHead className="p-2 text-blue-900">Producto</TableHead>
                                      <TableHead className="p-2 text-blue-900">Precio</TableHead>
                                      <TableHead className="p-2 text-blue-900">Cantidad</TableHead>
                                      <TableHead className="p-2 text-blue-900">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pedido.items?.map((item, idx) => (
                                      <TableRow key={idx} className="border-b hover:bg-blue-50">
                                        <TableCell className="p-2">
                                          <img
                                            src={
                                              item.imagen
                                                ? (item.imagen.startsWith("http")
                                                    ? item.imagen
                                                    : `/storage/${item.imagen}`)
                                                : "/images/placeholder.png"
                                            }
                                            alt={item.nombre_producto}
                                            className="w-10 h-10 object-cover rounded border border-blue-100 shadow"
                                            onError={e => {
                                              const target = e.currentTarget as HTMLImageElement;
                                              target.src = "/images/placeholder.png";
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell className="p-2 text-neutral-900">{item.nombre_producto}</TableCell>
                                        <TableCell className="p-2 text-blue-900">{formatPrice(item.precio_unitario)}</TableCell>
                                        <TableCell className="p-2 text-neutral-900">{item.cantidad}</TableCell>
                                        <TableCell className="p-2 text-blue-900">{formatPrice(item.subtotal)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Tarjetas en móviles */}
              <div className="sm:hidden space-y-3">
                {filteredPedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-neutral-50 rounded-xl shadow-lg border border-blue-100 p-3 w-full transition hover:shadow-xl">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-semibold text-base text-blue-900">{pedido.cliente}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-blue-100"
                        onClick={() => toggleRow(pedido.id)}
                        aria-label="Ver detalles"
                      >
                        {expandedRows.includes(pedido.id) ? (
                          <ChevronUp className="h-5 w-5 text-blue-900" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-blue-900" />
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-blue-700 mb-1"><strong>Fecha:</strong> {pedido.fecha}</div>
                    <div className="text-xs text-blue-700 mb-1"><strong>Dirección:</strong> {pedido.direccion}</div>
                    <div className="text-xs text-blue-700 mb-1"><strong>Número de Orden:</strong> {pedido.numeroOrden}</div>
                    <div className="text-xs mb-2">
                      <strong>Estado:</strong>{" "}
                      <Badge variant={getBadgeVariant(pedido.estado)} className="px-2 py-1 rounded-full text-xs font-medium shadow bg-blue-100 text-blue-900 border border-blue-200">
                        {pedido.estado}
                      </Badge>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-blue-300 w-full font-medium text-xs py-1 text-blue-900 hover:bg-blue-100 hover:text-blue-900 transition"
                        onClick={() => toggleRow(pedido.id)}
                        aria-label="Ver productos"
                      >
                        {expandedRows.includes(pedido.id) ? "Ocultar productos" : "Ver productos"}
                      </Button>
                    </div>
                    {expandedRows.includes(pedido.id) && (
                      <div className="mt-3">
                        <div className="font-semibold mb-2 text-xs text-blue-900">Productos del pedido:</div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs border border-blue-100 rounded-lg">
                            <thead>
                              <tr className="bg-blue-100">
                                <th className="text-left p-2 text-blue-900">Foto</th>
                                <th className="text-left p-2 text-blue-900">Producto</th>
                                <th className="text-left p-2 text-blue-900">Precio</th>
                                <th className="text-left p-2 text-blue-900">Cantidad</th>
                                <th className="text-left p-2 text-blue-900">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pedido.items?.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-blue-50">
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
                                      className="w-10 h-10 object-cover rounded border border-blue-100 shadow"
                                      onError={e => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.src = "/images/placeholder.png";
                                      }}
                                    />
                                  </td>
                                  <td className="p-2 text-neutral-900">{item.nombre_producto}</td>
                                  <td className="p-2 text-blue-900">{formatPrice(item.precio_unitario)}</td>
                                  <td className="p-2 text-neutral-900">{item.cantidad}</td>
                                  <td className="p-2 text-blue-900">{formatPrice(item.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PedidosFinalizados;