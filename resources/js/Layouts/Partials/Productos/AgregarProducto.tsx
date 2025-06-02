import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Upload,
  Star,
  Check,
} from 'lucide-react';

interface FlashMessage {
  message?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  subcategorias: Subcategoria[];
}

interface Subcategoria {
  id: number;
  nombre: string;
}

interface Moto {
  id: number;
  año: number;
  modelo: string;
  marca: string;
  estado: string;
}

interface ImagenAdicional {
  url: string;
  estilo: string;
  file?: string;
  previewUrl?: string;
}

interface AgregarProductoProps {
  categorias: Categoria[];
  motos: Moto[];
}

const AgregarProducto = ({ categorias, motos }: AgregarProductoProps) => {
  const flash = (usePage<PageProps>().props as any)?.flash as FlashMessage | undefined;
  const [activeTab, setActiveTab] = useState('informacion');
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [selectAllMotos, setSelectAllMotos] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [productoGuardado, setProductoGuardado] = useState(false);

  const { data, setData, reset, post, errors } = useForm({
    codigo: '',
    nombre: '',
    descripcion_corta: '',
    detalles: '',
    categoria_id: '',
    subcategoria_id: '',
    moto_ids: [] as string[],
    precio: '',
    descuento: '0',
    imagen_principal: '',
    imagen_principal_file: null as File | null,
    imagenes_adicionales: JSON.stringify([] as ImagenAdicional[]),
    calificacion: 0,
    incluye_igv: false as boolean,
    stock: 0,
    destacado: false as boolean,
    mas_vendido: false as boolean,
  });

  const [nuevaImagen, setNuevaImagen] = useState({
    url: '',
    estilo: '',
    file: null as File | null,
  });

  useEffect(() => {
    if (data.categoria_id) {
      const categoriaSeleccionada = categorias.find(
        (cat) => cat.id.toString() === data.categoria_id
      );
      setSubcategorias(categoriaSeleccionada?.subcategorias || []);
      setData('subcategoria_id', '');
    }
  }, [data.categoria_id, categorias]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setData(name as keyof typeof data, type === 'checkbox' ? checked ?? false : value);
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    const parts = rawValue.split('.');
    if (parts.length > 2) return; // Only allow one decimal point
    if (parts[1]?.length > 2) return; // Only allow 2 decimal places
    setData('precio', rawValue);
  };

  const handleMainImageFileChange = (file: File) => {
    setData((prevData) => ({
      ...prevData,
      imagen_principal: '',
      imagen_principal_file: file,
    }));
  };

  const handleAdditionalImageFileChange = (file: File) => {
    setNuevaImagen(prev => ({
      ...prev,
      url: '',
      file,
    }));
  };

  const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  };

  const agregarImagenAdicional = () => {
    const imagenesActuales = JSON.parse(data.imagenes_adicionales) as ImagenAdicional[];

    if ((nuevaImagen.url || nuevaImagen.file) && imagenesActuales.length < 6) {
      const newImagen: Partial<ImagenAdicional> = {
        estilo: nuevaImagen.estilo,
      };

      if (nuevaImagen.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImagen.file = e.target.result as string;
            newImagen.url = '';

            setData('imagenes_adicionales', JSON.stringify([...imagenesActuales, newImagen as ImagenAdicional]));
            setNuevaImagen({ url: '', estilo: '', file: null });
          }
        };
        reader.readAsDataURL(nuevaImagen.file);
      } else {
        newImagen.url = nuevaImagen.url;
        setData('imagenes_adicionales', JSON.stringify([...imagenesActuales, newImagen as ImagenAdicional]));
        setNuevaImagen({ url: '', estilo: '', file: null });
      }
    }
  };

  const eliminarImagenAdicional = (index: number) => {
    const imagenesActuales = JSON.parse(data.imagenes_adicionales) as ImagenAdicional[];
    const updatedImages = imagenesActuales.filter((_, i) => i !== index);
    setData('imagenes_adicionales', JSON.stringify(updatedImages));
  };

  const handleMotoSelection = (motoId: string) => {
    const newMotoIds = data.moto_ids.includes(motoId)
      ? data.moto_ids.filter(id => id !== motoId)
      : [...data.moto_ids, motoId];

    setSelectAllMotos(newMotoIds.length === motos.length);
    setData('moto_ids', newMotoIds);
  };

  const handleSelectAllMotos = () => {
    setSelectAllMotos(!selectAllMotos);
    setData('moto_ids', !selectAllMotos ? motos.map(moto => moto.id.toString()) : []);
  };

  const nextStep = () => {
    if (activeTab === 'informacion') setActiveTab('precios');
    else if (activeTab === 'precios') setActiveTab('imagenes');
    else if (activeTab === 'imagenes') setActiveTab('categorias');
  };

  const prevStep = () => {
    if (activeTab === 'precios') setActiveTab('informacion');
    else if (activeTab === 'imagenes') setActiveTab('precios');
    else if (activeTab === 'categorias') setActiveTab('imagenes');
  };

  const resetForm = () => {
    reset();
    setActiveTab('informacion');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    post(route('productos.store'), {
      onSuccess: () => {
        resetForm();
        setProductoGuardado(true);
        setTimeout(() => setProductoGuardado(false), 2500);
      },
      onFinish: () => {
        setProcessing(false);
      },
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculatePrecioConIGV = (): number => {
    const precio = parseFloat(data.precio) || 0;
    return data.incluye_igv ? precio * 1.18 : precio; // Si incluye IGV, se aplica el 18%
  };

  const calculateDescuento = (): number => {
    const precioConIGV = calculatePrecioConIGV();
    const descuento = parseFloat(data.descuento) || 0;
    return (precioConIGV * descuento) / 100;
  };

  const calculatePrecioFinal = (): string => {
    const precioConIGV = calculatePrecioConIGV();
    const descuento = calculateDescuento();
    return formatCurrency(precioConIGV - descuento);
  };

  // Nueva función para obtener la URL de previsualización de la imagen principal
  const getMainImagePreview = () => {
    if (data.imagen_principal_file) {
      return URL.createObjectURL(data.imagen_principal_file);
    }
    if (data.imagen_principal && data.imagen_principal.startsWith('http')) {
      return data.imagen_principal;
    }
    return null;
  };

  // Nueva función para obtener la URL de previsualización de una imagen adicional
  const getAdditionalImagePreview = (img: ImagenAdicional) => {
    if (img.file && img.file.startsWith('data:')) {
      return img.file;
    }
    if (img.url && img.url.startsWith('http')) {
      return img.url;
    }
    return null;
  };

  // Nueva función para eliminar la imagen principal
  const eliminarImagenPrincipal = () => {
    setData('imagen_principal', '');
    setData('imagen_principal_file', null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100 py-8 px-0">
      <div className="w-full px-0 sm:px-4 lg:px-8">
        {/* Notificación flotante en la esquina superior derecha */}
        {productoGuardado && (
          <div
            className="fixed top-20 right-6 z-50"
            style={{ minWidth: 220 }}
          >
            <div className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn font-semibold">
              <Check className="h-5 w-5" />
              Producto guardado
            </div>
          </div>
        )}
        {flash?.message && (
          <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded shadow-lg animate-fadeIn">
            {flash?.message}
          </div>
        )}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h1 className="text-2xl font-bold text-gray-800">Agregar Nuevo Producto</h1>
            <p className="text-sm text-gray-500 mt-1">Ingresa los detalles del nuevo producto para tu catálogo</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 px-2 sm:px-4">
              <div className="flex space-x-1 py-3 min-w-[350px] sm:min-w-0">
                {[
                  { id: 'informacion', label: 'Información' },
                  { id: 'precios', label: 'Precios' },
                  { id: 'imagenes', label: 'Imágenes' },
                  { id: 'categorias', label: 'Categorías' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-2 px-3 sm:py-3 sm:px-6 font-medium text-xs sm:text-sm transition-all duration-200 rounded-t-lg whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'text-blue-600 bg-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }
                    `}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transition-all duration-300"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 sm:p-6">
              {/* Sección de Información */}
              {activeTab === 'informacion' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">1</span>
                      Información Básica
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                          Código del Producto*
                        </label>
                        <input
                          name="codigo"
                          value={data.codigo}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                          required
                        />
                        {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
                      </div>
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                          Nombre del Producto*
                        </label>
                        <input
                          name="nombre"
                          value={data.nombre}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                          required
                        />
                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Descripción Corta*
                      </label>
                      <textarea
                        name="descripcion_corta"
                        value={data.descripcion_corta}
                        onChange={handleInputChange}
                        maxLength={150}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                        rows={3}
                        required
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {data.descripcion_corta.length}/150 caracteres
                        </span>
                        {errors.descripcion_corta && <p className="text-sm text-red-600">{errors.descripcion_corta}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Detalles del Producto
                      </label>
                      <textarea
                        name="detalles"
                        value={data.detalles}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                        rows={5}
                      />
                      {errors.detalles && <p className="mt-1 text-sm text-red-600">{errors.detalles}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Calificación del Producto</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setData('calificacion', star)}
                            className="text-2xl focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= data.calificacion ? (
                              <Star className="h-7 w-7 text-yellow-400 fill-current" />
                            ) : (
                              <Star className="h-7 w-7 text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Características Destacadas</label>
                      <div className="space-y-3">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={data.destacado}
                            onChange={(e) => setData('destacado', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                          />
                          <span className="ml-2 text-sm text-gray-700">Producto Destacado</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={data.mas_vendido}
                            onChange={(e) => setData('mas_vendido', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                          />
                          <span className="ml-2 text-sm text-gray-700">Más Vendido</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end pt-4 gap-2">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                    >
                      Siguiente
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sección de Precios */}
              {activeTab === 'precios' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">2</span>
                      Precios y Stock
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                          Precio Base (S/.)*
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">S/</span>
                          </div>
                          <input
                            name="precio"
                            value={data.precio}
                            onChange={handlePrecioChange}
                            className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                            placeholder="Ingrese el precio base"
                            required
                          />
                        </div>
                        {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                          Descuento (%)
                        </label>
                        <input
                          name="descuento"
                          type="number"
                          value={data.descuento}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                          placeholder="Ingrese el descuento"
                        />
                        {errors.descuento && <p className="mt-1 text-sm text-red-600">{errors.descuento}</p>}
                      </div>
                      
                      <div className="flex items-end">
                        <label className="inline-flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={data.incluye_igv}
                            onChange={(e) => setData('incluye_igv', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                          />
                          <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {data.incluye_igv ? "Incluye IGV (18%)" : "No incluye IGV"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Precios</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Precio Base:</span>
                        <span className="text-lg font-medium text-gray-900">
                          {formatCurrency(parseFloat(data.precio || '0'))}
                        </span>
                      </div>
                      
                      {data.incluye_igv && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">IGV (18%):</span>
                          <span className="text-lg font-medium text-gray-900">
                            {formatCurrency(calculatePrecioConIGV() - parseFloat(data.precio || '0'))}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Incluye IGV:</span>
                        <span className="text-lg font-medium text-gray-900">
                          {data.incluye_igv ? "Sí" : "No"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Descuento Aplicado:</span>
                        <span className="text-lg font-medium text-red-600">
                          - {formatCurrency(calculateDescuento())}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t pt-3 mt-2">
                        <span className="text-base font-semibold text-gray-700">Precio Final:</span>
                        <span className="text-xl font-bold text-green-600">{calculatePrecioFinal()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Stock Disponible</label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setData('stock', Math.max(0, data.stock - 1))}
                        className="inline-flex items-center justify-center p-2 w-10 h-10 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <div className="text-lg font-medium bg-gray-50 px-5 py-2 rounded-lg min-w-[60px] text-center">
                        {data.stock}
                      </div>
                      <button
                        type="button"
                        onClick={() => setData('stock', data.stock + 1)}
                        className="inline-flex items-center justify-center p-2 w-10 h-10 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                    >
                      Siguiente
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sección de Imágenes */}
              {activeTab === 'imagenes' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">3</span>
                      Imágenes del Producto
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Imagen Principal*</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                              Subir por URL:
                            </label>
                            <input
                              type="text"
                              value={data.imagen_principal}
                              onChange={(e) => setData('imagen_principal', e.target.value)}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                            />
                            {errors.imagen_principal && <p className="mt-1 text-sm text-red-600">{errors.imagen_principal}</p>}
                          </div>
                          
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                              Subir archivo:
                            </label>
                            <input
                              type="file"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0] && isValidImageFile(e.target.files[0])) {
                                  handleMainImageFileChange(e.target.files[0]);
                                }
                              }}
                              accept="image/*"
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                            />
                            {errors.imagen_principal_file && (
                              <p className="mt-1 text-sm text-red-600">{errors.imagen_principal_file}</p>
                            )}
                          </div>
                        </div>
                        
                        {(data.imagen_principal || data.imagen_principal_file) && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-4 relative">
                            <p className="text-sm text-green-600 flex items-center">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              Imagen principal seleccionada
                            </p>
                            {/* Vista previa de la imagen principal */}
                            {getMainImagePreview() && (
                              <div className="relative">
                                <img
                                  src={getMainImagePreview() as string}
                                  alt="Vista previa"
                                  className="w-24 h-24 object-contain rounded border border-gray-200 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={eliminarImagenPrincipal}
                                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 shadow transition-colors"
                                  title="Eliminar imagen principal"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Imágenes Adicionales (Máx. 6)</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600  transition-colors">
                              Subir por URL:
                            </label>
                            <input
                              type="text"
                              value={nuevaImagen.url}
                              onChange={(e) => setNuevaImagen(prev => ({ ...prev, url: e.target.value }))}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                            />
                          </div>
                          
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                              Subir archivo:
                            </label>
                            <input
                              type="file"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0] && isValidImageFile(e.target.files[0])) {
                                  handleAdditionalImageFileChange(e.target.files[0]);
                                }
                              }}
                              accept="image/*"
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                            />
                          </div>
                          
                          <div className="group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                              Estilo/Variante (opcional)
                            </label>
                            <input
                              type="text"
                              value={nuevaImagen.estilo}
                              onChange={(e) => setNuevaImagen(prev => ({ ...prev, estilo: e.target.value }))}
                              placeholder="Ej: Color Rojo"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={agregarImagenAdicional}
                            disabled={!nuevaImagen.url && !nuevaImagen.file}
                            className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            Agregar Imagen
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Imágenes Agregadas:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {JSON.parse(data.imagenes_adicionales).map((img: ImagenAdicional, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Vista previa de la imagen adicional */}
                                {getAdditionalImagePreview(img) && (
                                  <img
                                    src={getAdditionalImagePreview(img) as string}
                                    alt="Vista previa"
                                    className="w-16 h-16 object-contain rounded border border-gray-200 bg-white"
                                  />
                                )}
                                <div className="truncate">
                                  <span className="text-sm font-medium">{img.url || (img.file ? 'Imagen subida' : 'Imagen')}</span>
                                  {img.estilo && <span className="text-xs text-gray-500 block"> - {img.estilo}</span>}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => eliminarImagenAdicional(index)}
                                className="ml-2 text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                          
                          {JSON.parse(data.imagenes_adicionales).length === 0 && (
                            <div className="col-span-full py-4 text-center text-gray-500 italic bg-gray-50 rounded-lg">
                              No hay imágenes adicionales
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2 flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            JSON.parse(data.imagenes_adicionales).length === 6 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}></span>
                          {JSON.parse(data.imagenes_adicionales).length}/6 imágenes
                        </p>
                        {errors.imagenes_adicionales && <p className="text-sm text-red-600">{errors.imagenes_adicionales}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                    >
                      Siguiente
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sección de Categorías */}
              {activeTab === 'categorias' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">4</span>
                      Categorías y Motos Compatibles
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                          Categoría*
                        </label>
                        <select
                          value={data.categoria_id}
                          onChange={(e) => setData('categoria_id', e.target.value)}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3"
                          required
                        >
                          <option value="">Seleccione una categoría</option>
                          {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                          ))}
                        </select>
                        {errors.categoria_id && <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>}
                      </div>
                      
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                          Subcategoría*
                        </label>
                        <select
                          value={data.subcategoria_id}
                          onChange={(e) => setData('subcategoria_id', e.target.value)}
                          disabled={!data.categoria_id}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 sm:text-sm p-3 disabled:bg-gray-50 disabled:text-gray-500"
                          required
                        >
                          <option value="">Seleccione una subcategoría</option>
                          {subcategorias.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                          ))}
                        </select>
                        {errors.subcategoria_id && <p className="mt-1 text-sm text-red-600">{errors.subcategoria_id}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Motos Compatibles</h3>
                    <div className="mb-4">
                      <label className="inline-flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectAllMotos}
                          onChange={handleSelectAllMotos}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                        />
                        <span className="ml-2 text-sm text-gray-700">Seleccionar todas las motos</span>
                      </label>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                      {motos.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No hay motos disponibles</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {motos.map(moto => (
                            <div key={moto.id} className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
                              <input
                                type="checkbox"
                                id={`moto-${moto.id}`}
                                checked={data.moto_ids.includes(moto.id.toString())}
                                onChange={() => handleMotoSelection(moto.id.toString())}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                              />
                              <label htmlFor={`moto-${moto.id}`} className="ml-2 text-sm text-gray-700 flex-1 cursor-pointer">
                                {`${moto.marca} ${moto.modelo} (${moto.año})`}
                                <span className="ml-2 inline-block text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                                  {moto.estado}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {data.moto_ids.length} {data.moto_ids.length === 1 ? 'moto seleccionada' : 'motos seleccionadas'}
                      </p>
                      {data.moto_ids.length > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {Math.round((data.moto_ids.length / motos.length) * 100)}% del total
                        </span>
                      )}
                    </div>
                    {errors.moto_ids && <p className="text-sm text-red-600 mt-1">{errors.moto_ids}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Anterior
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto"
                    >
                      {processing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Guardar Producto
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarProducto;