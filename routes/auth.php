<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    RegisterController,
    LoginController,
    ProfileController  // Agrega esta línea
};
use Inertia\Inertia;

// Rutas de autenticación existentes (no las borres)
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');
Route::match(['get', 'post'], '/logout', [LoginController::class, 'logout'])->name('logout');

// Agrega estas nuevas rutas para el perfil (al final del archivo)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('/auth/profile/profilepage', [ProfileController::class, 'show']); // Alias por si lo necesitas
    Route::post('/profile/update-password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');
});