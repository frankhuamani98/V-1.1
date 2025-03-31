<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Muestra el formulario de inicio de sesión.
     */
    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Maneja el intento de inicio de sesión.
     */
    public function login(Request $request)
    {
        // Validar los datos del formulario
        $credentials = $request->validate([
            'identifier' => 'required', // Campo único para DNI, email o username
            'password' => 'required',
        ]);

        // Normalizar el identificador (convertir email a minúsculas)
        $identifier = $this->normalizeIdentifier($credentials['identifier']);

        // Determinar el campo a usar para la autenticación
        $field = $this->determineAuthField($identifier);

        // Intentar autenticar al usuario
        if (Auth::attempt([$field => $identifier, 'password' => $credentials['password']])) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Redirigir según el rol del usuario
            return $this->handleRedirect($user);
        }

        // Si la autenticación falla
        return back()->withErrors([
            'identifier' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ]);
    }

    /**
     * Normaliza el identificador (convierte emails a minúsculas)
     */
    protected function normalizeIdentifier(string $identifier): string
    {
        return filter_var($identifier, FILTER_VALIDATE_EMAIL) 
               ? strtolower($identifier)
               : $identifier;
    }

    /**
     * Determina el campo de autenticación (email, dni o username)
     */
    protected function determineAuthField(string $identifier): string
    {
        return filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' :
               (is_numeric($identifier) ? 'dni' : 'username');
    }

    /**
     * Maneja la redirección según el rol del usuario
     */
    protected function handleRedirect($user)
    {
        if ($user->role === 'admin') {
            return Inertia::render('Auth/AdminRedirect', [
                'user' => $user,
            ]);
        }

        return redirect('/')->with('success', '¡Bienvenido de nuevo!');
    }

    /**
     * Maneja el cierre de sesión.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}