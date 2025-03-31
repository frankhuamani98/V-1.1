<?php

namespace App\Http\Controllers\Usuarios;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ListaUsuariosController extends Controller
{
    public function index()
    {
        $users = User::select([
            'id',
            'username',
            'first_name',
            'last_name',
            'dni',
            'sexo',
            'email',
            'phone',
            'address',
            'role',
            'status',
            'created_at'
        ])->get();

        return Inertia::render('Dashboard/Usuarios/ListaUsuarios', [
            'users' => $users,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,username,'.$user->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'dni' => 'required|string|size:8|unique:users,dni,'.$user->id,
            'sexo' => 'required|string|in:Masculino,Femenino,Prefiero no decirlo',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'required|string|size:9|unique:users,phone,'.$user->id,
            'address' => 'required|string|max:255',
            'role' => 'required|string|in:admin,user',
            'status' => 'required|string|in:active,inactive,pending',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Usuario actualizado correctamente');
    }
}