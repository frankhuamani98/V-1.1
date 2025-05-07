<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        return response()->json(['message' => 'Profile data loaded']);
    }

    public function checkUsername(Request $request)
    {
        $username = $request->input('username');
        $currentUserId = Auth::id();

        $exists = User::where('username', $username)
            ->where('id', '!=', $currentUserId)
            ->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'Este nombre de usuario ya está siendo utilizado' : null
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        try {
            $validated = $request->validate([
                'username' => ['sometimes', 'required', 'string', 'max:255', 'unique:users,username,' . $user->id],
                'first_name' => ['sometimes', 'required', 'string', 'max:255'],
                'last_name' => ['sometimes', 'required', 'string', 'max:255'],
                'phone' => ['sometimes', 'required', 'string', 'size:9', 'unique:users,phone,' . $user->id],
                'address' => ['sometimes', 'required', 'string', 'max:255'],
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Perfil actualizado correctamente',
                'user' => $user->fresh()
            ]);

        } catch (ValidationException $e) {
            if (isset($e->errors()['username'])) {
                return response()->json([
                    'message' => 'Este nombre de usuario ya está siendo utilizado',
                    'errors' => ['username' => ['Este nombre de usuario ya está registrado']]
                ], 422);
            }

            return response()->json([
                'message' => 'Error al actualizar el perfil',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $user = $request->user();
            
            $request->validate([
                'current_password' => ['required'],
                'new_password' => [
                    'required',
                    'string',
                    'confirmed',
                    Password::min(8)
                        ->letters()
                        ->mixedCase()
                        ->numbers()
                        ->symbols()
                ],
                'new_password_confirmation' => 'required'
            ], [
                'current_password.required' => 'La contraseña actual es requerida',
                'new_password.required' => 'La nueva contraseña es requerida',
                'new_password.confirmed' => 'Las contraseñas no coinciden',
                'new_password.min' => 'La contraseña debe tener al menos 8 caracteres',
                'new_password_confirmation.required' => 'Debe confirmar la nueva contraseña'
            ]);

            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['La contraseña actual es incorrecta']
                ]);
            }

            // Actualizar la contraseña
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => '¡Contraseña actualizada con éxito!'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar la contraseña',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error in password update:', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar la contraseña',
                'errors' => ['general' => ['Ha ocurrido un error inesperado']]
            ], 500);
        }
    }
}