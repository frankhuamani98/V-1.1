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
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Finalizadas</CardTitle>
          <CardDescription>Consulta las reparaciones completadas en el taller.</CardDescription>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar por cliente o número de orden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md w-full sm:max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredPedidos.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No hay órdenes finalizadas que coincidan con la búsqueda.</p>
          ) : (
            <>
              {/* Tabla en pantallas grandes */}
              <div className="overflow-x-auto hidden sm:block">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Número de Orden</TableHead>
                      <TableHead>Productos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => (
                      <React.Fragment key={pedido.id}>
                        <TableRow>
                          <TableCell>{pedido.id}</TableCell>
                          <TableCell>{pedido.cliente}</TableCell>
                          <TableCell>{pedido.fecha}</TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                          </TableCell>
                          <TableCell>{pedido.direccion}</TableCell>
                          <TableCell>{pedido.numeroOrden}</TableCell>
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
                            <TableCell colSpan={7}>
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
              <div className="sm:hidden space-y-4">
                {filteredPedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{pedido.cliente}</p>
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
                    <p className="text-sm text-gray-600"><strong>Fecha:</strong> {pedido.fecha}</p>
                    <p className="text-sm text-gray-600"><strong>Dirección:</strong> {pedido.direccion}</p>
                    <p className="text-sm text-gray-600"><strong>Número de Orden:</strong> {pedido.numeroOrden}</p>
                    <p className="text-sm">
                      <strong>Estado:</strong>{" "}
                      <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                    </p>
                    <div className="mt-2">
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
