<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Profile/ProfilePage', [
            'user' => \Illuminate\Support\Facades\Auth::user(),
            'status' => session('status'),
        ]);
    }
}