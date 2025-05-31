import type React from "react"
import { useState, useMemo, useRef } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card } from "@/Components/ui/card"
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
  Filter,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { router } from "@inertiajs/react"
import { Toaster } from "@/Components/ui/toaster"
import { toast } from "sonner"

interface Categoria {
  id: number
  nombre: string
  estado: string
  created_at: string
  updated_at: string
}

interface CategoriasPrincipalesProps {
  categorias: Categoria[]
}

const CategoriasPrincipales: React.FC<CategoriasPrincipalesProps> = ({ categorias }) => {
  const formRef = useRef<HTMLDivElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [nombre, setNombre] = useState("")
  const [estado, setEstado] = useState("Activo")
  const [error, setError] = useState("")
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterEstado, setFilterEstado] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null)
  const itemsPerPage = 12

  const resetForm = () => {
    setNombre("")
    setEstado("Activo")
    setEditandoCategoria(null)
    setError("")
    setIsSubmitting(false)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setError("El nombre de la categoría es requerido")
      return
    }

    setIsSubmitting(true)

    if (editandoCategoria) {
      router.put(
        `/categorias/principales/${editandoCategoria.id}`,
        { nombre, estado },
        {
          onSuccess: () => {
            resetForm()
            toast.success("Categoría actualizada", {
              description: "La categoría ha sido actualizada correctamente"
            })
            router.reload({ only: ["categorias"] })
          },
          onError: (errors: any) => {
            setError(errors.nombre || "Error al actualizar la categoría")
            setIsSubmitting(false)
          },
        },
      )
    } else {
      router.post(
        "/categorias/principales",
        { nombre, estado },
        {
          onSuccess: () => {
            resetForm()
            toast.success("Categoría creada", {
              description: "La categoría ha sido creada correctamente"
            })
            router.reload({ only: ["categorias"] })
          },
          onError: (errors: any) => {
            setError(errors.nombre || "Error al guardar la categoría")
            setIsSubmitting(false)
          },
        },
      )
    }
  }

  const handleEditar = (categoria: Categoria) => {
    setNombre(categoria.nombre)
    setEstado(categoria.estado)
    setEditandoCategoria(categoria)
    setShowForm(true)
    
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  const handleEliminar = (id: number) => {
    setCategoriaToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (categoriaToDelete) {
      router.delete(`/categorias/principales/${categoriaToDelete}`, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setCategoriaToDelete(null)
          toast.success("Categoría eliminada con éxito", {
            description: "La categoría ha sido eliminada correctamente",
          })
          router.reload({ only: ["categorias"] })
        },
      })
    }
  }

  const filteredCategorias = useMemo(() => {
    return categorias.filter((categoria) => {
      const matchesSearch = categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterEstado === "todos" || categoria.estado === filterEstado
      return matchesSearch && matchesFilter
    })
  }, [categorias, searchTerm, filterEstado])

  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage)
  const paginatedCategorias = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredCategorias.slice(start, end)
  }, [filteredCategorias, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const categoriasActivas = categorias.filter(c => c.estado === "Activo").length
  const categoriasInactivas = categorias.filter(c => c.estado === "Inactivo").length

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Categorías</h1>
            <p className="text-gray-600">Administra y organiza las categorías de tu sistema</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Categorías</p>
                  <p className="text-lg font-bold text-gray-900">{categorias.length}</p>
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
                  <p className="text-lg font-bold text-emerald-600">{categoriasActivas}</p>
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
                  <p className="text-lg font-bold text-red-600">{categoriasInactivas}</p>
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
                    Nueva Categoría
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row w-full lg:flex-1 gap-3 order-first lg:order-last">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200"
                />
              </div>
              
              <div className="w-full sm:w-[220px]">
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white shadow-sm focus:shadow-md focus:border-blue-300 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Filter className="h-5 w-5 text-gray-400" />
                      <SelectValue placeholder="Filtrar por estado" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                    <SelectItem value="todos" className="rounded-lg">
                      <span className="font-medium">Todos los estados</span>
                    </SelectItem>
                    <SelectItem value="Activo" className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Activos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Inactivo" className="rounded-lg">
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
            <div ref={formRef} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editandoCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {editandoCategoria ? 'Modifica los datos de la categoría' : 'Completa la información para crear una nueva categoría'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 mb-2 block">
                      Nombre de la categoría
                    </Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingresa el nombre de la categoría"
                      className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-300 transition-all duration-200 w-full"
                    />
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
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : editandoCategoria ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Actualizar Categoría
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Crear Categoría
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
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {paginatedCategorias.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {paginatedCategorias.map((categoria: Categoria) => (
                  <div 
                    key={categoria.id} 
                    className="group bg-gray-50 rounded-xl p-5 hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Tag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {categoria.nombre}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(categoria.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`
                        px-3 py-1.5 text-xs font-semibold rounded-full flex-shrink-0 ml-3
                        ${categoria.estado === "Activo"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                        }
                      `}>
                        {categoria.estado}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(categoria)}
                        className="flex-1 h-10 rounded-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminar(categoria.id)}
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
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredCategorias.length)} de {filteredCategorias.length} categorías
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorías</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterEstado !== "todos" 
                  ? "No se encontraron categorías con los filtros aplicados"
                  : "Comienza creando tu primera categoría"
                }
              </p>
              {!showForm && (!searchTerm && filterEstado === "todos") && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Primera Categoría
                </Button>
              )}
            </div>
          )}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">¿Eliminar categoría?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 mt-2">
                Esta acción no se puede deshacer. Se eliminará permanentemente la categoría
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
        
        <Toaster />
      </div>
    </div>
  )
}

export default CategoriasPrincipales