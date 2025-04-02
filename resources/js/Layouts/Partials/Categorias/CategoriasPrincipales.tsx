import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card"
import {
  PlusCircle,
  Edit,
  Trash,
  Check,
  X,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Folder,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  ArrowUpDown,
  FolderPlus,
  FolderX,
  FolderClock,
  LayoutGrid,
  LayoutList,
  Sparkles,
  EyeOff,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { router } from "@inertiajs/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"

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

const CategoriasPrincipales = ({ categorias }: CategoriasPrincipalesProps) => {
  const [nombre, setNombre] = useState("")
  const [estado, setEstado] = useState("Activo")
  const [error, setError] = useState("")
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState("all")
  const [sortField, setSortField] = useState("nombre")
  const [sortDirection, setSortDirection] = useState("asc")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Gestión de notificaciones de éxito
  const showSuccessNotification = (message: string) => {
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setError("El nombre de la categoría es requerido")
      return
    }

    setIsSubmitting(true)

    if (editandoCategoria) {
      // Si estamos editando, actualizamos la categoría
      router.put(
        `/categorias/principales/${editandoCategoria.id}`,
        {
          nombre,
          estado,
        },
        {
          onSuccess: () => {
            setNombre("")
            setEstado("Activo")
            setEditandoCategoria(null)
            setError("")
            setIsSubmitting(false)
            showSuccessNotification("¡Categoría actualizada con éxito!")
            setIsFormVisible(false)
          },
          onError: (errors) => {
            setError(errors.nombre || "Error al actualizar la categoría")
            setIsSubmitting(false)
          },
        },
      )
    } else {
      // Si no, creamos una nueva categoría
      router.post(
        "/categorias/principales",
        {
          nombre,
          estado,
        },
        {
          onSuccess: () => {
            setNombre("")
            setEstado("Activo")
            setError("")
            setIsSubmitting(false)
            showSuccessNotification("¡Categoría creada con éxito!")
            setIsFormVisible(false)
          },
          onError: (errors) => {
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
    setIsFormVisible(true)
    // Scroll al formulario si es necesario
    document.getElementById("categoria-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleEliminar = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      router.delete(`/categorias/principales/${id}`, {
        onSuccess: () => {
          showSuccessNotification("¡Categoría eliminada con éxito!")
        },
      })
    }
  }

  const cancelarEdicion = () => {
    setNombre("")
    setEstado("Activo")
    setEditandoCategoria(null)
    setError("")
    setIsFormVisible(false)
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "Inactivo":
        return <X className="h-4 w-4 text-rose-500" />
      case "Pendiente":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Inactivo":
        return "bg-rose-50 text-rose-700 border-rose-200"
      case "Pendiente":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Ordenar y filtrar categorías
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 ml-1 opacity-70" />
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 ml-1" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 ml-1" />
    )
  }

  // Filtrado y ordenación de categorías en tiempo real
  const filteredAndSortedCategorias = useMemo(() => {
    return categorias
      .filter((categoria) => {
        // Filtro por término de búsqueda (en tiempo real)
        const matchesSearch =
          categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoria.estado.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por estado
        if (filter === "all") return matchesSearch
        return matchesSearch && categoria.estado.toLowerCase() === filter.toLowerCase()
      })
      .sort((a, b) => {
        if (sortField === "nombre") {
          return sortDirection === "asc" ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
        } else if (sortField === "estado") {
          return sortDirection === "asc" ? a.estado.localeCompare(b.estado) : b.estado.localeCompare(a.estado)
        } else if (sortField === "fecha") {
          return sortDirection === "asc"
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return 0
      })
  }, [categorias, searchTerm, filter, sortField, sortDirection])

  // Estadísticas
  const stats = {
    total: categorias.length,
    activas: categorias.filter((cat) => cat.estado === "Activo").length,
    inactivas: categorias.filter((cat) => cat.estado === "Inactivo").length,
    pendientes: categorias.filter((cat) => cat.estado === "Pendiente").length,
  }

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen max-w-screen-2xl mx-auto">
      {/* Notificación de éxito */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg flex items-center max-w-[calc(100vw-2rem)]"
          >
            <div className="bg-emerald-100 p-1.5 rounded-full mr-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="truncate">
              <p className="font-medium truncate">{successMessage}</p>
              <p className="text-xs text-emerald-600 mt-0.5 truncate">La acción se completó correctamente</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabecera */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-2 md:gap-4">
              <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 md:p-3 rounded-xl shadow-md">
                <Folder className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 flex items-center flex-wrap gap-2">
                  Categorías Principales
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {stats.total}
                  </span>
                </h1>
                <p className="text-sm md:text-base text-slate-500 mt-1">
                  Gestiona las categorías principales para organizar tus productos y servicios
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm md:text-base"
                    size="sm"
                  >
                    {isFormVisible ? <X className="mr-1 md:mr-2 h-4 w-4" /> : <Edit className="mr-1 md:mr-2 h-4 w-4" />}
                    {isFormVisible ? "Cerrar" : "Formulario"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFormVisible ? "Cerrar formulario" : "Mostrar formulario"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all text-sm md:text-base"
              size="sm"
              onClick={() => {
                cancelarEdicion()
                setIsFormVisible(true)
              }}
            >
              <PlusCircle className="mr-1 md:mr-2 h-4 w-4" />
              <span className="whitespace-nowrap">Nueva Categoría</span>
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-3 md:p-4 flex items-center">
              <div className="bg-indigo-50 p-2 md:p-3 rounded-xl mr-2 md:mr-3">
                <FolderPlus className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">{stats.total}</div>
                <div className="text-xs md:text-sm text-slate-500">Total categorías</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-3 md:p-4 flex items-center">
              <div className="bg-emerald-50 p-2 md:p-3 rounded-xl mr-2 md:mr-3">
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-600">{stats.activas}</div>
                <div className="text-xs md:text-sm text-slate-500">Categorías activas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-3 md:p-4 flex items-center">
              <div className="bg-rose-50 p-2 md:p-3 rounded-xl mr-2 md:mr-3">
                <FolderX className="h-4 w-4 md:h-5 md:w-5 text-rose-500" />
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-rose-600">{stats.inactivas}</div>
                <div className="text-xs md:text-sm text-slate-500">Categorías inactivas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-3 md:p-4 flex items-center">
              <div className="bg-amber-50 p-2 md:p-3 rounded-xl mr-2 md:mr-3">
                <FolderClock className="h-4 w-4 md:h-5 md:w-5 text-amber-500" />
              </div>
              <div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-amber-600">{stats.pendientes}</div>
                <div className="text-xs md:text-sm text-slate-500">Categorías pendientes</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formulario */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
          >
            <Card id="categoria-form" className="shadow-md border border-slate-100 overflow-hidden rounded-2xl">
              <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-100">
                <CardTitle className="text-lg md:text-xl flex items-center text-indigo-700">
                  {editandoCategoria ? <Edit className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  {editandoCategoria ? "Editar Categoría" : "Agregar Nueva Categoría"}
                </CardTitle>
                {editandoCategoria && (
                  <CardDescription className="text-sm">
                    Editando: <span className="font-medium text-indigo-600">{editandoCategoria.nombre}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="font-medium text-slate-700 text-sm md:text-base">
                        Nombre de la Categoría
                      </Label>
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ingrese el nombre de la categoría"
                        className="w-full border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg text-sm md:text-base"
                      />
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center text-xs md:text-sm text-rose-500 font-medium mt-1"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {error}
                        </motion.div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado" className="font-medium text-slate-700 text-sm md:text-base">
                        Estado de la Categoría
                      </Label>
                      <Select value={estado} onValueChange={setEstado}>
                        <SelectTrigger className="w-full border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg text-sm md:text-base">
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Activo" className="flex items-center text-sm md:text-base">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                              Activo
                            </div>
                          </SelectItem>
                          <SelectItem value="Inactivo" className="text-sm md:text-base">
                            <div className="flex items-center">
                              <X className="h-4 w-4 text-rose-500 mr-2" />
                              Inactivo
                            </div>
                          </SelectItem>
                          <SelectItem value="Pendiente" className="text-sm md:text-base">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-amber-500 mr-2" />
                              Pendiente
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelarEdicion}
                      className="border-slate-200 hover:bg-slate-50 rounded-lg text-sm md:text-base"
                      size="sm"
                    >
                      <X className="mr-1 md:mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all rounded-lg text-sm md:text-base"
                      disabled={isSubmitting}
                      size="sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-1 md:mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : editandoCategoria ? (
                        <>
                          <Check className="mr-1 md:mr-2 h-4 w-4" />
                          Actualizar
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-1 md:mr-2 h-4 w-4" />
                          Agregar
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listado de categorías existentes */}
      <Card className="shadow-md border border-slate-100 overflow-hidden rounded-2xl">
        <CardHeader className="pb-3 bg-white border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <CardTitle className="text-lg md:text-xl text-slate-800 flex items-center">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2 text-indigo-500" />
              Listado de Categorías
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg text-sm md:text-base"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-40 border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg text-sm md:text-base">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-slate-500" />
                    <SelectValue placeholder="Filtrar por" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm md:text-base">Todos los estados</SelectItem>
                  <SelectItem value="activo" className="text-sm md:text-base">Activo</SelectItem>
                  <SelectItem value="inactivo" className="text-sm md:text-base">Inactivo</SelectItem>
                  <SelectItem value="pendiente" className="text-sm md:text-base">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-between items-center border-b border-slate-100 px-3 py-2 bg-slate-50">
            <div className="flex gap-1 md:gap-2">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={
                  viewMode === "table"
                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs md:text-sm"
                    : "text-slate-600 hover:bg-slate-100 text-xs md:text-sm"
                }
              >
                <LayoutList className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Tabla
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs md:text-sm"
                    : "text-slate-600 hover:bg-slate-100 text-xs md:text-sm"
                }
              >
                <LayoutGrid className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Tarjetas
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "table" ? (
                <div className="overflow-x-auto">
                  {filteredAndSortedCategorias.length === 0 ? (
                    <div className="text-center py-8 md:py-12 text-slate-500 text-sm md:text-base">
                      {searchTerm || filter !== "all"
                        ? "No se encontraron categorías con ese filtro"
                        : "No hay categorías disponibles"}
                      <Button
                        variant="outline"
                        className="mt-2 mx-auto block border-slate-200 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-xs md:text-sm"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("")
                          setFilter("all")
                        }}
                      >
                        <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th
                            className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => toggleSort("nombre")}
                          >
                            <div className="flex items-center">Nombre {getSortIcon("nombre")}</div>
                          </th>
                          <th
                            className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() => toggleSort("estado")}
                          >
                            <div className="flex items-center justify-center">Estado {getSortIcon("estado")}</div>
                          </th>
                          <th
                            className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors hidden sm:table-cell"
                            onClick={() => toggleSort("fecha")}
                          >
                            <div className="flex items-center">Fecha Creación {getSortIcon("fecha")}</div>
                          </th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-medium uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100">
                        {filteredAndSortedCategorias.map((categoria) => (
                          <tr key={categoria.id} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 md:h-9 md:w-9 mr-2 md:mr-3 bg-violet-100 text-violet-600">
                                  <AvatarFallback>{categoria.nombre.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium text-slate-900 text-sm md:text-base">
                                  {categoria.nombre}
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap">
                              <div className="flex justify-center">
                                <Badge
                                  className={`${getEstadoColor(
                                    categoria.estado,
                                  )} flex items-center justify-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 text-xs md:text-sm`}
                                >
                                  {getEstadoIcon(categoria.estado)}
                                  {categoria.estado}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-xs md:text-sm text-slate-500 hidden sm:table-cell">
                              {formatDate(categoria.created_at)}
                            </td>
                            <td className="px-3 py-3 md:px-4 md:py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                              <div className="flex justify-end gap-1 md:gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditar(categoria)}
                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8 p-0"
                                      >
                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar categoría</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEliminar(categoria.id)}
                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0"
                                      >
                                        <Trash className="h-3 w-3 md:h-4 md:w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Eliminar categoría</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="p-2 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {filteredAndSortedCategorias.length === 0 ? (
                    <div className="text-center py-8 md:py-12 text-slate-500 text-sm md:text-base col-span-full">
                      {searchTerm || filter !== "all"
                        ? "No se encontraron categorías con ese filtro"
                        : "No hay categorías disponibles"}
                      <Button
                        variant="outline"
                        className="mt-2 mx-auto block border-slate-200 hover:bg-slate-50 hover:text-indigo-600 rounded-lg text-xs md:text-sm"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("")
                          setFilter("all")
                        }}
                      >
                        <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : (
                    filteredAndSortedCategorias.map((categoria) => (
                      <motion.div
                        key={categoria.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="overflow-hidden transition-all hover:shadow-md border border-slate-100 h-full">
                          <CardContent className="p-0">
                            <div className="p-3 md:p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 md:gap-3">
                                  <Avatar className="h-9 w-9 md:h-10 md:w-10 bg-violet-100 text-violet-600">
                                    <AvatarFallback>{categoria.nombre.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                                      {categoria.nombre}
                                    </h3>
                                    <Badge
                                      className={`${getEstadoColor(
                                        categoria.estado,
                                      )} flex items-center justify-center gap-1 mt-1 px-2 py-0.5 text-xs md:text-sm`}
                                    >
                                      {getEstadoIcon(categoria.estado)}
                                      {categoria.estado}
                                    </Badge>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-slate-500 hover:bg-slate-100 h-7 w-7 p-0"
                                    >
                                      <MoreVertical className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem
                                      onClick={() => handleEditar(categoria)}
                                      className="cursor-pointer text-xs md:text-sm"
                                    >
                                      <Edit className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-500" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleEliminar(categoria.id)}
                                      className="text-rose-600 cursor-pointer text-xs md:text-sm"
                                    >
                                      <Trash className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <Separator />
                            <div className="bg-slate-50 px-3 py-1.5 md:px-4 md:py-2 text-xs text-slate-500 flex justify-between items-center">
                              <span>Creado: {formatDate(categoria.created_at)}</span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditar(categoria)}
                                  className="h-6 w-6 md:h-7 md:w-7 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full"
                                >
                                  <Edit className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEliminar(categoria.id)}
                                  className="h-6 w-6 md:h-7 md:w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                                >
                                  <Trash className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-3 md:p-4 flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-slate-500">
          <div className="mb-2 sm:mb-0">
            Mostrando {filteredAndSortedCategorias.length} de {categorias.length} categorías
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Última actualización: {new Date().toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CategoriasPrincipales