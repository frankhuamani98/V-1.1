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
import { ChevronDown, ChevronUp, FileText, Receipt, Book } from "lucide-react";
import FacturacionModal from "@/Components/Modals/FacturacionModal";

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
  tipo_comprobante: 'factura' | 'boleta' | 'nota_venta' | null;
  dni?: string;
  user?: {
    dni?: string;
  };
  items?: PedidoItem[];
  comprobante_generado?: {
    tipo: 'factura' | 'boleta' | 'nota_venta';
    numero: string;
    estado: string;
  } | null;
}

interface Props {
  pedidos: Pedido[];
}

const PedidosFinalizados = ({ pedidos: pedidosProp = [] }: Props) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [tipoComprobante, setTipoComprobante] = useState<'factura' | 'boleta' | 'nota_venta' | null>(null);

  const filteredPedidos = pedidosProp.filter(
    (pedido) =>
      (pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (pedido.estado === "Completado" || pedido.estado === "Cancelado")
  );

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

  const handleDocumentClick = () => {
    window.open('https://ww1.sunat.gob.pe/xssecurity/SignOnVerification.htm?signonForwardAction=https%3A%2F%2Fww1.sunat.gob.pe%2Fol-ti-itemisionfacturaresp%2Femitirfesimp.do', '_blank');
  };

  const handleGenerarComprobante = (pedido: Pedido, tipo: 'factura' | 'boleta' | 'nota_venta') => {
    setSelectedPedido(pedido);
    setTipoComprobante(tipo);
    setModalOpen(true);
  };

  return (
    <div className="w-full py-8 px-0">
      <div className="w-full px-0 sm:px-6">
        <Card className="shadow-lg rounded-xl border border-gray-100 bg-white">
          <CardHeader className="bg-white border-b border-gray-100 rounded-t-xl py-4 px-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Órdenes Finalizadas</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Consulta las reparaciones completadas en el taller.
            </CardDescription>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Buscar por cliente o número de orden"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md w-full sm:max-w-md bg-white text-gray-800 shadow-sm transition"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredPedidos.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">No hay órdenes finalizadas que coincidan con la búsqueda.</div>
            ) : (
              <>
                <div className="overflow-x-auto hidden sm:block">
                  <Table className="min-w-full">
                    <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">ID</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Cliente</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Fecha</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Estado</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Dirección</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Número de Orden</TableHead>
                        <TableHead className="font-semibold text-gray-600 text-xs uppercase tracking-wider px-4 py-3">Productos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPedidos.map((pedido) => (
                        <React.Fragment key={pedido.id}>
                          <TableRow className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.id}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.cliente}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.fecha}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-800">
                              <Badge
                                variant="outline"
                                className={(() => {
                                  switch (pedido.estado) {
                                    case "Completado": return "bg-green-100 text-green-800 border-green-200";
                                    case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
                                    default: return "bg-gray-100 text-gray-800 border-gray-200";
                                  }
                                })() + " px-2.5 py-0.5 rounded-full text-xs font-semibold"}
                              >
                                {pedido.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.direccion}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-800">{pedido.numeroOrden}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-800">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
                                <div className="p-4 bg-gray-50 rounded-lg mt-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                                    <div className="text-sm text-gray-700">
                                      <span className="font-semibold">N° Orden:</span>{" "}
                                      <span className="font-mono text-blue-600 font-bold">{pedido.numeroOrden}</span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      <span className="font-semibold">Cliente:</span> {pedido.cliente}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      <span className="font-semibold">Fecha:</span> {pedido.fecha}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      <span className="font-semibold">Dirección:</span> {pedido.direccion}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      <span className="font-semibold">Estado:</span>{" "}
                                      <Badge
                                        variant="outline"
                                        className={(() => {
                                          switch (pedido.estado) {
                                            case "Completado": return "bg-green-100 text-green-800 border-green-200";
                                            case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
                                            default: return "bg-gray-100 text-gray-800 border-gray-200";
                                          }
                                        })() + " px-2.5 py-0.5 rounded-full text-xs font-semibold"}
                                      >
                                        {pedido.estado}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    {pedido.tipo_comprobante === 'factura' && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 flex items-center gap-2"
                                          onClick={handleDocumentClick}
                                        >
                                          <FileText className="h-4 w-4" />
                                          Factura
                                        </Button>
                                        {pedido.comprobante_generado ? (
                                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Factura generada: {pedido.comprobante_generado.numero}
                                          </Badge>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                                            onClick={() => handleGenerarComprobante(pedido, 'factura')}
                                          >
                                            <FileText className="h-4 w-4" />
                                            Generar Factura Local
                                          </Button>
                                        )}
                                      </>
                                    )}
                                    {pedido.tipo_comprobante === 'boleta' && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 flex items-center gap-2"
                                          onClick={handleDocumentClick}
                                        >
                                          <Receipt className="h-4 w-4" />
                                          Boleta
                                        </Button>
                                        {pedido.comprobante_generado ? (
                                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center">
                                            <Receipt className="h-4 w-4 mr-2" />
                                            Boleta generada: {pedido.comprobante_generado.numero}
                                          </Badge>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                                            onClick={() => handleGenerarComprobante(pedido, 'boleta')}
                                          >
                                            <Receipt className="h-4 w-4" />
                                            Generar Boleta Local
                                          </Button>
                                        )}
                                      </>
                                    )}
                                    {pedido.tipo_comprobante === 'nota_venta' && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 flex items-center gap-2"
                                          onClick={handleDocumentClick}
                                        >
                                          <Book className="h-4 w-4" />
                                          Nota de Ventas
                                        </Button>
                                        {pedido.comprobante_generado ? (
                                          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center">
                                            <Book className="h-4 w-4 mr-2" />
                                            Nota de Venta generada: {pedido.comprobante_generado.numero}
                                          </Badge>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
                                            onClick={() => handleGenerarComprobante(pedido, 'nota_venta')}
                                          >
                                            <Book className="h-4 w-4" />
                                            Generar Nota de Venta Local
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </div>

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
                  {filteredPedidos.map((pedido) => (
                    <div key={pedido.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <div className="text-xs font-mono text-blue-600 font-bold mb-1">N° Orden: {pedido.numeroOrden}</div>
                          <p className="font-semibold text-base text-gray-800">{pedido.cliente}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Fecha: {pedido.fecha}</p>
                          <p className="text-xs text-gray-500">Dirección: {pedido.direccion}</p>
                          <div className="flex flex-wrap gap-2 items-center mt-2">
                            <Badge
                              variant="outline"
                              className={(() => {
                                switch (pedido.estado) {
                                  case "Completado": return "bg-green-100 text-green-800 border-green-200";
                                  case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
                                  default: return "bg-gray-100 text-gray-800 border-gray-200";
                                }
                              })() + " px-2.5 py-0.5 rounded-full text-xs font-semibold"}
                            >
                              {pedido.estado}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-gray-500 hover:bg-gray-100"
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
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="space-y-2 mb-4">
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">N° Orden:</span>{" "}
                              <span className="font-mono text-blue-600 font-bold">{pedido.numeroOrden}</span>
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Cliente:</span> {pedido.cliente}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Fecha:</span> {pedido.fecha}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Dirección:</span> {pedido.direccion}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Estado:</span>{" "}
                              <Badge
                                variant="outline"
                                className={(() => {
                                  switch (pedido.estado) {
                                    case "Completado": return "bg-green-100 text-green-800 border-green-200";
                                    case "Cancelado": return "bg-red-100 text-red-800 border-red-200";
                                    default: return "bg-gray-100 text-gray-800 border-gray-200";
                                  }
                                })() + " px-2.5 py-0.5 rounded-full text-xs font-semibold"}
                              >
                                {pedido.estado}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {pedido.tipo_comprobante === 'factura' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 flex items-center gap-2"
                                  onClick={handleDocumentClick}
                                >
                                  <FileText className="h-4 w-4" />
                                  Factura
                                </Button>
                                {pedido.comprobante_generado ? (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Factura generada: {pedido.comprobante_generado.numero}
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                                    onClick={() => handleGenerarComprobante(pedido, 'factura')}
                                  >
                                    <FileText className="h-4 w-4" />
                                    Generar Factura
                                  </Button>
                                )}
                              </>
                            )}
                            {pedido.tipo_comprobante === 'boleta' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 flex items-center gap-2"
                                  onClick={handleDocumentClick}
                                >
                                  <Receipt className="h-4 w-4" />
                                  Boleta
                                </Button>
                                {pedido.comprobante_generado ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center">
                                    <Receipt className="h-4 w-4 mr-2" />
                                    Boleta generada: {pedido.comprobante_generado.numero}
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                                    onClick={() => handleGenerarComprobante(pedido, 'boleta')}
                                  >
                                    <Receipt className="h-4 w-4" />
                                    Generar Boleta
                                  </Button>
                                )}
                              </>
                            )}
                            {pedido.tipo_comprobante === 'nota_venta' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 flex items-center gap-2"
                                  onClick={handleDocumentClick}
                                >
                                  <Book className="h-4 w-4" />
                                  Nota de Ventas
                                </Button>
                                {pedido.comprobante_generado ? (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 flex items-center">
                                    <Book className="h-4 w-4 mr-2" />
                                    Nota de Venta generada: {pedido.comprobante_generado.numero}
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
                                    onClick={() => handleGenerarComprobante(pedido, 'nota_venta')}
                                  >
                                    <Book className="h-4 w-4" />
                                    Generar Nota de Venta
                                  </Button>
                                )}
                              </>
                            )}
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
      {modalOpen && selectedPedido && tipoComprobante && (
        <FacturacionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedPedido(null);
            setTipoComprobante(null);
          }}
          pedido={selectedPedido}
          tipoComprobante={tipoComprobante}
        />
      )}
    </div>
  );
};

export default PedidosFinalizados;