<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect('/')->with('error', 'Por favor, inicie sesión como administrador.');
        }

        if (Auth::user()->role !== 'admin') {
            return redirect('/')->with('error', 'Solo los administradores pueden acceder al dashboard.');
        }

        $user = Auth::user();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'email' => $user->email,
                ],
            ],
        ]);
    }
}