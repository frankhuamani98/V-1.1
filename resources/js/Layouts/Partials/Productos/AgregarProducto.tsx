import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";

interface AgregarProductoProps {
  categorias: Array<{
    id: number;
    nombre: string;
    subcategorias: Array<{
      id: number;
      nombre: string;
    }>;
  }>;
  motos: Array<{
    id: number;
    nombre_completo: string;
  }>;
}

const AgregarProducto: React.FC<AgregarProductoProps> = ({ categorias = [], motos = [] }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    codigo: "",
    nombre: "",
    descripcion_corta: "",
    detalles: "",
    precio: 0,
    descuento: 0,
    precio_con_descuento: 0,
    igv: 0,
    precio_final: 0,
    incluye_igv: false as boolean,
    stock: 0,
    imagen_principal: null as File | null,
    imagen_url: "",
    imagenes_adicionales: [] as File[],
    urls_adicionales: [] as string[],
    estilos_imagenes: [] as string[],
    categoria: "",
    subcategoria: "",
    compatible_motos: "todas",
    moto_especifica: "",
    es_destacado: false as boolean,
    es_mas_vendido: false as boolean,
    calificacion: 0
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewImagesAdicionales, setPreviewImagesAdicionales] = useState<{url: string, estilo: string}[]>([]);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [uploadMethodAdicional, setUploadMethodAdicional] = useState<'file' | 'url'>('file');
  const [subcategoriasFiltradas, setSubcategoriasFiltradas] = useState<Array<{ id: number; nombre: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageDetails, setCurrentImageDetails] = useState({
    url: "",
    estilo: ""
  });
  const [showImageForm, setShowImageForm] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Filtra subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (data.categoria) {
      const categoriaSeleccionada = categorias.find(c => c.id.toString() === data.categoria);
      setSubcategoriasFiltradas(categoriaSeleccionada?.subcategorias || []);
      setData("subcategoria", "");
    } else {
      setSubcategoriasFiltradas([]);
      setData("subcategoria", "");
    }
  }, [data.categoria, categorias]);

  // Calcula el precio final cuando cambia el precio, descuento o IGV
  useEffect(() => {
    const precioBase = parseFloat(data.precio.toString()) || 0;
    const descuento = parseFloat(data.descuento.toString()) || 0;

    // Validar que el descuento esté entre 0 y 100
    const descuentoValidado = Math.min(Math.max(descuento, 0), 100);
    if (descuento !== descuentoValidado) {
      setData("descuento", descuentoValidado);
      return;
    }

    // Calcula el precio con descuento
    const precioConDescuento = precioBase - (precioBase * descuentoValidado / 100);
    const precioConDescuentoRedondeado = parseFloat(precioConDescuento.toFixed(2));
    setData("precio_con_descuento", precioConDescuentoRedondeado);

    // Calcula el IGV correctamente
    let igv = 0;
    let precioFinal = precioConDescuentoRedondeado;

    if (!data.incluye_igv) {
      // Si NO incluye IGV, calculamos el IGV sobre el precio con descuento
      igv = precioConDescuentoRedondeado * 0.18;
      precioFinal = precioConDescuentoRedondeado + igv;
    }

    setData("igv", parseFloat(igv.toFixed(2)));
    setData("precio_final", parseFloat(precioFinal.toFixed(2)));
  }, [data.precio, data.descuento, data.incluye_igv]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.imagen_principal && !data.imagen_url) {
      toast.error("Debes subir una imagen principal");
      return;
    }

    if (data.precio <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('codigo', data.codigo);
    formData.append('nombre', data.nombre);
    formData.append('descripcion_corta', data.descripcion_corta);
    formData.append('detalles', data.detalles);
    formData.append('precio', data.precio.toString());
    formData.append('descuento', data.descuento.toString());
    formData.append('precio_con_descuento', data.precio_con_descuento.toString());
    formData.append('igv', data.igv.toString());
    formData.append('precio_final', data.precio_final.toString());
    formData.append('incluye_igv', data.incluye_igv ? '1' : '0');
    formData.append('stock', data.stock.toString());
    formData.append('categoria', data.categoria);
    formData.append('subcategoria', data.subcategoria);
    formData.append('compatible_motos', data.compatible_motos);
    formData.append('es_destacado', data.es_destacado ? '1' : '0');
    formData.append('es_mas_vendido', data.es_mas_vendido ? '1' : '0');
    formData.append('calificacion', data.calificacion.toString());

    if (data.compatible_motos === "especifica") {
      formData.append('moto_especifica', data.moto_especifica);
    }

    if (uploadMethod === 'file' && data.imagen_principal) {
      formData.append('imagen_principal', data.imagen_principal);
    } else if (uploadMethod === 'url' && data.imagen_url) {
      formData.append('imagen_url', data.imagen_url);
    }

    if (uploadMethodAdicional === 'file') {
      data.imagenes_adicionales.forEach((file, index) => {
        formData.append(`imagenes_adicionales[${index}]`, file);
      });
    } else {
      data.urls_adicionales.forEach((url, index) => {
        formData.append(`urls_adicionales[${index}]`, url);
      });
    }

    // Agregar estilos
    previewImagesAdicionales.forEach((img, index) => {
      formData.append(`estilos_imagenes[${index}]`, img.estilo);
    });

    router.post(route("productos.store"), formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Producto creado exitosamente");
        reset();
        setPreviewImage("");
        setPreviewImagesAdicionales([]);
        setIsUploading(false);
        setCurrentImageDetails({ url: "", estilo: "" });
        setShowImageForm(false);
      },
      onError: (errors) => {
        toast.error("Error al crear el producto");
        console.error("Errores:", errors);
        setIsUploading(false);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("imagen_principal", file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setData("imagen_url", url);
    if (url.trim() !== '') {
      setPreviewImage(url);
    } else {
      setPreviewImage("");
    }
  };

  const handleImagesAdicionalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setShowImageForm(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageDetails({
            url: event.target.result as string,
            estilo: ""
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageWithDetails = () => {
    if (uploadMethodAdicional === 'file') {
      const files = document.getElementById('imagenes_adicionales') as HTMLInputElement;
      if (files?.files?.[0]) {
        setData("imagenes_adicionales", [...data.imagenes_adicionales, files.files[0]]);
      }
    } else {
      if (currentImageUrl.trim()) {
        setData("urls_adicionales", [...data.urls_adicionales, currentImageUrl]);
      }
    }

    setPreviewImagesAdicionales([...previewImagesAdicionales, {
      url: uploadMethodAdicional === 'file' ? currentImageDetails.url : currentImageUrl,
      estilo: currentImageDetails.estilo
    }]);

    // Resetear el formulario
    setCurrentImageDetails({ url: "", estilo: "" });
    setCurrentImageUrl("");
    setShowImageForm(false);

    // Limpiar el input de archivo
    if (uploadMethodAdicional === 'file') {
      const fileInput = document.getElementById('imagenes_adicionales') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const removeAdditionalImage = (index: number) => {
    if (uploadMethodAdicional === 'file') {
      const newFiles = [...data.imagenes_adicionales];
      newFiles.splice(index, 1);
      setData("imagenes_adicionales", newFiles);
    } else {
      const newUrls = [...data.urls_adicionales];
      newUrls.splice(index, 1);
      setData("urls_adicionales", newUrls);
    }

    const newPreviews = [...previewImagesAdicionales];
    newPreviews.splice(index, 1);
    setPreviewImagesAdicionales(newPreviews);
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setData("calificacion", star)}
            className={`text-2xl ${star <= data.calificacion ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {data.calificacion} {data.calificacion === 1 ? 'estrella' : 'estrellas'}
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Agregar Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección de información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Código del Producto</label>
            <input
              value={data.codigo}
              onChange={(e) => setData("codigo", e.target.value)}
              placeholder="PROD-001"
              className="w-full p-2 border rounded"
            />
            {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo}</p>}
          </div>

          <div>
            <label className="block mb-1">Nombre del Producto</label>
            <input
              value={data.nombre}
              onChange={(e) => setData("nombre", e.target.value)}
              placeholder="Nombre completo del producto"
              className="w-full p-2 border rounded"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>
        </div>

        <div>
          <label className="block mb-1">Descripción Corta</label>
          <textarea
            value={data.descripcion_corta}
            onChange={(e) => setData("descripcion_corta", e.target.value)}
            placeholder="Breve descripción para mostrarse en listados"
            className="w-full p-2 border rounded min-h-[80px]"
          />
          {errors.descripcion_corta && <p className="text-red-500 text-sm">{errors.descripcion_corta}</p>}
        </div>

        <div>
          <label className="block mb-1">Detalles del Producto</label>
          <textarea
            value={data.detalles}
            onChange={(e) => setData("detalles", e.target.value)}
            placeholder="Descripción detallada con características y especificaciones"
            className="w-full p-2 border rounded min-h-[120px]"
          />
          {errors.detalles && <p className="text-red-500 text-sm">{errors.detalles}</p>}
        </div>

        {/* Sección de precios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-50 p-4 rounded-lg">
          <div>
            <label className="block mb-1">Precio Base (S/)</label>
            <input
              type="number"
              value={data.precio || ""}
              onChange={(e) => setData("precio", parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
            {errors.precio && <p className="text-red-500 text-sm">{errors.precio}</p>}
          </div>

          <div>
            <label className="block mb-1">Descuento (%)</label>
            <input
              type="number"
              value={data.descuento || ""}
              onChange={(e) => setData("descuento", parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
            {errors.descuento && <p className="text-red-500 text-sm">{errors.descuento}</p>}
          </div>

          <div className="bg-white p-3 rounded border border-blue-200">
            <div className="flex justify-between mb-1">
              <span>Precio con descuento:</span>
              <span>S/ {data.precio_con_descuento.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>IGV (18%):</span>
              <span>{data.incluye_igv ? "Incluido" : `S/ ${data.igv.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Precio Final:</span>
              <span>S/ {data.precio_final.toFixed(2)}</span>
            </div>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.incluye_igv}
                  onChange={(e) => setData("incluye_igv", e.target.checked)}
                  className="mr-2"
                />
                Precio incluye IGV
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1">Stock Disponible</label>
          <input
            type="number"
            value={data.stock || ""}
            onChange={(e) => setData("stock", parseInt(e.target.value) || 0)}
            className="w-full p-2 border rounded"
            min="0"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>

        {/* Sección de características especiales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="es_destacado"
              checked={data.es_destacado}
              onChange={(e) => setData("es_destacado", e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="es_destacado" className="font-medium">Producto Destacado</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="es_mas_vendido"
              checked={data.es_mas_vendido}
              onChange={(e) => setData("es_mas_vendido", e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="es_mas_vendido" className="font-medium">Lo Más Vendido</label>
          </div>

          <div>
            <label className="block mb-1">Calificación</label>
            {renderStarRating()}
          </div>
        </div>

        {/* Sección de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Imagen Principal</h2>

            <div className="mb-3">
              <div className="flex border-b">
                <button
                  type="button"
                  onClick={() => setUploadMethod('file')}
                  className={`px-4 py-2 ${uploadMethod === 'file' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Subir Archivo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`px-4 py-2 ${uploadMethod === 'url' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Usar URL
                </button>
              </div>
            </div>

            {uploadMethod === 'file' ? (
              <div>
                <input
                  id="imagen_principal"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="imagen_principal"
                  className="block p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-center"
                >
                  Haz clic para seleccionar una imagen
                  <p className="text-sm text-gray-500 mt-1">Formatos: JPG, PNG, GIF (Max 5MB)</p>
                </label>
                {errors.imagen_principal && <p className="text-red-500 text-sm mt-1">{errors.imagen_principal}</p>}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={data.imagen_url}
                  onChange={handleUrlChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full p-2 border rounded"
                />
                {errors.imagen_url && <p className="text-red-500 text-sm mt-1">{errors.imagen_url}</p>}
              </div>
            )}

            {previewImage && (
              <div className="mt-3">
                <img
                  src={previewImage}
                  alt="Vista previa imagen principal"
                  className="max-h-48 mx-auto border rounded"
                  onError={() => setPreviewImage("")}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage("");
                    setData("imagen_principal", null);
                    setData("imagen_url", "");
                  }}
                  className="mt-2 text-sm text-red-600"
                >
                  Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <div className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Imágenes Adicionales (Máx. 10)</h2>

            <div className="mb-3">
              <div className="flex border-b">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethodAdicional('file');
                    setShowImageForm(false);
                  }}
                  className={`px-4 py-2 ${uploadMethodAdicional === 'file' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Subir Archivos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethodAdicional('url');
                    setShowImageForm(false);
                  }}
                  className={`px-4 py-2 ${uploadMethodAdicional === 'url' ? 'border-b-2 border-blue-500' : ''}`}
                >
                  Usar URLs
                </button>
              </div>
            </div>

            {!showImageForm ? (
              uploadMethodAdicional === 'file' ? (
                <div>
                  <input
                    id="imagenes_adicionales"
                    type="file"
                    accept="image/*"
                    onChange={handleImagesAdicionalesChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagenes_adicionales"
                    className="block p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-center"
                  >
                    Haz clic para seleccionar una imagen
                    <p className="text-sm text-gray-500 mt-1">Formatos: JPG, PNG, GIF</p>
                  </label>
                  {errors.imagenes_adicionales && <p className="text-red-500 text-sm mt-1">{errors.imagenes_adicionales}</p>}
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={currentImageUrl}
                    onChange={(e) => setCurrentImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => currentImageUrl.trim() && setShowImageForm(true)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Continuar
                  </button>
                  {errors.urls_adicionales && <p className="text-red-500 text-sm mt-1">{errors.urls_adicionales}</p>}
                </div>
              )
            ) : (
              <div className="border rounded p-4">
                <div className="mb-4">
                  {uploadMethodAdicional === 'file' ? (
                    <img
                      src={currentImageDetails.url}
                      alt="Vista previa"
                      className="max-h-32 mx-auto border rounded"
                    />
                  ) : (
                    <img
                      src={currentImageUrl}
                      alt="Vista previa"
                      className="max-h-32 mx-auto border rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estilo (Ej: Moderno, Clásico, Deportivo)</label>
                  <input
                    type="text"
                    value={currentImageDetails.estilo}
                    onChange={(e) => setCurrentImageDetails({...currentImageDetails, estilo: e.target.value})}
                    placeholder="Ej: Moderno"
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowImageForm(false)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddImageWithDetails}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Agregar Imagen
                  </button>
                </div>
              </div>
            )}

            {previewImagesAdicionales.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Imágenes agregadas ({previewImagesAdicionales.length}/10):</h3>
                <div className="grid grid-cols-3 gap-2">
                  {previewImagesAdicionales.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Imagen adicional ${index + 1}`}
                        className="h-24 w-full object-cover border rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-xs mt-1 truncate">
                        <div>Estilo: {img.estilo || '--'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de categorización */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Categoría</label>
            <select
              value={data.categoria}
              onChange={(e) => setData("categoria", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id.toString()}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && <p className="text-red-500 text-sm">{errors.categoria}</p>}
          </div>

          <div>
            <label className="block mb-1">Subcategoría</label>
            <select
              value={data.subcategoria}
              onChange={(e) => setData("subcategoria", e.target.value)}
              disabled={!data.categoria}
              className="w-full p-2 border rounded"
            >
              <option value="">{data.categoria ? "Selecciona una subcategoría" : "Primero selecciona una categoría"}</option>
              {subcategoriasFiltradas.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id.toString()}>
                  {subcategoria.nombre}
                </option>
              ))}
            </select>
            {errors.subcategoria && <p className="text-red-500 text-sm">{errors.subcategoria}</p>}
          </div>
        </div>

        {/* Sección de compatibilidad con motos */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Compatibilidad con Motos</h2>

          <div className="mb-3">
            <label className="block mb-1">Tipo de compatibilidad</label>
            <select
              value={data.compatible_motos}
              onChange={(e) => setData("compatible_motos", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="todas">Todas las motos</option>
              <option value="especifica">Moto específica</option>
            </select>
          </div>

          {data.compatible_motos === "especifica" && (
            <div>
              <label className="block mb-1">Modelo de moto compatible</label>
              <select
                value={data.moto_especifica}
                onChange={(e) => setData("moto_especifica", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecciona una moto</option>
                {motos.map((moto) => (
                  <option key={moto.id} value={moto.nombre_completo}>
                    {moto.nombre_completo}
                  </option>
                ))}
              </select>
              {errors.moto_especifica && <p className="text-red-500 text-sm">{errors.moto_especifica}</p>}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => {
              reset();
              setPreviewImage("");
              setPreviewImagesAdicionales([]);
              setCurrentImageDetails({ url: "", estilo: "" });
              setShowImageForm(false);
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={processing || isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarProducto;
