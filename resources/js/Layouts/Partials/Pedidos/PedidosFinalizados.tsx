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

const PedidosFinalizados = () => {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: "Juan Pérez", moto: "Honda CBR 600", servicio: "Cambio de aceite", fecha: "2024-03-10", estado: "Finalizado", direccion: "Calle 123, Ciudad X", numeroOrden: "ORD-12345" },
    { id: 2, cliente: "María Gómez", moto: "Yamaha R3", servicio: "Revisión general", fecha: "2024-03-12", estado: "Cancelado", direccion: "Avenida 456, Ciudad Y", numeroOrden: "ORD-12346" },
    { id: 3, cliente: "Carlos Ruiz", moto: "Suzuki GSX-R750", servicio: "Cambio de frenos", fecha: "2024-03-14", estado: "Finalizado", direccion: "Calle 789, Ciudad Z", numeroOrden: "ORD-12347" },
    { id: 4, cliente: "Ana López", moto: "Kawasaki Ninja 400", servicio: "Reparación de motor", fecha: "2024-03-15", estado: "Finalizado", direccion: "Calle 101, Ciudad A", numeroOrden: "ORD-12348" },
  ]);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filteredPedidos = pedidos.filter(
    (pedido) =>
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.moto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Finalizado":
        return "default";
      case "Cancelado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Finalizadas</CardTitle>
          <CardDescription>Consulta las reparaciones completadas o canceladas en el taller.</CardDescription>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar por cliente o motocicleta"
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
                      <TableHead>Motocicleta</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell>{pedido.id}</TableCell>
                        <TableCell>{pedido.cliente}</TableCell>
                        <TableCell>{pedido.moto}</TableCell>
                        <TableCell>{pedido.servicio}</TableCell>
                        <TableCell>{pedido.fecha}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                        </TableCell>
                      </TableRow>
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
                    <p className="text-sm text-gray-600"><strong>Motocicleta:</strong> {pedido.moto}</p>
                    <p className="text-sm text-gray-600"><strong>Servicio:</strong> {pedido.servicio}</p>
                    <p className="text-sm text-gray-600"><strong>Fecha:</strong> {pedido.fecha}</p>
                    <p className="text-sm">
                      <strong>Estado:</strong>{" "}
                      <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                    </p>
                    
                    {/* Detalles expandibles */}
                    {expandedRows.includes(pedido.id) && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm"><strong>Número de Orden:</strong> {pedido.numeroOrden}</p>
                        <p className="text-sm"><strong>Dirección:</strong> {pedido.direccion}</p>
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
