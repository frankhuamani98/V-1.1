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

interface Pedido {
  id: number;
  cliente: string;
  fecha: string;
  estado: string;
}

interface Props {
  pedidos: Pedido[];
}

const EstadoPedidos = ({ pedidos: pedidosProp = [] }: Props) => {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosProp);

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    const estadoApi = nuevoEstado.toLowerCase();
    // Optimista: actualiza UI primero
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
    try {
      await fetch(`/pedidos/estado/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({ estado: estadoApi }),
      });
      // Opcional: mostrar notificación de éxito
    } catch (error) {
      // Opcional: revertir el cambio en caso de error
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === id ? { ...pedido, estado: pedidosProp.find(p => p.id === id)?.estado || pedido.estado } : pedido
        )
      );
      alert("Error al actualizar el estado del pedido.");
    }
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "secondary";
      case "Procesando":
        return "outline";
      case "Completado":
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
                          <SelectItem value="Procesando">Procesando</SelectItem>
                          <SelectItem value="Completado">Completado</SelectItem>
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
                      <SelectItem value="Procesando">Procesando</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
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
