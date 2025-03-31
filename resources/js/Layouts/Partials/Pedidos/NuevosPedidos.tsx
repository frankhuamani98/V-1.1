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

const NuevosPedidos = () => {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: "Juan Pérez", moto: "Honda CBR 600", servicio: "Cambio de aceite", fecha: "2024-03-10", estado: "Pendiente" },
    { id: 2, cliente: "María Gómez", moto: "Yamaha R3", servicio: "Revisión general", fecha: "2024-03-12", estado: "En reparación" },
    { id: 3, cliente: "Carlos Ruiz", moto: "Suzuki GSX-R750", servicio: "Cambio de frenos", fecha: "2024-03-14", estado: "Listo para entrega" },
    { id: 4, cliente: "Ana López", moto: "Kawasaki Ninja 400", servicio: "Reparación de motor", fecha: "2024-03-15", estado: "Cancelado" },
  ]);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevos Pedidos</CardTitle>
          <CardDescription>Gestión de reparaciones y mantenimientos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="hidden sm:table-header-group">
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
                {pedidos.map((pedido) => (
                  <React.Fragment key={pedido.id}>
                    <TableRow className="sm:table-row hidden">
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell>{pedido.moto}</TableCell>
                      <TableCell>{pedido.servicio}</TableCell>
                      <TableCell>{pedido.fecha}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pedido.estado === "Pendiente"
                              ? "secondary"
                              : pedido.estado === "En reparación"
                              ? "outline"
                              : pedido.estado === "Listo para entrega"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {pedido.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    {/* Diseño de tarjeta en móvil */}
                    <div className="sm:hidden bg-white rounded-lg shadow-md p-4 mb-2">
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
                      {expandedRows.includes(pedido.id) && (
                        <div className="mt-2 space-y-2">
                          <p className="text-sm"><strong>Motocicleta:</strong> {pedido.moto}</p>
                          <p className="text-sm"><strong>Servicio:</strong> {pedido.servicio}</p>
                          <p className="text-sm"><strong>Fecha:</strong> {pedido.fecha}</p>
                          <p className="text-sm">
                            <strong>Estado:</strong>{" "}
                            <Badge
                              variant={
                                pedido.estado === "Pendiente"
                                  ? "secondary"
                                  : pedido.estado === "En reparación"
                                  ? "outline"
                                  : pedido.estado === "Listo para entrega"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {pedido.estado}
                            </Badge>
                          </p>
                        </div>
                      )}
                    </div>
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
