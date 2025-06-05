import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Home, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";
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

const formatPrice = (price: number | string): string => {
  const num = Number(price);
  if (isNaN(num)) return "-";
  return `S/ ${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const getEstadoColor = (estado: string): string => {
  const estadoLower = estado.toLowerCase();
  switch (estadoLower) {
    case 'pendiente':
      return 'yellow';
    case 'procesando':
      return 'blue';
    case 'completado':
      return 'green';
    case 'cancelado':
      return 'red';
    default:
      return 'gray';
  }
};

export default function MisPedidos({ pedidos = [] }: Props) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (pedidoId: number) => {
    setExpandedRows(prev =>
      prev.includes(pedidoId)
        ? prev.filter(id => id !== pedidoId)
        : [...prev, pedidoId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Head title="Mis Pedidos" />
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-muted-foreground hover:text-primary"
                >
                  <Link href="/">
                    <Home className="h-4 w-4 mr-1" />
                    <span>Inicio</span>
                  </Link>
                </Button>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Mis Pedidos</span>
              </li>
            </ol>
          </nav>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Mis Pedidos</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Historial de todos tus pedidos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden sm:block">
                <Table className="dark:bg-gray-800 dark:text-gray-100">
                  <TableHeader>
                    <TableRow className="dark:bg-gray-800">
                      <TableHead className="w-20 dark:text-gray-300"></TableHead>
                      <TableHead className="dark:text-gray-300">N° Orden</TableHead>
                      <TableHead className="dark:text-gray-300">Fecha</TableHead>
                      <TableHead className="dark:text-gray-300">Estado</TableHead>
                      <TableHead className="dark:text-gray-300">Método de pago</TableHead>
                      <TableHead className="dark:text-gray-300">Total</TableHead>
                      <TableHead className="w-20 dark:text-gray-300">Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido) => (
                      <React.Fragment key={pedido.id}>
                        <TableRow className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                          <TableCell className="text-center">
                            <button
                              onClick={() => toggleRow(pedido.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                              {expandedRows.includes(pedido.id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900 dark:text-white">
                            {pedido.numero_orden}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="text-gray-900 dark:text-white">{pedido.fecha}</span>
                              {pedido.hora && (
                                <span className="text-gray-500 dark:text-gray-300"> • {pedido.hora}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                "bg-" +
                                getEstadoColor(pedido.estado) +
                                "-100 text-" +
                                getEstadoColor(pedido.estado) +
                                "-800 dark:bg-" +
                                getEstadoColor(pedido.estado) +
                                "-900 dark:text-" +
                                getEstadoColor(pedido.estado) +
                                "-200"
                              }
                            >
                              {pedido.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="dark:text-gray-200">{pedido.metodo_pago || "-"}</TableCell>
                          <TableCell className="dark:text-gray-200">
                            {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => toggleRow(pedido.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                              {expandedRows.includes(pedido.id)
                                ? "Ocultar"
                                : "Ver más"}
                            </button>
                          </TableCell>
                        </TableRow>
                        {expandedRows.includes(pedido.id) && (
                          <TableRow>
                            <TableCell colSpan={7} className="p-6 bg-gray-50 dark:bg-gray-900">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                  Detalle de productos
                                </h4>
                                <Table className="dark:bg-gray-900">
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="dark:text-gray-300">Producto</TableHead>
                                      <TableHead className="dark:text-gray-300">Precio unitario</TableHead>
                                      <TableHead className="dark:text-gray-300">Cantidad</TableHead>
                                      <TableHead className="dark:text-gray-300">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pedido.items?.map((item, index) => (
                                      <TableRow key={index} className="dark:bg-gray-900">
                                        <TableCell>
                                          <div className="flex items-center">
                                            {item.imagen && (
                                              <img
                                                src={
                                                  item.imagen.startsWith("http")
                                                    ? item.imagen
                                                    : `/storage/${item.imagen}`
                                                }
                                                alt={item.nombre_producto}
                                                className="w-10 h-10 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                                onError={(e) => {
                                                  const target = e.currentTarget as HTMLImageElement;
                                                  target.src = "/images/placeholder.png";
                                                }}
                                              />
                                            )}
                                            <span className="ml-3 dark:text-gray-200">{item.nombre_producto}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="dark:text-gray-200">{formatPrice(item.precio_unitario)}</TableCell>
                                        <TableCell className="dark:text-gray-200">{item.cantidad}</TableCell>
                                        <TableCell className="dark:text-gray-200">{formatPrice(item.subtotal)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                  {pedido.referencia_pago && (
                                    <div>
                                      <div className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Comprobante de pago:</div>
                                      <img
                                        src={
                                          pedido.referencia_pago.startsWith("http")
                                            ? pedido.referencia_pago
                                            : `/storage/${pedido.referencia_pago}`
                                        }
                                        alt="Comprobante de pago"
                                        className="w-64 max-w-full rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLImageElement;
                                          target.src = "/images/placeholder.png";
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="md:text-right">
                                    <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-xl px-6 py-3 inline-block">
                                      <span className="font-bold text-blue-900 dark:text-blue-200 mr-2">Total del pedido:</span>
                                      <span className="font-extrabold text-blue-700 dark:text-blue-300 text-lg">
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
                  <div key={pedido.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                    <div className="space-y-2">
                      {pedido.numero_orden && (
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-300 font-bold">
                          N° Orden: {pedido.numero_orden}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-900 dark:text-white">{pedido.fecha}</span>
                          {pedido.hora && (
                            <span className="text-gray-500 dark:text-gray-300"> • {pedido.hora}</span>
                          )}
                        </div>
                        <Badge
                          className={
                            "bg-" +
                            getEstadoColor(pedido.estado) +
                            "-100 text-" +
                            getEstadoColor(pedido.estado) +
                            "-800 dark:bg-" +
                            getEstadoColor(pedido.estado) +
                            "-900 dark:text-" +
                            getEstadoColor(pedido.estado) +
                            "-200"
                          }
                        >
                          {pedido.estado}
                        </Badge>
                      </div>
                      {pedido.metodo_pago && (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Método de pago: {pedido.metodo_pago}
                        </div>
                      )}
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Total: {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleRow(pedido.id)}
                        className="w-full mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center justify-center"
                      >
                        {expandedRows.includes(pedido.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Ocultar detalles
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Ver detalles
                          </>
                        )}
                      </button>
                    </div>

                    {expandedRows.includes(pedido.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                          Detalle de productos
                        </h4>
                        <div className="space-y-3">
                          {pedido.items?.map((item, index) => (
                            <div key={index} className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                {item.imagen && (
                                  <img
                                    src={
                                      item.imagen.startsWith("http")
                                        ? item.imagen
                                        : `/storage/${item.imagen}`
                                    }
                                    alt={item.nombre_producto}
                                    className="w-10 h-10 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      target.src = "/images/placeholder.png";
                                    }}
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.nombre_producto}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-300">
                                    Cantidad: {item.cantidad} x{" "}
                                    {formatPrice(item.precio_unitario)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.subtotal)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {pedido.referencia_pago && (
                          <div className="mt-4">
                            <div className="font-semibold mb-2 text-sm text-blue-700 dark:text-blue-300">
                              Comprobante de pago:
                            </div>
                            <img
                              src={
                                pedido.referencia_pago.startsWith("http")
                                  ? pedido.referencia_pago
                                  : `/storage/${pedido.referencia_pago}`
                              }
                              alt="Comprobante de pago"
                              className="w-full max-w-[200px] rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = "/images/placeholder.png";
                              }}
                            />
                          </div>
                        )}

                        <div className="mt-4 text-right">
                          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-2 inline-block">
                            <span className="font-bold text-blue-900 dark:text-blue-200 mr-2 text-sm">
                              Total del pedido:
                            </span>
                            <span className="font-extrabold text-blue-700 dark:text-blue-300 text-base">
                              {pedido.total !== undefined ? formatPrice(pedido.total) : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {pedidos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-300">No tienes pedidos realizados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}