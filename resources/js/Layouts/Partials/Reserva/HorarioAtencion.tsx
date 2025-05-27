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
    
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth} className="w-8 h-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-medium text-sm sm:text-base">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </div>
                    <Button variant="outline" size="sm" onClick={nextMonth} className="w-8 h-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm">
                {weekDays.map((day, i) => (
                    <div key={i} className="text-center font-semibold py-2 border-b">
                        {day}
                    </div>
                ))}
                
                {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dayStatus = getDayStatus(day);
                    const exceptions = getDayExceptions(day);
                    
                    const dayClasses = cn(
                        "min-h-[2.5rem] sm:min-h-[4rem] p-1 border rounded-md relative cursor-pointer transition-colors",
                        {
                            "opacity-40 bg-gray-50": !isCurrentMonth,
                            "bg-blue-50": isToday(day),
                            "hover:bg-gray-100": isCurrentMonth && !isToday(day),
                            "ring-2 ring-blue-500": selectedDate && isSameDay(day, selectedDate),
                            "bg-red-50 bg-[repeating-linear-gradient(45deg,#fee2e2,#fee2e2_4px,transparent_4px,transparent_8px)]": dayStatus.type === 'exception',
                        }
                    );
                    
                    return (
                        <div 
                            key={i} 
                            className={dayClasses}
                            onClick={() => handleDayClick(day)}
                        >
                            <div className="flex flex-col h-full">
                                <div className="text-right text-sm font-medium">
                                    {format(day, 'd')}
                                </div>
                                
                                <div className="flex-grow mt-1">
                                    {dayStatus.type !== 'undefined' && (
                                        <div className="flex justify-center">
                                            <Badge className={cn(
                                                "text-xs px-1 py-0 truncate",
                                                {
                                                    "bg-green-100 text-green-800": dayStatus.status === 'open',
                                                    "bg-red-100 text-red-800 font-medium": dayStatus.status === 'closed',
                                                }
                                            )}>
                                                {dayStatus.status === 'open' ? 'Abierto' : 'No Laboral'}
                                            </Badge>
                                        </div>
                                    )}
                                    
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
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-800 mr-2">Abierto</Badge>
                    <span>Horario de atención</span>
                </div>
                <div className="flex items-center">
                    <Badge className="bg-red-100 text-red-800 mr-2">Cerrado</Badge>
                    <span>Sin atención</span>
                </div>
                <div className="flex items-center">
                    <Info className="h-4 w-4 text-blue-600 mr-2" />
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
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                                >
                                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                                    Agregar Horario
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs sm:text-sm">Día</TableHead>
                                            <TableHead className="text-xs sm:text-sm">Horario</TableHead>
                                            <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                                            <TableHead className="text-right text-xs sm:text-sm">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {diasSemana.map((dia) => {
                                            const horario = horariosRecurrentes.find(h => h.dia_semana === dia);
                                            return (
                                                <TableRow key={dia}>
                                                    <TableCell className="font-medium text-xs sm:text-sm">
                                                        {capitalizarPrimeraLetra(dia)}
                                                    </TableCell>
                                                    <TableCell className="text-xs sm:text-sm">
                                                        {horario ? (
                                                            `${horario.hora_inicio} - ${horario.hora_fin}`
                                                        ) : (
                                                            <span className="text-gray-400">No configurado</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn(
                                                            "text-xs",
                                                            horario ? (
                                                                horario.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            ) : "bg-gray-100 text-gray-800"
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
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
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
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                                >
                                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                                    Agregar Excepción
                                </Button>
                            </div>
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Fecha</TableHead>
                                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell">Horario</TableHead>
                                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Estado</TableHead>
                                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">Motivo</TableHead>
                                                    <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {excepciones.map((excepcion) => (
                                                    <TableRow key={excepcion.id}>
                                                        <TableCell className="font-medium text-xs sm:text-sm">
                                                            <div>
                                                                {excepcion.fecha.split('-').reverse().join('/')}
                                                            </div>
                                                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                                                                {excepcion.hora_inicio} - {excepcion.hora_fin}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell">
                                                            {excepcion.hora_inicio} - {excepcion.hora_fin}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={cn(
                                                                "text-xs whitespace-nowrap",
                                                                excepcion.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            )}>
                                                                {excepcion.activo ? "Abierto" : "Cerrado"}
                                                            </Badge>
                                                            {!excepcion.activo && excepcion.motivo && (
                                                                <div className="md:hidden text-xs text-gray-500 mt-1 line-clamp-1">
                                                                    {excepcion.motivo}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-xs sm:text-sm max-w-[200px] hidden md:table-cell">
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
                                                                                className="h-8 w-8 p-0"
                                                                            >
                                                                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <DialogContent className="sm:max-w-[425px] w-[95%] max-h-[90vh] overflow-y-auto">
                    {activeTab === 'semanal' ? (
                        <FormProvider {...recurrenteForm}>
                            <form onSubmit={recurrenteForm.handleSubmit(onSubmitRecurrente)} className="space-y-4 text-xs sm:text-sm">
                                <FormField
                                    control={recurrenteForm.control}
                                    name="dia_semana"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Día de la semana</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un día" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {diasSemana.map((dia) => (
                                                        <SelectItem key={dia} value={dia}>
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
                                                <FormLabel>Hora inicio</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
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
                                                <FormLabel>Hora fin</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
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
                                            <FormLabel>Activo</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit">Guardar</Button>
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    ) : (
                        <FormProvider {...excepcionForm}>
                            <form onSubmit={excepcionForm.handleSubmit(onSubmitExcepcion)} className="space-y-4 text-xs sm:text-sm">
                                <FormField
                                    control={excepcionForm.control}
                                    name="fecha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
                                                <FormLabel>Hora inicio</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
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
                                                <FormLabel>Hora fin</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
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
                                            <FormLabel>Motivo</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Ingrese el motivo de la excepción" />
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
                                            <FormLabel>Activo</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit">Guardar</Button>
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