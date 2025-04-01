import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { ImagePlus, Trash2, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { BannerRecord } from "./HistorialBanners";

const SubirBanners = () => {
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar banners activos al iniciar
  useEffect(() => {
    const savedBanners = localStorage.getItem('banners');
    if (savedBanners) {
      const allBanners = JSON.parse(savedBanners);
      // Solo mostrar los activos en este componente
      setBanners(allBanners.filter((banner: BannerRecord) => banner.status === 'active'));
    }
  }, []);

  // Función para actualizar el localStorage
  const updateStoredBanners = (updatedBanners: BannerRecord[]) => {
    // Obtener todos los banners almacenados (incluyendo eliminados)
    const savedBanners = localStorage.getItem('banners');
    let allBanners: BannerRecord[] = [];

    if (savedBanners) {
      const parsedBanners = JSON.parse(savedBanners);
      // Filtrar para eliminar los activos (ya que los reemplazaremos)
      allBanners = parsedBanners.filter((banner: BannerRecord) => banner.status !== 'active');
    }

    // Combinar los banners eliminados con los actuales
    const combinedBanners = [...allBanners, ...updatedBanners];
    localStorage.setItem('banners', JSON.stringify(combinedBanners));

    // Disparar evento para notificar cambios
    window.dispatchEvent(new Event('storage'));
  };

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('El archivo seleccionado no es una imagen válida');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe exceder 5MB');
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Subir banner
  const handleUpload = () => {
    if (!selectedFile) return;

    const newBanner: BannerRecord = {
      id: Date.now(), // Usa timestamp para IDs únicos
      name: selectedFile.name,
      url: preview || "",
      date: new Date().toLocaleDateString(),
      status: "active",
      uploadedBy: "Usuario actual"
    };

    const updatedBanners = [...banners, newBanner];
    setBanners(updatedBanners);
    updateStoredBanners(updatedBanners);
    handleClearSelection();
  };

  // Eliminar banner
  const handleDelete = (id: number) => {
    // Marcar como eliminado pero mantener en el historial
    const updatedBanners = banners.filter(banner => banner.id !== id);

    // Obtener el banner eliminado y cambiar su estado
    const deletedBanner = banners.find(banner => banner.id === id);
    if (deletedBanner) {
      deletedBanner.status = "deleted";

      // Actualizar en localStorage
      setBanners(updatedBanners);

      // Combinar los activos y el recién eliminado
      updateStoredBanners([...updatedBanners, deletedBanner]);
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
            {/* Área de carga */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <Input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="flex-1 md:flex-none"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Banner
                  </Button>
                  {selectedFile && (
                    <Button
                      variant="outline"
                      onClick={handleClearSelection}
                      className="flex-1 md:flex-none"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Vista previa */}
              {preview && (
                <div className="mt-4 flex justify-center">
                  <div className="relative">
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
                </div>
              )}
            </div>

            {/* Tabla de banners */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Banners Activos</h3>

              {banners.length === 0 ? (
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
                        <TableHead className="w-1/3">Nombre</TableHead>
                        <TableHead className="w-1/5">Fecha</TableHead>
                        <TableHead className="w-1/4">Imagen</TableHead>
                        <TableHead className="w-16">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell className="font-mono text-xs">{banner.id}</TableCell>
                          <TableCell className="truncate max-w-xs">
                            {banner.name}
                          </TableCell>
                          <TableCell>{banner.date}</TableCell>
                          <TableCell>
                            <img
                              src={banner.url}
                              alt={banner.name}
                              className="h-12 w-auto max-w-full rounded border object-cover"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(banner.id)}
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

              {/* Vista móvil */}
              <div className="md:hidden">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-mono text-xs">ID: {banner.id}</p>
                        <p className="truncate max-w-xs">{banner.name}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                        title="Eliminar banner"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={banner.url}
                      alt={banner.name}
                      className="w-full rounded border object-cover mb-2"
                    />
                    <p className="text-sm text-gray-500">{banner.date}</p>
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