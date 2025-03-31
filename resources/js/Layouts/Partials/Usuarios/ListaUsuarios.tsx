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
import { ChevronDown, ChevronUp, Edit, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

interface Usuario {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    dni: string;
    sexo: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    status: string;
    created_at: string;
}

interface ListaUsuariosProps {
    users: Usuario[];
}

const ListaUsuarios = ({ users: initialUsers }: ListaUsuariosProps) => {
  const [users, setUsers] = useState<Usuario[]>(initialUsers);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"editar" | "ver">("ver");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const abrirModal = (usuario: Usuario, tipo: "editar" | "ver") => {
    setUsuarioSeleccionado(usuario);
    setModalTipo(tipo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioSeleccionado(null);
  };

  const guardarCambios = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioSeleccionado) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const datosActualizados = {
      username: formData.get("username") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      dni: formData.get("dni") as string,
      sexo: formData.get("sexo") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      role: formData.get("role") as string,
      status: formData.get("status") as string,
    };

    router.put(`/usuarios/${usuarioSeleccionado.id}`, datosActualizados, {
      preserveScroll: true,
      onSuccess: () => {
        setUsers(users.map(user => 
          user.id === usuarioSeleccionado.id ? { ...user, ...datosActualizados } : user
        ));
        toast.success("Usuario actualizado correctamente");
        cerrarModal();
      },
      onError: () => {
        toast.error("Error al actualizar el usuario");
      }
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Aquí puedes ver la lista de todos los usuarios registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="hidden sm:table-header-group">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((usuario) => (
                  <React.Fragment key={usuario.id}>
                    <TableRow className="sm:table-row hidden">
                      <TableCell>{usuario.first_name}</TableCell>
                      <TableCell>{usuario.last_name}</TableCell>
                      <TableCell>{usuario.dni}</TableCell>
                      <TableCell>{usuario.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            usuario.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {usuario.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            usuario.status === "active"
                              ? "default"
                              : usuario.status === "inactive"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {usuario.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => abrirModal(usuario, "ver")}
                            aria-label="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => abrirModal(usuario, "editar")}
                            aria-label="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    <div className="sm:hidden bg-white rounded-lg shadow-md p-4 mb-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{usuario.first_name} {usuario.last_name}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleRow(usuario.id)}
                          aria-label="Ver detalles"
                        >
                          {expandedRows.includes(usuario.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {expandedRows.includes(usuario.id) && (
                        <div className="mt-2 space-y-2">
                          <p className="text-sm">
                            <strong>DNI:</strong> {usuario.dni}
                          </p>
                          <p className="text-sm">
                            <strong>Teléfono:</strong> {usuario.phone}
                          </p>
                          <p className="text-sm">
                            <strong>Rol:</strong>{" "}
                            <Badge
                              variant={
                                usuario.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {usuario.role}
                            </Badge>
                          </p>
                          <p className="text-sm">
                            <strong>Estado:</strong>{" "}
                            <Badge
                              variant={
                                usuario.status === "active"
                                  ? "default"
                                  : usuario.status === "inactive"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {usuario.status}
                            </Badge>
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirModal(usuario, "ver")}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirModal(usuario, "editar")}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </div>
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

      <Dialog open={modalAbierto} onOpenChange={cerrarModal}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {modalTipo === "editar" ? "Editar Usuario" : "Detalles del Usuario"}
            </DialogTitle>
            <DialogDescription>
              {modalTipo === "editar"
                ? "Modifica la información del usuario."
                : "Aquí puedes ver toda la información del usuario."}
            </DialogDescription>
          </DialogHeader>
          {usuarioSeleccionado && (
            <form
              onSubmit={modalTipo === "editar" ? guardarCambios : undefined}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    name="username"
                    defaultValue={usuarioSeleccionado.username}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>Nombre</Label>
                  <Input
                    name="first_name"
                    defaultValue={usuarioSeleccionado.first_name}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input
                    name="last_name"
                    defaultValue={usuarioSeleccionado.last_name}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>DNI</Label>
                  <Input
                    name="dni"
                    defaultValue={usuarioSeleccionado.dni}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select
                    name="sexo"
                    defaultValue={usuarioSeleccionado.sexo}
                    disabled={modalTipo !== "editar"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Prefiero no decirlo">Prefiero no decirlo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    defaultValue={usuarioSeleccionado.email}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    name="phone"
                    defaultValue={usuarioSeleccionado.phone}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input
                    name="address"
                    defaultValue={usuarioSeleccionado.address}
                    readOnly={modalTipo !== "editar"}
                  />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select
                    name="role"
                    defaultValue={usuarioSeleccionado.role}
                    disabled={modalTipo !== "editar"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    name="status"
                    defaultValue={usuarioSeleccionado.status}
                    disabled={modalTipo !== "editar"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {modalTipo === "editar" && (
                <Button type="submit" className="w-full">
                  Guardar Cambios
                </Button>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default ListaUsuarios;