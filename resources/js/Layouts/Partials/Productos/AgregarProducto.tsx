import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';

interface ImagenAdicional {
  tipo: 'archivo' | 'url';
  archivo?: File;
  url?: string;
  preview: string;
  estilo: string;
}

const AgregarProducto = () => {
  const [imagenPrincipal, setImagenPrincipal] = useState<File | null>(null);
  const [imagenPrincipalUrl, setImagenPrincipalUrl] = useState('');
  const [previewPrincipal, setPreviewPrincipal] = useState("");
  const [imagenesAdicionales, setImagenesAdicionales] = useState<ImagenAdicional[]>([]);
  const [nuevaUrlAdicional, setNuevaUrlAdicional] = useState('');
  const [nuevoEstiloAdicional, setNuevoEstiloAdicional] = useState('');
  const [nuevoArchivoAdicional, setNuevoArchivoAdicional] = useState<File | null>(null);
  const [previewArchivoAdicional, setPreviewArchivoAdicional] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_principal: null as File | string | null,
    imagen_principal_url: '',
    imagenes_adicionales: [] as Array<{
      tipo: 'archivo' | 'url';
      archivo?: File;
      url?: string;
      estilo: string;
    }>,
  });

  const handleImagenPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | null = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImagenPrincipal(file);
      setImagenPrincipalUrl('');
      setData('imagen_principal', file);
      setData('imagen_principal_url', '');
      
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewPrincipal(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagenPrincipalUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const url = e.target.value;
    setImagenPrincipalUrl(url);
    setImagenPrincipal(null);
    setPreviewPrincipal(url);
    setData('imagen_principal_url', url);
    setData('imagen_principal', null);
  };

  const handleArchivoAdicionalChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | null = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNuevoArchivoAdicional(file);
      
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewArchivoAdicional(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarImagenAdicional = (tipo: 'archivo' | 'url') => {
    if (imagenesAdicionales.length >= 10) {
      alert("Ya has alcanzado el límite de 10 imágenes adicionales");
      return;
    }

    if (tipo === 'url' && nuevaUrlAdicional.trim() === '') {
      alert("Por favor ingresa una URL válida");
      return;
    }

    if (tipo === 'archivo' && !nuevoArchivoAdicional) {
      alert("Por favor selecciona un archivo");
      return;
    }

    if (nuevoEstiloAdicional.trim() === '') {
      alert("Por favor especifica el estilo o color");
      return;
    }

    const nuevaImagen: ImagenAdicional = {
      tipo,
      estilo: nuevoEstiloAdicional,
      preview: tipo === 'url' ? nuevaUrlAdicional : previewArchivoAdicional,
      ...(tipo === 'url' ? { url: nuevaUrlAdicional } : { archivo: nuevoArchivoAdicional! })
    };

    setImagenesAdicionales([...imagenesAdicionales, nuevaImagen]);
    
    // Actualizar datos del formulario
    setData('imagenes_adicionales', [
      ...data.imagenes_adicionales, 
      {
        tipo,
        estilo: nuevoEstiloAdicional,
        ...(tipo === 'url' ? { url: nuevaUrlAdicional } : { archivo: nuevoArchivoAdicional! })
      }
    ]);

    // Limpiar campos
    setNuevaUrlAdicional('');
    setNuevoEstiloAdicional('');
    setNuevoArchivoAdicional(null);
    setPreviewArchivoAdicional('');
  };

  const eliminarImagenAdicional = (index: number): void => {
    const nuevasImagenes = [...imagenesAdicionales];
    nuevasImagenes.splice(index, 1);
    setImagenesAdicionales(nuevasImagenes);
    
    // Actualizar datos del formulario
    setData('imagenes_adicionales', nuevasImagenes.map(img => ({
      tipo: img.tipo,
      estilo: img.estilo,
      ...(img.tipo === 'url' ? { url: img.url } : { archivo: img.archivo })
    })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagenPrincipal && !imagenPrincipalUrl) {
      alert('Debes proporcionar una imagen principal (archivo o URL)');
      return;
    }
    
    const formData = {
      ...data,
      precio: data.precio === '' ? 0 : parseFloat(data.precio as string)
    };
    
    post(route('productos.store'), {
      ...formData,
      onSuccess: () => {
        setImagenPrincipal(null);
        setImagenPrincipalUrl('');
        setImagenesAdicionales([]);
        setPreviewPrincipal("");
        setData({
          nombre: '',
          descripcion: '',
          precio: '',
          imagen_principal: null,
          imagen_principal_url: '',
          imagenes_adicionales: []
        });
      },
    });
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Agregar Producto</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos básicos del producto */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto</Label>
            <Input
              id="nombre"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
              required
            />
            {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              required
            />
            {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              type="number"
              value={data.precio}
              onChange={(e) => setData('precio', e.target.value)}
              required
              min="0"
              step="0.01"
            />
            {errors.precio && <p className="text-sm text-red-500">{errors.precio}</p>}
          </div>

          {/* Campo para imagen principal */}
          <div className="space-y-2">
            <Label>Imagen Principal</Label>
            
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Subir archivo</TabsTrigger>
                <TabsTrigger value="url">Usar URL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <Input
                  type="file"
                  id="imagenPrincipal"
                  accept="image/*"
                  onChange={handleImagenPrincipalChange}
                />
                {previewPrincipal && imagenPrincipal && (
                  <div className="mt-2">
                    <img 
                      src={previewPrincipal} 
                      alt="Preview principal" 
                      className="rounded-md border" 
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="url">
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imagenPrincipalUrl}
                  onChange={handleImagenPrincipalUrlChange}
                />
                {previewPrincipal && imagenPrincipalUrl && (
                  <div className="mt-2">
                    <img 
                      src={previewPrincipal} 
                      alt="Preview principal desde URL" 
                      className="rounded-md border" 
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {errors.imagen_principal && <p className="text-sm text-red-500">{errors.imagen_principal}</p>}
            {errors.imagen_principal_url && <p className="text-sm text-red-500">{errors.imagen_principal_url}</p>}
          </div>

          {/* Campo para imágenes adicionales */}
          <div className="space-y-2">
            <Label>
              Imágenes Adicionales (Máximo 10)
            </Label>
            
            <div className="space-y-4">
              {/* Sección para agregar nuevas imágenes */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Estilo/Color:
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ej: Rojo, Grande, Estilo moderno..."
                    value={nuevoEstiloAdicional}
                    onChange={(e) => setNuevoEstiloAdicional(e.target.value)}
                  />
                </div>

                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Subir archivo</TabsTrigger>
                    <TabsTrigger value="url">Usar URL</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleArchivoAdicionalChange}
                    />
                    {previewArchivoAdicional && (
                      <div className="mt-2">
                        <img 
                          src={previewArchivoAdicional} 
                          alt="Preview archivo adicional" 
                          className="rounded-md border" 
                          style={{ maxHeight: "100px" }}
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      onClick={() => agregarImagenAdicional('archivo')}
                      disabled={!nuevoArchivoAdicional || !nuevoEstiloAdicional.trim()}
                    >
                      Agregar Imagen
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={nuevaUrlAdicional}
                      onChange={(e) => setNuevaUrlAdicional(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => agregarImagenAdicional('url')}
                      disabled={!nuevaUrlAdicional.trim() || !nuevoEstiloAdicional.trim()}
                    >
                      Agregar Imagen
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Lista de imágenes adicionales agregadas */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Imágenes agregadas ({imagenesAdicionales.length}/10):
                </Label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {imagenesAdicionales.map((imagen, index) => (
                    <div key={index} className="border rounded-lg p-3 relative">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img 
                            src={imagen.preview} 
                            alt={`Imagen adicional ${index}`}
                            className="rounded-md border w-16 h-16 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=Imagen+no+disponible';
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{imagen.estilo}</p>
                          <p className="text-sm text-muted-foreground">
                            {imagen.tipo === 'url' ? 'URL' : 'Archivo'}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => eliminarImagenAdicional(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {errors.imagenes_adicionales && <p className="text-sm text-red-500">{errors.imagenes_adicionales}</p>}
          </div>

          <Button type="submit" disabled={processing}>
            {processing ? 'Guardando...' : 'Agregar Producto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgregarProducto;