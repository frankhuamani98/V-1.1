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
import { ChevronUp, ChevronDown, CheckCircle, Search } from "lucide-react";

const ReservasFinalizadas = () => {
  const [reservas, setReservas] = useState([
    { id: 1, cliente: "Juan Pérez", moto: "Honda CBR 600", servicio: "Cambio de aceite", fecha: "2024-03-20", estado: "Completada" },
    { id: 2, cliente: "María Gómez", moto: "Yamaha R3", servicio: "Revisión general", fecha: "2024-03-22", estado: "Completada" },
    { id: 3, cliente: "Carlos Ruiz", moto: "Suzuki GSX-R750", servicio: "Cambio de frenos", fecha: "2024-03-25", estado: "Completada" },
    { id: 4, cliente: "Ana López", moto: "Kawasaki Ninja 400", servicio: "Diagnóstico", fecha: "2024-03-27", estado: "Completada" },
    { id: 5, cliente: "Luis Ramírez", moto: "BMW S1000RR", servicio: "Pintura y estética", fecha: "2024-03-30", estado: "Completada" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtrar reservas finalizadas
  const filteredReservas = reservas.filter((reserva) =>
    reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reserva.moto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar reservas por fecha
  const sortedReservas = [...filteredReservas].sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle><CheckCircle className="inline-block mr-2 h-6 w-6" /> Reservas Finalizadas</CardTitle>
          <CardDescription>Consulta las reservas completadas en el taller.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por cliente o motocicleta"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="w-full sm:w-auto"
            >
              Ordenar {sortOrder === "asc" ? <ChevronUp className="h-4 w-4 inline-block" /> : <ChevronDown className="h-4 w-4 inline-block" />}
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
                {sortedReservas.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.id}</TableCell>
                    <TableCell>{reserva.cliente}</TableCell>
                    <TableCell>{reserva.moto}</TableCell>
                    <TableCell>{reserva.servicio}</TableCell>
                    <TableCell>{reserva.fecha}</TableCell>
                    <TableCell>
                      <Badge variant="default">{reserva.estado}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tarjetas en móviles */}
          <div className="sm:hidden space-y-4">
            {sortedReservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-lg shadow-md p-4">
                <p className="font-medium">{reserva.cliente}</p>
                <p className="text-sm text-gray-600"><strong>Motocicleta:</strong> {reserva.moto}</p>
                <p className="text-sm text-gray-600"><strong>Servicio:</strong> {reserva.servicio}</p>
                <p className="text-sm text-gray-600"><strong>Fecha:</strong> {reserva.fecha}</p>
                <p className="text-sm">
                  <strong>Estado:</strong> <Badge variant="default">{reserva.estado}</Badge>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservasFinalizadas;
