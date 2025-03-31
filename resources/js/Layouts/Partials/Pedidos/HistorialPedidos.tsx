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

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: "Juan Pérez", moto: "Honda CBR 600", servicio: "Cambio de aceite", fecha: "2024-03-10", estado: "Finalizado" },
    { id: 2, cliente: "María Gómez", moto: "Yamaha R3", servicio: "Revisión general", fecha: "2024-03-12", estado: "Cancelado" },
    { id: 3, cliente: "Carlos Ruiz", moto: "Suzuki GSX-R750", servicio: "Cambio de frenos", fecha: "2024-03-14", estado: "Finalizado" },
    { id: 4, cliente: "Ana López", moto: "Kawasaki Ninja 400", servicio: "Reparación de motor", fecha: "2024-03-15", estado: "Finalizado" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>("Finalizado");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtrar pedidos por cliente y estado
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase());
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
          <CardTitle>Historial de Servicios</CardTitle>
          <CardDescription>Consulta los servicios completados o cancelados en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <Input
              placeholder="Buscar por cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Motocicleta</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPedidos.map((pedido) => (
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

          {/* Vista en tarjetas para móviles */}
          <div className="sm:hidden space-y-4">
            {sortedPedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{pedido.cliente}</p>
                  <Badge variant={getBadgeVariant(pedido.estado)}>{pedido.estado}</Badge>
                </div>
                <p className="text-sm text-gray-600"><strong>Motocicleta:</strong> {pedido.moto}</p>
                <p className="text-sm text-gray-600"><strong>Servicio:</strong> {pedido.servicio}</p>
                <p className="text-sm text-gray-600"><strong>Fecha:</strong> {pedido.fecha}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistorialPedidos;
