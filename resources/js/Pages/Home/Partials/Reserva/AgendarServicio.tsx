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

export default function AgendarServicio({ servicios, horarios, motoData, reserva, flash, isEditing = false }: Props) {
  const [selectedDate, setSelectedDate] = useState(reserva?.fecha || "");
  const [successMessage, setSuccessMessage] = useState(flash?.success || "");
  const [errorMessage, setErrorMessage] = useState(flash?.error || "");
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [horarioId, setHorarioId] = useState<number | null>(null);
  const [loadingHours, setLoadingHours] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [selectedYear, setSelectedYear] = useState(reserva?.moto?.año?.toString() || "");
  const [selectedBrand, setSelectedBrand] = useState(reserva?.moto?.marca || "");
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

  // Update filtered models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      setFilteredModels(motoData.models.filter(m => 
        m.marca === selectedBrand && 
        (!selectedYear || m.año.toString() === selectedYear)
      ));
    } else {
      setFilteredModels([]);
    }
  }, [selectedBrand, selectedYear]);

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

  // Fetch available hours when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableHours(selectedDate);
    } else {
      setAvailableHours([]);
      setHorarioId(null);
      setDateErrorMessage("");
    }
  }, [selectedDate]);

  const fetchAvailableHours = async (date: string) => {
    setLoadingHours(true);
    setDateErrorMessage("");
    
    try {
      const response = await axios.get<HorasDisponiblesResponse>(route('api.reservas.horas-disponibles'), {
        params: { fecha: date }
      });
      
      if (response.data.disponible) {
        setAvailableHours(response.data.horas);
        setHorarioId(response.data.horario_id);
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
    
    if (horarioId) {
      setData("horario_id", horarioId.toString());
    }
    
    if (!data.moto_id) {
      setErrorMessage("Por favor seleccione una motocicleta");
      return;
    }
    
    if (isEditing && reserva?.id) {
      put(route("reservas.update", reserva.id), {
        onSuccess: () => {
          setSuccessMessage("Reserva actualizada exitosamente.");
        },
        onError: () => {
          setErrorMessage("Hubo un problema al actualizar la reserva. Por favor revise los campos.");
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
        onError: () => {
          setErrorMessage("Hubo un problema al crear la reserva. Por favor revise los campos.");
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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