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
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Órdenes Finalizadas</CardTitle>
          <CardDescription className="text-gray-500">Consulta las reparaciones completadas en el taller.</CardDescription>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Buscar por cliente o número de orden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border rounded w-full sm:max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPedidos.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No hay órdenes finalizadas que coincidan con la búsqueda.</div>
          ) : (
            <>
              {/* Tabla en pantallas grandes */}
              <div className="overflow-x-auto hidden sm:block">
                <Table className="min-w-full bg-white rounded shadow-sm">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="p-2">ID</TableHead>
                      <TableHead className="p-2">Cliente</TableHead>
                      <TableHead className="p-2">Fecha</TableHead>
                      <TableHead className="p-2">Estado</TableHead>
                      <TableHead className="p-2">Dirección</TableHead>
                      <TableHead className="p-2">Número de Orden</TableHead>
                      <TableHead className="p-2">Productos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => (
                      <React.Fragment key={pedido.id}>
                        <TableRow className="border-b">
                          <TableCell className="p-2">{pedido.id}</TableCell>
                          <TableCell className="p-2">{pedido.cliente}</TableCell>
                          <TableCell className="p-2">{pedido.fecha}</TableCell>
                          <TableCell className="p-2">
                            <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                          </TableCell>
                          <TableCell className="p-2">{pedido.direccion}</TableCell>
                          <TableCell className="p-2">{pedido.numeroOrden}</TableCell>
                          <TableCell className="p-2">
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
                            <TableCell colSpan={7}>
                              <div className="p-2 bg-gray-50 rounded">
                                <div className="font-semibold mb-1 text-sm">Productos del pedido:</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-gray-100">
                                      <TableHead className="p-1">Foto</TableHead>
                                      <TableHead className="p-1">Producto</TableHead>
                                      <TableHead className="p-1">Precio</TableHead>
                                      <TableHead className="p-1">Cantidad</TableHead>
                                      <TableHead className="p-1">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pedido.items?.map((item, idx) => (
                                      <TableRow key={idx} className="border-b">
                                        <TableCell className="p-1">
                                          <img
                                            src={
                                              item.imagen
                                                ? (item.imagen.startsWith("http")
                                                    ? item.imagen
                                                    : `/storage/${item.imagen}`)
                                                : "/images/placeholder.png"
                                            }
                                            alt={item.nombre_producto}
                                            className="w-8 h-8 object-cover rounded"
                                            onError={e => {
                                              const target = e.currentTarget as HTMLImageElement;
                                              target.src = "/images/placeholder.png";
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell className="p-1">{item.nombre_producto}</TableCell>
                                        <TableCell className="p-1">{formatPrice(item.precio_unitario)}</TableCell>
                                        <TableCell className="p-1">{item.cantidad}</TableCell>
                                        <TableCell className="p-1">{formatPrice(item.subtotal)}</TableCell>
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
              <div className="sm:hidden space-y-2">
                {filteredPedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded shadow-sm p-2 w-full">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm">{pedido.cliente}</div>
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
                    <div className="text-xs text-gray-500"><strong>Fecha:</strong> {pedido.fecha}</div>
                    <div className="text-xs text-gray-500"><strong>Dirección:</strong> {pedido.direccion}</div>
                    <div className="text-xs text-gray-500"><strong>Número de Orden:</strong> {pedido.numeroOrden}</div>
                    <div className="text-xs">
                      <strong>Estado:</strong>{" "}
                      <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                    </div>
                    <div className="mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRow(pedido.id)}
                        aria-label="Ver productos"
                      >
                        {expandedRows.includes(pedido.id) ? "Ocultar productos" : "Ver productos"}
                      </Button>
                    </div>
                    {expandedRows.includes(pedido.id) && (
                      <div className="mt-2">
                        <div className="font-semibold mb-1 text-xs">Productos del pedido:</div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="text-left p-1">Foto</th>
                                <th className="text-left p-1">Producto</th>
                                <th className="text-left p-1">Precio</th>
                                <th className="text-left p-1">Cantidad</th>
                                <th className="text-left p-1">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pedido.items?.map((item, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-1">
                                    <img
                                      src={
                                        item.imagen
                                          ? (item.imagen.startsWith("http")
                                              ? item.imagen
                                              : `/storage/${item.imagen}`)
                                          : "/images/placeholder.png"
                                      }
                                      alt={item.nombre_producto}
                                      className="w-8 h-8 object-cover rounded"
                                      onError={e => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.src = "/images/placeholder.png";
                                      }}
                                    />
                                  </td>
                                  <td className="p-1">{item.nombre_producto}</td>
                                  <td className="p-1">{formatPrice(item.precio_unitario)}</td>
                                  <td className="p-1">{item.cantidad}</td>
                                  <td className="p-1">{formatPrice(item.subtotal)}</td>
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
