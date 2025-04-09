import React, { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
import { ImagePlus, X, Upload, Link as LinkIcon, Plus, Bike, Package, Tag, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
  file: File | null;
  url: string;
  color: string;
  style: string;
}

interface MotorcycleCompatibility {
  brand: string;
  model: string;
  yearStart: string;
  yearEnd: string;
}

interface FormData {
  code: string;
  name: string;
  shortDescription: string;
  description: string;
  originalPrice: string;
  discount: string;
  includeIGV: boolean;
  finalPrice: string;
  category: string;
  subcategory: string;
  stock: string;
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  mainImage: File | null;
  mainImageUrl: string;
  additionalImages: ProductImage[];
  motorcycleCompatibility: MotorcycleCompatibility[];
  features: string[];
  specifications: { key: string; value: string }[];
  isFeatured: boolean;
  isBestSeller: boolean;
}

const categories = {
  parts: {
    label: 'Partes de Motocicleta',
    subcategories: ['Motor', 'Transmisión', 'Suspensión', 'Frenos', 'Escape', 'Eléctrico'],
  },
  accessories: {
    label: 'Accesorios',
    subcategories: ['Cascos', 'Guantes', 'Chaquetas', 'Botas', 'Equipaje', 'Electrónica'],
  },
  tools: {
    label: 'Herramientas y Equipos',
    subcategories: ['Herramientas Manuales', 'Herramientas Eléctricas', 'Mantenimiento', 'Equipos de Garaje'],
  },
  tires: {
    label: 'Neumáticos y Ruedas',
    subcategories: ['Neumáticos de Calle', 'Neumáticos Todoterreno', 'Ruedas', 'Cámaras'],
  },
  apparel: {
    label: 'Equipo de Conducción',
    subcategories: ['Equipo de Calle', 'Equipo Todoterreno', 'Ropa Casual', 'Protección'],
  },
};

function AgregarProducto() {
  const [formData, setFormData] = useState<FormData>({
    code: '',
    name: '',
    shortDescription: '',
    description: '',
    originalPrice: '',
    discount: '0',
    includeIGV: true,
    finalPrice: '',
    category: '',
    subcategory: '',
    stock: '',
    sku: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    mainImage: null,
    mainImageUrl: '',
    additionalImages: [],
    motorcycleCompatibility: [],
    features: [],
    specifications: [],
    isFeatured: false,
    isBestSeller: false,
  });

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [tempImageDetails, setTempImageDetails] = useState({ color: '', style: '' });
  const [mainImageTab, setMainImageTab] = useState<'upload' | 'url'>('upload');

  useEffect(() => {
    const calculateFinalPrice = () => {
      const original = parseFloat(formData.originalPrice) || 0;
      const discount = parseFloat(formData.discount) || 0;
      const discountedPrice = original * (1 - discount / 100);
      const withIGV = formData.includeIGV ? discountedPrice * 1.18 : discountedPrice;
      return withIGV.toFixed(2);
    };

    setFormData(prev => ({
      ...prev,
      finalPrice: calculateFinalPrice()
    }));
  }, [formData.originalPrice, formData.discount, formData.includeIGV]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file, mainImageUrl: '' }));
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMainImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, mainImageUrl: url, mainImage: null }));
    setMainImagePreview(url || null);
  };

  const handleAdditionalImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const newImages = [...prev.additionalImages];
          newImages.push({
            file,
            url: '',
            color: '',
            style: '',
          });
          return { ...prev, additionalImages: newImages };
        });
        setTempImageDetails({ color: '', style: '' });
        setSelectedImageIndex(formData.additionalImages.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url) {
      setFormData((prev) => {
        const newImages = [...prev.additionalImages];
        newImages.push({
          file: null,
          url,
          color: '',
          style: '',
        });
        return { ...prev, additionalImages: newImages };
      });
      setTempImageDetails({ color: '', style: '' });
      setSelectedImageIndex(formData.additionalImages.length);
    }
  };

  const updateImageDetails = (index: number, color: string, style: string) => {
    setFormData((prev) => {
      const newImages = [...prev.additionalImages];
      newImages[index] = { ...newImages[index], color, style };
      return { ...prev, additionalImages: newImages };
    });
    setSelectedImageIndex(null);
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.additionalImages];
      newImages.splice(index, 1);
      return { ...prev, additionalImages: newImages };
    });
  };

  const addMotorcycleCompatibility = () => {
    setFormData((prev) => ({
      ...prev,
      motorcycleCompatibility: [
        ...prev.motorcycleCompatibility,
        { brand: '', model: '', yearStart: '', yearEnd: '' },
      ],
    }));
  };

  const updateMotorcycleCompatibility = (index: number, field: keyof MotorcycleCompatibility, value: string) => {
    setFormData((prev) => {
      const newCompatibility = [...prev.motorcycleCompatibility];
      newCompatibility[index] = { ...newCompatibility[index], [field]: value };
      return { ...prev, motorcycleCompatibility: newCompatibility };
    });
  };

  const removeMotorcycleCompatibility = (index: number) => {
    setFormData((prev) => {
      const newCompatibility = [...prev.motorcycleCompatibility];
      newCompatibility.splice(index, 1);
      return { ...prev, motorcycleCompatibility: newCompatibility };
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => {
      const newFeatures = [...prev.features];
      newFeatures.splice(index, 1);
      return { ...prev, features: newFeatures };
    });
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }],
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs.splice(index, 1);
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Aquí normalmente enviarías los datos a tu backend
      console.log('Formulario enviado:', formData);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImagePreview = (image: ProductImage) => {
    if (image.file) {
      return URL.createObjectURL(image.file);
    }
    return image.url;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="border-t-4 border-t-blue-600">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              Agregar Nuevo Producto
            </CardTitle>
            <CardDescription>
              Crea una nueva lista de productos con información detallada y compatibilidad con motocicletas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información Básica */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Información Básica
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Código del Producto</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          placeholder="Ingrese el código del producto"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Producto</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ingrese el nombre del producto"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shortDescription">Descripción Corta</Label>
                        <Textarea
                          id="shortDescription"
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                          placeholder="Breve descripción del producto"
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción Detallada</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Descripción detallada del producto"
                          className="min-h-[120px]"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="originalPrice">Precio Original (S/)</Label>
                            <Input
                              id="originalPrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.originalPrice}
                              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discount">Descuento (%)</Label>
                            <Input
                              id="discount"
                              type="number"
                              min="0"
                              max="100"
                              value={formData.discount}
                              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="includeIGV">Incluir IGV (18%)</Label>
                          <Switch
                            id="includeIGV"
                            checked={formData.includeIGV}
                            onCheckedChange={(checked) => setFormData({ ...formData, includeIGV: checked })}
                          />
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Precio Final:</span>
                            <span className="text-xl font-bold">S/{formData.finalPrice}</span>
                          </div>
                          {formData.includeIGV && (
                            <p className="text-sm text-gray-500 mt-1">Incluye 18% IGV</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <Label htmlFor="isFeatured">Producto Destacado</Label>
                          </div>
                          <Switch
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <Label htmlFor="isBestSeller">Más Vendido</Label>
                          </div>
                          <Switch
                            id="isBestSeller"
                            checked={formData.isBestSeller}
                            onCheckedChange={(checked) => setFormData({ ...formData, isBestSeller: checked })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoría</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => {
                              setFormData({ ...formData, category: value, subcategory: '' });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(categories).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subcategory">Subcategoría</Label>
                          <Select
                            value={formData.subcategory}
                            onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                            disabled={!formData.category}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar subcategoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.category &&
                                categories[formData.category as keyof typeof categories].subcategories.map(
                                  (subcategory) => (
                                    <SelectItem key={subcategory} value={subcategory.toLowerCase()}>
                                      {subcategory}
                                    </SelectItem>
                                  )
                                )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compatibilidad con Motocicletas */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Bike className="w-5 h-5" />
                        Compatibilidad con Motocicletas
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMotorcycleCompatibility}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Compatibilidad
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.motorcycleCompatibility.map((compat, index) => (
                        <div key={index} className="relative p-4 border rounded-lg bg-gray-50">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2"
                            onClick={() => removeMotorcycleCompatibility(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Marca</Label>
                              <Input
                                value={compat.brand}
                                onChange={(e) =>
                                  updateMotorcycleCompatibility(index, 'brand', e.target.value)
                                }
                                placeholder="ej. Honda"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Modelo</Label>
                              <Input
                                value={compat.model}
                                onChange={(e) =>
                                  updateMotorcycleCompatibility(index, 'model', e.target.value)
                                }
                                placeholder="ej. CBR600RR"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Año Inicial</Label>
                              <Input
                                type="number"
                                min="1900"
                                max="2099"
                                value={compat.yearStart}
                                onChange={(e) =>
                                  updateMotorcycleCompatibility(index, 'yearStart', e.target.value)
                                }
                                placeholder="ej. 2019"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Año Final</Label>
                              <Input
                                type="number"
                                min="1900"
                                max="2099"
                                value={compat.yearEnd}
                                onChange={(e) =>
                                  updateMotorcycleCompatibility(index, 'yearEnd', e.target.value)
                                }
                                placeholder="ej. 2023"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Imágenes */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload" onClick={() => setMainImageTab('upload')}>Subir Imágenes</TabsTrigger>
                        <TabsTrigger value="url" onClick={() => setMainImageTab('url')}>URLs de Imágenes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="space-y-4">
                        <div className="space-y-4">
                          <Label>Imagen Principal</Label>
                          <div className="flex flex-col gap-4">
                            <div
                              className={cn(
                                "relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg",
                                mainImagePreview ? "border-gray-200" : "border-gray-300"
                              )}
                            >
                              {mainImagePreview ? (
                                <img
                                  src={mainImagePreview}
                                  alt="Vista Previa"
                                  className="object-cover w-full h-full rounded-lg"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <ImagePlus className="w-8 h-8 text-gray-400" />
                                  <span className="text-sm text-gray-500">Subir imagen principal</span>
                                </div>
                              )}
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <Label>Imágenes Adicionales</Label>
                          <div className="grid grid-cols-2 gap-4">
                            {formData.additionalImages.map((image, index) => (
                              <div key={index} className="relative">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <div
                                      className={cn(
                                        "relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer",
                                        image.file || image.url ? "border-gray-200" : "border-gray-300"
                                      )}
                                    >
                                      {(image.file || image.url) ? (
                                        <img
                                          src={getImagePreview(image)}
                                          alt={`Imagen ${index + 1}`}
                                          className="object-cover w-full h-full rounded-lg"
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center gap-2">
                                          <ImagePlus className="w-6 h-6 text-gray-400" />
                                          <span className="text-xs text-gray-500">Imagen {index + 1}</span>
                                        </div>
                                      )}
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Detalles de la Imagen</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                      <div className="space-y-2">
                                        <Label>Color</Label>
                                        <Input
                                          placeholder="Ingresar color"
                                          value={image.color}
                                          onChange={(e) =>
                                            updateImageDetails(index, e.target.value, image.style)
                                          }
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Estilo</Label>
                                        <Input
                                          placeholder="Ingresar estilo"
                                          value={image.style}
                                          onChange={(e) =>
                                            updateImageDetails(index, image.color, e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>URL de la Imagen</Label>
                                        <Input
                                          placeholder="https://example.com/image.jpg"
                                          value={image.url}
                                          onChange={(e) => {
                                            const newImages = [...formData.additionalImages];
                                            newImages[index] = {
                                              ...newImages[index],
                                              url: e.target.value,
                                              file: null,
                                            };
                                            setFormData({ ...formData, additionalImages: newImages });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2"
                                  onClick={() => removeAdditionalImage(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                                {(image.color || image.style) && (
                                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white p-2 rounded text-xs">
                                    {image.color && <div>Color: {image.color}</div>}
                                    {image.style && <div>Estilo: {image.style}</div>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {formData.additionalImages.length < 10 && (
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <Label>Subir nueva imagen</Label>
                                <div className="relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg border-gray-300">
                                  <div className="flex flex-col items-center gap-2">
                                    <ImagePlus className="w-6 h-6 text-gray-400" />
                                    <span className="text-sm text-gray-500">Agregar imagen adicional</span>
                                  </div>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAdditionalImageFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="url" className="space-y-4">
                        <div className="space-y-4">
                          <Label>Imagen Principal</Label>
                          <div className="flex gap-2">
                            <Input
                              value={formData.mainImageUrl}
                              onChange={handleMainImageUrlChange}
                              placeholder="https://example.com/image.jpg"
                              className="flex-1"
                            />
                          </div>
                          {formData.mainImageUrl && (
                            <div className="w-full h-40 border rounded-lg overflow-hidden">
                              <img
                                src={formData.mainImageUrl}
                                alt="Vista previa URL"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                          <Label>Imágenes Adicionales</Label>
                          <div className="grid grid-cols-2 gap-4">
                            {formData.additionalImages.map((image, index) => (
                              <div key={index} className="relative">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <div
                                      className={cn(
                                        "relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer",
                                        image.url ? "border-gray-200" : "border-gray-300"
                                      )}
                                    >
                                      {image.url ? (
                                        <img
                                          src={image.url}
                                          alt={`Imagen ${index + 1}`}
                                          className="object-cover w-full h-full rounded-lg"
                                        />
                                      ) : (
                                        <div className="flex flex-col items-center gap-2">
                                          <ImagePlus className="w-6 h-6 text-gray-400" />
                                          <span className="text-xs text-gray-500">Imagen {index + 1}</span>
                                        </div>
                                      )}
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Detalles de la Imagen</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                      <div className="space-y-2">
                                        <Label>URL de la Imagen</Label>
                                        <Input
                                          placeholder="https://example.com/image.jpg"
                                          value={image.url}
                                          onChange={(e) => {
                                            const newImages = [...formData.additionalImages];
                                            newImages[index] = {
                                              ...newImages[index],
                                              url: e.target.value,
                                              file: null,
                                            };
                                            setFormData({ ...formData, additionalImages: newImages });
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Color</Label>
                                        <Input
                                          placeholder="Ingresar color"
                                          value={image.color}
                                          onChange={(e) =>
                                            updateImageDetails(index, e.target.value, image.style)
                                          }
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Estilo</Label>
                                        <Input
                                          placeholder="Ingresar estilo"
                                          value={image.style}
                                          onChange={(e) =>
                                            updateImageDetails(index, image.color, e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2"
                                  onClick={() => removeAdditionalImage(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                                {(image.color || image.style) && (
                                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white p-2 rounded text-xs">
                                    {image.color && <div>Color: {image.color}</div>}
                                    {image.style && <div>Estilo: {image.style}</div>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {formData.additionalImages.length < 10 && (
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <Label>Agregar por URL</Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="https://example.com/image.jpg"
                                    onChange={handleAdditionalImageUrlChange}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AgregarProducto;
