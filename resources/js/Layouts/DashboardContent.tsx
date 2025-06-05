import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  BikeIcon,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';

// Definición de tipos
interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  progress: number;
}

interface AlertCardProps {
  message: string;
  priority: 'alta' | 'media' | 'baja';
  onDismiss: () => void;
  onResolve: () => void;
}

interface Opinion {
  id: number;
  user: {
    name: string;
  } | null;
  calificacion: number;
  contenido: string;
  created_at: string;
  util: number;
  es_soporte: boolean;
}

interface DashboardProps {
  totalPedidosCompletados: number;
  cambioPedidosCompletados: number;
  progresoPedidosCompletados: number;
  textoCambio?: string;
  totalReservasCompletadas: number;
  progresoReservasCompletadas: number;
  totalNuevosUsuarios: number;
  progresoNuevosUsuarios: number;
  totalProductos: number;
  ventasMensuales: Array<{
    name: string;
    sales: number;
  }>;
  reservasMensuales: Array<{
    name: string;
    reservas: number;
  }>;
  topProductosData: Array<{
    name: string;
    value: number;
  }>;
  stockPorCategoriaData: Array<{
    name: string;
    value: number;
  }>;
  usuariosNuevosMensuales: Array<{
    name: string;
    nuevos: number;
  }>;
  ultimasMotos: Array<{
    id: number;
    name: string;
    estado: string;
    date: string;
  }>;
  upcomingAppointments: Array<{
    id: number;
    customer: string;
    type: string;
    vehicle: string;
    time: string;
  }>;
  opiniones: Opinion[];
}



const partTypeData = [
  { name: 'Aceites y Lubricantes', value: 40 },
  { name: 'Neumáticos', value: 25 },
  { name: 'Baterías', value: 15 },
  { name: 'Cascos', value: 12 },
  { name: 'Accesorios', value: 8 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const customerData = [
  { name: 'Jan', new: 40, returning: 24 },
  { name: 'Feb', new: 30, returning: 13 },
  { name: 'Mar', new: 20, returning: 38 },
  { name: 'Apr', new: 27, returning: 39 },
  { name: 'May', new: 18, returning: 48 },
  { name: 'Jun', new: 23, returning: 38 },
  { name: 'Jul', new: 34, returning: 43 },
];

const recentLeads = [
  { id: 1, name: "Yamaha YZF-R3 2023", vehicle: "", status: "Nuevo", date: "Hace 10 min" },
  { id: 2, name: "Honda CB500F 2022", vehicle: "", status: "Contactado", date: "Hace 1 hora" },
  { id: 3, name: "Suzuki GSX-R600 2023", vehicle: "", status: "Interesado", date: "Hace 3 horas" },
  { id: 4, name: "Kawasaki Ninja 400 2022", vehicle: "", status: "Prueba de Manejo", date: "Ayer" },
  { id: 5, name: "Ducati Monster 2023", vehicle: "", status: "Negociación", date: "Ayer" },
];

// Elimina el array estático de upcomingAppointments

const KPICard: React.FC<KPICardProps & { textoCambio?: string }> = ({
  title, value, icon, change, progress, textoCambio = "del mes actual"
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <span className={`flex items-center ${change > 0 ? 'text-green-500' : 'text-blue-500'}`}>
          {change.toFixed(1)}%
        </span>
        <span>{textoCambio}</span>
      </div>
      <Progress className="mt-3" value={progress} />
    </CardContent>
  </Card>
);

const AlertCard: React.FC<AlertCardProps> = ({ message, priority, onDismiss, onResolve }) => (
  <div className="flex items-start space-x-3">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
      priority === "alta" ? "bg-destructive/10" :
      priority === "media" ? "bg-orange-500/10" : "bg-blue-500/10"
    }`}>
      <AlertCircle className={`h-5 w-5 ${
        priority === "alta" ? "text-destructive" :
        priority === "media" ? "text-orange-500" : "text-blue-500"
      }`} />
    </div>
    <div className="space-y-1 flex-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <Badge variant={
          priority === "alta" ? "destructive" :
          priority === "media" ? "secondary" : "outline"
        } className="text-xs">
          {priority}
        </Badge>
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onDismiss}>
          Descartar
        </Button>
        <Button variant="default" size="sm" className="h-7 px-2" onClick={onResolve}>
          Resolver
        </Button>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({
  totalPedidosCompletados,
  cambioPedidosCompletados,
  progresoPedidosCompletados,
  textoCambio = "del mes actual",
  totalReservasCompletadas,
  progresoReservasCompletadas,
  totalNuevosUsuarios,
  progresoNuevosUsuarios,
  totalProductos,
  ventasMensuales,
  reservasMensuales,
  topProductosData,
  stockPorCategoriaData,
  usuariosNuevosMensuales,
  ultimasMotos = [],
  upcomingAppointments = [],
  opiniones = [],
}) => {
  // Calcular el total de productos para porcentajes en el gráfico de inventario
  const totalProductosInventario = stockPorCategoriaData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tablero</h1>
        <div className="flex flex-wrap items-center gap-2">

        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Pedidos"
          value={totalPedidosCompletados}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          change={cambioPedidosCompletados}
          progress={progresoPedidosCompletados}
          textoCambio={textoCambio}
        />
        <KPICard
          title="Total de Reservas"
          value={totalReservasCompletadas}
          icon={<BikeIcon className="h-4 w-4 text-muted-foreground" />}
          change={progresoReservasCompletadas}
          progress={progresoReservasCompletadas}
          textoCambio={textoCambio}
        />
        <KPICard
          title="Nuevos Usuarios"
          value={totalNuevosUsuarios}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          change={progresoNuevosUsuarios}
          progress={progresoNuevosUsuarios}
          textoCambio={textoCambio}
        />
        <KPICard
          title="Total de Productos"
          value={totalProductos}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          change={0}
          progress={0}
          textoCambio={textoCambio}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">Resumen</TabsTrigger>
          <TabsTrigger value="sales" className="flex-1 sm:flex-none">Reservas</TabsTrigger>
          <TabsTrigger value="inventory" className="flex-1 sm:flex-none">Inventario</TabsTrigger>
          <TabsTrigger value="customers" className="flex-1 sm:flex-none">Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Ventas</CardTitle>
                <CardDescription>Desempeño mensual de ventas</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventasMensuales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(value: any) => Number(value).toLocaleString('es-PE', { maximumFractionDigits: 0 })} />
                      <Legend />
                      <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="Ventas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Productos</CardTitle>
                <CardDescription>Distribución de mis productos por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topProductosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {topProductosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempeño de Reservas</CardTitle>
              <CardDescription>Análisis detallado de reservas mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reservasMensuales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: any) => Number(value).toLocaleString('es-PE', { maximumFractionDigits: 0 })} />
                    <Legend />
                    <Line type="monotone" dataKey="reservas" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} name="Reservas Completadas" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Inventario</CardTitle>
              <CardDescription>Niveles de stock actuales y distribución</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockPorCategoriaData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => {
                        const percent = totalProductosInventario > 0 ? (value / totalProductosInventario) * 100 : 0;
                        return `${name}: ${value} (${percent.toFixed(1)}%)`;
                      }}
                    >
                      {stockPorCategoriaData.map((entry, index) => (
                        <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adquisición de Clientes</CardTitle>
              <CardDescription>Usuarios nuevos registrados por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usuariosNuevosMensuales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: any) => Number(value).toLocaleString('es-PE', { maximumFractionDigits: 0 })} />
                    <Legend />
                    <Bar dataKey="nuevos" fill="hsl(var(--chart-1))" name="Usuarios Nuevos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Motos Nuevas */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Motos Nuevas</CardTitle>
            <CardDescription>Últimas motos registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ultimasMotos.map((moto) => (
                <div key={moto.id} className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BikeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{moto.name}</p>
                      {/* Puedes mostrar el estado si lo deseas */}
                      {/* <Badge variant="outline" className="text-xs">{moto.estado}</Badge> */}
                    </div>
                    <p className="text-xs text-muted-foreground">{moto.date}</p>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => window.location.href = '/motos/registro'}
              >
                Ver todas las motos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Nuevas Reservas</CardTitle>
            <CardDescription>Reservas registradas hoy y mañana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{appointment.customer}</p>
                      <Badge variant="outline" className="text-xs">
                        {appointment.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{appointment.vehicle}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => window.location.href = '/dashboard/reservas'}
              >
                Ver reservas
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Opiniones (antes: Alertas de Inventario) */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Opiniones Recientes</CardTitle>
            <CardDescription>Comentarios y calificaciones de usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opiniones.length === 0 && (
                <div className="text-sm text-muted-foreground">No hay opiniones recientes.</div>
              )}
              {opiniones.map((opinion) => (
                <div key={opinion.id} className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {opinion.user ? opinion.user.name : "Anónimo"}
                        {opinion.es_soporte && (
                          <Badge variant="secondary" className="ml-2 text-xs">Soporte</Badge>
                        )}
                      </p>
                      <span className="text-xs text-yellow-500">
                        {"★".repeat(opinion.calificacion)}
                        {"☆".repeat(5 - opinion.calificacion)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{opinion.created_at}</p>
                    <p className="text-sm">{opinion.contenido}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">Útil: {opinion.util}</Badge>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => window.location.href = '/dashboard/opiniones'}>
                Ver todas las opiniones
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;





































































































































