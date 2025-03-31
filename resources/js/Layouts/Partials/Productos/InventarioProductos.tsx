import React, { useState } from "react";
import { Eye, Edit, Trash2, Plus, Download, Upload, ChevronDown, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import * as XLSX from "xlsx";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";

interface Producto {
  codigo: string;
  nombre: string;
  urlFoto: string;
  categoria: string;
  subcategoria: string;
  detalles: string;
  descripcionCorta: string;
  precio: string;
  descuento: string;
  precioTotal: string;
  motosRelacionadas: string;
  stock: number;
}

const InventarioProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([
    {
      codigo: "P001",
      nombre: "Producto 1",
      urlFoto: "#",
      categoria: "Repuestos",
      subcategoria: "Subcategoría 1",
      detalles: "Detalles del producto 1",
      descripcionCorta: "Descripción corta 1",
      precio: "$10.00",
      descuento: "10%",
      precioTotal: "$9.00",
      motosRelacionadas: "Moto 1",
      stock: 50,
    },
    {
      codigo: "P002",
      nombre: "Producto 2",
      urlFoto: "#",
      categoria: "Repuestos",
      subcategoria: "Subcategoría 1",
      detalles: "Detalles del producto 2",
      descripcionCorta: "Descripción corta 2",
      precio: "$15.00",
      descuento: "5%",
      precioTotal: "$14.25",
      motosRelacionadas: "Moto 2",
      stock: 30,
    },
  ]);

  // Estados para los modales
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all">("all");

  // Filtrado y búsqueda
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Handlers para los modales
  const handleViewDetails = (producto: Producto) => {
    setCurrentProduct(producto);
    setIsDetailOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setCurrentProduct(producto);
    setIsEditOpen(true);
  };

  const handleDelete = (producto: Producto) => {
    setCurrentProduct(producto);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (currentProduct) {
      setProductos(productos.filter(p => p.codigo !== currentProduct.codigo));
      setIsDeleteOpen(false);
    }
  };

  const handleSaveChanges = () => {
    if (currentProduct) {
      setProductos(
        productos.map((p) => (p.codigo === currentProduct.codigo ? currentProduct : p))
      );
      setIsEditOpen(false);
    }
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, `inventario_productos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Importar desde Excel
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setImportProgress(0);
    }
  };

  const importFromExcel = () => {
    if (!file) return;

    setImportProgress(30);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        setImportProgress(60);
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Producto>(firstSheet);
        
        if (jsonData.length > 0 && jsonData[0].codigo && jsonData[0].nombre) {
          setProductos(jsonData);
          setImportProgress(100);
          setTimeout(() => {
            setIsImportOpen(false);
            setFile(null);
            setImportProgress(0);
          }, 1000);
        } else {
          throw new Error("Formato incorrecto");
        }
      } catch (error: any) {
        console.error("Error al importar:", error);
        const errorMessage = error?.message || "Ocurrió un error desconocido";
        alert(`Error al importar: ${errorMessage}`);
        setImportProgress(0);
      }
    };
    
    reader.onerror = () => {
      alert("Error al leer el archivo");
      setImportProgress(0);
    };
    
    reader.readAsArrayBuffer(file);
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventario de Productos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona todos los productos de tu inventario
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Input
                placeholder="Buscar productos..."
                className="pl-8 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <span className="hidden sm:inline">Acciones</span>
                  <Download className="h-4 w-4 sm:hidden" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToExcel}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsImportOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
        </div>

        {/* Vista para móviles */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            filteredProducts.map((producto, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {producto.nombre}
                      </CardTitle>
                      <CardDescription className="mt-1">Código: {producto.codigo}</CardDescription>
                    </div>
                    <span className="font-medium">{producto.precio}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Categoría</Label>
                      <p className="text-sm">{producto.categoria}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Stock</Label>
                      <p className="text-sm">{producto.stock} unidades</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Acciones <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => handleViewDetails(producto)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(producto)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(producto)}
                        className="text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Vista para desktop */}
        <div className="hidden md:block border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((producto, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {producto.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.precio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {producto.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(producto)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalles</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(producto)}
                                className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(producto)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Eliminar producto
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalles */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalles del Producto</DialogTitle>
              {currentProduct && (
                <DialogDescription>
                  Código: {currentProduct.codigo}
                </DialogDescription>
              )}
            </DialogHeader>
            {currentProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input value={currentProduct.nombre} readOnly />
                  </div>
                  <div>
                    <Label>Precio</Label>
                    <Input value={currentProduct.precio} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoría</Label>
                    <Input value={currentProduct.categoria} readOnly />
                  </div>
                  <div>
                    <Label>Subcategoría</Label>
                    <Input value={currentProduct.subcategoria} readOnly />
                  </div>
                </div>
                <div>
                  <Label>Descripción Corta</Label>
                  <Textarea value={currentProduct.descripcionCorta} readOnly />
                </div>
                <div>
                  <Label>Detalles</Label>
                  <Textarea value={currentProduct.detalles} readOnly rows={5} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stock disponible</Label>
                    <Input value={currentProduct.stock} readOnly />
                  </div>
                  <div>
                    <Label>Motos relacionadas</Label>
                    <Input value={currentProduct.motosRelacionadas} readOnly />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Edición */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              {currentProduct && (
                <DialogDescription>
                  Editando: {currentProduct.nombre} ({currentProduct.codigo})
                </DialogDescription>
              )}
            </DialogHeader>
            {currentProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código</Label>
                    <Input
                      value={currentProduct.codigo}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, codigo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={currentProduct.nombre}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, nombre: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoría</Label>
                    <Input
                      value={currentProduct.categoria}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, categoria: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Subcategoría</Label>
                    <Input
                      value={currentProduct.subcategoria}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, subcategoria: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Descripción Corta</Label>
                  <Textarea
                    value={currentProduct.descripcionCorta}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        descripcionCorta: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Detalles</Label>
                  <Textarea
                    value={currentProduct.detalles}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, detalles: e.target.value })
                    }
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Precio</Label>
                    <Input
                      value={currentProduct.precio}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, precio: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Descuento</Label>
                    <Input
                      value={currentProduct.descuento}
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, descuento: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      value={currentProduct.stock}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Motos relacionadas</Label>
                  <Input
                    value={currentProduct.motosRelacionadas}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        motosRelacionadas: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveChanges}>Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Eliminación */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Eliminar producto</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Importación */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Importar Productos desde Excel</DialogTitle>
              <DialogDescription>
                Sube un archivo Excel (.xlsx) para actualizar el inventario. Se reemplazarán los productos existentes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="file">Archivo Excel</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
              </div>
              
              {importProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Progreso de importación</Label>
                    {importProgress === 100 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-gray-500">{importProgress}%</span>
                    )}
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              )}
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Formato requerido:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">Columna</th>
                        <th className="text-left pb-2">Tipo</th>
                        <th className="text-left pb-2">Requerido</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">codigo</td>
                        <td className="py-2">Texto</td>
                        <td className="py-2">Sí</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">nombre</td>
                        <td className="py-2">Texto</td>
                        <td className="py-2">Sí</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">categoria</td>
                        <td className="py-2">Texto</td>
                        <td className="py-2">Sí</td>
                      </tr>
                      <tr>
                        <td className="py-2">stock</td>
                        <td className="py-2">Número</td>
                        <td className="py-2">Sí</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Descarga el <button className="text-blue-500 underline" onClick={exportToExcel}>archivo de ejemplo</button> como referencia.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsImportOpen(false);
                setImportProgress(0);
              }}>
                Cancelar
              </Button>
              <Button 
                onClick={importFromExcel} 
                disabled={!file || importProgress > 0}
              >
                {importProgress > 0 ? "Importando..." : "Importar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default InventarioProductos;