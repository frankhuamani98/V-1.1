import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
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

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="border-0 sm:border">
                <CardHeader className="px-2 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg sm:text-xl">Administradores</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                                Aquí puedes ver la lista de administradores.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    <div className="overflow-x-auto">
                        {admins.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No hay administradores registrados</p>
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader className="hidden sm:table-header-group">
                                    <TableRow>
                                        <TableHead className="px-2 py-3">Nombre</TableHead>
                                        <TableHead className="px-2 py-3">Apellido</TableHead>
                                        <TableHead className="px-2 py-3">Email</TableHead>
                                        <TableHead className="px-2 py-3">Teléfono</TableHead>
                                        <TableHead className="px-2 py-3">Estado</TableHead>
                                        <TableHead className="px-2 py-3">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <React.Fragment key={admin.id}>
                                            {/* Vista de escritorio */}
                                            <TableRow className="hidden sm:table-row">
                                                <TableCell className="px-2 py-3">{admin.first_name}</TableCell>
                                                <TableCell className="px-2 py-3">{admin.last_name}</TableCell>
                                                <TableCell className="px-2 py-3">{admin.email}</TableCell>
                                                <TableCell className="px-2 py-3">{admin.phone}</TableCell>
                                                <TableCell className="px-2 py-3">
                                                    <Badge
                                                        variant={
                                                            admin.status === "active"
                                                                ? "default"
                                                                : admin.status === "inactive"
                                                                ? "destructive"
                                                                : "secondary"
                                                        }
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        {admin.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-2 py-3">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemoveAdmin(admin.id)}
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        Quitar Admin
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                            {/* Vista móvil */}
                                            <div className="sm:hidden bg-white rounded-lg shadow-sm p-3 mb-2 border">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {admin.first_name} {admin.last_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {admin.email}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <Badge
                                                            variant={
                                                                admin.status === "active"
                                                                    ? "default"
                                                                    : admin.status === "inactive"
                                                                    ? "destructive"
                                                                    : "secondary"
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {admin.status}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => toggleRow(admin.id)}
                                                            aria-label="Ver detalles"
                                                        >
                                                            {expandedRows.includes(admin.id) ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                                {expandedRows.includes(admin.id) && (
                                                    <div className="mt-2 space-y-2 pt-2 border-t">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Teléfono:</span>
                                                            <span>{admin.phone}</span>
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full mt-2 text-xs"
                                                            onClick={() => handleRemoveAdmin(admin.id)}
                                                        >
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
            <Toaster />
        </div>
    );
};

export default Administradores;