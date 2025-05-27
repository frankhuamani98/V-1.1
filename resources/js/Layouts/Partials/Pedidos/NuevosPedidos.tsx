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
  metodo_pago?: string;
  total?: number; // <-- Añadido
  items?: PedidoItem[];
}

interface Props {
  pedidos: Pedido[];
}

const NuevosPedidos = ({ pedidos: pedidosProp = [] }: Props) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number): string =>
    price?.toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace("PEN", "S/")
    .replace(/\./g, "#")
    .replace(/,/g, ".")
    .replace(/#/g, ",");

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevos Pedidos</CardTitle>
          <CardDescription>Gestión de pedidos recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="hidden sm:table-header-group">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Total</TableHead> {/* Nueva columna */}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosProp.map((pedido) => (
                  <React.Fragment key={pedido.id}>
                    <TableRow className="sm:table-row hidden">
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell>{pedido.fecha}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRow(pedido.id)}
                          aria-label="Ver detalles"
                        >
                          Detalles del pedido{" "}
                          {expandedRows.includes(pedido.id) ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Móvil: Tarjeta */}
                    <div className="sm:hidden bg-white rounded-lg shadow-md p-4 mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{pedido.cliente}</p>
                          <p className="text-xs text-gray-500">{pedido.fecha}</p>
                          <p className="text-xs">
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
                          </p>
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
                    </div>

                    {/* Detalles del pedido (expandible) */}
                    {expandedRows.includes(pedido.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50">
                          <div className="p-2">
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
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NuevosPedidos;
