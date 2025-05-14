import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp, UserX, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";

interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
}

interface AdministradoresProps {
    admins: Admin[];
}

const Administradores = ({ admins: initialAdmins }: AdministradoresProps) => {
    const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRow = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleRemoveAdmin = (id: number) => {
        router.delete(`/usuarios/administradores/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setAdmins(admins.filter(admin => admin.id !== id));
                toast.success("Administrador eliminado correctamente");
            },
            onError: () => {
                toast.error("Error al eliminar administrador");
            }
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100";
            case "inactive":
                return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
            default:
                return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        }
    };

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Administradores</CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    Aquí puedes ver la lista de administradores.
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0 pb-2">
                    <div className="overflow-x-auto">
                        {admins.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">No hay administradores registrados</p>
                                <p className="text-gray-500 text-sm mt-1">Los usuarios con rol de administrador aparecerán aquí</p>
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader className="hidden sm:table-header-group bg-gray-50">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-gray-600">Nombre</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Apellido</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Email</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Teléfono</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Estado</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <React.Fragment key={admin.id}>
                                            <TableRow className="hidden sm:table-row hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-4 py-4 font-medium">{admin.first_name}</TableCell>
                                                <TableCell className="px-4 py-4">{admin.last_name}</TableCell>
                                                <TableCell className="px-4 py-4 text-blue-600">{admin.email}</TableCell>
                                                <TableCell className="px-4 py-4">{admin.phone}</TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <Badge
                                                        className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(admin.status)}`}
                                                    >
                                                        {admin.status === "active" ? "Activo" : admin.status === "inactive" ? "Inactivo" : admin.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemoveAdmin(admin.id)}
                                                        className="text-xs font-medium flex items-center gap-1.5 rounded-lg"
                                                    >
                                                        <UserX className="h-3.5 w-3.5" />
                                                        Quitar Admin
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                            <div className="sm:hidden bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-800 truncate">
                                                            {admin.first_name} {admin.last_name}
                                                        </p>
                                                        <p className="text-sm text-blue-600 truncate mt-0.5">
                                                            {admin.email}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <Badge
                                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusClass(admin.status)}`}
                                                        >
                                                            {admin.status === "active" ? "Activo" : admin.status === "inactive" ? "Inactivo" : admin.status}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full hover:bg-gray-100"
                                                            onClick={() => toggleRow(admin.id)}
                                                            aria-label="Ver detalles"
                                                        >
                                                            {expandedRows.includes(admin.id) ? (
                                                                <ChevronUp className="h-4 w-4 text-gray-500" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                                {expandedRows.includes(admin.id) && (
                                                    <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Teléfono:</span>
                                                            <span className="font-medium text-gray-800">{admin.phone}</span>
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full mt-2 text-xs font-medium flex items-center justify-center gap-1.5 rounded-lg"
                                                            onClick={() => handleRemoveAdmin(admin.id)}
                                                        >
                                                            <UserX className="h-3.5 w-3.5" />
                                                            Quitar Rol de Administrador
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Toaster position="top-right" closeButton />
        </div>
    );
};

export default Administradores;