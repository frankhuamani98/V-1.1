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
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', Password::min(8)->letters()->numbers(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }
}