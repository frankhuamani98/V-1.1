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

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pedido.numero_orden?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = selectedStatus ? pedido.estado === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const sortedPedidos = filteredPedidos.sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

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
    <div className="w-full py-8 px-0">
      <div className="w-full px-0 sm:px-6">
        <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-xl py-4 px-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Historial de Pedidos</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Consulta todos los pedidos realizados en el taller.
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
              <Input
                type="text"
                placeholder="Buscar por cliente o número de orden"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md w-full sm:w-64 bg-white text-gray-800 shadow-sm transition"
              />
              <Select value={selectedStatus} onValueChange={v => setSelectedStatus(v === "todos" ? undefined : v)}>
                <SelectTrigger className="w-full sm:w-32 px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-white text-gray-800 shadow-sm transition">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Procesando">Procesando</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition flex items-center justify-center"
              >
                Ordenar por fecha {sortOrder === "asc" ? <ChevronUp className="h-4 w-4 ml-2 text-gray-500" /> : <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto hidden sm:block">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">ID</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">N° Orden</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Cliente</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Fecha</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Hora</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Estado</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Método de Pago</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Total</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Comprobante</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Productos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPedidos.map((pedido) => (
                    <React.Fragment key={pedido.id}>
                      <TableRow className="border-b border-gray-100 hover:bg-gray-50">
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
                          {pedido.referencia_pago ? (
                            <img
                              src={
                                pedido.referencia_pago.startsWith('http')
                                  ? pedido.referencia_pago
                                  : `/storage/${pedido.referencia_pago}`
                              }
                              alt="Comprobante de pago"
                              className="w-16 h-16 object-cover rounded-md border border-gray-200 shadow-sm"
                              onError={e => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = "/images/placeholder.png";
                              }}
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          <Button variant="outline" size="sm" onClick={() => toggleRow(pedido.id)} aria-label="Ver detalles" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            Detalles del pedido{expandedRows.includes(pedido.id) ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(pedido.id) && (
                        <TableRow className="hidden sm:table-row">
                          <TableCell colSpan={10}>
                            <div className="p-4 bg-gray-50 rounded-lg mt-2">
                              <div className="font-semibold mb-3 text-gray-700">Resumen del Pedido:</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">N° Orden:</span>{" "}
                                  <span className="font-mono text-blue-600 font-bold">{pedido.numero_orden ?? '-'}</span>
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Cliente:</span> {pedido.cliente}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Fecha:</span> {pedido.fecha}
                                  {pedido.hora && <span className="ml-2 text-gray-600 font-medium">{pedido.hora}</span>}
                                </div>
                                <div className="text-sm text-gray-700 flex flex-wrap gap-2 items-center">
                                  <span className="font-semibold">Estado:</span>{" "}
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
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="font-semibold">Método de Pago:</span>{" "}
                                  {pedido.metodo_pago ?? <span className="text-gray-400">-</span>}
                                </div>
                              </div>

                              <div className="font-semibold mb-3 text-gray-700 mt-6">Productos del pedido:</div>
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
                                          onError={e => {
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
                                  <div className="col-span-1">
                                    <div className="font-semibold mb-2 text-blue-700">Comprobante de pago:</div>
                                    <img
                                      src={
                                        pedido.referencia_pago.startsWith('http')
                                          ? pedido.referencia_pago
                                          : `/storage/${pedido.referencia_pago}`
                                      }
                                      alt="Comprobante de pago"
                                      className="w-64 max-w-full rounded-lg border border-blue-200 shadow-sm"
                                      onError={e => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.src = "/images/placeholder.png";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="md:text-right flex items-end justify-end">
                                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 inline-block">
                                    <span className="font-bold text-blue-900 mr-2">Total del pedido:</span>
                                    <span className="font-extrabold text-blue-700 text-lg">
                                      {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                                    </span>
                                  </div>
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

            <div className="sm:hidden space-y-4 px-4">
              {sortedPedidos.map((pedido) => (
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
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="font-semibold mb-3 text-sm text-gray-700">Resumen del Pedido:</div>
                      <div className="space-y-1 mb-4">
                        {pedido.numero_orden && (
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">N° Orden:</span>{" "}
                            <span className="font-mono text-blue-600 font-bold">{pedido.numero_orden}</span>
                          </div>
                        )}
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Cliente:</span> {pedido.cliente}
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Fecha:</span> {pedido.fecha}
                          {pedido.hora && (
                            <span className="ml-2 text-gray-600 font-medium">
                              {pedido.hora}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 flex flex-wrap gap-2 items-center">
                          <span className="font-semibold">Estado:</span>{" "}
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
                            })() + " px-2.5 py-0.5 rounded-full text-xs font-semibold"}
                          >
                            {pedido.estado}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">Método de Pago:</span>{" "}
                          {pedido.metodo_pago ?? <span className="text-gray-400">-</span>}
                        </div>
                      </div>

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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistorialPedidos;