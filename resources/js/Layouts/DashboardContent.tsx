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

const salesData = [
  { name: 'Jan', sales: 65, target: 50 },
  { name: 'Feb', sales: 59, target: 60 },
  { name: 'Mar', sales: 80, target: 70 },
  { name: 'Apr', sales: 81, target: 80 },
  { name: 'May', sales: 56, target: 90 },
  { name: 'Jun', sales: 55, target: 100 },
  { name: 'Jul', sales: 40, target: 110 },
];

const partTypeData = [
  { name: 'Frenos', value: 35 },
  { name: 'Motor', value: 30 },
  { name: 'Suspensión', value: 15 },
  { name: 'Escape', value: 12 },
  { name: 'Electrónica', value: 8 },
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
  { id: 1, name: "Juan Pérez", vehicle: "Yamaha YZF-R3 2023", status: "Nuevo", date: "Hace 10 min" },
  { id: 2, name: "Carlos López", vehicle: "Honda CB500F 2022", status: "Contactado", date: "Hace 1 hora" },
  { id: 3, name: "Ana Martínez", vehicle: "Suzuki GSX-R600 2023", status: "Interesado", date: "Hace 3 horas" },
  { id: 4, name: "Luis García", vehicle: "Kawasaki Ninja 400 2022", status: "Prueba de Manejo", date: "Ayer" },
  { id: 5, name: "María Rodríguez", vehicle: "Ducati Monster 2023", status: "Negociación", date: "Ayer" },
];

const upcomingAppointments = [
  { id: 1, customer: "Pedro Sánchez", type: "Prueba de Manejo", vehicle: "Yamaha MT-07", time: "Hoy, 2:00 PM" },
  { id: 2, customer: "Laura Gómez", type: "Servicio", vehicle: "Honda CBR650R", time: "Hoy, 4:30 PM" },
  { id: 3, customer: "Javier Fernández", type: "Consulta", vehicle: "Suzuki V-Strom 650", time: "Mañana, 10:00 AM" },
  { id: 4, customer: "Sofía Ramírez", type: "Entrega", vehicle: "Kawasaki Z650", time: "Mañana, 3:00 PM" },
];

const inventoryAlerts = [
  { id: 1, message: "Bajo stock: Frenos para Yamaha YZF-R3", priority: "alta" as const },
  { id: 2, message: "Mantenimiento necesario: Honda CB500F", priority: "media" as const },
  { id: 3, message: "Documento por vencer: Seguro de Suzuki GSX-R600", priority: "baja" as const },
  { id: 4, message: "Ajuste de precio necesario: Kawasaki Ninja 400", priority: "media" as const },
];

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, change, progress }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <span className={`flex items-center ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
          {Math.abs(change)}%
        </span>
        <span>del mes pasado</span>
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

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tablero</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Julio 2025
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <TrendingUp className="mr-2 h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Ventas Totales"
          value="$1,248,560"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          change={12.5}
          progress={75}
        />
        <KPICard
          title="Motos Reparadas"
          value="145"
          icon={<BikeIcon className="h-4 w-4 text-muted-foreground" />}
          change={8.2}
          progress={68}
        />
        <KPICard
          title="Nuevos Clientes"
          value="34"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          change={-4.1}
          progress={34}
        />
        <KPICard
          title="Valor Promedio de Venta"
          value="$86,452"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          change={10.3}
          progress={82}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">Resumen</TabsTrigger>
          <TabsTrigger value="sales" className="flex-1 sm:flex-none">Ventas</TabsTrigger>
          <TabsTrigger value="inventory" className="flex-1 sm:flex-none">Inventario</TabsTrigger>
          <TabsTrigger value="customers" className="flex-1 sm:flex-none">Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Ventas</CardTitle>
                <CardDescription>Desempeño mensual de ventas vs objetivo</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="Ventas" />
                      <Bar dataKey="target" fill="hsl(var(--chart-2))" name="Objetivo" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Tipos de Partes</CardTitle>
                <CardDescription>Distribución por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={partTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {partTypeData.map((entry, index) => (
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
              <CardTitle>Desempeño de Ventas</CardTitle>
              <CardDescription>Análisis detallado de ventas mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--chart-2))" />
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
                      data={partTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value} unidades`}
                    >
                      {partTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <CardDescription>Clientes nuevos vs recurrentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" fill="hsl(var(--chart-1))" name="Clientes Nuevos" />
                    <Bar dataKey="returning" fill="hsl(var(--chart-3))" name="Clientes Recurrentes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Leads */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Leads Recientes</CardTitle>
            <CardDescription>Últimas consultas de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{lead.name}</p>
                      <Badge variant={
                        lead.status === "Nuevo" ? "default" :
                        lead.status === "Contactado" ? "secondary" :
                        lead.status === "Interesado" ? "outline" :
                        lead.status === "Prueba de Manejo" ? "destructive" : "default"
                      } className="text-xs">
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{lead.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{lead.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2">
                Ver todos los leads
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Próximas Citas</CardTitle>
            <CardDescription>Programadas para hoy y mañana</CardDescription>
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
              <Button variant="ghost" size="sm" className="w-full mt-2">
                Ver calendario
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Alertas de Inventario</CardTitle>
            <CardDescription>Problemas que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  message={alert.message}
                  priority={alert.priority}
                  onDismiss={() => console.log(`Dismissed: ${alert.message}`)}
                  onResolve={() => console.log(`Resolved: ${alert.message}`)}
                />
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2">
                Ver todas las alertas
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
