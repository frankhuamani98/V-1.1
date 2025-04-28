export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export interface HorarioRecurrente {
    id: number;
    tipo: 'recurrente';
    dia_semana: DiaSemana;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
}

export interface HorarioExcepcion {
    id: number;
    tipo: 'excepcion';
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
    motivo?: string;
}

export interface HorarioAtencionProps {
    horariosRecurrentes: HorarioRecurrente[];
    excepciones: HorarioExcepcion[];
}