import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Clock } from "lucide-react";

interface Horario {
    dia: string;
    inicio: string;
    fin: string;
    disponible: boolean;
}

interface HorarioAtencionProps {
    horarios: Horario[];
}

const HorarioAtencion = ({ horarios }: HorarioAtencionProps) => {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Horarios de Atención</CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    Visualiza los horarios disponibles para reservas
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="px-4 py-3 text-gray-600">Día</TableHead>
                                    <TableHead className="px-4 py-3 text-gray-600">Horario</TableHead>
                                    <TableHead className="px-4 py-3 text-gray-600">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {horarios.map((horario, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-4 py-4 font-medium">{horario.dia}</TableCell>
                                        <TableCell className="px-4 py-4">
                                            {horario.disponible ? (
                                                <span>{horario.inicio} - {horario.fin}</span>
                                            ) : (
                                                <span className="text-gray-400">No disponible</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            {horario.disponible ? (
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    Disponible
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                                    Cerrado
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Notas:</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Los horarios disponibles pueden ser seleccionados por los clientes para agendar sus reservas.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Los días marcados como "Cerrado" no estarán disponibles para agendar reservas.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Para modificar estos horarios, contacte al administrador del sistema.
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HorarioAtencion;