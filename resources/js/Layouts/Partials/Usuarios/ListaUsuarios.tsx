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
  CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp, Edit, Eye, Search, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

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
  const [busqueda, setBusqueda] = useState("");
  const [tabActual, setTabActual] = useState("todos");

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

  const filtrarUsuarios = () => {
    let usuariosFiltrados = users.filter(usuario => 
      usuario.first_name.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.last_name.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.dni.includes(busqueda) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (tabActual === "activos") {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.status === "active");
    } else if (tabActual === "inactivos") {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.status === "inactive");
    } else if (tabActual === "pendientes") {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.status === "pending");
    }

    return usuariosFiltrados;
  };

  const usuariosFiltrados = filtrarUsuarios();

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "default" : "secondary";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-primary/5 pb-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-primary">Lista de Usuarios</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Gestiona todos los usuarios registrados en el sistema
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  className="pl-8 border-gray-200 focus:ring-primary/50"
                  placeholder="Buscar por nombre, apellido, DNI o email..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="todos" className="w-full" onValueChange={(value) => setTabActual(value)}>
              <TabsList className="bg-gray-100 mb-4">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="activos">Activos</TabsTrigger>
                <TabsTrigger value="inactivos">Inactivos</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos" className="m-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader className="hidden sm:table-header-group bg-gray-50">
                      <TableRow>
                        <TableHead className="font-medium text-gray-600">Nombre</TableHead>
                        <TableHead className="font-medium text-gray-600">Apellido</TableHead>
                        <TableHead className="font-medium text-gray-600">DNI</TableHead>
                        <TableHead className="font-medium text-gray-600">Teléfono</TableHead>
                        <TableHead className="font-medium text-gray-600">Rol</TableHead>
                        <TableHead className="font-medium text-gray-600">Estado</TableHead>
                        <TableHead className="font-medium text-gray-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((usuario) => (
                        <React.Fragment key={usuario.id}>
                          <TableRow className="sm:table-row hidden hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium">{usuario.first_name}</TableCell>
                            <TableCell>{usuario.last_name}</TableCell>
                            <TableCell className="text-gray-500">{usuario.dni}</TableCell>
                            <TableCell className="text-gray-500">{usuario.phone}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getRoleBadgeVariant(usuario.role)}
                                className={usuario.role === "admin" ? "bg-blue-500 hover:bg-blue-600" : ""}
                              >
                                {usuario.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(usuario.status)}
                                className={`${
                                  usuario.status === "active" 
                                    ? "bg-green-500 hover:bg-green-600" 
                                    : usuario.status === "inactive" 
                                    ? "bg-red-500 hover:bg-red-600" 
                                    : "bg-amber-500 hover:bg-amber-600"
                                }`}
                              >
                                {usuario.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "ver")}
                                  aria-label="Ver detalles"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "editar")}
                                  aria-label="Editar"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          <div className="sm:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800">{usuario.first_name} {usuario.last_name}</p>
                                <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getStatusBadgeVariant(usuario.status)}
                                  className={`${
                                    usuario.status === "active" 
                                      ? "bg-green-500" 
                                      : usuario.status === "inactive" 
                                      ? "bg-red-500" 
                                      : "bg-amber-500"
                                  }`}
                                >
                                  {usuario.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRow(usuario.id)}
                                  aria-label="Ver detalles"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  {expandedRows.includes(usuario.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {expandedRows.includes(usuario.id) && (
                              <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-gray-500 text-xs">DNI</p>
                                    <p className="font-medium">{usuario.dni}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Teléfono</p>
                                    <p className="font-medium">{usuario.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Rol</p>
                                    <Badge
                                      variant={getRoleBadgeVariant(usuario.role)}
                                      className={usuario.role === "admin" ? "bg-blue-500" : ""}
                                    >
                                      {usuario.role}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "ver")}
                                    className="h-9 flex-1 border-gray-200"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detalles
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "editar")}
                                    className="h-9 flex-1 border-gray-200 bg-primary/5 text-primary border-primary/20"
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
                
                {usuariosFiltrados.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No hay usuarios que coincidan con tu búsqueda "{busqueda}".
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activos" className="m-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader className="hidden sm:table-header-group bg-gray-50">
                      <TableRow>
                        <TableHead className="font-medium text-gray-600">Nombre</TableHead>
                        <TableHead className="font-medium text-gray-600">Apellido</TableHead>
                        <TableHead className="font-medium text-gray-600">DNI</TableHead>
                        <TableHead className="font-medium text-gray-600">Teléfono</TableHead>
                        <TableHead className="font-medium text-gray-600">Rol</TableHead>
                        <TableHead className="font-medium text-gray-600">Estado</TableHead>
                        <TableHead className="font-medium text-gray-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((usuario) => (
                        <React.Fragment key={usuario.id}>
                          <TableRow className="sm:table-row hidden hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium">{usuario.first_name}</TableCell>
                            <TableCell>{usuario.last_name}</TableCell>
                            <TableCell className="text-gray-500">{usuario.dni}</TableCell>
                            <TableCell className="text-gray-500">{usuario.phone}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getRoleBadgeVariant(usuario.role)}
                                className={usuario.role === "admin" ? "bg-blue-500 hover:bg-blue-600" : ""}
                              >
                                {usuario.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(usuario.status)}
                                className={`${
                                  usuario.status === "active" 
                                    ? "bg-green-500 hover:bg-green-600" 
                                    : usuario.status === "inactive" 
                                    ? "bg-red-500 hover:bg-red-600" 
                                    : "bg-amber-500 hover:bg-amber-600"
                                }`}
                              >
                                {usuario.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "ver")}
                                  aria-label="Ver detalles"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "editar")}
                                  aria-label="Editar"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          <div className="sm:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800">{usuario.first_name} {usuario.last_name}</p>
                                <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getStatusBadgeVariant(usuario.status)}
                                  className={`${
                                    usuario.status === "active" 
                                      ? "bg-green-500" 
                                      : usuario.status === "inactive" 
                                      ? "bg-red-500" 
                                      : "bg-amber-500"
                                  }`}
                                >
                                  {usuario.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRow(usuario.id)}
                                  aria-label="Ver detalles"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  {expandedRows.includes(usuario.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {expandedRows.includes(usuario.id) && (
                              <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-gray-500 text-xs">DNI</p>
                                    <p className="font-medium">{usuario.dni}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Teléfono</p>
                                    <p className="font-medium">{usuario.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Rol</p>
                                    <Badge
                                      variant={getRoleBadgeVariant(usuario.role)}
                                      className={usuario.role === "admin" ? "bg-blue-500" : ""}
                                    >
                                      {usuario.role}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "ver")}
                                    className="h-9 flex-1 border-gray-200"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detalles
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "editar")}
                                    className="h-9 flex-1 border-gray-200 bg-primary/5 text-primary border-primary/20"
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
                
                {usuariosFiltrados.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No se encontraron usuarios activos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No hay usuarios activos que coincidan con tu búsqueda "{busqueda}".
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="inactivos" className="m-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader className="hidden sm:table-header-group bg-gray-50">
                      <TableRow>
                        <TableHead className="font-medium text-gray-600">Nombre</TableHead>
                        <TableHead className="font-medium text-gray-600">Apellido</TableHead>
                        <TableHead className="font-medium text-gray-600">DNI</TableHead>
                        <TableHead className="font-medium text-gray-600">Teléfono</TableHead>
                        <TableHead className="font-medium text-gray-600">Rol</TableHead>
                        <TableHead className="font-medium text-gray-600">Estado</TableHead>
                        <TableHead className="font-medium text-gray-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((usuario) => (
                        <React.Fragment key={usuario.id}>
                          <TableRow className="sm:table-row hidden hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium">{usuario.first_name}</TableCell>
                            <TableCell>{usuario.last_name}</TableCell>
                            <TableCell className="text-gray-500">{usuario.dni}</TableCell>
                            <TableCell className="text-gray-500">{usuario.phone}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getRoleBadgeVariant(usuario.role)}
                                className={usuario.role === "admin" ? "bg-blue-500 hover:bg-blue-600" : ""}
                              >
                                {usuario.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(usuario.status)}
                                className={`${
                                  usuario.status === "active" 
                                    ? "bg-green-500 hover:bg-green-600" 
                                    : usuario.status === "inactive" 
                                    ? "bg-red-500 hover:bg-red-600" 
                                    : "bg-amber-500 hover:bg-amber-600"
                                }`}
                              >
                                {usuario.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "ver")}
                                  aria-label="Ver detalles"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "editar")}
                                  aria-label="Editar"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          <div className="sm:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800">{usuario.first_name} {usuario.last_name}</p>
                                <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getStatusBadgeVariant(usuario.status)}
                                  className={`${
                                    usuario.status === "active" 
                                      ? "bg-green-500" 
                                      : usuario.status === "inactive" 
                                      ? "bg-red-500" 
                                      : "bg-amber-500"
                                  }`}
                                >
                                  {usuario.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRow(usuario.id)}
                                  aria-label="Ver detalles"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  {expandedRows.includes(usuario.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {expandedRows.includes(usuario.id) && (
                              <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-gray-500 text-xs">DNI</p>
                                    <p className="font-medium">{usuario.dni}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Teléfono</p>
                                    <p className="font-medium">{usuario.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Rol</p>
                                    <Badge
                                      variant={getRoleBadgeVariant(usuario.role)}
                                      className={usuario.role === "admin" ? "bg-blue-500" : ""}
                                    >
                                      {usuario.role}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "ver")}
                                    className="h-9 flex-1 border-gray-200"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detalles
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "editar")}
                                    className="h-9 flex-1 border-gray-200 bg-primary/5 text-primary border-primary/20"
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
                
                {usuariosFiltrados.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No se encontraron usuarios inactivos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No hay usuarios inactivos que coincidan con tu búsqueda "{busqueda}".
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pendientes" className="m-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader className="hidden sm:table-header-group bg-gray-50">
                      <TableRow>
                        <TableHead className="font-medium text-gray-600">Nombre</TableHead>
                        <TableHead className="font-medium text-gray-600">Apellido</TableHead>
                        <TableHead className="font-medium text-gray-600">DNI</TableHead>
                        <TableHead className="font-medium text-gray-600">Teléfono</TableHead>
                        <TableHead className="font-medium text-gray-600">Rol</TableHead>
                        <TableHead className="font-medium text-gray-600">Estado</TableHead>
                        <TableHead className="font-medium text-gray-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuariosFiltrados.map((usuario) => (
                        <React.Fragment key={usuario.id}>
                          <TableRow className="sm:table-row hidden hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium">{usuario.first_name}</TableCell>
                            <TableCell>{usuario.last_name}</TableCell>
                            <TableCell className="text-gray-500">{usuario.dni}</TableCell>
                            <TableCell className="text-gray-500">{usuario.phone}</TableCell>
                            <TableCell>
                              <Badge
                                variant={getRoleBadgeVariant(usuario.role)}
                                className={usuario.role === "admin" ? "bg-blue-500 hover:bg-blue-600" : ""}
                              >
                                {usuario.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(usuario.status)}
                                className={`${
                                  usuario.status === "active" 
                                    ? "bg-green-500 hover:bg-green-600" 
                                    : usuario.status === "inactive" 
                                    ? "bg-red-500 hover:bg-red-600" 
                                    : "bg-amber-500 hover:bg-amber-600"
                                }`}
                              >
                                {usuario.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "ver")}
                                  aria-label="Ver detalles"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirModal(usuario, "editar")}
                                  aria-label="Editar"
                                  className="h-8 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          <div className="sm:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800">{usuario.first_name} {usuario.last_name}</p>
                                <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={getStatusBadgeVariant(usuario.status)}
                                  className={`${
                                    usuario.status === "active" 
                                      ? "bg-green-500" 
                                      : usuario.status === "inactive" 
                                      ? "bg-red-500" 
                                      : "bg-amber-500"
                                  }`}
                                >
                                  {usuario.status}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRow(usuario.id)}
                                  aria-label="Ver detalles"
                                  className="h-8 w-8 p-0 rounded-full"
                                >
                                  {expandedRows.includes(usuario.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {expandedRows.includes(usuario.id) && (
                              <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="text-gray-500 text-xs">DNI</p>
                                    <p className="font-medium">{usuario.dni}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Teléfono</p>
                                    <p className="font-medium">{usuario.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-xs">Rol</p>
                                    <Badge
                                      variant={getRoleBadgeVariant(usuario.role)}
                                      className={usuario.role === "admin" ? "bg-blue-500" : ""}
                                    >
                                      {usuario.role}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "ver")}
                                    className="h-9 flex-1 border-gray-200"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Detalles
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => abrirModal(usuario, "editar")}
                                    className="h-9 flex-1 border-gray-200 bg-primary/5 text-primary border-primary/20"
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
                
                {usuariosFiltrados.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No se encontraron usuarios pendientes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No hay usuarios pendientes que coincidan con tu búsqueda "{busqueda}".
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t border-gray-100 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {usuariosFiltrados.length} de {users.length} usuarios
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled className="border-gray-200">
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200">
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={modalAbierto} onOpenChange={cerrarModal}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {modalTipo === "editar" ? "Editar Usuario" : "Detalles del Usuario"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {modalTipo === "editar"
                ? "Modifica la información del usuario según sea necesario."
                : "Información completa del perfil de usuario."}
            </DialogDescription>
          </DialogHeader>
          
          {usuarioSeleccionado && (
            <form
              id="usuario-form"
              onSubmit={modalTipo === "editar" ? guardarCambios : undefined}
              className="px-6 py-4 space-y-6"
            >
              {modalTipo === "ver" && (
                <div className="flex items-center space-x-4 pb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {usuarioSeleccionado.first_name.charAt(0)}
                    {usuarioSeleccionado.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {usuarioSeleccionado.first_name} {usuarioSeleccionado.last_name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Badge
                        variant={getRoleBadgeVariant(usuarioSeleccionado.role)}
                        className={usuarioSeleccionado.role === "admin" ? "bg-blue-500" : ""}
                      >
                        {usuarioSeleccionado.role}
                      </Badge>
                      <span>•</span>
                      <Badge
                        variant={getStatusBadgeVariant(usuarioSeleccionado.status)}
                        className={`${
                          usuarioSeleccionado.status === "active" 
                            ? "bg-green-500" 
                            : usuarioSeleccionado.status === "inactive" 
                            ? "bg-red-500" 
                            : "bg-amber-500"
                        }`}
                      >
                        {usuarioSeleccionado.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Username</Label>
                  <Input
                    name="username"
                    defaultValue={usuarioSeleccionado.username}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    name="email"
                    defaultValue={usuarioSeleccionado.email}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                  <Input
                    name="first_name"
                    defaultValue={usuarioSeleccionado.first_name}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Apellido</Label>
                  <Input
                    name="last_name"
                    defaultValue={usuarioSeleccionado.last_name}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">DNI</Label>
                  <Input
                    name="dni"
                    defaultValue={usuarioSeleccionado.dni}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                  <Input
                    name="phone"
                    defaultValue={usuarioSeleccionado.phone}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Sexo</Label>
                  {modalTipo === "editar" ? (
                    <Select name="sexo" defaultValue={usuarioSeleccionado.sexo}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                        <SelectItem value="Prefiero no decirlo">Prefiero no decirlo</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={usuarioSeleccionado.sexo}
                      readOnly
                      className="bg-gray-50 text-gray-800"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Dirección</Label>
                  <Input
                    name="address"
                    defaultValue={usuarioSeleccionado.address}
                    readOnly={modalTipo !== "editar"}
                    className={modalTipo !== "editar" ? "bg-gray-50 text-gray-800" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Rol</Label>
                  {modalTipo === "editar" ? (
                    <Select name="role" defaultValue={usuarioSeleccionado.role}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="py-2">
                      <Badge
                        variant={getRoleBadgeVariant(usuarioSeleccionado.role)}
                        className={usuarioSeleccionado.role === "admin" ? "bg-blue-500" : ""}
                      >
                        {usuarioSeleccionado.role}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Estado</Label>
                  {modalTipo === "editar" ? (
                    <Select name="status" defaultValue={usuarioSeleccionado.status}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="py-2">
                      <Badge
                        variant={getStatusBadgeVariant(usuarioSeleccionado.status)}
                        className={`${
                          usuarioSeleccionado.status === "active" 
                            ? "bg-green-500" 
                            : usuarioSeleccionado.status === "inactive" 
                            ? "bg-red-500" 
                            : "bg-amber-500"
                        }`}
                      >
                        {usuarioSeleccionado.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {modalTipo === "ver" && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-2">Información adicional</h4>
                  <p className="text-sm text-gray-500">
                    Fecha de registro: {new Date(usuarioSeleccionado.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </form>
          )}
          
          <DialogFooter className="px-6 py-4 bg-gray-50 border-t flex-row justify-end space-x-2">
            <Button variant="outline" onClick={cerrarModal} className="border-gray-200">
              {modalTipo === "editar" ? "Cancelar" : "Cerrar"}
            </Button>
            {modalTipo === "editar" && (
              <Button type="submit" form="usuario-form" className="bg-primary hover:bg-primary/90">
                Guardar Cambios
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default ListaUsuarios;































































































































































































