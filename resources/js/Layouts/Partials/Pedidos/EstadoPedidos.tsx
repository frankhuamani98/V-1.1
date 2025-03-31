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

const EstadoPedidos = () => {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: "Juan Pérez", moto: "Honda CBR 600", servicio: "Cambio de aceite", fecha: "2024-03-10", estado: "Pendiente" },
    { id: 2, cliente: "María Gómez", moto: "Yamaha R3", servicio: "Revisión general", fecha: "2024-03-12", estado: "En reparación" },
    { id: 3, cliente: "Carlos Ruiz", moto: "Suzuki GSX-R750", servicio: "Cambio de frenos", fecha: "2024-03-14", estado: "Listo para entrega" },
    { id: 4, cliente: "Ana López", moto: "Kawasaki Ninja 400", servicio: "Reparación de motor", fecha: "2024-03-15", estado: "Cancelado" },
  ]);

  const actualizarEstado = (id: number, nuevoEstado: string) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "secondary";
      case "En reparación":
        return "outline";
      case "Listo para entrega":
        return "default";
      case "Cancelado":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado de Pedidos</CardTitle>
          <CardDescription>Gestiona y actualiza el estado de los servicios en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Actualizar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>{pedido.cliente}</TableCell>
                    <TableCell>{pedido.moto}</TableCell>
                    <TableCell>{pedido.servicio}</TableCell>
                    <TableCell>{pedido.fecha}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={pedido.estado}
                        onValueChange={(nuevoEstado) => actualizarEstado(pedido.id, nuevoEstado)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En reparación">En reparación</SelectItem>
                          <SelectItem value="Listo para entrega">Listo para entrega</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Vista en tarjetas para móviles */}
          <div className="sm:hidden space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{pedido.cliente}</p>
                  <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                </div>
                <p className="text-sm text-gray-600"><strong>Motocicleta:</strong> {pedido.moto}</p>
                <p className="text-sm text-gray-600"><strong>Servicio:</strong> {pedido.servicio}</p>
                <p className="text-sm text-gray-600"><strong>Fecha:</strong> {pedido.fecha}</p>
                <div className="mt-2">
                  <Select
                    value={pedido.estado}
                    onValueChange={(nuevoEstado) => actualizarEstado(pedido.id, nuevoEstado)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En reparación">En reparación</SelectItem>
                      <SelectItem value="Listo para entrega">Listo para entrega</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadoPedidos;
