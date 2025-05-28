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
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { ChevronUp, ChevronDown } from "lucide-react";

// Estructura igual a NuevosPedidos
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

const HistorialPedidos = ({ pedidos = [] }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  // Filtrar pedidos por cliente o número de orden y estado
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pedido.numero_orden?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = selectedStatus ? pedido.estado === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Ordenar pedidos por fecha
  const sortedPedidos = filteredPedidos.sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const getBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completado":
      case "finalizado":
        return "default";
      case "cancelado":
        return "destructive";
      case "procesando":
        return "outline";
      default:
        return "secondary";
    }
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

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pedidos</CardTitle>
          <CardDescription>Consulta todos los pedidos realizados en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <Input
              placeholder="Buscar por cliente o número de orden"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <Select value={selectedStatus} onValueChange={v => setSelectedStatus(v === "todos" ? undefined : v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Procesando">Procesando</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                {/* Agrega más estados si existen */}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="w-full sm:w-auto"
            >
              Ordenar por fecha {sortOrder === "asc" ? <ChevronUp className="h-4 w-4 inline-block" /> : <ChevronDown className="h-4 w-4 inline-block" />}
            </Button>
          </div>

          {/* Tabla en pantallas grandes */}
          <div className="overflow-x-auto hidden sm:block">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>N° Orden</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>Productos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPedidos.map((pedido) => (
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
                      <TableCell>{pedido.hora ?? '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        {pedido.total !== null && pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
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
                        <Button variant="outline" size="sm" onClick={() => toggleRow(pedido.id)}>
                          Ver productos
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(pedido.id) && (
                      <TableRow>
                        <TableCell colSpan={10}>
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
          </div>

          {/* Vista en tarjetas para móviles */}
          <div className="sm:hidden space-y-4">
            {sortedPedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    {pedido.numero_orden && (
                      <div className="text-xs font-mono text-blue-700 font-bold mb-1">
                        N° Orden: {pedido.numero_orden}
                      </div>
                    )}
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
                      <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                    </span>
                    <p className="text-xs text-gray-500">
                      Método de pago: {pedido.metodo_pago ? pedido.metodo_pago : <span className="text-gray-400">-</span>}
                    </p>
                    <p className="text-xs text-gray-700 font-bold">
                      Total: {pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                    </p>
                    {pedido.referencia_pago && (
                      <div className="mt-2">
                        <img
                          src={
                            pedido.referencia_pago.startsWith('http')
                              ? pedido.referencia_pago
                              : `/storage/${pedido.referencia_pago}`
                          }
                          alt="Comprobante de pago"
                          className="w-24 h-24 object-cover rounded border"
                          onError={e => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/images/placeholder.png";
                          }}
                        />
                      </div>
                    )}
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
                                  onError={(e) => {
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
        </CardContent>
      </Card>
    </div>
  );
};

export default HistorialPedidos;
