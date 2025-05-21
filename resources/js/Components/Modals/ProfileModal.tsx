import { useState, useRef } from "react";
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
import { toast, Toaster } from "sonner";
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
  Eye,
  EyeOff,
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

interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const ProfileModal = ({ isOpen, onClose, user }: ProfileModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameCheckTimeout = useRef<NodeJS.Timeout>();
  const [editableFields, setEditableFields] = useState<{ [key: string]: EditableField }>({
    username: { key: "username", value: user?.username || "", isEditing: false },
    phone: { key: "phone", value: user?.phone || "", isEditing: false },
    address: { key: "address", value: user?.address || "", isEditing: false },
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [currentPasswordError, setCurrentPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const checkUsernameAvailability = async (username: string) => {
    setCheckingUsername(true);
    try {
      const response = await axios.post('/api/check-username', { username });
      if (!response.data.available) {
        setUsernameError(response.data.message);
        return false;
      }
      setUsernameError(null);
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setEditableFields(prev => ({
      ...prev,
      username: { ...prev.username, value: newUsername }
    }));

    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }

    if (newUsername === user?.username) {
      setUsernameError(null);
      return;
    }

    usernameCheckTimeout.current = setTimeout(() => {
      checkUsernameAvailability(newUsername);
    }, 500);
  };

  const handleEdit = (field: string) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: true }
    }));
    if (field === 'username') {
      setUsernameError(null);
    }
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
    if (field === 'username') {
      setUsernameError(null);
    }
  };

  const handleSave = async (field: string) => {
    if (field === 'username' && usernameError) {
      toast.error("Por favor, elige otro nombre de usuario");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.patch('/api/profile', {
        [field]: editableFields[field].value
      });

      setEditableFields(prev => ({
        ...prev,
        [field]: { ...prev[field], isEditing: false }
      }));

      toast.success("Información actualizada correctamente");
    } catch (error: any) {
      if (error.response?.data?.errors?.username) {
        toast.error(error.response.data.message || "Este nombre de usuario ya está registrado");
      } else {
        toast.error("Error al actualizar la información");
      }
      handleCancel(field);
    } finally {
      setIsUpdating(false);
    }
  };

  const isStrongPassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+=(){}[\]<>^~`|\\/"'#])[A-Za-z\d@$!%*?&.,;:+=(){}[\]<>^~`|\\/"'#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validatePassword = (password: string) => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&.,;:+=(){}[\]<>^~\`|\\/"'#]/.test(password)
    });
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNewPassword(newValue);
    validatePassword(newValue);

    if (confirmPassword) {
      setConfirmPasswordError(
        newValue !== confirmPassword ? "Las contraseñas no coinciden" : ""
      );
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setConfirmPasswordError(
      newPassword !== confirmValue ? "Las contraseñas no coinciden" : ""
    );
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      setCurrentPasswordError("La contraseña actual es requerida");
      return;
    }
    if (!newPassword) {
      toast.error("La nueva contraseña es requerida", {
        description: "Por favor ingrese su nueva contraseña",
        duration: 4000
      });
      return;
    }
    if (!confirmPassword) {
      toast.error("Debe confirmar la nueva contraseña", {
        description: "Por favor confirme su nueva contraseña",
        duration: 4000
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error("La contraseña debe ser segura", {
        description: "Por favor asegúrese de cumplir con todos los requisitos de seguridad indicados",
        duration: 5000
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await axios.post('/profile/update-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      toast.success("¡Contraseña actualizada!", {
        description: "Tu contraseña ha sido actualizada exitosamente. Los cambios se aplicarán en tu próximo inicio de sesión.",
        duration: 5000,
        action: {
          label: "Entendido",
          onClick: () => {}
        }
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordError("");
      setConfirmPasswordError("");
      setShowCurrentPassword(false);
      setPasswordValidation({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        if (error.response.data.errors.current_password) {
          setCurrentPasswordError(error.response.data.errors.current_password[0]);
          toast.error("Error en la contraseña actual", {
            description: error.response.data.errors.current_password[0],
            duration: 4000
          });
        }
        if (error.response.data.errors.new_password) {
          toast.error("Error en la nueva contraseña", {
            description: error.response.data.errors.new_password[0],
            duration: 4000
          });
        }
        if (error.response.data.errors.new_password_confirmation) {
          setConfirmPasswordError(error.response.data.errors.new_password_confirmation[0]);
        }
      } else {
        toast.error("Error al actualizar la contraseña", {
          description: error.response?.data?.message || "Hubo un problema al actualizar tu contraseña. Por favor intenta nuevamente.",
          duration: 4000
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const EditableField = ({ field, label, icon }: { field: string; label: string; icon: React.ReactNode }) => {
    const fieldData = editableFields[field];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Solo permite números
      if (field === 'phone' && !/^\d*$/.test(newValue)) {
        return;
      }
      setEditableFields(prev => ({
        ...prev,
        [field]: { ...prev[field], value: newValue }
      }));
    };

    return (
      <div className="group relative flex items-start space-x-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-4 -mx-4 transition-colors">
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={fieldData.value}
                  onChange={field === 'username' ? handleUsernameChange : field === 'phone' ? handlePhoneChange : (e) => setEditableFields(prev => ({
                    ...prev,
                    [field]: { ...prev[field], value: e.target.value }
                  }))}
                  className={`flex-1 ${usernameError && field === 'username' ? 'border-red-500 focus:ring-red-500' : ''}`}
                  autoFocus
                  type={field === 'phone' ? 'tel' : 'text'}
                />
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSave(field)}
                    disabled={isUpdating || (field === 'username' && !!usernameError)}
                    className="h-8 w-8 p-0"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    )}
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
              {field === 'username' && (
                <div className="min-h-[20px]">
                  {checkingUsername && (
                    <p className="text-sm text-muted-foreground">
                      Verificando disponibilidad...
                    </p>
                  )}
                  {usernameError && (
                    <p className="text-sm text-red-500">
                      {usernameError}
                    </p>
                  )}
                </div>
              )}
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
    <>
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
            <div className="md:w-80 bg-background dark:bg-[#18181b] p-6 border-r border-border">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-semibold mb-4">
                  {user ? getInitials(user.first_name || "", user.last_name || "") : ""}
                </div>
                <DialogTitle className="text-xl mb-1">
                  {user?.first_name} {user?.last_name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                <Badge variant="outline" className="mb-6 bg-black text-white dark:bg-white dark:text-black">
                  Usuario Registrado
                </Badge>

                <div className="w-full space-y-4">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">@{editableFields.username.value || user?.username}</span>
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
                  <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                  <User className="w-6 h-6" />
                    Mi Perfil
                    </DialogTitle>
                  <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white">Cerrar</Button>
                </div>
              </DialogHeader>

              <div className="p-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="w-full justify-start border-b pb-px mb-6">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-background flex items-center gap-2">
                    <User className="w-4 h-4" />
                      Información Personal
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-background flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                      Seguridad
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="data-[state=active]:bg-background">
                      Preferencias
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="focus:outline-none">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">Información Básica</h3>

                    </div>

                    <div className="mt-6 space-y-1">
                      <EditableField
                        field="username"
                        label="Nombre de Usuario"
                        icon={<User className="h-5 w-5 text-primary/60" />}
                      />
                      <NonEditableField
                        label="Nombre"
                        value={user?.first_name || ""}
                        icon={<User className="h-5 w-5 text-primary/60" />}
                      />
                      <NonEditableField
                        label="Apellido"
                        value={user?.last_name || ""}
                        icon={<User className="h-5 w-5 text-primary/60" />}
                      />
                      <NonEditableField
                        label="DNI"
                        value={user?.dni || ""}
                        icon={<CreditCard className="h-5 w-5 text-primary/60" />}
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
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                setCurrentPasswordError("");
                              }}
                              className={`pr-20 ${currentPasswordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <div className="absolute right-0 top-0 h-full flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                  <Eye className="h-4 w-4" aria-hidden="true" />
                                )}
                                <span className="sr-only">
                                  {showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                </span>
                              </Button>
                              <Lock className="h-4 w-4 text-muted-foreground mr-3" />
                            </div>
                          </div>
                          {currentPasswordError && (
                            <p className="text-sm text-red-500">{currentPasswordError}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Nueva Contraseña</Label>
                          <div className="relative">
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={handleNewPasswordChange}
                              className="pr-10"
                            />
                            <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                            <p className="text-sm font-medium mb-2">La contraseña debe tener:</p>
                            <ul className="space-y-1 text-sm">
                              <li className={`flex items-center ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                <CheckIcon className={`h-4 w-4 mr-2 ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}`} />
                                Mínimo 8 caracteres
                              </li>
                              <li className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                <CheckIcon className={`h-4 w-4 mr-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}`} />
                                Al menos una mayúscula
                              </li>
                              <li className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                <CheckIcon className={`h-4 w-4 mr-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}`} />
                                Al menos una minúscula
                              </li>
                              <li className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                <CheckIcon className={`h-4 w-4 mr-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}`} />
                                Al menos un número
                              </li>
                              <li className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                <CheckIcon className={`h-4 w-4 mr-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-300 dark:text-gray-600'}`} />
                                Al menos un carácter especial
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Confirmar Nueva Contraseña</Label>
                          <div className="relative">
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={handleConfirmPasswordChange}
                              className={`pr-10 ${confirmPasswordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                            />
                            <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                          {confirmPasswordError && (
                            <p className="text-sm text-red-500">{confirmPasswordError}</p>
                          )}
                        </div>

                        <Button
                          onClick={handlePasswordChange}
                          disabled={
                            isChangingPassword ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            !!confirmPasswordError ||
                            !Object.values(passwordValidation).every(Boolean)
                          }
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
      <Toaster richColors position="top-right" />
    </>
  );
};
