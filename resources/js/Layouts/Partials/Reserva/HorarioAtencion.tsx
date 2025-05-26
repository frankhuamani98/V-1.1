import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Calendar as CalendarIcon, Clock, AlertCircle, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { router } from "@inertiajs/react";
import { DiaSemana, HorarioRecurrente, HorarioExcepcion, HorarioAtencionProps } from "@/types/horarios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { cn } from "@/lib/utils";

const diasSemana: DiaSemana[] = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const colorCeleste = "bg-blue-50 text-blue-800";

const horarioRecurrenteSchema = z.object({
    dia_semana: z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const),
    hora_inicio: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    hora_fin: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    activo: z.boolean(),
});

const horarioExcepcionSchema = z.object({
    fecha: z.string(),
    hora_inicio: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    hora_fin: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido'),
    activo: z.boolean(),
    motivo: z.string().min(1, 'El motivo es requerido'),
});

type FormRecurrenteType = z.infer<typeof horarioRecurrenteSchema>;
type FormExcepcionType = z.infer<typeof horarioExcepcionSchema>;

const CalendarioHorarios: React.FC<{
    horariosRecurrentes: HorarioRecurrente[];
    excepciones: HorarioExcepcion[];
    onAddHorario: (date: string) => void;
}> = ({ horariosRecurrentes, excepciones, onAddHorario }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [selectedDateInfo, setSelectedDateInfo] = useState<any>(null);
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    let calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const startDay = monthStart.getDay();
    if (startDay !== 1) {
        const daysToAdd = startDay === 0 ? 6 : startDay - 1;
        const newStart = addDays(monthStart, -daysToAdd);
        calendarDays = eachDayOfInterval({ start: newStart, end: monthEnd });
    }
    
    const endDay = monthEnd.getDay();
    if (endDay !== 0) {
        const daysToAdd = 7 - endDay;
        const newEnd = addDays(monthEnd, daysToAdd);
        calendarDays = eachDayOfInterval({ start: calendarDays[0], end: newEnd });
    }
    
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    
    const getDayExceptions = (day: Date) => {
        const formattedDay = format(day, 'yyyy-MM-dd');
        return excepciones.filter((exc: HorarioExcepcion) => exc.fecha === formattedDay);
    };
    
    const getDayRecurrentSchedule = (day: Date) => {
        const dayOfWeek = format(day, 'EEEE', { locale: es }).toLowerCase();
        const dayMap: Record<string, DiaSemana> = {
            'lunes': 'lunes',
            'martes': 'martes',
            'miércoles': 'miercoles',
            'jueves': 'jueves',
            'viernes': 'viernes',
            'sábado': 'sabado',
            'domingo': 'domingo'
        };
        const normalizedDay = dayMap[dayOfWeek];
        return horariosRecurrentes.find((horario: HorarioRecurrente) => 
            horario.dia_semana === normalizedDay
        );
    };
    
    const getDayStatus = (day: Date) => {
        const dayExceptions = getDayExceptions(day);
        if (dayExceptions.length > 0) {
            const activeExceptions = dayExceptions.filter((exc: HorarioExcepcion) => exc.activo);
            if (activeExceptions.length > 0) {
                return { type: 'exception' as const, status: 'open', data: activeExceptions[0] };
            }
            return { type: 'exception' as const, status: 'closed', data: dayExceptions[0] };
        }
        
        const recurrentSchedule = getDayRecurrentSchedule(day);
        if (recurrentSchedule) {
            return { 
                type: 'recurrent' as const, 
                status: recurrentSchedule.activo ? 'open' : 'closed',
                data: recurrentSchedule
            };
        }
        
        return { type: 'undefined' as const, status: 'closed', data: null };
    };
    
    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setSelectedDateInfo(getDayStatus(day));
        setIsInfoDialogOpen(true);
    };
    
    const handleAddSchedule = () => {
        setIsInfoDialogOpen(false);
        if (selectedDate) {
            onAddHorario(format(selectedDate, 'yyyy-MM-dd'));
        }
    };
    
    const weekDays = [
        { label: 'Lun' },
        { label: 'Mar' },
        { label: 'Mié' },
        { label: 'Jue' },
        { label: 'Vie' },
        { label: 'Sáb' },
        { label: 'Dom' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMonth}
                    className="w-10 h-10 rounded-full border border-blue-200 shadow hover:bg-blue-100 transition"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-blue-800 drop-shadow-sm uppercase letter-spacing-wider">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextMonth}
                    className="w-10 h-10 rounded-full border border-blue-200 shadow hover:bg-blue-100 transition"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-xl p-3 sm:p-6">
                <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
                    {weekDays.map((day, i) => (
                        <div
                            key={i}
                            className={`text-center font-bold py-2 border-b border-blue-200 uppercase tracking-wider rounded-t-lg ${colorCeleste}`}
                        >
                            {day.label}
                        </div>
                    ))}
                    {calendarDays.map((day, i) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const dayStatus = getDayStatus(day);
                        const dayClasses = cn(
                            "min-h-[2.5rem] sm:min-h-[4rem] p-1 border rounded-xl relative cursor-pointer transition-all duration-150 flex flex-col items-center justify-between group",
                            colorCeleste,
                            {
                                "opacity-40 bg-gray-50": !isCurrentMonth,
                                "bg-blue-200 ring-2 ring-blue-400": isToday(day),
                                "hover:bg-blue-300": isCurrentMonth && !isToday(day),
                                "ring-2 ring-blue-500": selectedDate && isSameDay(day, selectedDate),
                                "bg-red-50 bg-[repeating-linear-gradient(45deg,#fee2e2,#fee2e2_4px,transparent_4px,transparent_8px)]": dayStatus.type === 'exception',
                                "shadow-md": isToday(day) || (selectedDate && isSameDay(day, selectedDate)),
                            }
                        );
                        return (
                            <div
                                key={i}
                                className={dayClasses}
                                onClick={() => handleDayClick(day)}
                                tabIndex={0}
                                aria-label={`Día ${format(day, 'd')} ${format(day, 'MMMM', { locale: es })}`}
                            >
                                <div className="w-full flex justify-end">
                                    <span className="text-xs font-bold">{format(day, 'd')}</span>
                                </div>
                                <div className="flex-grow flex items-center justify-center mt-1">
                                    {dayStatus.type !== 'undefined' && (
                                        <Badge className={cn(
                                            "text-xs px-2 py-0.5 rounded-full shadow font-semibold transition",
                                            {
                                                "bg-green-100 text-green-800 border border-green-200": dayStatus.status === 'open',
                                                "bg-red-100 text-red-800 border border-red-200": dayStatus.status === 'closed',
                                            }
                                        )}>
                                            {dayStatus.status === 'open' ? 'Abierto' : 'No Laboral'}
                                        </Badge>
                                    )}
                                </div>
                                {dayStatus.type === 'exception' && dayStatus.data && (
                                    <div className="absolute bottom-1 right-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <AlertCircle className="h-3 w-3 text-red-600" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">
                                                        {((dayStatus.data as HorarioExcepcion).motivo) || 'Día no laboral'}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-wrap gap-6 mt-6 text-xs sm:text-sm text-gray-600 justify-center">
                <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full shadow border border-green-200">Abierto</Badge>
                    <span>Horario de atención</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full shadow border border-red-200">Cerrado</Badge>
                    <span>Sin atención</span>
                </div>
                <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span>Horario con excepción</span>
                </div>
            </div>

            <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedDate && format(selectedDate, 'EEEE d', { locale: es })} de {selectedDate && format(selectedDate, 'MMMM yyyy', { locale: es })}
                        </DialogTitle>
                        <DialogDescription>
                            Gestión del horario para esta fecha
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {selectedDateInfo && (
                            <>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">Estado Actual</h3>
                                    <Badge className={cn(
                                        "mb-3",
                                        {
                                            "bg-green-100 text-green-800": selectedDateInfo.status === 'open',
                                            "bg-red-100 text-red-800": selectedDateInfo.status === 'closed',
                                        }
                                    )}>
                                        {selectedDateInfo.status === 'open' ? 'Abierto' : 'No Laboral'}
                                    </Badge>
                                    
                                    {selectedDateInfo.type === 'exception' && (
                                        <div className="space-y-2 mt-3">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <p className="text-sm font-medium text-gray-700">Excepción programada</p>
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-medium">Horario:</span> {selectedDateInfo.data.hora_inicio} - {selectedDateInfo.data.hora_fin}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Motivo:</span> {selectedDateInfo.data.motivo || "No especificado"}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {selectedDateInfo.type === 'recurrent' && (
                                        <div className="space-y-2 mt-3">
                                            <p className="text-sm font-medium text-gray-700">Horario regular</p>
                                            <p className="text-sm">
                                                <span className="font-medium">Horario:</span> {selectedDateInfo.data.hora_inicio} - {selectedDateInfo.data.hora_fin}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {selectedDateInfo.type === 'undefined' && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            No hay horario definido para este día.
                                        </p>
                                    )}
                                </div>
                                
                                <div className="border-t pt-4">
                                    <Button onClick={handleAddSchedule} className="w-full">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        {selectedDateInfo.type === 'exception' 
                                            ? 'Modificar excepción' 
                                            : 'Programar excepción'}
                                    </Button>
                                    {selectedDateInfo.type === 'exception' && (
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Puede modificar o eliminar esta excepción
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const HorarioAtencion = ({ horariosRecurrentes, excepciones }: HorarioAtencionProps) => {
    const [activeTab, setActiveTab] = useState("calendario");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHorario, setEditingHorario] = useState<HorarioRecurrente | HorarioExcepcion | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [horarioToDelete, setHorarioToDelete] = useState<HorarioRecurrente | HorarioExcepcion | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const recurrenteForm = useForm<FormRecurrenteType>({
        resolver: zodResolver(horarioRecurrenteSchema),
        defaultValues: {
            dia_semana: 'lunes',
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true,
        },
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const excepcionForm = useForm<FormExcepcionType>({
        resolver: zodResolver(horarioExcepcionSchema),
        defaultValues: {
            fecha: formattedDate,
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true,
            motivo: '',
        },
    });

    const capitalizarPrimeraLetra = (texto: string) => {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    const handleCreateHorario = () => {
        setEditingHorario(null);
        setIsDialogOpen(true);
    };

    const handleEditHorario = (horario: HorarioRecurrente | HorarioExcepcion) => {
        setEditingHorario(horario);
        if (horario.tipo === 'recurrente') {
            recurrenteForm.reset({
                dia_semana: horario.dia_semana,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                activo: horario.activo,
            });
        } else {
            excepcionForm.reset({
                fecha: horario.fecha,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                activo: horario.activo,
                motivo: horario.motivo || '',
            });
        }
        setIsDialogOpen(true);
    };

    const handleDeleteHorario = (horario: HorarioRecurrente | HorarioExcepcion) => {
        setHorarioToDelete(horario);
        setIsDeleteDialogOpen(true);
    };

    const onSubmitRecurrente = (data: FormRecurrenteType) => {
        if (editingHorario) {
            router.put(route('dashboard.reservas.horario.recurrentes.update', editingHorario.id), {
                ...data,
                tipo: 'recurrente',
            });
        } else {
            router.post(route('dashboard.reservas.horario.recurrentes.store'), {
                ...data,
                tipo: 'recurrente',
            });
        }
        setIsDialogOpen(false);
    };

    const onSubmitExcepcion = (data: FormExcepcionType) => {
        const fechaFormateada = data.fecha;
        
        if (editingHorario && editingHorario.id) {
            router.put(route('dashboard.reservas.horario.excepciones.update', editingHorario.id), {
                ...data,
                fecha: fechaFormateada,
                tipo: 'excepcion',
            });
        } else {
            router.post(route('dashboard.reservas.horario.excepciones.store'), {
                ...data,
                fecha: fechaFormateada,
                tipo: 'excepcion',
            });
        }
        setIsDialogOpen(false);
    };

    const confirmDelete = () => {
        if (horarioToDelete) {
            const routeName = horarioToDelete.tipo === 'recurrente'
                ? 'dashboard.reservas.horario.recurrentes.destroy'
                : 'dashboard.reservas.horario.excepciones.destroy';
            
            router.delete(route(routeName, { horario: horarioToDelete.id }));
        }
        setIsDeleteDialogOpen(false);
        setHorarioToDelete(null);
    };

    const handleAddHorarioFromCalendar = (date: string) => {
        const excepcionExistente = excepciones.find(exc => exc.fecha === date);
      
        if (excepcionExistente) {
          setEditingHorario(excepcionExistente);
          excepcionForm.reset({
            fecha: excepcionExistente.fecha,
            hora_inicio: excepcionExistente.hora_inicio,
            hora_fin: excepcionExistente.hora_fin,
            activo: excepcionExistente.activo,
            motivo: excepcionExistente.motivo || '',
          });
        } else {
          setEditingHorario(null);
          excepcionForm.reset({
            fecha: date,
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true,
            motivo: '',
          });
        }
      
        setActiveTab("excepciones");
        setIsDialogOpen(true);
      };

    // Componente VisuallyHidden para accesibilidad
    const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
        <span style={{
            border: 0,
            clip: "rect(0 0 0 0)",
            height: "1px",
            margin: "-1px",
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            width: "1px",
            whiteSpace: "nowrap"
        }}>{children}</span>
    );

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-3 sm:px-6 py-4 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full hidden sm:block">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-base sm:text-xl font-bold text-gray-800">
                                    Horarios de Atención
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm text-gray-500">
                                    Gestiona los horarios semanales y excepciones
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-2 sm:p-6">
                    <Tabs defaultValue="calendario" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-4 grid grid-cols-3 h-auto gap-2">
                            <TabsTrigger value="calendario" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span className="text-xs sm:text-sm">Calendario</span>
                            </TabsTrigger>
                            <TabsTrigger value="semanal" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs sm:text-sm">Horario</span>
                            </TabsTrigger>
                            <TabsTrigger value="excepciones" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs sm:text-sm">Excepciones</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="calendario">
                            <div className="overflow-x-auto">
                                <CalendarioHorarios 
                                    horariosRecurrentes={horariosRecurrentes}
                                    excepciones={excepciones}
                                    onAddHorario={handleAddHorarioFromCalendar}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="semanal">
                            <div className="flex justify-end mb-4">
                                <Button 
                                    onClick={handleCreateHorario}
                                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white text-xs sm:text-sm rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 font-bold transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Agregar Horario</span>
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <Table className="rounded-2xl overflow-hidden border border-blue-200 shadow-lg bg-blue-50/60">
                                    <TableHeader>
                                        <TableRow className="bg-blue-100/80">
                                            <TableHead className="text-xs sm:text-sm text-blue-800 font-bold">Día</TableHead>
                                            <TableHead className="text-xs sm:text-sm text-blue-800 font-bold">Horario</TableHead>
                                            <TableHead className="text-xs sm:text-sm text-blue-800 font-bold">Estado</TableHead>
                                            <TableHead className="text-right text-xs sm:text-sm text-blue-800 font-bold">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {diasSemana.map((dia) => {
                                            const horario = horariosRecurrentes.find(h => h.dia_semana === dia);
                                            return (
                                                <TableRow key={dia} className="hover:bg-blue-100/60 transition">
                                                    <TableCell className="font-semibold text-xs sm:text-sm text-blue-900">
                                                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold shadow">
                                                            {capitalizarPrimeraLetra(dia)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-xs sm:text-sm text-blue-900">
                                                        {horario ? (
                                                            <span className="font-mono">{horario.hora_inicio} - {horario.hora_fin}</span>
                                                        ) : (
                                                            <span className="text-gray-400">No configurado</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn(
                                                            "text-xs px-2 py-0.5 rounded-full font-semibold",
                                                            horario ? (
                                                                horario.activo ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
                                                            ) : "bg-gray-100 text-gray-800 border border-gray-200"
                                                        )}>
                                                            {horario ? (horario.activo ? "Abierto" : "Cerrado") : "Sin definir"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {horario && (
                                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEditHorario(horario)}
                                                                    className="h-8 w-8 p-0 border-blue-300 hover:border-blue-500"
                                                                >
                                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteHorario(horario)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="excepciones">
                            <div className="flex justify-end mb-4">
                                <Button 
                                    onClick={() => {
                                        setEditingHorario(null);
                                        const today = new Date();
                                        const year = today.getFullYear();
                                        const month = String(today.getMonth() + 1).padStart(2, '0');
                                        const day = String(today.getDate()).padStart(2, '0');
                                        const formattedDate = `${year}-${month}-${day}`;
                                        
                                        excepcionForm.reset({
                                            fecha: formattedDate,
                                            hora_inicio: '09:00',
                                            hora_fin: '18:00',
                                            activo: true,
                                            motivo: '',
                                        });
                                        setIsDialogOpen(true);
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white text-xs sm:text-sm rounded-xl shadow-lg font-bold px-4 py-2 flex items-center gap-2 transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                                    Agregar Excepción
                                </Button>
                            </div>
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="border rounded-2xl overflow-hidden shadow-lg bg-blue-50/60 border-blue-200">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-blue-100/80">
                                                    <TableHead className="text-xs sm:text-sm text-blue-800 font-bold whitespace-nowrap">Fecha</TableHead>
                                                    <TableHead className="text-xs sm:text-sm text-blue-800 font-bold whitespace-nowrap hidden sm:table-cell">Horario</TableHead>
                                                    <TableHead className="text-xs sm:text-sm text-blue-800 font-bold whitespace-nowrap">Estado</TableHead>
                                                    <TableHead className="text-xs sm:text-sm text-blue-800 font-bold whitespace-nowrap hidden md:table-cell">Motivo</TableHead>
                                                    <TableHead className="text-right text-xs sm:text-sm text-blue-800 font-bold whitespace-nowrap">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {excepciones.map((excepcion) => (
                                                    <TableRow key={excepcion.id} className="hover:bg-blue-100/60 transition">
                                                        <TableCell className="font-semibold text-xs sm:text-sm text-blue-900">
                                                            <div>
                                                                {excepcion.fecha.split('-').reverse().join('/')}
                                                            </div>
                                                            <div className="sm:hidden text-xs text-blue-700 mt-1">
                                                                {excepcion.hora_inicio} - {excepcion.hora_fin}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell text-blue-900">
                                                            {excepcion.hora_inicio} - {excepcion.hora_fin}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={cn(
                                                                "text-xs whitespace-nowrap px-2 py-0.5 rounded-full font-semibold",
                                                                excepcion.activo ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
                                                            )}>
                                                                {excepcion.activo ? "Abierto" : "Cerrado"}
                                                            </Badge>
                                                            {!excepcion.activo && excepcion.motivo && (
                                                                <div className="md:hidden text-xs text-blue-700 mt-1 line-clamp-1">
                                                                    {excepcion.motivo}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-xs sm:text-sm max-w-[200px] hidden md:table-cell text-blue-900">
                                                            <div className="truncate" title={excepcion.motivo || "-"}>
                                                                {excepcion.motivo || "-"}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-1 sm:gap-2">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => handleEditHorario(excepcion)}
                                                                                className="h-8 w-8 p-0 border-blue-300 hover:border-blue-500"
                                                                            >
                                                                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Editar excepción</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() => handleDeleteHorario(excepcion)}
                                                                                className="h-8 w-8 p-0"
                                                                            >
                                                                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Eliminar excepción</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="sm:max-w-[425px] w-[95%] max-h-[90vh] overflow-y-auto 
                    bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 
                    shadow-2xl rounded-3xl border-2 border-blue-300 relative
                    ring-4 ring-blue-100"
                    aria-describedby="horario-dialog-desc"
                    style={{
                        top: "10vh", // Hace que el modal se muestre más arriba
                        margin: "0 auto",
                        position: "fixed",
                        left: "50%",
                        transform: "translate(-50%, 0)", // Centrado horizontal, arriba vertical
                        zIndex: 50
                    }}
                >
                    {/* Botón de cerrar visible y animado */}
                    <button
                        onClick={() => setIsDialogOpen(false)}
                        className="absolute top-3 right-3 z-10 rounded-full bg-blue-200 hover:bg-blue-400 p-1 transition-all duration-200 shadow-lg border border-blue-400"
                        aria-label="Cerrar"
                        type="button"
                    >
                        <svg width="22" height="22" viewBox="0 0 20 20" className="text-blue-700 hover:text-blue-900 transition-colors duration-200">
                            <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                            <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>
                    {/* DialogTitle oculto para accesibilidad */}
                    <VisuallyHidden>
                        <DialogTitle>
                            {activeTab === 'semanal'
                                ? 'Editar horario semanal'
                                : 'Editar excepción'}
                        </DialogTitle>
                        <DialogDescription id="horario-dialog-desc">
                            {activeTab === 'semanal'
                                ? 'Formulario para crear o editar un horario semanal de atención'
                                : 'Formulario para crear o editar una excepción de horario'}
                        </DialogDescription>
                    </VisuallyHidden>
                    {activeTab === 'semanal' ? (
                        <FormProvider {...recurrenteForm}>
                            <form onSubmit={recurrenteForm.handleSubmit(onSubmitRecurrente)} className="space-y-7 text-xs sm:text-sm">
                                <div className="rounded-2xl bg-blue-50/80 shadow-lg p-5 space-y-5 border border-blue-200">
                                    <FormField
                                        control={recurrenteForm.control}
                                        name="dia_semana"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-blue-700">Día de la semana</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-lg border-blue-300 shadow focus:ring-2 focus:ring-blue-400 bg-blue-100/70 text-blue-900 font-semibold">
                                                            <SelectValue placeholder="Selecciona un día" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-lg shadow-lg bg-blue-50 border-blue-200">
                                                        {diasSemana.map((dia) => (
                                                            <SelectItem key={dia} value={dia} className="text-blue-800 hover:bg-blue-200">
                                                                {capitalizarPrimeraLetra(dia)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={recurrenteForm.control}
                                            name="hora_inicio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-blue-700">Hora inicio</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} className="rounded-lg border-blue-300 shadow bg-blue-100/70 text-blue-900 font-semibold focus:ring-2 focus:ring-blue-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={recurrenteForm.control}
                                            name="hora_fin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-blue-700">Hora fin</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} className="rounded-lg border-blue-300 shadow bg-blue-100/70 text-blue-900 font-semibold focus:ring-2 focus:ring-blue-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={recurrenteForm.control}
                                        name="activo"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between">
                                                <FormLabel className="font-bold text-blue-700">Activo</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-blue-600"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-xl shadow-lg font-bold tracking-wide transition-all duration-200">
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    ) : (
                        <FormProvider {...excepcionForm}>
                            <form onSubmit={excepcionForm.handleSubmit(onSubmitExcepcion)} className="space-y-7 text-xs sm:text-sm">
                                <div className="rounded-2xl bg-blue-50/80 shadow-lg p-5 space-y-5 border border-blue-200">
                                    <FormField
                                        control={excepcionForm.control}
                                        name="fecha"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-blue-700">Fecha</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="rounded-lg border-blue-300 shadow bg-blue-100/70 text-blue-900 font-semibold focus:ring-2 focus:ring-blue-400" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={excepcionForm.control}
                                            name="hora_inicio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-blue-700">Hora inicio</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} className="rounded-lg border-blue-300 shadow bg-blue-100/70 text-blue-900 font-semibold focus:ring-2 focus:ring-blue-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        
                                        <FormField
                                            control={excepcionForm.control}
                                            name="hora_fin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-blue-700">Hora fin</FormLabel>
                                                    <FormControl>
                                                        <Input type="time" {...field} className="rounded-lg border-blue-300 shadow bg-blue-100/70 text-blue-900 font-semibold focus:ring-2 focus:ring-blue-400" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={excepcionForm.control}
                                        name="motivo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-blue-700">Motivo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Ingrese el motivo de la excepción" className="rounded-lg border-blue-300 shadow bg-blue-100/70 text-blue-900 font-semibold focus:ring-2 focus:ring-blue-400" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={excepcionForm.control}
                                        name="activo"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between">
                                                <FormLabel className="font-bold text-blue-700">Activo</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-blue-600"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-xl shadow-lg font-bold tracking-wide transition-all duration-200">
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="w-[95%] sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                            ¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="text-xs sm:text-sm"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="text-xs sm:text-sm"
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HorarioAtencion;