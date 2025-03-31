<?php

namespace App\Http\Controllers\Reservas;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class ReservasFinalizadasController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Reservas/ReservasFinalizadas');
    }
}