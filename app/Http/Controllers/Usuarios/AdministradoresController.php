<?php

namespace App\Http\Controllers\Usuarios;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;

class AdministradoresController extends Controller
{
    // Mostrar lista de administradores
    public function index()
    {
        $admins = User::where('role', 'admin')
            ->select(['id', 'first_name', 'last_name', 'email', 'phone', 'status'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status,
                ];
            });

        return Inertia::render('Dashboard/Usuarios/Administradores', [
            'admins' => $admins,
        ]);
    }

    // Quitar rol de administrador
    public function destroy(User $user)
    {
        // Evitar eliminar el último admin
        if (User::where('role', 'admin')->count() <= 1) {
            return back()->withErrors(['message' => 'No puedes eliminar el último administrador']);
        }
    
        $user->update(['role' => 'user']);
        return redirect()->route('usuarios.administradores.index')->with('success', 'Rol de administrador eliminado correctamente');
    }
}