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
import { ChevronUp, ChevronDown, ClipboardList, Search } from "lucide-react";

const EstadoReservas = () => {
  const [reservas, setReservas] = useState([
    { id: 1, cliente: "Juan Pérez", moto: "Honda CBR 600", servicio: "Cambio de aceite", fecha: "2024-03-20", estado: "Pendiente" },
    { id: 2, cliente: "María Gómez", moto: "Yamaha R3", servicio: "Revisión general", fecha: "2024-03-22", estado: "Confirmada" },
    { id: 3, cliente: "Carlos Ruiz", moto: "Suzuki GSX-R750", servicio: "Cambio de frenos", fecha: "2024-03-25", estado: "En Proceso" },
    { id: 4, cliente: "Ana López", moto: "Kawasaki Ninja 400", servicio: "Diagnóstico", fecha: "2024-03-27", estado: "Completada" },
    { id: 5, cliente: "Luis Ramírez", moto: "BMW S1000RR", servicio: "Pintura y estética", fecha: "2024-03-30", estado: "Cancelada" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredReservas = reservas.filter((reserva) => {
    const matchesSearch =
      reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.moto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? reserva.estado === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const sortedReservas = [...filteredReservas].sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const actualizarEstado = (id: number, nuevoEstado: string) => {
    setReservas((prevReservas) =>
      prevReservas.map((reserva) =>
        reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
      )
    );
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "secondary";
      case "Confirmada":
        return "default";
      case "En Proceso":
        return "outline";
      case "Completada":
        return "default";
      case "Cancelada":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle><ClipboardList className="inline-block mr-2 h-6 w-6" /> Estado de Reservas</CardTitle>
          <CardDescription>Administra el estado de las reservas en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por cliente o motocicleta"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmada">Confirmada</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              Ordenar {sortOrder === "asc" ? <ChevronUp className="h-4 w-4 inline-block" /> : <ChevronDown className="h-4 w-4 inline-block" />}
            </Button>
          </div>

          {/* Tabla para pantallas grandes */}
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
                {sortedReservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.id}</TableCell>
                    <TableCell>{reserva.cliente}</TableCell>
                    <TableCell>{reserva.moto}</TableCell>
                    <TableCell>{reserva.servicio}</TableCell>
                    <TableCell>{reserva.fecha}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(reserva.estado)}>{reserva.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={reserva.estado} onValueChange={(nuevoEstado) => actualizarEstado(reserva.id, nuevoEstado)}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="Confirmada">Confirmada</SelectItem>
                          <SelectItem value="En Proceso">En Proceso</SelectItem>
                          <SelectItem value="Completada">Completada</SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tarjetas para móviles */}
          <div className="sm:hidden space-y-4">
            {sortedReservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-lg shadow-md p-4">
                <p className="font-medium">{reserva.cliente}</p>
                <p className="text-sm"><strong>Motocicleta:</strong> {reserva.moto}</p>
                <p className="text-sm"><strong>Servicio:</strong> {reserva.servicio}</p>
                <p className="text-sm"><strong>Fecha:</strong> {reserva.fecha}</p>
                <Badge variant={getBadgeVariant(reserva.estado)}>{reserva.estado}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadoReservas;
