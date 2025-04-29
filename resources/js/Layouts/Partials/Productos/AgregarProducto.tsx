import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

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
  file?: string; // Cambiado a string para base64
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
        // Convertir el archivo a base64
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImagen.file = e.target.result as string;
            newImagen.url = ''; // Asegurarse de que no haya URL si hay archivo
            
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
      },
      onFinish: () => {
        setProcessing(false);
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {flash?.message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {flash?.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {/* Navegación por tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('informacion')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'informacion' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Información
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('precios')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'precios' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Precios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('imagenes')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'imagenes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Imágenes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categorias')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'categorias' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Categorías
          </button>
        </div>

        {/* Contenido de cada tab */}
        {activeTab === 'informacion' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código del Producto*</label>
                <input
                  name="codigo"
                  value={data.codigo}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
                {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto*</label>
                <input
                  name="nombre"
                  value={data.nombre}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta*</label>
              <textarea
                name="descripcion_corta"
                value={data.descripcion_corta}
                onChange={handleInputChange}
                maxLength={150}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
                required
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{data.descripcion_corta.length}/150 caracteres</span>
                {errors.descripcion_corta && <p className="text-sm text-red-600">{errors.descripcion_corta}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detalles del Producto</label>
              <textarea
                name="detalles"
                value={data.detalles}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={5}
              />
              {errors.detalles && <p className="mt-1 text-sm text-red-600">{errors.detalles}</p>}
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setData('calificacion', star)}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= data.calificacion ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={data.destacado}
                    onChange={(e) => setData('destacado', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Producto Destacado</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={data.mas_vendido}
                    onChange={(e) => setData('mas_vendido', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Más Vendido</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {activeTab === 'precios' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Precios y Stock</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/.)*</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">S/</span>
                  </div>
                  <input
                    name="precio"
                    value={data.precio}
                    onChange={handlePrecioChange}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                <input
                  name="descuento"
                  type="number"
                  value={data.descuento}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.descuento && <p className="mt-1 text-sm text-red-600">{errors.descuento}</p>}
              </div>

              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={data.incluye_igv}
                    onChange={(e) => setData('incluye_igv', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incluye IGV (18%)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setData('stock', Math.max(0, data.stock - 1))}
                  className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="text-lg font-medium">{data.stock}</span>
                <button
                  type="button"
                  onClick={() => setData('stock', data.stock + 1)}
                  className="inline-flex items-center p-1 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {activeTab === 'imagenes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Imágenes del Producto</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Imagen Principal*</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subir por URL:</label>
                  <input
                    type="text"
                    value={data.imagen_principal}
                    onChange={(e) => setData('imagen_principal', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.imagen_principal && <p className="mt-1 text-sm text-red-600">{errors.imagen_principal}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subir archivo:</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && isValidImageFile(e.target.files[0])) {
                        handleMainImageFileChange(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.imagen_principal_file && <p className="mt-1 text-sm text-red-600">{errors.imagen_principal_file}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Imágenes Adicionales (Máx. 6)</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subir por URL:</label>
                  <input
                    type="text"
                    value={nuevaImagen.url}
                    onChange={(e) => setNuevaImagen(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subir archivo:</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && isValidImageFile(e.target.files[0])) {
                        handleAdditionalImageFileChange(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estilo/Variante (opcional)</label>
                  <input
                    type="text"
                    value={nuevaImagen.estilo}
                    onChange={(e) => setNuevaImagen(prev => ({ ...prev, estilo: e.target.value }))}
                    placeholder="Ej: Color Rojo"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={agregarImagenAdicional}
                disabled={!nuevaImagen.url && !nuevaImagen.file}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Imagen
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-md font-medium text-gray-900">Imágenes Agregadas:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {JSON.parse(data.imagenes_adicionales).map((img: ImagenAdicional, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="truncate">
                      <span className="text-sm">{img.url || (img.file ? 'Imagen subida' : 'Imagen')}</span>
                      {img.estilo && <span className="text-xs text-gray-500"> - {img.estilo}</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarImagenAdicional(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {JSON.parse(data.imagenes_adicionales).length}/6 imágenes
              </p>
              {errors.imagenes_adicionales && <p className="text-sm text-red-600">{errors.imagenes_adicionales}</p>}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {activeTab === 'categorias' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Categorías y Motos Compatibles</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
                <select
                  value={data.categoria_id}
                  onChange={(e) => setData('categoria_id', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                {errors.categoria_id && <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría*</label>
                <select
                  value={data.subcategoria_id}
                  onChange={(e) => setData('subcategoria_id', e.target.value)}
                  disabled={!data.categoria_id}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
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

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Motos Compatibles</h3>
              
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAllMotos}
                    onChange={handleSelectAllMotos}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Seleccionar todas las motos</span>
                </label>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {motos.map(moto => (
                  <div key={moto.id} className="flex items-center p-1 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`moto-${moto.id}`}
                      checked={data.moto_ids.includes(moto.id.toString())}
                      onChange={() => handleMotoSelection(moto.id.toString())}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`moto-${moto.id}`} className="ml-2 text-sm text-gray-700">
                      {`${moto.marca} ${moto.modelo} (${moto.año})`}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{data.moto_ids.length} motos seleccionadas</p>
              {errors.moto_ids && <p className="text-sm text-red-600">{errors.moto_ids}</p>}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Anterior
              </button>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : 'Guardar Producto'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AgregarProducto;
