import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import NavigationMenu from '@/Components/NavigationMenu';
import axios from "axios";

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
  
  // Initialize form data
  const { data, setData, post, put, processing, errors, reset } = useForm({
    moto_id: reserva?.moto_id?.toString() || "",
    placa: reserva?.placa || "",
    servicio_id: reserva?.servicio_id?.toString() || "",
    fecha: reserva?.fecha || "",
    hora: reserva?.hora || "",
    detalles: reserva?.detalles || "",
    horario_id: reserva?.horario_id?.toString() || "",
  });

  // Set initial values for selectedYear and selectedBrand when editing
  useEffect(() => {
    if (isEditing && reserva?.moto) {
      setSelectedYear(reserva.moto.año.toString());
      setSelectedBrand(reserva.moto.marca);
    }
  }, [isEditing, reserva]);

  // Update filtered models when brand or year changes
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

  // Limpiar los mensajes después de 5 segundos
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Fetch available hours when date changes or when editing and there's an initial date
  useEffect(() => {
    const dateToUse = selectedDate || reserva?.fecha;
    if (dateToUse) {
      fetchAvailableHours(dateToUse);
    }
  }, [selectedDate, isEditing, reserva?.fecha]);

  const fetchAvailableHours = async (date: string) => {
    setLoadingHours(true);
    setDateErrorMessage("");
    setData("horario_id", ""); // Limpiar horario_id al cambiar la fecha
    
    try {
      const response = await axios.get<HorasDisponiblesResponse>(route('api.reservas.horas-disponibles'), {
        params: { fecha: date }
      });
      
      if (response.data.disponible) {
        setAvailableHours(response.data.horas);
        setHorarioId(response.data.horario_id);
        setData("horario_id", response.data.horario_id.toString()); // Establecer horario_id cuando se obtienen las horas disponibles
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
    
    // Limpiar mensajes de error anteriores
    setErrorMessage("");
    
    // Validar campos requeridos con mensajes específicos
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

    // Validaciones específicas adicionales
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

    // Proceder con el envío del formulario
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
    setData("moto_id", ""); // Clear selected moto when brand changes
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setData("moto_id", ""); // Clear selected moto when year changes
  };

  const handleModelSelect = (motoId: string) => {
    setData("moto_id", motoId);
    const selectedMoto = motoData.models.find(m => m.id.toString() === motoId);
  };

  return (
    <>
      <Head title={isEditing ? "Editar Reserva" : "Agendar Servicio"} />
      <NavigationMenu /> 
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              {isEditing ? "Editar Reserva" : "Agendar Servicio para tu Moto"}
            </h1>
            
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div>
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div>
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selección de Moto */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Año del Modelo
                    </label>
                    <select
                      className={`mt-1 block w-full border ${errors.moto_id ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      required
                    >
                      <option value="">Seleccione un año</option>
                      {motoData.years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marca
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedBrand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      required
                    >
                      <option value="">Seleccione una marca</option>
                      {motoData.brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Modelo
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        <option key={moto.id} value={moto.id}>
                          {moto.modelo}
                        </option>
                      ))}
                    </select>
                    {errors.moto_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.moto_id}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
                      Placa
                    </label>
                    <input
                      type="text"
                      id="placa"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={data.placa}
                      onChange={(e) => setData("placa", e.target.value)}
                      required
                    />
                    {errors.placa && (
                      <p className="mt-1 text-sm text-red-600">{errors.placa}</p>
                    )}
                  </div>
                </div>

                {/* Servicio y Detalles */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="servicio_id" className="block text-sm font-medium text-gray-700">
                      Servicio
                    </label>
                    <select
                      id="servicio_id"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={data.servicio_id}
                      onChange={(e) => setData("servicio_id", e.target.value)}
                      required
                    >
                      <option value="">Seleccione un servicio</option>
                      {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.servicio_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.servicio_id}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="detalles" className="block text-sm font-medium text-gray-700">
                      Detalles adicionales (opcional)
                    </label>
                    <textarea
                      id="detalles"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={data.detalles}
                      onChange={(e) => setData("detalles", e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Fecha y Hora */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="fecha"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={data.fecha}
                      onChange={(e) => {
                        setData("fecha", e.target.value);
                        setSelectedDate(e.target.value);
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    {errors.fecha && (
                      <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>
                    )}
                    {dateErrorMessage && (
                      <p className="mt-1 text-sm text-red-600">{dateErrorMessage}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                      Hora
                    </label>
                    <select
                      id="hora"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                    {errors.hora && (
                      <p className="mt-1 text-sm text-red-600">{errors.hora}</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Horarios de Atención</h3>
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
                        <p key={dia} className="text-sm text-gray-600">
                          <span className="font-medium">{dia}:</span> {horario}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                {isEditing && (
                  <a
                    href={route('reservas.index')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </a>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={processing || Boolean(availableHours.length === 0 && selectedDate)}
                >
                  {processing ? "Procesando..." : isEditing ? "Guardar Cambios" : "Agendar Cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}