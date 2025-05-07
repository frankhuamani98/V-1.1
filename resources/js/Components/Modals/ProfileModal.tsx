import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Loader2,
  Lock,
  CreditCard,
  Calendar,
  PencilIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    dni: string;
    phone: string;
    address: string;
    sexo: string;
  } | null;
}

interface EditableField {
  key: string;
  value: string;
  isEditing: boolean;
}

export const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editableFields, setEditableFields] = useState<{ [key: string]: EditableField }>({
    first_name: { key: "first_name", value: user?.first_name || "", isEditing: false },
    last_name: { key: "last_name", value: user?.last_name || "", isEditing: false },
    phone: { key: "phone", value: user?.phone || "", isEditing: false },
    address: { key: "address", value: user?.address || "", isEditing: false },
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleEdit = (field: string) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: true }
    }));
  };

  const handleCancel = (field: string) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { 
        ...prev[field], 
        isEditing: false,
        value: user?.[field as keyof typeof user] || ""
      }
    }));
  };

  const handleSave = async (field: string) => {
    setIsUpdating(true);
    try {
      await axios.patch('/api/profile', {
        [field]: editableFields[field].value
      });
      
      setEditableFields(prev => ({
        ...prev,
        [field]: { ...prev[field], isEditing: false }
      }));
      
      toast.success("Información actualizada correctamente");
    } catch (error: any) {
      toast.error("Error al actualizar la información");
      handleCancel(field);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsChangingPassword(true);
    try {
      await axios.post('/profile/update-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      
      toast.success("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((messages: any) => {
          messages.forEach((message: string) => toast.error(message));
        });
      } else {
        toast.error("Error al actualizar la contraseña");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const EditableField = ({ field, label, icon }: { field: string; label: string; icon: React.ReactNode }) => {
    const fieldData = editableFields[field];
    
    return (
      <div className="group relative flex items-start space-x-4 py-4 hover:bg-gray-50 rounded-lg px-4 -mx-4 transition-colors">
        <div className="flex-shrink-0 mt-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground mb-1">{label}</Label>
            {!fieldData.isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(field)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          {fieldData.isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={fieldData.value}
                onChange={(e) => setEditableFields(prev => ({
                  ...prev,
                  [field]: { ...prev[field], value: e.target.value }
                }))}
                className="flex-1"
                autoFocus
              />
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSave(field)}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0"
                >
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancel(field)}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0"
                >
                  <XIcon className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-base font-medium">{fieldData.value || "No especificado"}</p>
          )}
        </div>
      </div>
    );
  };

  const NonEditableField = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <div className="flex items-start space-x-4 py-4">
      <div className="flex-shrink-0 mt-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <Label className="text-sm text-muted-foreground mb-1">{label}</Label>
        <p className="text-base font-medium">{value || "No especificado"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
      document.body.style.pointerEvents = 'auto';
    }}>
      <DialogContent className="max-w-4xl p-0" onCloseAutoFocus={(e) => {
        e.preventDefault();
        document.body.style.pointerEvents = 'auto';
      }}>
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Sidebar with user info */}
          <div className="md:w-80 bg-gray-50 dark:bg-gray-900 p-6 border-r">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-semibold mb-4">
                {user ? getInitials(user.first_name || "", user.last_name || "") : ""}
              </div>
              <DialogTitle className="text-xl mb-1">
                {user?.first_name} {user?.last_name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              <Badge variant="outline" className="mb-6">
                Usuario Registrado
              </Badge>
              
              <div className="w-full space-y-4">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-muted-foreground">@{user?.username}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-muted-foreground">DNI: {user?.dni}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6 bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-semibold">Mi Perfil</DialogTitle>
                <Button variant="outline" onClick={onClose}>Cerrar</Button>
              </div>
            </DialogHeader>

            <div className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="w-full justify-start border-b pb-px mb-6">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-background">
                    Información Personal
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-background">
                    Seguridad
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="data-[state=active]:bg-background">
                    Preferencias
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="focus:outline-none">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Información Básica</h3>
                    <p className="text-sm text-muted-foreground">
                      Actualiza tu información personal y de contacto.
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-1">
                    <EditableField
                      field="first_name"
                      label="Nombre"
                      icon={<User className="h-5 w-5 text-primary/60" />}
                    />
                    <EditableField
                      field="last_name"
                      label="Apellido"
                      icon={<User className="h-5 w-5 text-primary/60" />}
                    />
                    <NonEditableField
                      label="DNI"
                      value={user?.dni || ""}
                      icon={<CreditCard className="h-5 w-5 text-primary/60" />}
                    />
                    <NonEditableField
                      label="Nombre de Usuario"
                      value={user?.username || ""}
                      icon={<User className="h-5 w-5 text-primary/60" />}
                    />
                    <NonEditableField
                      label="Correo Electrónico"
                      value={user?.email || ""}
                      icon={<Mail className="h-5 w-5 text-primary/60" />}
                    />
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-1 mb-6">
                      <h3 className="text-lg font-semibold">Información de Contacto</h3>
                      <p className="text-sm text-muted-foreground">
                        Mantén actualizada tu información de contacto.
                      </p>
                    </div>

                    <EditableField
                      field="phone"
                      label="Teléfono"
                      icon={<Phone className="h-5 w-5 text-primary/60" />}
                    />
                    <EditableField
                      field="address"
                      label="Dirección"
                      icon={<MapPin className="h-5 w-5 text-primary/60" />}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Cambiar Contraseña
                    </h3>
                    <div className="max-w-md space-y-4">
                      <div className="space-y-2">
                        <Label>Contraseña Actual</Label>
                        <div className="relative">
                          <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pr-10"
                          />
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Nueva Contraseña</Label>
                        <div className="relative">
                          <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pr-10"
                          />
                          <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Confirmar Nueva Contraseña</Label>
                        <div className="relative">
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-10"
                          />
                          <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>

                      <Button
                        onClick={handlePasswordChange}
                        disabled={isChangingPassword}
                        className="w-full mt-2"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          'Cambiar Contraseña'
                        )}
                      </Button>

                      <p className="text-sm text-muted-foreground mt-4">
                        La contraseña debe tener al menos 8 caracteres y contener letras y números.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Preferencias
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Las preferencias de usuario estarán disponibles próximamente.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};