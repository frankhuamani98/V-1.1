"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {
  PlusCircle,
  Edit,
  Trash,
  Check,
  Search,
  Loader2,
  AlertCircle,
  X,
  Filter,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { router } from "@inertiajs/react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/Components/ui/badge"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/Components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { cn } from "@/lib/utils"

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
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortField, setSortField] = useState<"nombre" | "categoria">("nombre")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

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
  }

  const handleEditar = (subcategoria: Subcategoria) => {
    setNombre(subcategoria.nombre)
    setCategoriaId(subcategoria.categoria_id.toString())
    setEstado(subcategoria.estado)
    setEditandoId(subcategoria.id)
    setShowForm(true)
    setTimeout(() => {
      document.getElementById("form-card")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleEliminar = (id: number) => {
    if (confirm("¿Está seguro que desea eliminar esta subcategoría?")) {
      router.delete(`/categorias/subcategorias/${id}`, {
        onSuccess: () => {
          showSuccessNotification("Subcategoría eliminada con éxito")
          router.reload({ only: ["subcategorias"] })
        },
      })
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "active") {
      setStatusFilter("Activo")
    } else if (value === "inactive") {
      setStatusFilter("Inactivo")
    } else {
      setStatusFilter("all")
    }
  }

  const toggleSort = (field: "nombre" | "categoria") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedAndFilteredSubcategorias = subcategorias
    .filter((sub) => {
      const matchesSearch =
        sub.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || sub.estado === statusFilter
      const matchesCategory = categoryFilter === "all" || sub.categoria_id.toString() === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      if (sortField === "nombre") {
        return sortDirection === "asc" ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
      } else {
        return sortDirection === "asc"
          ? a.categoria.nombre.localeCompare(b.categoria.nombre)
          : b.categoria.nombre.localeCompare(a.categoria.nombre)
      }
    })

  const toggleForm = () => {
    setShowForm(!showForm)
    resetForm()
    if (!showForm) {
      setTimeout(() => {
        document.getElementById("form-card")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list")
  }

  // Calcular estadísticas
  const totalActivas = subcategorias.filter((s) => s.estado === "Activo").length
  const totalInactivas = subcategorias.filter((s) => s.estado === "Inactivo").length
  const porcentajeActivas = subcategorias.length > 0 ? Math.round((totalActivas / subcategorias.length) * 100) : 0

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b to-slate-100/80 w-full overflow-x-hidden">
        {/* Notificación de éxito */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 border border-emerald-600/20"
            >
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{successMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 space-y-4 sm:space-y-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/60">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-white">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Gestión de Subcategorías</h1>
                  <p className="mt-1 sm:mt-2 text-blue-100 max-w-2xl text-sm sm:text-base">
                    Organiza y administra las subcategorías de tu plataforma de manera eficiente
                  </p>
                </div>
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={toggleForm}
                    className="w-full xs:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-lg transition-all text-[0.875rem] sm:text-[1rem] h-[2.25rem] sm:h-[2.5rem]"
                  >
                    {showForm ? (
                      <>
                        <X className="mr-2 h-[1rem] w-[1rem]" />
                        <span>Ocultar Formulario</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-[1rem] w-[1rem]" />
                        <span className="hidden sm:inline">Añadir Nueva Subcategoría</span>
                        <span className="sm:hidden">Nueva</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={toggleViewMode}
                    variant="outline"
                    className="w-full xs:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all text-xs sm:text-sm h-9 sm:h-10"
                  >
                    {viewMode === "list" ? (
                      <>
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Vista Cuadrícula</span>
                        <span className="sm:hidden">Cuadrícula</span>
                      </>
                    ) : (
                      <>
                        <List className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Vista Lista</span>
                        <span className="sm:hidden">Lista</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200/60 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Activas</p>
                        <p className="text-base sm:text-lg font-semibold text-slate-900">{totalActivas}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Inactivas</p>
                        <p className="text-base sm:text-lg font-semibold text-slate-900">{totalInactivas}</p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-100">
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="text-base sm:text-lg font-semibold text-slate-900">{subcategorias.length}</p>
                      </div>
                    </div>

                    <div className="hidden md:block h-10 w-px bg-slate-200 mx-2"></div>

                    <div className="hidden md:flex items-center gap-2">
                      <div className="w-full max-w-[120px] h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${porcentajeActivas}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{porcentajeActivas}% activas</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mt-3 sm:mt-4 md:mt-0">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar subcategorías..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                id="form-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                        {editandoId ? (
                          <>
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <Edit className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Editar Subcategoría</span>
                          </>
                        ) : (
                          <>
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <PlusCircle className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Crear Nueva Subcategoría</span>
                          </>
                        )}
                      </h2>
                      {editandoId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetForm}
                          className="text-slate-500 hover:text-slate-700 group"
                        >
                          <X className="mr-1 h-4 w-4 group-hover:rotate-90 transition-transform" />
                          <span>Cancelar Edición</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1rem] sm:gap-[1.5rem]">
                        {/* Campo Nombre */}
                        <div className="space-y-[0.5rem]">
                          <Label className="text-[0.875rem] font-medium text-slate-700 flex items-center">
                            Nombre
                            <span className="text-red-500 ml-[0.25rem]">*</span>
                          </Label>
                          <Input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ejm: Frenos de Disco"
                            className="h-[2.5rem] sm:h-[2.75rem] focus:ring-2 focus:ring-blue-500/50 border-slate-200 rounded-xl text-[0.875rem]"
                          />
                        </div>

                        {/* Selector Categoría */}
                        <div className="space-y-[0.5rem]">
                          <Label className="text-[0.875rem] font-medium text-slate-700 flex items-center">
                            Categoría
                            <span className="text-red-500 ml-[0.25rem]">*</span>
                          </Label>
                          <Select value={categoriaId} onValueChange={setCategoriaId}>
                            <SelectTrigger className="h-[2.5rem] sm:h-[2.75rem] focus:ring-2 focus:ring-blue-500/50 border-slate-200 rounded-xl text-[0.875rem]">
                              <SelectValue placeholder="Seleccione una categoría" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {categorias.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.id.toString()}
                                  className="rounded-lg hover:bg-slate-50"
                                >
                                  <div className="flex items-center">{cat.nombre}</div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Selector Estado */}
                        <div className="space-y-[0.5rem]">
                          <Label className="text-[0.875rem] font-medium text-slate-700">Estado</Label>
                          <Select value={estado} onValueChange={setEstado}>
                            <SelectTrigger className="h-[2.5rem] sm:h-[2.75rem] focus:ring-2 focus:ring-blue-500/50 border-slate-200 rounded-xl text-[0.875rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Activo" className="rounded-lg hover:bg-emerald-50 group">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 group-hover:bg-emerald-600" />
                                  <span className="text-emerald-700">Activo</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Inactivo" className="rounded-lg hover:bg-red-50 group">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-red-500 mr-3 group-hover:bg-red-600" />
                                  <span className="text-red-700">Inactivo</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Mensaje de Error */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start"
                        >
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-red-700 font-medium text-base">Error de validación</p>
                            <p className="text-red-600 text-sm">{error}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Botón de Envío */}
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-10 sm:h-11 px-4 sm:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin mr-2 h-4 w-4" />
                              <span>Procesando...</span>
                            </>
                          ) : editandoId ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Actualizar Subcategoría</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>Crear Subcategoría</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtros y Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
                <TabsList className="bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                  <TabsTrigger
                    value="all"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Todas
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                      Activas
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactive"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      Inactivas
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 sm:h-10 w-full xs:min-w-[150px] sm:min-w-[200px] rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500/50 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-slate-500" />
                      <span className="truncate">
                        {categoryFilter === "all"
                          ? "Todas las categorías"
                          : categorias.find((c) => c.id.toString() === categoryFilter)?.nombre}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="rounded-lg">
                      Todas las categorías
                    </SelectItem>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="rounded-lg hover:bg-slate-50">
                        <div className="flex items-center">{cat.nombre}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 sm:h-10 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm"
                  onClick={() => toggleSort("nombre")}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span>Ordenar por {sortField === "nombre" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</span>
                </Button>
              </div>
            </div>

            {/* Resultados */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Subcategorías</h3>
                <p className="text-sm text-slate-500">
                  {sortedAndFilteredSubcategorias.length}{" "}
                  {sortedAndFilteredSubcategorias.length === 1 ? "resultado" : "resultados"}
                </p>
              </div>

              {/* Vista de Lista */}
              {viewMode === "list" && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 -mx-3 sm:mx-0">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-slate-600 font-medium text-xs sm:text-sm border-b border-slate-200 cursor-pointer">
                          <div className="flex items-center">
                            Nombre
                            {sortField === "nombre" && (
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-slate-600 font-medium text-xs sm:text-sm border-b border-slate-200 cursor-pointer">
                          <div className="flex items-center">
                            Categoría
                            {sortField === "categoria" && (
                              <ChevronDown
                                className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-slate-600 font-medium text-xs sm:text-sm border-b border-slate-200">
                          Estado
                        </TableHead>
                        <TableHead className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-slate-600 font-medium text-xs sm:text-sm border-b border-slate-200 text-right">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <AnimatePresence>
                        {sortedAndFilteredSubcategorias.length > 0 ? (
                          sortedAndFilteredSubcategorias.map((subcategoria) => (
                            <motion.tr
                              key={subcategoria.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="border-b border-slate-200 hover:bg-blue-50/10 transition-colors group"
                            >
                              <TableCell className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] font-medium text-slate-900 text-[0.875rem] sm:text-[1rem]">
                                {subcategoria.nombre}
                              </TableCell>
                              <TableCell className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-slate-600 text-[0.875rem] sm:text-[1rem]">
                                <Badge
                                  variant="outline"
                                  className="bg-slate-50 text-slate-700 border-slate-200 font-normal py-[0.25rem] px-[0.5rem] text-[0.75rem]"
                                >
                                  {subcategoria.categoria.nombre}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-[0.875rem] sm:text-[1rem]">
                                <Badge
                                  variant={subcategoria.estado === "Activo" ? "default" : "destructive"}
                                  className={`rounded-full py-1 px-3 text-xs font-medium shadow-sm ${
                                    subcategoria.estado === "Activo"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-red-100 text-red-800 border border-red-200"
                                  }`}
                                >
                                  {subcategoria.estado === "Activo" ? (
                                    <span className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                                      {subcategoria.estado}
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                                      {subcategoria.estado}
                                    </span>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-[0.75rem] sm:px-[1.5rem] py-[0.75rem] sm:py-[1rem] text-right text-[0.875rem] sm:text-[1rem]">
                                <div
                                  className={cn(
                                    "flex justify-end gap-2 transition-opacity",
                                    "sm:opacity-0 sm:group-hover:opacity-100",
                                    "opacity-100", // Siempre visible en móviles
                                  )}
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditar(subcategoria)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 rounded-lg h-9 w-9 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white border shadow-lg rounded-xl">
                                      <p className="text-sm">Editar subcategoría</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEliminar(subcategoria.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg h-9 w-9 p-0"
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white border shadow-lg rounded-xl">
                                      <p className="text-sm">Eliminar subcategoría</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-slate-200"
                          >
                            <TableCell colSpan={4} className="px-6 py-10 text-center">
                              <div className="text-slate-400 flex flex-col items-center justify-center">
                                <div className="bg-slate-100 p-4 rounded-full mb-4">
                                  <Search className="h-10 w-10 text-slate-300" />
                                </div>
                                <p className="text-lg font-medium">No se encontraron resultados</p>
                                <p className="text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                              </div>
                            </TableCell>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Vista de Cuadrícula */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[0.75rem] sm:gap-[1rem]">
                  <AnimatePresence>
                    {sortedAndFilteredSubcategorias.length > 0 ? (
                      sortedAndFilteredSubcategorias.map((subcategoria) => (
                        <motion.div
                          key={subcategoria.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group"
                        >
                          <div
                            className={`h-[0.5rem] w-full ${subcategoria.estado === "Activo" ? "bg-emerald-500" : "bg-red-500"}`}
                          ></div>
                          <div className="p-[1rem]">
                            <div className="flex justify-between items-start mb-[0.75rem]">
                              <h4 className="font-medium text-slate-900 truncate text-[0.875rem] sm:text-[1rem]">
                                {subcategoria.nombre}
                              </h4>
                              <Badge
                                variant={subcategoria.estado === "Activo" ? "default" : "destructive"}
                                className={`rounded-full py-[0.125rem] px-[0.5rem] text-[0.75rem] font-medium ${
                                  subcategoria.estado === "Activo"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-red-100 text-red-800 border border-red-200"
                                }`}
                              >
                                {subcategoria.estado}
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <Badge
                                variant="outline"
                                className="bg-slate-50 text-slate-700 border-slate-200 font-normal py-[0.25rem] px-[0.5rem] text-[0.75rem]"
                              >
                                {subcategoria.categoria.nombre}
                              </Badge>
                            </div>

                            <div
                              className={cn(
                                "flex justify-end gap-2 mt-4 transition-opacity",
                                "sm:opacity-0 sm:group-hover:opacity-100",
                                "opacity-100", // Siempre visible en móviles
                              )}
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditar(subcategoria)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 rounded-lg h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border shadow-lg rounded-xl">
                                  <p className="text-sm">Editar subcategoría</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEliminar(subcategoria.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg h-8 w-8 p-0"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white border shadow-lg rounded-xl">
                                  <p className="text-sm">Eliminar subcategoría</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full">
                        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                          <div className="text-slate-400 flex flex-col items-center justify-center">
                            <div className="bg-slate-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-slate-300" />
                            </div>
                            <p className="text-base sm:text-lg font-medium">No se encontraron resultados</p>
                            <p className="text-xs sm:text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default Subcategorias

