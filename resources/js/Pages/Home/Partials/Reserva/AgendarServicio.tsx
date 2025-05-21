import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  Bike,
  BadgeInfo,
  Tag,
  Hash,
  Wrench,
  ChevronLeft,
  Save,
  ClipboardList,
} from "lucide-react";
import ReservaNavigation from "@/Components/ReservaNavigation";
import Header from "@/Pages/Home/Header";
import Footer from "@/Pages/Home/Footer";

interface Moto {
  id: number;
  año: number;
  marca: string;
  modelo: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Reserva {
  id?: number;
  moto_id?: number;
  placa: string;
  servicio_id: number;
  fecha: string;
  hora: string;
  detalles: string | null;
  estado?: string;
  horario_id?: number;
  moto?: {
    id: number;
    año: number;
    marca: string;
    modelo: string;
  };
}

interface Props {
  servicios: Servicio[];
  horarios: {
    dias: string[];
    horarios: Record<string, string>;
    franjas: string[];
  };
  motoData: {
    years: number[];
    brands: string[];
    models: Array<{ id: number; año: number; marca: string; modelo: string; }>;
  };
  reserva?: Reserva;
  flash?: {
    success?: string;
    error?: string;
  };
  isEditing?: boolean;
}

interface HorasDisponiblesResponse {
  disponible: boolean;
  motivo?: string;
  horas: string[];
  fecha: string;
  horario_id: number;
}

interface FormData {
  moto_id: string;
  placa: string;
  servicio_id: string;
  fecha: string;
  hora: string;
  detalles: string;
  horario_id: string;
}

interface FormErrors {
  [key: string]: string[] | string | undefined;
}

export default function AgendarServicio({ servicios, horarios, motoData, reserva, flash, isEditing = false }: Props) {
  const [selectedDate, setSelectedDate] = useState(reserva?.fecha || "");
  const [successMessage, setSuccessMessage] = useState(flash?.success || "");
  const [errorMessage, setErrorMessage] = useState(flash?.error || "");
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [horarioId, setHorarioId] = useState<number | null>(null);
  const [loadingHours, setLoadingHours] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredModels, setFilteredModels] = useState(motoData.models);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    moto_id: reserva?.moto_id?.toString() || "",
    placa: reserva?.placa || "",
    servicio_id: reserva?.servicio_id?.toString() || "",
    fecha: reserva?.fecha || "",
    hora: reserva?.hora || "",
    detalles: reserva?.detalles || "",
    horario_id: reserva?.horario_id?.toString() || "",
  });

  useEffect(() => {
    if (isEditing && reserva?.moto) {
      setSelectedYear(reserva.moto.año.toString());
      setSelectedBrand(reserva.moto.marca);
    }
  }, [isEditing, reserva]);

  useEffect(() => {
    if (selectedBrand) {
      setFilteredModels(motoData.models.filter(m => 
        m.marca === selectedBrand && 
        (!selectedYear || m.año.toString() === selectedYear)
      ));
    } else {
      setFilteredModels([]);
    }
  }, [selectedBrand, selectedYear, motoData.models]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const dateToUse = selectedDate || reserva?.fecha;
    if (dateToUse) {
      fetchAvailableHours(dateToUse);
    }
  }, [selectedDate, isEditing, reserva?.fecha]);

  const fetchAvailableHours = async (date: string) => {
    setLoadingHours(true);
    setDateErrorMessage("");
    setData("horario_id", "");
    
    try {
      const response = await axios.get<HorasDisponiblesResponse>(route('api.reservas.horas-disponibles'), {
        params: { fecha: date }
      });
      
      if (response.data.disponible) {
        setAvailableHours(response.data.horas);
        setHorarioId(response.data.horario_id);
        setData("horario_id", response.data.horario_id.toString());
        if (isEditing && data.hora && !response.data.horas.includes(data.hora)) {
          setData("hora", "");
        }
      } else {
        setAvailableHours([]);
        setDateErrorMessage(response.data.motivo || "No hay horarios disponibles para esta fecha");
        setData("hora", "");
      }
    } catch (error) {
      console.error("Error fetching available hours:", error);
      setDateErrorMessage("Error al cargar horarios disponibles");
      setAvailableHours([]);
    } finally {
      setLoadingHours(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const validations = {
      moto_id: "Por favor seleccione una motocicleta",
      placa: "Por favor ingrese la placa de la motocicleta",
      servicio_id: "Por favor seleccione un servicio",
      fecha: "Por favor seleccione una fecha",
      hora: "Por favor seleccione una hora disponible",
      horario_id: "Por favor seleccione una fecha y hora válidas"
    };

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.entries(validations).forEach(([field, message]) => {
      if (!data[field as keyof typeof data]) {
        newErrors[field] = message;
        hasErrors = true;
      }
    });

    if (data.placa && data.placa.length > 10) {
      newErrors.placa = "La placa no puede tener más de 10 caracteres";
      hasErrors = true;
    }

    if (data.fecha && new Date(data.fecha) < new Date()) {
      newErrors.fecha = "La fecha no puede ser anterior a hoy";
      hasErrors = true;
    }

    if (!data.horario_id && selectedDate) {
      newErrors.horario_id = "No se pudo determinar el horario para la fecha seleccionada";
      hasErrors = true;
    }

    if (hasErrors) {
      const errorMessages = Object.values(newErrors).join('\n');
      setErrorMessage("Por favor corrija los siguientes errores:\n" + errorMessages);
      return;
    }

    if (isEditing && reserva?.id) {
      put(route("reservas.update", reserva.id), {
        onSuccess: () => {
          setSuccessMessage("Reserva actualizada exitosamente.");
        },
        onError: (errors: FormErrors) => {
          const errorMessages: string[] = [];
          Object.entries(errors).forEach(([field, message]) => {
            const fieldName = field === 'moto_id' ? 'motocicleta' :
                            field === 'servicio_id' ? 'servicio' :
                            field === 'placa' ? 'placa' :
                            field === 'fecha' ? 'fecha' :
                            field === 'hora' ? 'hora' :
                            field === 'horario_id' ? 'horario' : field;
            
            if (typeof message === 'string') {
              errorMessages.push(`${fieldName}: ${message}`);
            } else if (Array.isArray(message) && message.length > 0) {
              errorMessages.push(`${fieldName}: ${message[0]}`);
            }
          });
          setErrorMessage("Por favor corrija los siguientes errores:\n" + errorMessages.join('\n'));
        }
      });
    } else {
      post(route("reservas.store"), {
        onSuccess: () => {
          reset();
          setSelectedDate("");
          setAvailableHours([]);
          setSuccessMessage("Reserva creada exitosamente. Será redirigido a sus citas.");
        },
        onError: (errors: FormErrors) => {
          const errorMessages: string[] = [];
          Object.entries(errors).forEach(([field, message]) => {
            const fieldName = field === 'moto_id' ? 'motocicleta' :
                            field === 'servicio_id' ? 'servicio' :
                            field === 'placa' ? 'placa' :
                            field === 'fecha' ? 'fecha' :
                            field === 'hora' ? 'hora' :
                            field === 'horario_id' ? 'horario' : field;
            
            if (typeof message === 'string') {
              errorMessages.push(`${fieldName}: ${message}`);
            } else if (Array.isArray(message) && message.length > 0) {
              errorMessages.push(`${fieldName}: ${message[0]}`);
            }
          });
          setErrorMessage("Por favor corrija los siguientes errores:\n" + errorMessages.join('\n'));
        }
      });
    }
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setData("moto_id", "");
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setData("moto_id", "");
  };

  const handleModelSelect = (motoId: string) => {
    setData("moto_id", motoId);
    const selectedMoto = motoData.models.find(m => m.id.toString() === motoId);
  };

  return (
    <>
      <Head title={isEditing ? "Editar Reserva" : "Agendar Servicio"} />
      <Header />
      <ReservaNavigation currentPage="Agendar Servicio" />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-0 px-0">
        <div className="w-[90%] bg-white shadow-xl rounded-2xl border border-blue-200 flex flex-col justify-center mx-auto my-8">
          <div className="p-4 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-100 to-indigo-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Editar Reserva" : "Agendar Servicio para tu Moto"}
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-2">Completa los datos para reservar tu cita</p>
          </div>
          <div className="flex-1 flex flex-col justify-center p-4 sm:p-8">
            {successMessage && (
              <div className="mb-6 flex items-center gap-2 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm">
                <CheckCircle className="text-green-500 h-6 w-6" />
                <span className="text-base text-green-700">{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 flex items-center gap-2 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
                <AlertCircle className="text-red-500 h-6 w-6" />
                <span className="text-base text-red-700">{errorMessage}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div className="space-y-6">
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <BadgeInfo className="h-5 w-5 text-blue-400" />
                      Año del Modelo
                    </label>
                    <select
                      className={`mt-1 block w-full border ${errors.moto_id ? 'border-red-300' : 'border-gray-300'} rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg`}
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      required
                    >
                      <option value="">Seleccione un año</option>
                      {motoData.years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Bike className="h-5 w-5 text-blue-400" />
                      Marca
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                      value={selectedBrand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      required
                    >
                      <option value="">Seleccione una marca</option>
                      {motoData.brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-blue-400" />
                      Modelo
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                      value={data.moto_id}
                      onChange={(e) => handleModelSelect(e.target.value)}
                      required
                      disabled={!selectedBrand || !selectedYear}
                    >
                      <option value="">
                        {!selectedBrand || !selectedYear
                          ? "Primero seleccione año y marca"
                          : "Seleccione un modelo"}
                      </option>
                      {filteredModels.map((moto) => (
                        <option key={moto.id} value={moto.id}>{moto.modelo}</option>
                      ))}
                    </select>
                    {errors.moto_id && (
                      <p className="mt-1 text-base text-red-600">{errors.moto_id}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="placa" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Hash className="h-5 w-5 text-blue-400" />
                      Placa
                    </label>
                    <input
                      type="text"
                      id="placa"
                      className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                      value={data.placa}
                      onChange={(e) => setData("placa", e.target.value)}
                      required
                      maxLength={10}
                      placeholder="Ej: ABC-123"
                    />
                    {errors.placa && (
                      <p className="mt-1 text-base text-red-600">{errors.placa}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="servicio_id" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-400" />
                      Servicio
                    </label>
                    <select
                      id="servicio_id"
                      className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                      value={data.servicio_id}
                      onChange={(e) => setData("servicio_id", e.target.value)}
                      required
                    >
                      <option value="">Seleccione un servicio</option>
                      {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>{servicio.nombre}</option>
                      ))}
                    </select>
                    {errors.servicio_id && (
                      <p className="mt-1 text-base text-red-600">{errors.servicio_id}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="detalles" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      ¿Qué problema presenta tu moto?
                    </label>
                    <div className="relative">
                      <textarea
                        id="detalles"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                        value={data.detalles}
                        onChange={(e) => setData("detalles", e.target.value)}
                        placeholder="Describe el problema o servicio requerido"
                      />
                      <AlertCircle className="absolute right-4 top-4 h-5 w-5 text-blue-200 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="fecha" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-blue-400" />
                      Fecha
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="fecha"
                        className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                        value={data.fecha}
                        onChange={(e) => {
                          setData("fecha", e.target.value);
                          setSelectedDate(e.target.value);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <CalendarDays className="absolute right-4 top-4 h-5 w-5 text-blue-200 pointer-events-none" />
                    </div>
                    {errors.fecha && (
                      <p className="mt-1 text-base text-red-600">{errors.fecha}</p>
                    )}
                    {dateErrorMessage && (
                      <p className="mt-1 text-base text-red-600">{dateErrorMessage}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="hora" className="block text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      Hora
                    </label>
                    <div className="relative">
                      <select
                        id="hora"
                        className="mt-1 block w-full border border-gray-300 rounded-2xl shadow-sm py-4 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                        value={data.hora}
                        onChange={(e) => setData("hora", e.target.value)}
                        required
                        disabled={!selectedDate || loadingHours || availableHours.length === 0}
                      >
                        <option value="">
                          {loadingHours
                            ? "Cargando horarios..."
                            : availableHours.length === 0 && selectedDate
                            ? "No hay horarios disponibles"
                            : "Seleccione una hora"}
                        </option>
                        {availableHours.map((hora) => (
                          <option key={hora} value={hora}>{hora}</option>
                        ))}
                      </select>
                      <Clock className="absolute right-4 top-4 h-5 w-5 text-blue-200 pointer-events-none" />
                    </div>
                    {errors.hora && (
                      <p className="mt-1 text-base text-red-600">{errors.hora}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl mt-8 mb-4 border border-blue-100 shadow-sm">
                <h3 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Horarios de Atención
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-blue-200 rounded-lg p-2 bg-white">
                  {Object.entries({
                    'Lunes': horarios.horarios['Lunes'] || '',
                    'Martes': horarios.horarios['Martes'] || '',
                    'Miércoles': horarios.horarios['Miércoles'] || '',
                    'Jueves': horarios.horarios['Jueves'] || '',
                    'Viernes': horarios.horarios['Viernes'] || '',
                    'Sábado': horarios.horarios['Sábado'] || '',
                    'Domingo': horarios.horarios['Domingo'] || ''
                  })
                    .filter(([_, horario]) => horario !== '')
                    .map(([dia, horario]) => (
                      <div key={dia} className="text-xs text-blue-900 flex items-center gap-2">
                        <Clock className="h-3 w-3 text-blue-300" />
                        <span className="font-medium">{dia}:</span> {horario}
                      </div>
                    ))}
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                {isEditing && (
                  <a
                    href={route('reservas.index')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Cancelar
                  </a>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 gap-2"
                  disabled={processing || Boolean(availableHours.length === 0 && selectedDate)}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : isEditing ? (
                    <>
                      <Save className="h-5 w-5" />
                      Guardar Cambios
                    </>
                  ) : (
                    <>
                      <ClipboardList className="h-5 w-5" />
                      Agendar Cita
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}