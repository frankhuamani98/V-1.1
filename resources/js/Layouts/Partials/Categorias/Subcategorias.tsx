import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import {
  PlusCircle,
  Edit,
  Trash,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Filter,
  MoreVertical,
  Calendar,
  Tag,
  X,
  Eye,
  Archive,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { router } from "@inertiajs/react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/Components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/Components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu"

interface Subcategoria {
  id: number
  nombre: string
  categoria_id: number
  categoria: {
    nombre: string
  }
  estado: string
  created_at: string
}

interface Categoria {
  id: number
  nombre: string
}

interface SubcategoriasProps {
  subcategorias: Subcategoria[]
  categorias: Categoria[]
}

const Subcategorias = ({ subcategorias: initialSubcategorias, categorias }: SubcategoriasProps) => {
  const [nombre, setNombre] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [estado, setEstado] = useState("Activo")
  const [error, setError] = useState("")
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>(initialSubcategorias)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subcategoriaToDelete, setSubcategoriaToDelete] = useState<number | null>(null)
  const itemsPerPage = 12

  useEffect(() => {
    setSubcategorias(initialSubcategorias)
  }, [initialSubcategorias])

  const showSuccessNotification = (message: string) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("El nombre es requerido")
      return
    }

    if (!categoriaId) {
      setError("Seleccione una categoría")
      return
    }

    setIsSubmitting(true)

    if (editandoId) {
      router.put(
        `/categorias/subcategorias/${editandoId}`,
        {
          nombre,
          categoria_id: categoriaId,
          estado,
        },
        {
          onSuccess: () => {
            resetForm()
            showSuccessNotification("Subcategoría actualizada con éxito")
            router.reload({ only: ["subcategorias"] })
          },
          onError: (errors) => {
            setError(errors.message || "Error al actualizar")
            setIsSubmitting(false)
          },
        },
      )
    } else {
      router.post(
        "/categorias/subcategorias",
        {
          nombre,
          categoria_id: categoriaId,
          estado,
        },
        {
          onSuccess: () => {
            resetForm()
            showSuccessNotification("Subcategoría creada con éxito")
            router.reload({ only: ["subcategorias"] })
          },
          onError: (errors) => {
            setError(errors.message || "Error al crear")
            setIsSubmitting(false)
          },
        },
      )
    }
  }

  const resetForm = () => {
    setNombre("")
    setCategoriaId("")
    setEstado("Activo")
    setError("")
    setEditandoId(null)
    setIsSubmitting(false)
    setShowForm(false)
  }

  const handleEditar = (subcategoria: Subcategoria) => {
    setNombre(subcategoria.nombre)
    setCategoriaId(subcategoria.categoria_id.toString())
    setEstado(subcategoria.estado)
    setEditandoId(subcategoria.id)
    setShowForm(true)
  }

  const handleEliminar = (id: number) => {
    setSubcategoriaToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (subcategoriaToDelete) {
      router.delete(`/categorias/subcategorias/${subcategoriaToDelete}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setSubcategoriaToDelete(null)
          showSuccessNotification("Subcategoría eliminada con éxito")
          router.reload({ only: ["subcategorias"] })
        },
      })
    }
  }

  const filteredSubcategorias = subcategorias.filter((sub) => {
    const matchesSearch = sub.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && sub.estado === "Activo"
    if (activeTab === "inactive") return matchesSearch && sub.estado === "Inactivo"
    
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredSubcategorias.length / itemsPerPage)
  const paginatedSubcategorias = filteredSubcategorias.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const stats = {
    total: subcategorias.length,
    active: subcategorias.filter(s => s.estado === "Activo").length,
    inactive: subcategorias.filter(s => s.estado === "Inactivo").length,
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-6 right-6 z-50 bg-white shadow-xl rounded-2xl p-4 flex items-center gap-3 border border-emerald-200"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-slate-800">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Subcategorías</h1>
            <p className="text-gray-600">Administra y organiza las subcategorías del sistema</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Subcategorías</p>
                  <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Activas</p>
                  <p className="text-lg font-bold text-emerald-600">{stats.active}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <div className="h-6 w-6 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Inactivas</p>
                  <p className="text-lg font-bold text-red-600">{stats.inactive}</p>
                </div>
                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <div className="h-6 w-6 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-3 mb-6">
            <div className="w-full lg:w-auto lg:min-w-[180px] order-last lg:order-first">
              <Button
                onClick={() => {
                  if (showForm) {
                    resetForm()
                  } else {
                    setShowForm(true)
                  }
                }}
                className={`
                  w-full h-12 px-6 rounded-xl font-medium transition-all duration-200
                  ${showForm 
                    ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/25"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                  }
                `}
              >
                {showForm ? (
                  <>
                    <X className="h-5 w-5 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nueva Subcategoría
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:flex-1 gap-3 order-first lg:order-last">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar subcategorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200"
                />
              </div>
              
              <div className="w-full sm:w-[220px]">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <SelectValue placeholder="Filtrar por estado" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                    <SelectItem value="all" className="rounded-lg">
                      <span className="font-medium">Todos los estados</span>
                    </SelectItem>
                    <SelectItem value="active" className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Activos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive" className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span>Inactivos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editandoId ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editandoId ? 'Modifica los datos de la subcategoría' : 'Completa la información para crear una nueva subcategoría'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nombre de la subcategoría
                    </Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingresa el nombre"
                      className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-300 transition-all duration-200 w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoria" className="text-sm font-medium text-gray-700 mb-2 block">
                      Categoría
                    </Label>
                    <Select value={categoriaId} onValueChange={setCategoriaId}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white w-full">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {categorias.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()} className="rounded-lg">
                            {cat.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estado" className="text-sm font-medium text-gray-700 mb-2 block">
                      Estado
                    </Label>
                    <Select value={estado} onValueChange={setEstado}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white w-full">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            estado === "Activo" ? "bg-emerald-500" : "bg-red-500"
                          }`} />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Activo" className="rounded-lg">
                          <span>Activo</span>
                        </SelectItem>
                        <SelectItem value="Inactivo" className="rounded-lg">
                          <span>Inactivo</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700 font-medium">{error}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 disabled:opacity-50 order-last sm:order-first"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : editandoId ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Actualizar Subcategoría
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Crear Subcategoría
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium border-gray-200 hover:bg-gray-50 transition-all duration-200 order-first sm:order-last"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredSubcategorias.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                  {paginatedSubcategorias.map((subcategoria) => (
                    <div 
                      key={subcategoria.id} 
                      className="group bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Tag className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {subcategoria.nombre}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Categoría: {subcategoria.categoria.nombre}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(subcategoria.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <span className={`
                          px-3 py-1.5 text-xs font-semibold rounded-full flex-shrink-0 ml-3
                          ${subcategoria.estado === "Activo"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                          }
                        `}>
                          {subcategoria.estado}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditar(subcategoria)}
                          className="flex-1 h-10 rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminar(subcategoria.id)}
                          className="flex-1 h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="border-t border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredSubcategorias.length)} de {filteredSubcategorias.length} subcategorías
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-9 w-9 p-0 rounded-lg border-gray-200"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-700">
                          {currentPage} de {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="h-9 w-9 p-0 rounded-lg border-gray-200"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay subcategorías</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || activeTab !== "all" 
                    ? "No se encontraron subcategorías con los filtros aplicados"
                    : "Comienza creando tu primera subcategoría"
                  }
                </p>
                {!showForm && (!searchTerm && activeTab === "all") && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Crear Primera Subcategoría
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">¿Eliminar subcategoría?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Esta acción no se puede deshacer. Se eliminará permanentemente la subcategoría
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-xl px-6 py-2.5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 rounded-xl px-6 py-2.5"
            >
              <Trash className="h-4 w-4 mr-2" />
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Subcategorias