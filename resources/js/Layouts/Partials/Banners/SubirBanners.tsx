import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ImagePlus, Trash2, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { DateTimePicker } from "@/Components/ui/date-time-picker";

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen_principal: string;
  activo: boolean;
  orden: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  created_at: string;
  updated_at: string;
}

const SubirBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [activo, setActivo] = useState(true);
  const [orden, setOrden] = useState(0);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners');
      if (!response.ok) throw new Error('Error al cargar banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validate image
      if (!file.type.startsWith('image/')) {
        setError('El archivo seleccionado no es una imagen válida');
        return;
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe exceder 5MB');
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setTitulo("");
    setSubtitulo("");
    setOrden(0);
    setFechaInicio(null);
    setFechaFin(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload banner to server
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('imagen_principal', selectedFile);
      formData.append('titulo', titulo);
      formData.append('subtitulo', subtitulo);
      formData.append('activo', activo ? '1' : '0');
      formData.append('orden', orden.toString());
      if (fechaInicio) formData.append('fecha_inicio', fechaInicio.toISOString());
      if (fechaFin) formData.append('fecha_fin', fechaFin.toISOString());

      const response = await fetch('/api/banners', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir el banner');
      }

      const newBanner = await response.json();
      setBanners([...banners, newBanner]);
      handleClearSelection();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al subir el banner');
    } finally {
      setLoading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este banner?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el banner');

      setBanners(banners.filter(banner => banner.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar el banner');
    } finally {
      setLoading(false);
    }
  };

  // Toggle banner status
  const toggleStatus = async (banner: Banner) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activo: !banner.activo
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar el banner');

      const updatedBanner = await response.json();
      setBanners(banners.map(b => b.id === updatedBanner.id ? updatedBanner : b));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImagePlus className="text-primary h-6 w-6" />
              <div>
                <CardTitle>Gestión de Banners</CardTitle>
                <CardDescription>
                  Sube, visualiza y administra los banners de tu sitio
                </CardDescription>
              </div>
            </div>
            <span className="text-sm text-gray-500 hidden md:inline-block">
              {banners.length} banner{banners.length !== 1 ? 's' : ''} activos
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Upload area */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título del banner"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitulo">Subtítulo</Label>
                      <Input
                        id="subtitulo"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                        placeholder="Subtítulo del banner"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <Label htmlFor="orden">Orden</Label>
                        <Input
                          id="orden"
                          type="number"
                          value={orden}
                          onChange={(e) => setOrden(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="activo"
                          checked={activo}
                          onCheckedChange={setActivo}
                        />
                        <Label htmlFor="activo">Activo</Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Fecha Inicio</Label>
                        <DateTimePicker
                          date={fechaInicio}
                          setDate={setFechaInicio}
                          placeholder="Seleccionar fecha inicio"
                        />
                      </div>
                      <div>
                        <Label>Fecha Fin</Label>
                        <DateTimePicker
                          date={fechaFin}
                          setDate={setFechaFin}
                          placeholder="Seleccionar fecha fin"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label>Imagen del Banner</Label>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Preview */}
                    {preview && (
                      <div className="mt-2">
                        <div className="bg-white p-2 rounded-lg shadow-md">
                          <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                          <img
                            src={preview}
                            alt="Vista previa"
                            className="max-h-48 rounded border object-contain mx-auto"
                          />
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                            {selectedFile?.name} ({selectedFile ? Math.round(selectedFile.size / 1024) : 0} KB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subiendo...
                    </span>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Banner
                    </>
                  )}
                </Button>
                {selectedFile && (
                  <Button
                    variant="outline"
                    onClick={handleClearSelection}
                    disabled={loading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                )}
              </div>
            </div>

            {/* Banners table */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Banners</h3>

              {loading && banners.length === 0 ? (
                <div className="text-center py-8">
                  <p>Cargando banners...</p>
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border">
                  <ImagePlus className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No hay banners subidos todavía</p>
                  <p className="text-slate-400 text-sm">Los banners que subas aparecerán aquí</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border md:block hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead className="w-24">Orden</TableHead>
                        <TableHead className="w-24">Estado</TableHead>
                        <TableHead className="w-32">Fechas</TableHead>
                        <TableHead className="w-24">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell className="font-mono text-xs">{banner.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{banner.titulo}</div>
                            <div className="text-xs text-gray-500">{banner.subtitulo}</div>
                          </TableCell>
                          <TableCell>
                            <img
                              src={banner.imagen_principal}
                              alt={banner.titulo}
                              className="h-12 w-auto max-w-full rounded border object-cover"
                            />
                          </TableCell>
                          <TableCell>
                            {banner.orden}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Switch
                                checked={banner.activo}
                                onCheckedChange={() => toggleStatus(banner)}
                                disabled={loading}
                              />
                              <span className="ml-2 text-sm">
                                {banner.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div>{banner.fecha_inicio ? new Date(banner.fecha_inicio).toLocaleDateString() : '-'}</div>
                              <div>{banner.fecha_fin ? new Date(banner.fecha_fin).toLocaleDateString() : '-'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(banner.id)}
                              disabled={loading}
                              title="Eliminar banner"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Mobile view */}
              <div className="md:hidden">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{banner.titulo}</div>
                        <div className="text-sm text-gray-500">{banner.subtitulo}</div>
                        <div className="text-xs text-gray-400">ID: {banner.id} • Orden: {banner.orden}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={banner.activo}
                          onCheckedChange={() => toggleStatus(banner)}
                          disabled={loading}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(banner.id)}
                          disabled={loading}
                          title="Eliminar banner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <img
                      src={banner.imagen_principal}
                      alt={banner.titulo}
                      className="w-full rounded border object-cover mb-2"
                    />
                    <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-semibold">Inicio:</div>
                        <div>{banner.fecha_inicio ? new Date(banner.fecha_inicio).toLocaleString() : '-'}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Fin:</div>
                        <div>{banner.fecha_fin ? new Date(banner.fecha_fin).toLocaleString() : '-'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubirBanners;