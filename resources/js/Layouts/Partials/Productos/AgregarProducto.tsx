import { useForm } from '@inertiajs/react';
import { useState } from 'react';

function AgregarProducto() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        stock: '',
        imagen: null as File | null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    interface FormData {
      nombre: string;
      descripcion: string;
      precio: string;
      categoria: string;
      stock: string;
      imagen: File | null;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      post(route('productos.store'), {
        onSuccess: () => reset(),
      });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file: File | null = e.target.files ? e.target.files[0] : null;
      if (file) {
        setData('imagen', file);
        const reader: FileReader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Agregar Nuevo Producto</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del Producto */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre del Producto
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.nombre && <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        value={data.descripcion}
                        onChange={(e) => setData('descripcion', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.descripcion && <p className="mt-2 text-sm text-red-600">{errors.descripcion}</p>}
                </div>

                {/* Precio y Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                            Precio ($)
                        </label>
                        <input
                            id="precio"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.precio}
                            onChange={(e) => setData('precio', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.precio && <p className="mt-2 text-sm text-red-600">{errors.precio}</p>}
                    </div>

                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                            Stock Disponible
                        </label>
                        <input
                            id="stock"
                            type="number"
                            min="0"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.stock && <p className="mt-2 text-sm text-red-600">{errors.stock}</p>}
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                        Categoría
                    </label>
                    <select
                        id="categoria"
                        value={data.categoria}
                        onChange={(e) => setData('categoria', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione una categoría</option>
                        <option value="electronica">Electrónica</option>
                        <option value="ropa">Ropa</option>
                        <option value="hogar">Hogar</option>
                        <option value="alimentos">Alimentos</option>
                        <option value="deportes">Deportes</option>
                    </select>
                    {errors.categoria && <p className="mt-2 text-sm text-red-600">{errors.categoria}</p>}
                </div>

                {/* Imagen del Producto */}
                <div>
                    <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
                        Imagen del Producto
                    </label>
                    <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
                    
                    {previewImage && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-700">Vista previa:</p>
                            <img src={previewImage} alt="Preview" className="mt-2 h-32 object-cover rounded-md" />
                        </div>
                    )}
                </div>

                {/* Botón de Envío */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AgregarProducto;