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

  const getAvailableStates = (currentEstado: string) => {
    switch (currentEstado) {
      case "Pendiente":
        return ["Pendiente", "Procesando", "Completado", "Cancelado"];
      case "Procesando":
        return ["Procesando", "Completado", "Cancelado"];
      case "Completado":
        return ["Completado", "Cancelado"];
      case "Cancelado":
        return ["Cancelado"];
      default:
        return ["Pendiente", "Procesando", "Completado", "Cancelado"];
    }
  };

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

  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "-";
    const num = Number(price);
    if (isNaN(num)) return "-";
    return "S/ " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="w-full py-8 px-0">
      <div className="w-full px-0 sm:px-6">
        <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-xl py-4 px-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Todos los Pedidos</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Gestiona y actualiza el estado de todos los pedidos.
            </CardDescription>
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
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Estado</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Método de Pago</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Total</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Actualizar</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Productos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.map((pedido) => (
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
                          {pedido.metodo_pago ?? <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          {pedido.total !== undefined ? formatPrice(pedido.total) : <span className="text-gray-400">-</span>}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          <Select
                            value={pedido.estado}
                            onValueChange={(nuevoEstado) => actualizarEstado(pedido.id, nuevoEstado)}
                          >
                            <SelectTrigger className="w-[150px] border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableStates(pedido.estado).map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRow(pedido.id)}
                            aria-label="Ver productos"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            {expandedRows.includes(pedido.id) ? "Ocultar" : "Ver"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(pedido.id) && (
                        <TableRow>
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
                                      onError={e => {
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
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="sm:hidden space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-lg shadow-sm p-4 overflow-hidden border border-gray-100">
                  {pedido.numero_orden && (
                    <div className="text-xs font-mono text-blue-600 font-bold mb-1">
                      N° Orden: {pedido.numero_orden}
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold truncate mr-2 text-base text-gray-800">{pedido.cliente}</p>
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
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600"><strong>Fecha:</strong> {pedido.fecha}</p>
                    <p className="text-gray-600"><strong>Método:</strong> {pedido.metodo_pago ?? "-"}</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleRow(pedido.id)}
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {expandedRows.includes(pedido.id) ? "Ocultar productos" : "Ver productos"}
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
                        {getAvailableStates(pedido.estado).map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstadoPedidos;