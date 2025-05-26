import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
  UserPlus,
  User,
  Users,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import { Toaster, toast } from 'sonner';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    firstName: '',
    lastName: '',
    dni: '',
    sexo: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    terms: false as boolean,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isStrongPassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+=(){}[\]<>^~`|\\/"'#])[A-Za-z\d@$!%*?&.,;:+=(){}[\]<>^~`|\\/"'#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.dni.length !== 8 || !/^\d+$/.test(data.dni)) {
      toast.error('El DNI debe tener exactamente 8 dígitos');
      return;
    }

    if (!isValidEmail(data.email)) {
      toast.error('Por favor, ingrese un correo electrónico válido');
      return;
    }

    if (!isValidPhone(data.phone)) {
      toast.error('El número de teléfono debe tener 9 dígitos');
      return;
    }

    if (!isStrongPassword(data.password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }

    if (data.password !== data.password_confirmation) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!data.terms) {
      toast.error('Debe aceptar los términos y condiciones');
      return;
    }

    post('/register', {
      onSuccess: () => {
        toast.success('Registro exitoso!', {
          description: `Bienvenido, ${data.firstName} ${data.lastName}!`,
        });
        reset();
      },
      onError: (errors) => {
        toast.error('Error en el registro', {
          description: 'Por favor, revise los errores en el formulario.',
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-primary p-2 rounded-full">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">
            Ingrese su información para crear una cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="usuario123"
                  className="pl-10"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                />
              </div>
              {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nombres
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Juan"
                  className="pl-10"
                  value={data.firstName}
                  onChange={(e) => setData('firstName', e.target.value)}
                />
              </div>
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Apellidos
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  className="pl-10"
                  value={data.lastName}
                  onChange={(e) => setData('lastName', e.target.value)}
                />
              </div>
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                DNI
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dni"
                  type="text"
                  placeholder="12345678"
                  className="pl-10"
                  value={data.dni}
                  onChange={(e) => setData('dni', e.target.value)}
                  maxLength={8}
                />
              </div>
              {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
            </div>

            <div>
              <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Sexo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="sexo"
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={data.sexo}
                  onChange={(e) => setData('sexo', e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
              </div>
              {errors.sexo && <p className="text-sm text-red-500">{errors.sexo}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.perez@ejemplo.com"
                  className="pl-10"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value.toLowerCase())} 
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Celular
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="text"
                  placeholder="987654321"
                  className="pl-10"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Dirección (opcional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Av. Ejemplo 123"
                  className="pl-10"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                />
              </div>
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
            </div>

            <div className="md:col-span-2 flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
              <Checkbox
                id="terms"
                checked={data.terms}
                onCheckedChange={(checked) => {
                  setData('terms', checked as boolean);
                }}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="terms" className="text-sm font-medium">
                  Aceptar términos y condiciones
                </label>
                <p className="text-sm text-muted-foreground">
                  He leído y acepto los{' '}
                  <a 
                    href="/pdf/terminosycondiciones.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    términos y condiciones
                  </a>{' '}
                  de Rudolf Motos.
                </p>
              </div>
              {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
            </div>

            <Button type="submit" className="md:col-span-2 w-full" disabled={processing}>
              {processing ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tiene una cuenta?{' '}
            <a href="/login" className="text-primary font-medium hover:underline">
              Iniciar sesión
            </a>
          </p>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}